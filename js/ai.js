/* ============================================================
 * Fit拍 · AI 视觉识别
 * 支持 OpenAI 兼容接口（含 DeepSeek/Qwen/GLM/Kimi/Moonshot 等）
 * 以及 Google Gemini（可选）。无 API Key 时返回 null，前端走手动选择兜底。
 * ============================================================ */
const AI = (() => {
  const VISION_PROMPT = `你是一位专业健身教练和器械识别专家。请分析这张照片，判断照片中出现的健身器械或健身动作。
只输出一个 JSON 对象（不要输出任何其它文字、代码块或解释），格式如下：
{
  "type": "equipment" 或 "exercise" 或 "none",
  "name": "识别到的器械或动作的中文名称，如：杠铃、高位下拉机、杠铃卧推",
  "confidence": 0到1之间的数字,
  "bodyPart": "主要训练部位，如：胸、背、腿、肩、二头、三头、核心、有氧",
  "suggestions": ["该器械/动作推荐的3个训练动作中文名"]
}
如果照片里没有明显的健身器械或动作，type 填 "none"，name 填 "无法识别"。`;

  function getConfig() {
    return DB.getSettings();
  }

  function isConfigured() {
    const s = getConfig();
    return !!(s.apiKey && (s.baseUrl || s.aiProvider === 'gemini'));
  }

  /* OpenAI 兼容接口调用 */
  async function callOpenAICompat(config, imageDataUrl) {
    const baseUrl = (config.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const model = config.model || 'gpt-4o-mini';
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: '你只输出符合要求的 JSON，不输出任何额外内容。' },
          { role: 'user', content: [
            { type: 'text', text: VISION_PROMPT },
            { type: 'image_url', image_url: { url: imageDataUrl } }
          ]}
        ],
        temperature: 0.2,
        max_tokens: 400
      })
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`API 错误 ${resp.status}: ${errText.slice(0, 120)}`);
    }
    const data = await resp.json();
    const content = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content : '';
    return content;
  }

  /* Gemini 接口调用 */
  async function callGemini(config, imageDataUrl) {
    const base = 'https://generativelanguage.googleapis.com/v1beta';
    const model = config.model || 'gemini-1.5-flash';
    const mime = (imageDataUrl.match(/^data:([^;]+);/) || [])[1] || 'image/jpeg';
    const b64 = imageDataUrl.split(',')[1];
    const resp = await fetch(`${base}/models/${model}:generateContent?key=${encodeURIComponent(config.apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: VISION_PROMPT },
          { inline_data: { mime_type: mime, data: b64 } }
        ]}],
        generationConfig: { temperature: 0.2, maxOutputTokens: 400 }
      })
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`Gemini 错误 ${resp.status}: ${errText.slice(0, 120)}`);
    }
    const data = await resp.json();
    return data.candidates && data.candidates[0] && data.candidates[0].content
      ? data.candidates[0].content.parts.map(p => p.text || '').join('') : '';
  }

  function parseJson(text) {
    if (!text) return null;
    // 剥离可能的 markdown 代码块
    let t = text.trim();
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    // 提取首个 { ... } 块
    const start = t.indexOf('{');
    const end = t.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(t.slice(start, end + 1));
    } catch (e) {
      return null;
    }
  }

  /* 主识别入口。返回结构化结果；失败/未配置返回 { error } */
  async function recognize(imageDataUrl) {
    const config = getConfig();
    if (!isConfigured()) {
      return { error: 'not-configured' };
    }
    try {
      let raw;
      if (config.aiProvider === 'gemini') {
        raw = await callGemini(config, imageDataUrl);
      } else {
        raw = await callOpenAICompat(config, imageDataUrl);
      }
      const parsed = parseJson(raw);
      if (!parsed) return { error: 'parse-failed', raw };
      return normalize(parsed);
    } catch (err) {
      return { error: err.message || 'request-failed' };
    }
  }

  /* 将 AI 结果归一化并尽量落地到本地动作/器械库 */
  function normalize(parsed) {
    const result = {
      type: parsed.type || 'none',
      name: parsed.name || '',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      bodyPart: parsed.bodyPart || '',
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    };
    // 尝试匹配本地器械库
    const eq = matchEquipmentByText(result.name);
    const ex = matchExerciseByText(result.name);
    if (eq) result.equipment = eq;
    if (ex) result.exercise = ex;

    // 匹配建议动作到本地库
    result.matchedExercises = [];
    for (const s of result.suggestions) {
      const m = matchExerciseByText(s);
      if (m && !result.matchedExercises.find(x => x.id === m.id)) result.matchedExercises.push(m);
    }
    // 若建议无法匹配，但识别到了器械，则用该器械推荐动作
    if (result.matchedExercises.length === 0 && eq) {
      result.matchedExercises = getExercisesByEquipment(eq.id).slice(0, 3);
    }
    return result;
  }

  return { recognize, isConfigured };
})();
