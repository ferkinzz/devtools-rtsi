export function getWebviewHtml(): string {
  return /* html */ `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';" />
  <title>Dev Panel</title>
  <style>
    :root {
      --bg:         #0d0d0d;
      --surface:    #161616;
      --surface2:   #1e1e1e;
      --surface3:   #262626;
      --border:     rgba(255,255,255,0.07);
      --text:       #e8e8e8;
      --text-muted: #555;
      --text-dim:   #888;
      --accent:     #6366f1;
      --accent-dim: rgba(99,102,241,0.12);
      --green:      #34d399;
      --green-dim:  rgba(52,211,153,0.12);
      --yellow:     #fbbf24;
      --yellow-dim: rgba(251,191,36,0.12);
      --red:        #f87171;
      --red-dim:    rgba(248,113,113,0.12);
      --blue:       #60a5fa;
      --blue-dim:   rgba(96,165,250,0.12);
      --r:          8px;
    }
    [data-theme="light"] {
      --bg:         #f0f2f5;
      --surface:    #ffffff;
      --surface2:   #f6f7f9;
      --surface3:   #eceef1;
      --border:     rgba(0,0,0,0.09);
      --text:       #111827;
      --text-muted: #aaa;
      --text-dim:   #6b7280;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg); color: var(--text);
      height: 100vh; display: flex; flex-direction: column;
      overflow: hidden; font-size: 13px;
    }

    /* ── HEADER ─────────────────────────────── */
    .header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 0 20px; height: 52px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .logo {
      width: 26px; height: 26px; border-radius: 7px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 800; color: white;
    }
    .app-name { font-weight: 600; font-size: 14px; letter-spacing: -0.3px; }
    .app-name em { color: var(--text-muted); font-style: normal; font-weight: 400; }
    .btn-icon {
      width: 32px; height: 32px; border-radius: var(--r);
      border: 1px solid var(--border); background: transparent;
      color: var(--text-dim); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; transition: all .15s;
    }
    .btn-icon:hover { background: var(--surface2); color: var(--text); }

    /* ── LAYOUT ─────────────────────────────── */
    .layout { display: flex; flex: 1; overflow: hidden; }

    /* ── SIDEBAR ─────────────────────────────── */
    .sidebar {
      width: 192px; background: var(--surface);
      border-right: 1px solid var(--border);
      padding: 12px 8px; display: flex;
      flex-direction: column; gap: 2px; flex-shrink: 0;
    }
    .nav-item {
      display: flex; align-items: center; gap: 9px;
      padding: 8px 12px; border-radius: var(--r);
      cursor: pointer; color: var(--text-dim);
      transition: all .15s; user-select: none;
      border: 1px solid transparent;
    }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active {
      background: var(--accent-dim); color: var(--accent);
      border-color: rgba(99,102,241,.18);
    }
    .nav-icon { font-size: 13px; width: 18px; text-align: center; }
    .nav-label { font-size: 13px; font-weight: 500; flex: 1; }
    .nav-badge {
      background: var(--surface3); color: var(--text-dim);
      font-size: 10px; padding: 1px 6px;
      border-radius: 99px; font-weight: 700;
    }
    .nav-item.active .nav-badge {
      background: rgba(99,102,241,.2); color: var(--accent);
    }

    /* ── CONTENT ─────────────────────────────── */
    .content { flex: 1; overflow-y: auto; padding: 22px; }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; }

    /* ── SECTION HEADER ──────────────────────── */
    .sec-header {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 16px;
    }
    .sec-title { font-size: 16px; font-weight: 700; letter-spacing: -0.4px; }

    /* ── INPUTS ──────────────────────────────── */
    .input-row { display: flex; gap: 8px; margin-bottom: 14px; }
    input, textarea, select {
      flex: 1; background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--r);
      color: var(--text); padding: 8px 12px;
      font-size: 13px; font-family: inherit; outline: none;
      transition: border-color .15s;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--accent); }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }

    .btn {
      padding: 8px 14px; border-radius: var(--r);
      border: none; cursor: pointer;
      font-size: 12px; font-weight: 600;
      font-family: inherit; transition: all .15s; white-space: nowrap;
    }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { opacity: .88; }
    .btn-ghost {
      background: transparent; color: var(--text-dim);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { background: var(--surface2); color: var(--text); }
    .btn-sm { padding: 5px 11px; font-size: 11px; }

    /* ── PILLS ───────────────────────────────── */
    .pills { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
    .pill {
      padding: 4px 12px; border-radius: 99px;
      font-size: 11px; font-weight: 600; cursor: pointer;
      border: 1px solid var(--border); background: transparent;
      color: var(--text-dim); font-family: inherit; transition: all .15s;
    }
    .pill:hover { background: var(--surface2); color: var(--text); }
    .pill.active { background: var(--accent); color: #fff; border-color: var(--accent); }

    /* ── TASK CARD ───────────────────────────── */
    .task-list { display: flex; flex-direction: column; gap: 7px; }
    .task-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r); padding: 11px 14px;
      display: flex; align-items: flex-start; gap: 11px;
      transition: border-color .15s;
    }
    .task-card:hover { border-color: rgba(255,255,255,.13); }
    [data-theme="light"] .task-card:hover { border-color: rgba(0,0,0,.18); }
    .task-status {
      padding: 2px 8px; border-radius: 99px;
      font-size: 10px; font-weight: 800; letter-spacing: .4px;
      cursor: pointer; white-space: nowrap; flex-shrink: 0;
      text-transform: uppercase; margin-top: 1px;
    }
    .s-todo   { background: var(--surface3);   color: var(--text-dim); }
    .s-doing  { background: var(--blue-dim);    color: var(--blue); }
    .s-done   { background: var(--green-dim);   color: var(--green); }
    .task-body { flex: 1; min-width: 0; }
    .task-title { font-size: 13px; line-height: 1.45; word-break: break-word; }
    .task-card.is-done .task-title { text-decoration: line-through; opacity: .42; }
    .task-tags { display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap; }
    .tag {
      font-size: 10px; padding: 1px 6px; border-radius: 4px;
      background: var(--surface3); color: var(--text-dim); font-weight: 600;
    }
    .btn-del {
      width: 24px; height: 24px; border-radius: 5px;
      border: none; background: transparent;
      color: var(--text-muted); cursor: pointer; font-size: 11px;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: all .15s; flex-shrink: 0;
    }
    .task-card:hover .btn-del,
    .note-card:hover .btn-del,
    .phase-card:hover .phase-del { opacity: 1; }
    .btn-del:hover { background: var(--red-dim); color: var(--red); }

    /* ── NOTES ───────────────────────────────── */
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 12px;
    }
    .add-note-card {
      border-radius: var(--r); padding: 14px; min-height: 130px;
      background: var(--surface); border: 2px dashed var(--border);
      display: flex; flex-direction: column; gap: 8px;
    }
    .add-note-card textarea {
      background: transparent; border: none; flex: 1;
      min-height: 70px; resize: none; font-size: 13px; padding: 0;
    }
    .note-card {
      border-radius: var(--r); padding: 14px; min-height: 120px;
      position: relative; border: 1px solid transparent;
    }
    .nc0 { background: #2b2200; border-color: #5a4810; }
    .nc1 { background: #0a2016; border-color: #1a5038; }
    .nc2 { background: #0a1530; border-color: #1a3060; }
    .nc3 { background: #20102a; border-color: #4a1a5a; }
    [data-theme="light"] .nc0 { background: #fef9c3; border-color: #fde68a; }
    [data-theme="light"] .nc1 { background: #dcfce7; border-color: #86efac; }
    [data-theme="light"] .nc2 { background: #dbeafe; border-color: #93c5fd; }
    [data-theme="light"] .nc3 { background: #fae8ff; border-color: #e879f9; }
    .note-card .btn-del { position: absolute; top: 8px; right: 8px; opacity: 0; }
    .note-text { font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; opacity: .88; }
    .note-date { font-size: 10px; color: var(--text-muted); margin-top: 8px; }

    /* ── DECISIONS ───────────────────────────── */
    .decision-list { display: flex; flex-direction: column; gap: 10px; }
    .decision-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r); overflow: hidden;
    }
    .decision-head {
      padding: 13px 16px; display: flex; align-items: center;
      gap: 9px; cursor: pointer; transition: background .15s;
    }
    .decision-head:hover { background: var(--surface2); }
    .d-status {
      padding: 2px 8px; border-radius: 99px;
      font-size: 10px; font-weight: 800; text-transform: uppercase; flex-shrink: 0;
    }
    .ds-proposed  { background: var(--yellow-dim); color: var(--yellow); }
    .ds-accepted  { background: var(--green-dim);  color: var(--green); }
    .ds-deprecated{ background: var(--red-dim);    color: var(--red); }
    .d-title-text { flex: 1; font-weight: 600; font-size: 13px; }
    .d-date { font-size: 11px; color: var(--text-muted); }
    .d-chevron { color: var(--text-muted); font-size: 10px; transition: transform .2s; }
    .decision-card.open .d-chevron { transform: rotate(90deg); }
    .decision-body {
      display: none; padding: 0 16px 16px;
      border-top: 1px solid var(--border);
    }
    .decision-card.open .decision-body { display: block; }
    .d-field { margin-top: 12px; }
    .d-field-label {
      font-size: 10px; font-weight: 800; text-transform: uppercase;
      letter-spacing: .5px; color: var(--text-muted); margin-bottom: 4px;
    }
    .d-field-value { font-size: 13px; line-height: 1.6; color: var(--text-dim); white-space: pre-wrap; }
    .d-form {
      background: var(--surface); border: 1px solid var(--accent);
      border-radius: var(--r); padding: 16px;
      margin-bottom: 14px; display: none;
      flex-direction: column; gap: 9px;
    }
    .d-form.open { display: flex; }
    .d-form textarea { resize: vertical; min-height: 60px; }
    .form-row { display: flex; gap: 8px; }

    /* ── ROADMAP ─────────────────────────────── */
    .phases { display: flex; flex-direction: column; gap: 14px; }
    .phase-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r); overflow: hidden;
    }
    .phase-head {
      padding: 11px 14px; display: flex; align-items: center; gap: 10px;
    }
    .phase-name { font-weight: 600; font-size: 13px; flex: 1; }
    .prog-bar {
      width: 72px; height: 4px; background: var(--surface3);
      border-radius: 99px; overflow: hidden;
    }
    .prog-fill {
      height: 100%; background: var(--accent);
      border-radius: 99px; transition: width .3s;
    }
    .prog-pct { font-size: 11px; color: var(--text-muted); font-family: monospace; }
    .phase-del {
      width: 24px; height: 24px; border-radius: 5px;
      border: none; background: transparent;
      color: var(--text-muted); cursor: pointer; font-size: 11px;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: all .15s;
    }
    .phase-del:hover { background: var(--red-dim); color: var(--red); }
    .phase-items { border-top: 1px solid var(--border); padding: 8px; }
    .phase-item {
      display: flex; align-items: center; gap: 9px;
      padding: 7px 8px; border-radius: 6px; transition: background .15s;
    }
    .phase-item:hover { background: var(--surface2); }
    .item-check {
      width: 16px; height: 16px; border-radius: 4px;
      border: 1px solid var(--border); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; flex-shrink: 0; transition: all .15s;
    }
    .item-check.done  { background: var(--green); border-color: var(--green); color: #fff; }
    .item-check.doing { background: var(--blue-dim); border-color: var(--blue); color: var(--blue); }
    .item-label { flex: 1; font-size: 13px; }
    .phase-item.is-done .item-label { text-decoration: line-through; opacity: .38; }
    .phase-add-row { display: flex; gap: 6px; margin: 8px 8px 4px; }
    .phase-add-row input { font-size: 12px; padding: 6px 10px; }

    /* ── AI ──────────────────────────────────── */
    .ai-wrap { display: flex; flex-direction: column; height: calc(100vh - 148px); }
    .ai-status-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 14px; background: var(--surface);
      border: 1px solid var(--border); border-radius: var(--r);
      margin-bottom: 12px;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--text-muted); transition: all .3s;
    }
    .dot.on  { background: var(--green); box-shadow: 0 0 6px var(--green); }
    .dot.off { background: var(--red); }
    .ai-status-text { font-size: 12px; color: var(--text-dim); }
    .ai-model-label { font-size: 11px; color: var(--text-muted); margin-left: auto; font-family: monospace; }
    .chat-msgs {
      flex: 1; overflow-y: auto; display: flex;
      flex-direction: column; gap: 11px; padding: 2px;
    }
    .msg { display: flex; gap: 10px; align-items: flex-start; }
    .msg-av {
      width: 28px; height: 28px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; flex-shrink: 0;
    }
    .av-user { background: var(--accent); color: #fff; }
    .av-ai   { background: var(--surface3); color: var(--text-dim); }
    .msg-body {
      flex: 1; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r); padding: 10px 13px;
      font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;
    }
    .msg.user .msg-body { background: var(--accent-dim); border-color: rgba(99,102,241,.2); }
    .chat-in-row { display: flex; gap: 8px; margin-top: 12px; }
    .chat-in-row textarea { resize: none; height: 44px; padding: 10px 12px; line-height: 1.5; }

    /* ── EMPTY STATE ─────────────────────────── */
    .empty { text-align: center; padding: 52px 20px; color: var(--text-muted); }
    .empty-icon { font-size: 30px; margin-bottom: 10px; opacity: .35; }
    .empty-text { font-size: 13px; }

    /* ── SCROLLBAR ───────────────────────────── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  </style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="header-left">
    <div class="logo">D</div>
    <div class="app-name">Dev Panel <em>· RTSI</em></div>
  </div>
  <button class="btn-icon" id="theme-btn" title="Toggle tema">☀</button>
</div>

<div class="layout">
  <!-- SIDEBAR -->
  <nav class="sidebar">
    <div class="nav-item active" data-tab="tasks">
      <span class="nav-icon">✔</span>
      <span class="nav-label">Tasks</span>
      <span class="nav-badge" id="b-tasks">0</span>
    </div>
    <div class="nav-item" data-tab="ideas">
      <span class="nav-icon">💡</span>
      <span class="nav-label">Ideas</span>
      <span class="nav-badge" id="b-ideas">0</span>
    </div>
    <div class="nav-item" data-tab="notes">
      <span class="nav-icon">📝</span>
      <span class="nav-label">Notas</span>
      <span class="nav-badge" id="b-notes">0</span>
    </div>
    <div class="nav-item" data-tab="decisions">
      <span class="nav-icon">⚖</span>
      <span class="nav-label">Decisiones</span>
      <span class="nav-badge" id="b-decisions">0</span>
    </div>
    <div class="nav-item" data-tab="roadmap">
      <span class="nav-icon">🗺</span>
      <span class="nav-label">Roadmap</span>
    </div>
    <div class="nav-item" data-tab="ai">
      <span class="nav-icon">✦</span>
      <span class="nav-label">AI</span>
    </div>
  </nav>

  <!-- CONTENT -->
  <main class="content">

    <!-- TASKS -->
    <div class="tab-pane active" id="tab-tasks">
      <div class="sec-header">
        <h2 class="sec-title">Tasks</h2>
      </div>
      <div class="input-row">
        <input id="task-in" type="text" placeholder="Nueva tarea... (#tag para etiquetar)" />
        <button class="btn btn-primary" onclick="addTask()">Agregar</button>
      </div>
      <div class="pills">
        <button class="pill active" onclick="setTF('all',this)">Todas</button>
        <button class="pill" onclick="setTF('todo',this)">Todo</button>
        <button class="pill" onclick="setTF('doing',this)">Haciendo</button>
        <button class="pill" onclick="setTF('done',this)">Hecho</button>
      </div>
      <div class="task-list" id="tasks-list"></div>
    </div>

    <!-- IDEAS -->
    <div class="tab-pane" id="tab-ideas">
      <div class="sec-header">
        <h2 class="sec-title">Ideas</h2>
      </div>
      <div class="input-row">
        <input id="idea-in" type="text" placeholder="Nueva idea... (#tag para etiquetar)" />
        <button class="btn btn-primary" onclick="addIdea()">Agregar</button>
      </div>
      <div class="task-list" id="ideas-list"></div>
    </div>

    <!-- NOTES -->
    <div class="tab-pane" id="tab-notes">
      <div class="sec-header">
        <h2 class="sec-title">Notas</h2>
      </div>
      <div class="notes-grid" id="notes-grid"></div>
    </div>

    <!-- DECISIONS -->
    <div class="tab-pane" id="tab-decisions">
      <div class="sec-header">
        <h2 class="sec-title">Decisiones</h2>
        <button class="btn btn-primary btn-sm" onclick="toggleDF()">+ Nueva</button>
      </div>
      <div class="d-form" id="d-form">
        <input id="d-title" type="text" placeholder="Título de la decisión" />
        <div class="form-row">
          <select id="d-status">
            <option value="proposed">Propuesta</option>
            <option value="accepted">Aceptada</option>
            <option value="deprecated">Deprecada</option>
          </select>
        </div>
        <textarea id="d-ctx"  placeholder="Contexto (¿por qué se tomó?)"></textarea>
        <textarea id="d-dec"  placeholder="Decisión tomada"></textarea>
        <textarea id="d-cons" placeholder="Consecuencias"></textarea>
        <div class="form-row">
          <button class="btn btn-primary" onclick="addDecision()">Guardar</button>
          <button class="btn btn-ghost"   onclick="toggleDF()">Cancelar</button>
        </div>
      </div>
      <div class="decision-list" id="decisions-list"></div>
    </div>

    <!-- ROADMAP -->
    <div class="tab-pane" id="tab-roadmap">
      <div class="sec-header">
        <h2 class="sec-title">Roadmap</h2>
      </div>
      <div class="input-row" style="margin-bottom:18px">
        <input id="phase-in" type="text" placeholder="Nueva fase..." />
        <button class="btn btn-primary" onclick="addPhase()">Agregar fase</button>
      </div>
      <div class="phases" id="phases"></div>
    </div>

    <!-- AI -->
    <div class="tab-pane" id="tab-ai">
      <div class="sec-header">
        <h2 class="sec-title">AI Assistant</h2>
        <button class="btn btn-ghost btn-sm" onclick="pingOllama()">Reconectar</button>
      </div>
      <div class="ai-wrap">
        <div class="ai-status-bar">
          <div class="dot" id="ai-dot"></div>
          <span class="ai-status-text" id="ai-status">Verificando Ollama…</span>
          <span class="ai-model-label">mistral:7b-instruct</span>
        </div>
        <div class="chat-msgs" id="chat-msgs"></div>
        <div class="chat-in-row">
          <textarea id="ai-in" placeholder="Escribe un mensaje… (Enter para enviar)"></textarea>
          <button class="btn btn-primary" id="ai-send" onclick="sendAI()">Enviar</button>
        </div>
      </div>
    </div>

  </main>
</div>

<script>
  const vscode = acquireVsCodeApi();
  let data = { tasks: [], notes: [], decisions: [], roadmap: [] };
  let tf = 'all';          // tasks filter
  let ollamaOk = false;
  let streaming = false;
  let curAiEl = null;

  // ── THEME ───────────────────────────────────
  const html = document.documentElement;
  let dark = true;
  document.getElementById('theme-btn').onclick = () => {
    dark = !dark;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.getElementById('theme-btn').textContent = dark ? '☀' : '🌙';
  };

  // ── TABS ────────────────────────────────────
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => {
      const tab = el.dataset.tab;
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
      if (tab === 'ai') pingOllama();
    });
  });

  // ── MESSAGES FROM EXTENSION ─────────────────
  window.addEventListener('message', ({ data: msg }) => {
    switch (msg.type) {
      case 'data':          data = msg.payload; renderAll(); break;
      case 'ollama-status': setOllama(msg.ok);  break;
      case 'ollama-chunk':  appendChunk(msg.text); break;
      case 'ollama-done':   finishStream();     break;
      case 'ollama-error':  finishStream('Error: ' + msg.msg); break;
    }
  });
  vscode.postMessage({ type: 'ready' });

  function save() {
    data.lastUpdated = new Date().toISOString();
    vscode.postMessage({ type: 'save', payload: data });
  }

  // ── RENDER ──────────────────────────────────
  function renderAll() {
    renderTasks(); renderNotes(); renderDecisions(); renderRoadmap(); badges();
  }

  function badges() {
    const pending = data.tasks.filter(t => t.type === 'task' && t.status !== 'done').length;
    const ideas   = data.tasks.filter(t => t.type === 'idea').length;
    document.getElementById('b-tasks').textContent     = pending;
    document.getElementById('b-ideas').textContent     = ideas;
    document.getElementById('b-notes').textContent     = data.notes.length;
    document.getElementById('b-decisions').textContent = data.decisions.length;
  }

  // ── TASKS ───────────────────────────────────
  function addTask() {
    const el = document.getElementById('task-in');
    const raw = el.value.trim(); if (!raw) return;
    const tags  = [...raw.matchAll(/#(\\w+)/g)].map(m => m[1]);
    const title = raw.replace(/#\\w+/g, '').trim();
    data.tasks.push({ id: uid(), type: 'task', title, tags, status: 'todo', at: now() });
    el.value = ''; save(); renderAll();
  }

  function addIdea() {
    const el = document.getElementById('idea-in');
    const raw = el.value.trim(); if (!raw) return;
    const tags  = [...raw.matchAll(/#(\\w+)/g)].map(m => m[1]);
    const title = raw.replace(/#\\w+/g, '').trim();
    data.tasks.push({ id: uid(), type: 'idea', title, tags, status: 'todo', at: now() });
    el.value = ''; save(); renderAll();
  }

  function cycleStatus(id) {
    const t = data.tasks.find(x => x.id === id); if (!t) return;
    t.status = { todo: 'doing', doing: 'done', done: 'todo' }[t.status] || 'todo';
    save(); renderAll();
  }

  function delTask(id) {
    data.tasks = data.tasks.filter(t => t.id !== id); save(); renderAll();
  }

  function setTF(f, el) {
    tf = f;
    el.closest('.pills').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active'); renderTasks();
  }

  function renderTasks() {
    render_tlist('task', 'tasks-list');
    render_tlist('idea', 'ideas-list');
  }

  function render_tlist(type, id) {
    const el = document.getElementById(id);
    let items = data.tasks.filter(t => t.type === type);
    if (type === 'task' && tf !== 'all') items = items.filter(t => t.status === tf);
    if (!items.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">' + (type === 'task' ? '✔' : '💡') + '</div><div class="empty-text">Nada por aquí aún</div></div>';
      return;
    }
    el.innerHTML = items.map(t => \`
      <div class="task-card \${t.status === 'done' ? 'is-done' : ''}">
        <span class="task-status s-\${t.status}" onclick="cycleStatus('\${t.id}')">\${sLabel(t.status)}</span>
        <div class="task-body">
          <div class="task-title">\${esc(t.title)}</div>
          \${t.tags?.length ? '<div class="task-tags">' + t.tags.map(g => '<span class="tag">#' + esc(g) + '</span>').join('') + '</div>' : ''}
        </div>
        <button class="btn-del" onclick="delTask('\${t.id}')">✕</button>
      </div>
    \`).join('');
  }

  const sLabel = s => ({ todo: 'Todo', doing: 'Doing', done: 'Done' }[s] || s);

  // ── NOTES ───────────────────────────────────
  function addNote() {
    const el = document.getElementById('note-in');
    const text = el.value.trim(); if (!text) return;
    data.notes.push({ id: uid(), text, color: data.notes.length % 4, at: now() });
    el.value = ''; save(); renderNotes();
  }

  function delNote(id) {
    data.notes = data.notes.filter(n => n.id !== id); save(); renderNotes(); badges();
  }

  function renderNotes() {
    const grid = document.getElementById('notes-grid');
    const addCard = \`<div class="add-note-card">
      <textarea id="note-in" placeholder="Escribe una nota…"></textarea>
      <button class="btn btn-primary btn-sm" onclick="addNote()">Agregar</button>
    </div>\`;
    const cards = data.notes.map(n => \`
      <div class="note-card nc\${n.color % 4}">
        <button class="btn-del" onclick="delNote('\${n.id}')">✕</button>
        <div class="note-text">\${esc(n.text)}</div>
        <div class="note-date">\${fmtD(n.at)}</div>
      </div>
    \`).join('');
    grid.innerHTML = addCard + cards;
  }

  // ── DECISIONS ───────────────────────────────
  function toggleDF() { document.getElementById('d-form').classList.toggle('open'); }

  function addDecision() {
    const title = document.getElementById('d-title').value.trim(); if (!title) return;
    data.decisions.push({
      id: uid(), title,
      status:       document.getElementById('d-status').value,
      context:      document.getElementById('d-ctx').value.trim(),
      decision:     document.getElementById('d-dec').value.trim(),
      consequences: document.getElementById('d-cons').value.trim(),
      at: now()
    });
    ['d-title','d-ctx','d-dec','d-cons'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('d-status').value = 'proposed';
    toggleDF(); save(); renderDecisions(); badges();
  }

  function delDecision(id) {
    data.decisions = data.decisions.filter(d => d.id !== id); save(); renderDecisions(); badges();
  }

  function toggleD(id) {
    document.getElementById('dc-' + id).classList.toggle('open');
  }

  function renderDecisions() {
    const el = document.getElementById('decisions-list');
    if (!data.decisions.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">⚖</div><div class="empty-text">Sin decisiones registradas</div></div>';
      return;
    }
    el.innerHTML = [...data.decisions].reverse().map(d => \`
      <div class="decision-card" id="dc-\${d.id}">
        <div class="decision-head" onclick="toggleD('\${d.id}')">
          <span class="d-status ds-\${d.status}">\${d.status}</span>
          <span class="d-title-text">\${esc(d.title)}</span>
          <span class="d-date">\${fmtD(d.at)}</span>
          <button class="btn-del" onclick="event.stopPropagation();delDecision('\${d.id}')">✕</button>
          <span class="d-chevron">▶</span>
        </div>
        <div class="decision-body">
          \${d.context      ? \`<div class="d-field"><div class="d-field-label">Contexto</div><div class="d-field-value">\${esc(d.context)}</div></div>\` : ''}
          \${d.decision     ? \`<div class="d-field"><div class="d-field-label">Decisión</div><div class="d-field-value">\${esc(d.decision)}</div></div>\` : ''}
          \${d.consequences ? \`<div class="d-field"><div class="d-field-label">Consecuencias</div><div class="d-field-value">\${esc(d.consequences)}</div></div>\` : ''}
        </div>
      </div>
    \`).join('');
  }

  // ── ROADMAP ─────────────────────────────────
  function addPhase() {
    const el = document.getElementById('phase-in');
    const name = el.value.trim(); if (!name) return;
    data.roadmap.push({ id: uid(), name, items: [] });
    el.value = ''; save(); renderRoadmap();
  }

  function addItem(pid) {
    const el = document.getElementById('pi-' + pid);
    const label = el.value.trim(); if (!label) return;
    const phase = data.roadmap.find(p => p.id === pid); if (!phase) return;
    phase.items.push({ id: uid(), label, status: 'todo' });
    el.value = ''; save(); renderRoadmap();
  }

  function cycleItem(pid, iid) {
    const phase = data.roadmap.find(p => p.id === pid);
    const item  = phase?.items.find(i => i.id === iid); if (!item) return;
    item.status = { todo: 'doing', doing: 'done', done: 'todo' }[item.status] || 'todo';
    save(); renderRoadmap();
  }

  function delPhase(id) {
    data.roadmap = data.roadmap.filter(p => p.id !== id); save(); renderRoadmap();
  }

  function delItem(pid, iid) {
    const phase = data.roadmap.find(p => p.id === pid); if (!phase) return;
    phase.items = phase.items.filter(i => i.id !== iid); save(); renderRoadmap();
  }

  function phasePct(phase) {
    if (!phase.items.length) return 0;
    return Math.round(phase.items.filter(i => i.status === 'done').length / phase.items.length * 100);
  }

  function renderRoadmap() {
    const el = document.getElementById('phases');
    if (!data.roadmap.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">🗺</div><div class="empty-text">Agrega una fase para empezar</div></div>';
      return;
    }
    el.innerHTML = data.roadmap.map(phase => {
      const pct = phasePct(phase);
      return \`
        <div class="phase-card">
          <div class="phase-head">
            <span class="phase-name">\${esc(phase.name)}</span>
            <div class="prog-bar"><div class="prog-fill" style="width:\${pct}%"></div></div>
            <span class="prog-pct">\${pct}%</span>
            <button class="phase-del" onclick="delPhase('\${phase.id}')">✕</button>
          </div>
          <div class="phase-items">
            \${phase.items.map(item => \`
              <div class="phase-item \${item.status === 'done' ? 'is-done' : ''}">
                <div class="item-check \${item.status}" onclick="cycleItem('\${phase.id}','\${item.id}')">
                  \${item.status === 'done' ? '✓' : item.status === 'doing' ? '·' : ''}
                </div>
                <span class="item-label">\${esc(item.label)}</span>
                <button class="btn-del" onclick="delItem('\${phase.id}','\${item.id}')">✕</button>
              </div>
            \`).join('')}
            <div class="phase-add-row">
              <input id="pi-\${phase.id}" type="text" placeholder="Agregar item…"
                onkeydown="if(event.key==='Enter')addItem('\${phase.id}')" />
              <button class="btn btn-ghost btn-sm" onclick="addItem('\${phase.id}')">+</button>
            </div>
          </div>
        </div>
      \`;
    }).join('');
  }

  // ── AI / OLLAMA ─────────────────────────────
  function pingOllama() {
    document.getElementById('ai-status').textContent = 'Verificando…';
    vscode.postMessage({ type: 'ollama-ping' });
  }

  function setOllama(ok) {
    ollamaOk = ok;
    document.getElementById('ai-dot').className    = 'dot ' + (ok ? 'on' : 'off');
    document.getElementById('ai-status').textContent = ok ? 'Ollama conectado' : 'Ollama no disponible';
    document.getElementById('ai-send').disabled    = !ok || streaming;
  }

  function sendAI() {
    if (!ollamaOk || streaming) return;
    const el = document.getElementById('ai-in');
    const text = el.value.trim(); if (!text) return;
    addMsg('user', text);
    curAiEl = addMsg('ai', '');
    el.value = '';
    streaming = true;
    document.getElementById('ai-send').disabled = true;
    vscode.postMessage({ type: 'ollama-chat', prompt: text });
  }

  function addMsg(role, text) {
    const wrap = document.getElementById('chat-msgs');
    const div  = document.createElement('div');
    div.className = 'msg ' + role;
    div.innerHTML = \`
      <div class="msg-av av-\${role}">\${role === 'user' ? 'Tú' : 'AI'}</div>
      <div class="msg-body">\${esc(text)}</div>
    \`;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
    return div.querySelector('.msg-body');
  }

  function appendChunk(text) {
    if (!curAiEl) return;
    curAiEl.textContent += text;
    document.getElementById('chat-msgs').scrollTop = 9999;
  }

  function finishStream(err) {
    streaming = false;
    document.getElementById('ai-send').disabled = false;
    if (err && curAiEl) curAiEl.textContent = err;
    curAiEl = null;
  }

  // ── KEYBOARD SHORTCUTS ──────────────────────
  document.getElementById('task-in').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
  document.getElementById('idea-in').addEventListener('keydown', e => { if (e.key === 'Enter') addIdea(); });
  document.getElementById('ai-in').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(); }
  });

  // ── UTILS ───────────────────────────────────
  const uid  = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const now  = () => new Date().toISOString();
  const fmtD = iso => iso ? new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const esc  = s  => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
</script>
</body>
</html>`;
}
