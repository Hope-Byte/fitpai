/* ============================================================
 * Fit拍 · 主应用逻辑（视图、导航、计划生成、打卡、识别流程）
 * ============================================================ */
(function () {
  'use strict';

  /* ---------------- 工具函数 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dowCn(date) { // 1=周一 ... 7=周日
    const d = date || new Date();
    return d.getDay() === 0 ? 7 : d.getDay();
  }
  const WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  function weekdayCn(n) { return WEEK[(n - 1 + 7) % 7]; }
  function fmtDate(s) {
    if (!s) return '';
    const [y, m, d] = s.split('-');
    return `${Number(m)}月${Number(d)}日`;
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function toast(msg, ms) {
    const t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.hidden = true; }, ms || 2200);
  }

  /* ---------------- 简笔画示范 ---------------- */
  const POSES = {
    'raise':  { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[30,40], elR:[90,40], haL:[24,46], haR:[96,46], knL:[46,84], knR:[74,84], ftL:[42,112], ftR:[78,112] },
    'press':  { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[46,18], elR:[74,18], haL:[52,6],  haR:[68,6],  knL:[46,84], knR:[74,84], ftL:[42,112], ftR:[78,112] },
    'curl':   { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[44,52], elR:[76,52], haL:[46,30], haR:[74,30], knL:[46,84], knR:[74,84], ftL:[42,112], ftR:[78,112] },
    'pushdown':{ head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[46,48], elR:[74,48], haL:[46,68], haR:[74,68], knL:[46,84], knR:[74,84], ftL:[42,112], ftR:[78,112] },
    'squat':  { head:[60,16], neck:[60,24], hip:[60,60], shL:[46,32], shR:[74,32], elL:[40,46], elR:[80,46], haL:[34,42], haR:[86,42], knL:[42,82], knR:[78,82], ftL:[40,112], ftR:[80,112] },
    'lunge':  { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[42,44], elR:[78,44], haL:[50,42], haR:[70,42], knL:[48,78], knR:[76,78], ftL:[38,110], ftR:[82,110] },
    'pull-v': { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[44,16], elR:[76,16], haL:[52,8],  haR:[68,8],  knL:[46,84], knR:[74,84], ftL:[42,112], ftR:[78,112] },
    'pull-h': { head:[60,14], neck:[60,22], hip:[62,56], shL:[46,28], shR:[74,28], elL:[40,48], elR:[80,48], haL:[44,58], haR:[76,58], knL:[46,84], knR:[76,84], ftL:[42,112], ftR:[78,112] },
    'hinge':  { head:[50,26], neck:[54,33], hip:[64,56], shL:[50,38], shR:[66,38], elL:[44,52], elR:[60,52], haL:[40,66], haR:[56,66], knL:[50,84], knR:[74,84], ftL:[46,112], ftR:[70,112] },
    'push-up':{ head:[26,46], neck:[34,48], hip:[64,66], shL:[34,48], shR:[34,48], elL:[30,70], elR:[30,70], haL:[28,90], haR:[28,90], knL:[76,84], knR:[76,84], ftL:[88,102], ftR:[88,102] },
    'plank':  { head:[26,50], neck:[34,52], hip:[68,66], shL:[34,52], shR:[34,52], elL:[32,74], elR:[32,74], haL:[30,94], haR:[30,94], knL:[80,82], knR:[80,82], ftL:[92,98],  ftR:[92,98] },
    'core':   { head:[60,30], neck:[60,38], hip:[60,72], shL:[46,42], shR:[74,42], elL:[44,52], elR:[76,52], haL:[48,46], haR:[72,46], knL:[44,74], knR:[76,74], ftL:[40,58], ftR:[80,58] },
    'dip':    { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,30], shR:[74,30], elL:[44,50], elR:[76,50], haL:[40,58], haR:[80,58], knL:[46,84], knR:[74,84], ftL:[42,112], ftR:[78,112] },
    'cardio': { head:[60,16], neck:[60,24], hip:[60,56], shL:[46,32], shR:[74,32], elL:[38,40], elR:[82,38], haL:[32,48], haR:[88,34], knL:[70,78], knR:[48,78], ftL:[76,108], ftR:[38,108] }
  };
  function renderIllustration(pattern) {
    const p = POSES[pattern] || POSES['raise'];
    const S = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    return `<svg class="pose-ill" viewBox="0 0 120 130" aria-hidden="true">
      <circle cx="60" cy="58" r="44" class="pose-bg"/>
      <circle cx="${p.head[0]}" cy="${p.head[1]}" r="7" class="pose-head"/>
      <g class="pose-line">
        ${S(p.neck, p.hip)}
        ${S(p.shL, p.elL)}${S(p.elL, p.haL)}
        ${S(p.shR, p.elR)}${S(p.elR, p.haR)}
        ${S(p.hip, p.knL)}${S(p.knL, p.ftL)}
        ${S(p.hip, p.knR)}${S(p.knR, p.ftR)}
      </g>
    </svg>`;
  }

  /* ---------------- 今日会话（打卡进度） ---------------- */
  const SESSION_KEY = 'fitpai_today_session';
  function readLocal(key, fb) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return fb; } }
  function writeLocal(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  function loadSession() {
    const s = readLocal(SESSION_KEY, null);
    return (s && s.date === todayStr()) ? s : null;
  }
  function saveSession(s) { writeLocal(SESSION_KEY, s); }

  function buildSession() {
    const plan = DB.getPlan();
    const s = { date: todayStr(), exercises: [] };
    const dow = dowCn();
    if (plan && plan.schedule) {
      const today = plan.schedule.find(d => d.dayOfWeek === dow);
      if (today) {
        today.exercises.forEach(item => {
          const ex = getExerciseById(item.exerciseId);
          if (ex) s.exercises.push(makeSessionItem(ex, item.sets, item.reps));
        });
      }
    }
    // 合并今日额外加入的动作
    const addons = readLocal('fitpai_today_addons', []);
    const addon = addons.find(a => a.date === todayStr());
    if (addon) {
      addon.exerciseIds.forEach(id => {
        if (!s.exercises.find(e => e.id === id)) {
          const ex = getExerciseById(id);
          if (ex) s.exercises.push(makeSessionItem(ex, ex.sets, ex.reps));
        }
      });
    }
    return s;
  }
  function makeSessionItem(ex, sets, reps) {
    return { id: ex.id, name: ex.name, bodyPart: ex.bodyPart, pattern: ex.pattern,
      targetSets: sets || ex.sets, targetReps: reps || ex.reps,
      weight: '', done: false };
  }

  function addTodayExercise(exerciseId) {
    const addons = readLocal('fitpai_today_addons', []);
    let a = addons.find(x => x.date === todayStr());
    if (!a) { a = { date: todayStr(), exerciseIds: [] }; addons.push(a); }
    if (!a.exerciseIds.includes(exerciseId)) {
      a.exerciseIds.push(exerciseId);
      writeLocal('fitpai_today_addons', addons);
      toast('已加入今日训练');
      // 同步到当前会话
      const s = loadSession() || buildSession();
      const ex = getExerciseById(exerciseId);
      if (!s.exercises.find(e => e.id === exerciseId)) {
        s.exercises.push(makeSessionItem(ex, ex.sets, ex.reps));
        saveSession(s);
      }
      renderToday();
    } else {
      toast('该动作已在今日训练中');
    }
  }

  /* ---------------- 计划生成 ---------------- */
  function generatePlan(profile) {
    const days = profile.daysPerWeek || 3;
    const splits = SPLITS[days] || SPLITS[3];
    const split = splits[0];
    const dowMap = days === 3 ? [1, 3, 5] : [1, 2, 4, 5];

    // 可用器械集合（空 = 不限）
    const avail = profile.equipment && profile.equipment.length ? profile.equipment : null;

    const schedule = split.days.map((day, i) => {
      let exIds = day.exercises.slice();
      if (avail) {
        exIds = exIds.filter(id => {
          const ex = getExerciseById(id);
          if (!ex) return false;
          return ex.equipment.every(eq => avail.includes(eq) || eq === 'mat');
        });
        // 过滤后不足，补垫上/自重动作
        const fallback = ['push-up', 'plank', 'crunch', 'lunge', 'russian-twist'];
        let fi = 0;
        while (exIds.length < 3 && fi < fallback.length) {
          const id = fallback[fi++];
          if (!exIds.includes(id)) exIds.push(id);
        }
      }
      const exercises = exIds.map(id => {
        const ex = getExerciseById(id);
        return { exerciseId: id, sets: ex.sets, reps: ex.reps };
      });
      return { dayOfWeek: dowMap[i], name: day.name, focus: day.focus, exercises };
    });

    return {
      goal: profile.goal, level: profile.level, daysPerWeek: days,
      splitId: split.id, splitName: split.name, createdAt: Date.now(),
      schedule
    };
  }

  /* ---------------- 导航 ---------------- */
  const App = { currentView: 'today' };

  function switchView(view) {
    App.currentView = view;
    $$('.view').forEach(v => v.classList.toggle('active', v.dataset.view === view));
    $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.nav === view));
    if (view === 'today') renderToday();
    else if (view === 'plan') renderPlan();
    else if (view === 'library') renderLibrary();
    else if (view === 'profile') renderProfile();
    else if (view === 'scan') renderScan();
    window.scrollTo(0, 0);
  }

  /* ---------------- 渲染：今日 ---------------- */
  function renderToday() {
    const el = $('#view-today');
    if (!DB.isOnboarded()) { el.innerHTML = ''; return; }

    const profile = DB.getProfile();
    const plan = DB.getPlan();
    const dow = dowCn();
    let session = loadSession();
    if (!session) { session = buildSession(); saveSession(session); }

    const planToday = plan && plan.schedule ? plan.schedule.find(d => d.dayOfWeek === dow) : null;
    const doneCount = session.exercises.filter(e => e.done).length;
    const total = session.exercises.length;
    const isRestDay = !planToday || total === 0;

    let html = '';
    // 问候与日期
    html += `<div class="today-hero">
      <div class="today-greeting">
        <p class="today-date">${weekdayCn(dow)} · ${fmtDate(todayStr())}</p>
        <h1>${profile.name ? esc(profile.name) + '，' : ''}${isRestDay ? '今天休息' : '开始今天的训练'}</h1>
        <p class="today-sub">${isRestDay ? '给身体充分恢复，或做一组轻度有氧' : (planToday ? planToday.name + ' · ' + planToday.focus : '今日训练')}</p>
      </div>
      <div class="today-progress-ring" style="--pct:${total ? Math.round(doneCount / total * 100) : 0}">
        <span>${doneCount}<small>/${total}</small></span>
      </div>
    </div>`;

    if (isRestDay) {
      html += `<div class="rest-card">
        <div class="rest-icon">🌿</div>
        <p>今日为休息日，肌肉在休息中生长。</p>
        <button class="ghost-btn" onclick="App.addTodayRestCardio()">+ 加一组有氧/拉伸</button>
      </div>`;
    } else {
      html += `<div class="session-list">`;
      session.exercises.forEach((ex, i) => {
        html += `
        <div class="ex-card ${ex.done ? 'done' : ''}" onclick="App.openExercise('${ex.id}')">
          <button class="ex-check ${ex.done ? 'checked' : ''}" onclick="event.stopPropagation();App.toggleDone(${i})" aria-label="标记完成">
            ${ex.done ? '✓' : ''}
          </button>
          <div class="ex-info">
            <div class="ex-name">${esc(ex.name)}</div>
            <div class="ex-meta">${esc(ex.bodyPart)} · ${ex.targetSets}组 × ${ex.targetReps}</div>
          </div>
          <span class="ex-chevron">›</span>
        </div>`;
      });
      html += `</div>
      <div class="today-actions">
        <button class="primary-btn" onclick="App.completeWorkout()">完成今日训练 (${doneCount}/${total})</button>
      </div>`;
    }

    el.innerHTML = html;
  }

  function toggleDone(i) {
    const s = loadSession();
    if (!s) return;
    s.exercises[i].done = !s.exercises[i].done;
    saveSession(s);
    renderToday();
  }

  function completeWorkout() {
    const s = loadSession();
    if (!s) return;
    const done = s.exercises.filter(e => e.done);
    if (done.length === 0) {
      toast('请先标记至少一个完成动作');
      return;
    }
    const plan = DB.getPlan();
    const dow = dowCn();
    const planToday = plan && plan.schedule ? plan.schedule.find(d => d.dayOfWeek === dow) : null;
    const record = {
      id: uid(),
      date: todayStr(),
      dateISO: new Date().toISOString(),
      dayName: planToday ? planToday.name : '自由训练',
      durationMin: null,
      exercises: s.exercises.map(e => ({
        exerciseId: e.id, name: e.name, bodyPart: e.bodyPart,
        targetSets: e.targetSets, targetReps: e.targetReps,
        weight: e.weight || null, done: e.done
      }))
    };
    DB.addHistory(record);
    // 清空今日会话与临时加练
    localStorage.removeItem(SESSION_KEY);
    const addons = readLocal('fitpai_today_addons', []).filter(a => a.date !== todayStr());
    writeLocal('fitpai_today_addons', addons);
    toast('🎉 训练打卡成功！');
    renderToday();
  }

  function addTodayRestCardio() {
    addTodayExercise('treadmill-run');
  }

  /* ---------------- 渲染：计划 ---------------- */
  function renderPlan() {
    const el = $('#view-plan');
    const plan = DB.getPlan();
    if (!plan) {
      el.innerHTML = `<div class="empty-state">
        <div class="empty-icon">🗓️</div>
        <h3>还没有训练计划</h3>
        <p>拍照识别或手动选择器械，生成属于你的一周 3-4 练计划</p>
        <button class="primary-btn" onclick="App.goOnboarding(true)">生成训练计划</button>
      </div>`;
      return;
    }
    const goalName = (GOALS[plan.goal] || {}).name || '';
    const levelName = (LEVELS[plan.level] || {}).name || '';
    let html = `<div class="plan-head">
      <h2>我的训练计划</h2>
      <p class="plan-meta">${plan.splitName} · ${plan.daysPerWeek}练/周 · ${goalName} · ${levelName}</p>
    </div>`;
    const todayDow = dowCn();
    plan.schedule.forEach((day, idx) => {
      const isToday = day.dayOfWeek === todayDow;
      html += `<div class="day-card ${isToday ? 'today' : ''}">
        <div class="day-card-head">
          <span class="day-badge">${weekdayCn(day.dayOfWeek)}</span>
          <span class="day-name">${esc(day.name)}</span>
          <span class="day-focus">${esc(day.focus)}</span>
          ${isToday ? '<span class="day-today-tag">今天</span>' : ''}
        </div>
        <div class="day-ex-list">`;
      day.exercises.forEach(item => {
        const ex = getExerciseById(item.exerciseId);
        if (!ex) return;
        html += `<div class="day-ex" onclick="App.openExercise('${ex.id}')">
          <span class="day-ex-dot"></span>
          <span class="day-ex-name">${esc(ex.name)}</span>
          <span class="day-ex-sets">${item.sets}×${item.reps}</span>
        </div>`;
      });
      html += `</div></div>`;
    });
    html += `<button class="ghost-btn full" onclick="App.goOnboarding(true)">重新生成计划</button>`;
    el.innerHTML = html;
  }

  /* ---------------- 渲染：动作库 ---------------- */
  function renderLibrary(filter) {
    const el = $('#view-library');
    const parts = getBodyParts();
    let html = `<div class="lib-head"><h2>动作库</h2><p>点击查看图文示范与要点</p></div>`;
    html += `<div class="filter-chips" id="lib-filters">
      <button class="chip ${!filter ? 'active' : ''}" data-f="">全部</button>`;
    parts.forEach(p => {
      html += `<button class="chip ${filter === p ? 'active' : ''}" data-f="${p}">${p}</button>`;
    });
    html += `</div><div class="lib-list">`;
    const list = filter ? getExercisesByBodyPart(filter) : EXERCISES;
    list.forEach(ex => {
      html += `<div class="lib-item" onclick="App.openExercise('${ex.id}')">
        <div class="lib-ill">${renderIllustration(ex.pattern)}</div>
        <div class="lib-info">
          <div class="lib-name">${esc(ex.name)}</div>
          <div class="lib-meta">${esc(ex.bodyPart)} · ${esc(ex.type)} · ${esc(ex.level)}</div>
        </div>
        <span class="ex-chevron">›</span>
      </div>`;
    });
    html += `</div>`;
    el.innerHTML = html;
    $('#lib-filters').addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (b) renderLibrary(b.dataset.f || null);
    });
  }

  /* ---------------- 动作详情弹窗 ---------------- */
  function openExercise(id) {
    const ex = getExerciseById(id);
    if (!ex) return;
    const eqNames = ex.equipment.map(e => (getEquipmentById(e) || {}).name).filter(Boolean).join('、');
    const modal = $('#modal');
    modal.innerHTML = `
      <button class="modal-close" onclick="App.closeModal()">✕</button>
      <div class="modal-ill-wrap">${renderIllustration(ex.pattern)}</div>
      <h3 class="modal-title">${esc(ex.name)}</h3>
      <p class="modal-en">${esc(ex.en)}</p>
      <div class="modal-tags">
        <span class="tag">${esc(ex.bodyPart)}</span>
        <span class="tag">${esc(ex.type)}</span>
        <span class="tag">${esc(ex.level)}</span>
      </div>
      <div class="modal-stat">
        <div><b>${ex.sets}</b><span>组</span></div>
        <div><b>${ex.reps}</b><span>次</span></div>
        <div><b>${ex.rest}</b><span>休息</span></div>
      </div>
      <div class="modal-section">
        <h4>动作步骤</h4>
        <ol>${ex.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      </div>
      <div class="modal-section">
        <h4>动作要点</h4>
        <ul class="cue-list">${ex.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
      ${ex.tips ? `<div class="modal-section"><h4>教练提示</h4><p class="tip-text">${esc(ex.tips)}</p></div>` : ''}
      <div class="modal-section muted"><p>所需器械：${eqNames || '无（自重）'}</p></div>
      <button class="primary-btn full" onclick="App.addTodayExercise('${ex.id}')">+ 加入今日训练</button>
    `;
    showModal();
  }

  /* ---------------- 弹窗 ---------------- */
  let onboardingLocked = false;
  function showModal() { $('#modal-mask').hidden = false; }
  function closeModal() { if (onboardingLocked) return; $('#modal-mask').hidden = true; }

  /* ---------------- 渲染：拍照识别 ---------------- */
  let lastRecognition = null;

  function renderScan() {
    const el = $('#view-scan');
    const configured = AI.isConfigured();
    let html = `<div class="scan-hero">
      <h2>拍照识别</h2>
      <p>拍摄健身器械或动作，AI 帮你识别并推荐训练动作</p>
    </div>
    <div class="scan-big-actions">
      <button class="scan-main-btn" onclick="App.openCamera()">
        <span class="scan-main-icon">📷</span>
        <span>拍摄器械 / 动作</span>
      </button>
      <button class="scan-sub-btn2" onclick="App.pickGallery()">从相册选择图片</button>
    </div>`;

    if (!configured) {
      html += `<div class="ai-hint" onclick="App.goSettings()">
        <span>💡</span>
        <div><b>尚未配置 AI 识别</b><p>配置后可拍照自动识别；未配置时仍可手动选择器械 →</p></div>
      </div>`;
    }

    // 识别结果展示
    if (lastRecognition) {
      html += renderRecognitionResult(lastRecognition);
    }

    // 手动选择器械兜底
    html += `<div class="manual-block">
      <h3>手动选择器械</h3>
      <div class="eq-grid">`;
    EQUIPMENT.forEach(eq => {
      html += `<button class="eq-chip" onclick="App.pickEquipment('${eq.id}')">${eq.name}</button>`;
    });
    html += `</div></div>`;

    el.innerHTML = html;
  }

  function renderRecognitionResult(r) {
    if (!r) return '';
    if (r.error === 'not-configured') return '';
    let html = `<div class="recog-card">`;
    if (r.error) {
      html += `<div class="recog-fail">
        <div class="recog-fail-icon">⚠️</div>
        <p><b>识别未成功</b></p>
        <p class="muted">${r.error === 'parse-failed' ? '返回内容无法解析' : esc(r.error)}</p>
        <p class="muted">你可以手动选择下方器械继续</p>
      </div>`;
    } else if (r.type === 'none') {
      html += `<div class="recog-fail">
        <div class="recog-fail-icon">🔍</div>
        <p><b>未识别到明确器械/动作</b></p>
        <p class="muted">请拍得更清晰，或手动选择器械</p>
      </div>`;
    } else {
      const conf = Math.round((r.confidence || 0) * 100);
      html += `<div class="recog-ok">
        <div class="recog-ok-head">
          <div class="recog-icon">${r.type === 'equipment' ? '🏋️' : '🤸'}</div>
          <div>
            <div class="recog-name">${esc(r.name || '识别结果')}</div>
            <div class="recog-meta">${r.type === 'equipment' ? '器械' : '动作'} · 置信度 ${conf}%${r.bodyPart ? ' · ' + esc(r.bodyPart) : ''}</div>
          </div>
        </div>`;
      if (r.matchedExercises && r.matchedExercises.length) {
        html += `<div class="recog-sugg-title">推荐训练动作</div><div class="recog-sugg">`;
        r.matchedExercises.forEach(ex => {
          html += `<div class="recog-ex" onclick="App.openExercise('${ex.id}')">
            <div class="lib-ill sm">${renderIllustration(ex.pattern)}</div>
            <div class="recog-ex-info">
              <div class="recog-ex-name">${esc(ex.name)}</div>
              <div class="recog-ex-meta">${esc(ex.bodyPart)} · ${ex.sets}×${ex.reps}</div>
            </div>
            <button class="mini-add" onclick="event.stopPropagation();App.addTodayExercise('${ex.id}')">+ 加入</button>
          </div>`;
        });
        html += `</div>`;
      }
      html += `</div>`;
    }
    html += `<button class="ghost-btn full" onclick="App.openCamera()">↻ 重新拍摄</button></div>`;
    return html;
  }

  function pickEquipment(eqId) {
    const eq = getEquipmentById(eqId);
    if (!eq) return;
    const exercises = getExercisesByEquipment(eqId);
    const modal = $('#modal');
    modal.innerHTML = `
      <button class="modal-close" onclick="App.closeModal()">✕</button>
      <h3 class="modal-title">${esc(eq.name)}</h3>
      <p class="modal-en">可训练部位：${esc(eq.bodyParts.join('、'))}</p>
      <div class="eq-ex-list">`;
    exercises.forEach(ex => {
      modal.innerHTML += `<div class="recog-ex" onclick="App.openExercise('${ex.id}')">
        <div class="lib-ill sm">${renderIllustration(ex.pattern)}</div>
        <div class="recog-ex-info">
          <div class="recog-ex-name">${esc(ex.name)}</div>
          <div class="recog-ex-meta">${esc(ex.bodyPart)} · ${ex.sets}×${ex.reps}</div>
        </div>
        <button class="mini-add" onclick="event.stopPropagation();App.addTodayExercise('${ex.id}')">+ 加入</button>
      </div>`;
    });
    modal.innerHTML += `</div>`;
    showModal();
  }

  /* ---------------- 相机与识别流程 ---------------- */
  function openCamera(title) {
    $('#camera-title').textContent = title || '拍摄器械 / 动作';
    $('#camera-overlay').hidden = false;
    Camera.start().then(ok => {
      if (!ok) {
        toast('无法启动摄像头，请改用相册或检查权限');
      }
    });
  }
  function closeCamera() {
    Camera.stop();
    $('#camera-overlay').hidden = true;
  }

  async function onShutter() {
    const dataUrl = Camera.capture();
    if (!dataUrl) { toast('拍照失败，请重试'); return; }
    Camera.stop();
    $('#camera-overlay').hidden = true;
    showPreview(dataUrl);
  }

  async function pickGallery() {
    const dataUrl = await Camera.pickFromGallery();
    if (dataUrl) {
      closeCamera();
      showPreview(dataUrl);
    }
  }

  function showPreview(dataUrl) {
    const img = $('#preview-image');
    img.src = dataUrl;
    $('#preview-overlay').hidden = false;
    img._dataUrl = dataUrl;
  }
  function closePreview() {
    $('#preview-overlay').hidden = true;
  }

  async function recognizeCurrent() {
    const img = $('#preview-image');
    const dataUrl = img._dataUrl;
    if (!dataUrl) return;
    $('#preview-overlay').hidden = true;
    showLoading('正在识别…');
    const compressed = await Camera.compress(dataUrl, 1024, 0.8);
    const result = await AI.recognize(compressed);
    hideLoading();
    if (result && result.error === 'not-configured') {
      toast('请先在「我的 → AI 设置」配置识别接口');
      lastRecognition = null;
      switchView('scan');
      renderScan();
      // 未配置时走手动选择
      goSettings();
      return;
    }
    if (result && result.error && result.error !== 'not-configured') {
      toast('识别失败，请检查网络或 API 配置');
    } else {
      toast('识别完成');
    }
    lastRecognition = result;
    switchView('scan');
  }

  /* ---------------- 加载层 ---------------- */
  function showLoading(text) {
    $('#loading-text').textContent = text || '处理中…';
    $('#loading-mask').hidden = false;
  }
  function hideLoading() { $('#loading-mask').hidden = true; }

  /* ---------------- 渲染：我的 ---------------- */
  function renderProfile() {
    const el = $('#view-profile');
    const profile = DB.getProfile();
    const history = DB.getHistory();
    const totalWorkouts = history.length;
    const totalEx = history.reduce((n, r) => n + (r.exercises ? r.exercises.filter(e => e.done).length : 0), 0);

    // 连续打卡
    const days = new Set(history.map(r => r.date));
    let streak = 0;
    let cursor = new Date();
    // 若今天还没练，从昨天开始算连续
    if (!days.has(todayStr())) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.getFullYear() + '-' + String(cursor.getMonth() + 1).padStart(2, '0') + '-' + String(cursor.getDate()).padStart(2, '0'))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    let html = `<div class="profile-head">
      <div class="avatar">${profile && profile.name ? esc(profile.name[0]) : '🏃'}</div>
      <div class="profile-info">
        <h2>${profile ? esc(profile.name) : '未设置'}</h2>
        <p>${profile ? (profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '') + ' · ' + (profile.age ? profile.age + '岁' : '') + ' · ' + (profile.height ? profile.height + 'cm' : '') + ' · ' + (profile.weight ? profile.weight + 'kg' : '') : '完善档案以获得个性化计划'}</p>
      </div>
      <button class="ghost-btn sm" onclick="App.goOnboarding(true)">编辑</button>
    </div>`;

    html += `<div class="stat-grid">
      <div class="stat-cell"><b>${streak}</b><span>连续打卡(天)</span></div>
      <div class="stat-cell"><b>${totalWorkouts}</b><span>累计训练(次)</span></div>
      <div class="stat-cell"><b>${totalEx}</b><span>完成动作(个)</span></div>
    </div>`;

    // 目标与水平
    if (profile) {
      const g = GOALS[profile.goal];
      const l = LEVELS[profile.level];
      html += `<div class="settings-card">
        <div class="set-row"><span>健身目标</span><b>${g ? g.name : '-'}</b></div>
        <div class="set-row"><span>训练水平</span><b>${l ? l.name : '-'}</b></div>
        <div class="set-row"><span>每周训练</span><b>${profile.daysPerWeek || '-'} 次</b></div>
      </div>`;
    }

    // 最近打卡
    html += `<div class="settings-card">
      <div class="set-title">最近打卡记录</div>`;
    if (history.length === 0) {
      html += `<p class="muted empty-pad">还没有训练记录，快去完成第一次训练吧</p>`;
    } else {
      const recent = history.slice(-5).reverse();
      recent.forEach(r => {
        const doneCount = r.exercises ? r.exercises.filter(e => e.done).length : 0;
        html += `<div class="hist-row">
          <div class="hist-date"><b>${fmtDate(r.date)}</b><span>${esc(r.dayName || '训练')}</span></div>
          <div class="hist-count">${doneCount} 动作</div>
        </div>`;
      });
    }
    html += `</div>`;

    // 设置入口
    html += `<div class="settings-card">
      <div class="set-title">设置</div>
      <button class="set-row clickable" onclick="App.goSettings()"><span>AI 识别配置</span><b>${AI.isConfigured() ? '已配置 ✓' : '未配置'} ›</b></button>
      <button class="set-row clickable" onclick="App.resetAll()"><span>清空所有数据</span><b>›</b></button>
    </div>`;

    el.innerHTML = html;
  }

  /* ---------------- AI 设置 ---------------- */
  function goSettings() {
    const s = DB.getSettings();
    const modal = $('#modal');
    modal.innerHTML = `
      <button class="modal-close" onclick="App.closeModal()">✕</button>
      <h3 class="modal-title">AI 识别配置</h3>
      <p class="modal-en">拍照识别需要接入一个视觉大模型接口</p>
      <div class="form-field">
        <label>服务商</label>
        <select id="set-aiProvider">
          <option value="" ${!s.aiProvider ? 'selected' : ''}>OpenAI 兼容接口（推荐）</option>
          <option value="gemini" ${s.aiProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
        </select>
      </div>
      <div class="form-field" id="set-baseurl-wrap">
        <label>接口地址 Base URL</label>
        <input id="set-baseUrl" type="url" placeholder="https://api.openai.com/v1" value="${esc(s.baseUrl || '')}" />
        <p class="field-hint">支持 DeepSeek/通义千问/智谱/Kimi 等兼容 OpenAI 格式的地址</p>
      </div>
      <div class="form-field">
        <label>API Key</label>
        <input id="set-apiKey" type="password" placeholder="sk-..." value="${esc(s.apiKey || '')}" />
      </div>
      <div class="form-field">
        <label>模型名称</label>
        <input id="set-model" type="text" placeholder="gpt-4o-mini / gemini-1.5-flash" value="${esc(s.model || '')}" />
        <p class="field-hint">视觉模型：如 gpt-4o-mini、qwen-vl-plus、glm-4v、gemini-1.5-flash</p>
      </div>
      <button class="primary-btn full" onclick="App.saveSettings()">保存配置</button>
      <p class="privacy-note">🔒 API Key 仅保存在本机浏览器本地，不会上传到任何第三方服务器</p>
    `;
    // 切换服务商时显示/隐藏 Base URL
    const providerSel = $('#set-aiProvider');
    const bw = $('#set-baseurl-wrap');
    const updateBase = () => { bw.style.display = providerSel.value === 'gemini' ? 'none' : 'block'; };
    updateBase();
    providerSel.addEventListener('change', updateBase);
    showModal();
  }

  function saveSettings() {
    const settings = {
      aiProvider: $('#set-aiProvider').value,
      baseUrl: $('#set-baseUrl').value.trim(),
      apiKey: $('#set-apiKey').value.trim(),
      model: $('#set-model').value.trim()
    };
    DB.saveSettings(settings);
    closeModal();
    toast('AI 配置已保存');
    renderScan();
  }

  function resetAll() {
    if (!confirm('确定清空所有数据（档案、计划、打卡记录）吗？此操作不可恢复。')) return;
    ['fitpai_profile', 'fitpai_plan', 'fitpai_history', 'fitpai_settings', 'fitpai_onboarded', SESSION_KEY, 'fitpai_today_addons']
      .forEach(k => localStorage.removeItem(k));
    toast('已清空');
    init();
  }

  /* ---------------- 引导 / 建档 ---------------- */
  function goOnboarding(isEdit) {
    onboardingLocked = !isEdit;
    const p = DB.getProfile() || {};
    const modal = $('#modal');
    const closeBtn = isEdit ? '<button class="modal-close" onclick="App.closeModal()">✕</button>' : '';
    modal.innerHTML = `
      ${closeBtn}
      <h3 class="modal-title">${isEdit ? '编辑档案' : '完善你的档案'}</h3>
      <p class="modal-en">用于生成个性化训练计划</p>

      <div class="form-field"><label>昵称</label>
        <input id="ob-name" type="text" placeholder="怎么称呼你" value="${esc(p.name || '')}" /></div>

      <div class="form-field"><label>性别</label>
        <div class="seg" id="ob-gender">
          <button data-v="male" class="${p.gender === 'male' ? 'active' : ''}">男</button>
          <button data-v="female" class="${p.gender === 'female' ? 'active' : ''}">女</button>
        </div></div>

      <div class="form-row">
        <div class="form-field"><label>年龄</label><input id="ob-age" type="number" inputmode="numeric" placeholder="25" value="${p.age || ''}" /></div>
        <div class="form-field"><label>身高(cm)</label><input id="ob-height" type="number" inputmode="decimal" placeholder="175" value="${p.height || ''}" /></div>
        <div class="form-field"><label>体重(kg)</label><input id="ob-weight" type="number" inputmode="decimal" placeholder="70" value="${p.weight || ''}" /></div>
      </div>

      <div class="form-field"><label>健身目标</label>
        <div class="goal-grid" id="ob-goal">
          ${Object.keys(GOALS).map(k => `<button data-v="${k}" class="${p.goal === k ? 'active' : ''}"><b>${GOALS[k].name}</b><span>${GOALS[k].desc}</span></button>`).join('')}
        </div></div>

      <div class="form-field"><label>训练水平</label>
        <div class="seg" id="ob-level">
          ${Object.keys(LEVELS).map(k => `<button data-v="${k}" class="${p.level === k ? 'active' : ''}">${LEVELS[k].name}</button>`).join('')}
        </div></div>

      <div class="form-field"><label>每周训练次数</label>
        <div class="seg" id="ob-days">
          <button data-v="3" class="${String(p.daysPerWeek || 3) === '3' ? 'active' : ''}">3 次</button>
          <button data-v="4" class="${String(p.daysPerWeek) === '4' ? 'active' : ''}">4 次</button>
        </div></div>

      <div class="form-field"><label>可用器械（可多选，不选则默认全部）</label>
        <div class="eq-grid selectable" id="ob-equipment">
          ${EQUIPMENT.map(eq => `<button data-v="${eq.id}" class="${(p.equipment || []).includes(eq.id) ? 'active' : ''}">${eq.name}</button>`).join('')}
        </div></div>

      <button class="primary-btn full" onclick="App.saveProfile(${isEdit ? 'true' : 'false'})">${isEdit ? '保存并生成计划' : '生成我的训练计划'}</button>
    `;

    // 分段选择交互
    setupSeg('ob-gender');
    setupSeg('ob-level');
    setupSeg('ob-days');
    setupMulti('ob-goal');
    setupMulti('ob-equipment');
    showModal();
  }

  function setupSeg(id) {
    const wrap = $('#' + id);
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      wrap.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  }
  function setupMulti(id) {
    const wrap = $('#' + id);
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      b.classList.toggle('active');
    });
  }

  function saveProfile(isEdit) {
    const gender = $('#ob-gender .active') ? $('#ob-gender .active').dataset.v : '';
    const level = $('#ob-level .active') ? $('#ob-level .active').dataset.v : 'beginner';
    const days = $('#ob-days .active') ? Number($('#ob-days .active').dataset.v) : 3;
    const goal = $('#ob-goal .active') ? $('#ob-goal .active').dataset.v : 'build-muscle';
    const equipment = $$('#ob-equipment .active').map(b => b.dataset.v);

    const name = $('#ob-name').value.trim();
    const age = $('#ob-age').value ? Number($('#ob-age').value) : null;
    const height = $('#ob-height').value ? Number($('#ob-height').value) : null;
    const weight = $('#ob-weight').value ? Number($('#ob-weight').value) : null;

    const profile = { name, gender, age, height, weight, goal, level, daysPerWeek: days, equipment };
    DB.saveProfile(profile);
    DB.setOnboarded(true);

    const plan = generatePlan(profile);
    DB.savePlan(plan);
    onboardingLocked = false;
    closeModal();
    toast(isEdit ? '计划已更新 🎉' : '欢迎开始训练 🎉');
    switchView('today');
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    bindEvents();
    // 注册 Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    if (!DB.isOnboarded()) {
      goOnboarding(false);
      return;
    }
    switchView('today');
  }

  function bindEvents() {
    // 底部导航
    $$('.nav-item').forEach(n => {
      n.addEventListener('click', () => switchView(n.dataset.nav));
    });
    // 顶部快速拍照
    $('#btn-quick-scan').addEventListener('click', () => { switchView('scan'); openCamera(); });

    // 相机控制
    $('#btn-camera-close').addEventListener('click', closeCamera);
    $('#btn-camera-switch').addEventListener('click', () => Camera.switchCamera());
    $('#btn-camera-shutter').addEventListener('click', onShutter);
    $('#btn-camera-gallery').addEventListener('click', pickGallery);
    $('#btn-camera-flash').addEventListener('click', () => toast('闪光灯（浏览器受限）'));

    // 预览控制
    $('#btn-preview-back').addEventListener('click', closePreview);
    $('#btn-preview-use').addEventListener('click', recognizeCurrent);
    $('#btn-preview-retake').addEventListener('click', () => { closePreview(); openCamera(); });
    $('#btn-preview-recognize').addEventListener('click', recognizeCurrent);

    // 弹窗关闭
    $('#modal-mask').addEventListener('click', (e) => { if (e.target === $('#modal-mask')) closeModal(); });
  }

  /* ---------------- 暴露到全局（供内联 onclick 调用） ---------------- */
  window.App = {
    switchView, openExercise, closeModal, addTodayExercise, toggleDone,
    completeWorkout, addTodayRestCardio, openCamera, pickGallery, pickEquipment,
    goOnboarding, goSettings, saveSettings, saveProfile, resetAll,
    recognizeCurrent
  };

  document.addEventListener('DOMContentLoaded', init);
})();
