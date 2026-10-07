/* ============================================================
 * Fit拍 · 本地存储层（localStorage）
 * ============================================================ */
const DB = (() => {
  const PREFIX = 'fitpai_';
  const KEYS = {
    profile: 'profile',          // 个人档案
    plan: 'plan',                // 当前训练计划
    history: 'history',          // 训练打卡记录
    settings: 'settings',        // AI 配置等
    onboarded: 'onboarded'       // 是否完成引导
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('存储失败', e);
      return false;
    }
  }

  /* ----- 个人档案 ----- */
  function getProfile() {
    return read(KEYS.profile, null);
  }
  function saveProfile(profile) {
    return write(KEYS.profile, profile);
  }

  /* ----- 训练计划 ----- */
  function getPlan() {
    return read(KEYS.plan, null);
  }
  function savePlan(plan) {
    return write(KEYS.plan, plan);
  }

  /* ----- 打卡记录 ----- */
  function getHistory() {
    return read(KEYS.history, []);
  }
  function saveHistory(history) {
    return write(KEYS.history, history);
  }
  function addHistory(record) {
    const history = getHistory();
    history.push(record);
    saveHistory(history);
    return record;
  }

  /* ----- 设置 ----- */
  function getSettings() {
    return read(KEYS.settings, {
      aiProvider: '',      // '' | 'openai' | 'gemini'
      apiKey: '',
      baseUrl: '',
      model: ''
    });
  }
  function saveSettings(settings) {
    return write(KEYS.settings, settings);
  }

  /* ----- 引导状态 ----- */
  function isOnboarded() {
    return !!read(KEYS.onboarded, false);
  }
  function setOnboarded(v) {
    return write(KEYS.onboarded, v);
  }

  return {
    getProfile, saveProfile,
    getPlan, savePlan,
    getHistory, saveHistory, addHistory,
    getSettings, saveSettings,
    isOnboarded, setOnboarded
  };
})();
