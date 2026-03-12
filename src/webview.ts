export function getWebviewHtml(): string {
  return /* html */ `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline' 'self';" />
  <title>DevTools RTSI</title>
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
      --accent-dim: rgba(99,102,241,0.13);
      --green:      #34d399;
      --green-dim:  rgba(52,211,153,0.13);
      --yellow:     #fbbf24;
      --yellow-dim: rgba(251,191,36,0.13);
      --red:        #f87171;
      --red-dim:    rgba(248,113,113,0.13);
      --blue:       #60a5fa;
      --blue-dim:   rgba(96,165,250,0.13);
      --r:          7px;
    }
    [data-theme="light"] {
      --bg:         #f0f2f5;
      --surface:    #ffffff;
      --surface2:   #f5f6f8;
      --surface3:   #eceef1;
      --border:     rgba(0,0,0,0.09);
      --text:       #111827;
      --text-muted: #bbb;
      --text-dim:   #6b7280;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg); color: var(--text);
      height: 100vh; display: flex; flex-direction: column;
      overflow: hidden; font-size: 13px;
    }

    /* ── HEADER ──────────────────────────────── */
    .header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }
    .logo-row { display: flex; align-items: center; gap: 8px; }
    .logo {
      width: 22px; height: 22px; border-radius: 6px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff;
    }
    .app-name { font-size: 13px; font-weight: 600; letter-spacing: -0.3px; }
    .app-name em { color: var(--text-muted); font-style: normal; font-weight: 400; font-size: 11px; }
    .hdr-actions { display: flex; gap: 6px; align-items: center; }
    .btn-icon {
      width: 26px; height: 26px; border-radius: var(--r);
      border: 1px solid var(--border); background: transparent;
      color: var(--text-dim); cursor: pointer; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s;
    }
    .btn-icon:hover { background: var(--surface2); color: var(--text); }
    .btn-icon.active { background: var(--accent-dim); color: var(--accent); border-color: rgba(99,102,241,.2); }

    /* ── TAB BAR ─────────────────────────────── */
    .tabbar {
      display: flex; background: var(--surface);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0; overflow-x: auto;
    }
    .tabbar::-webkit-scrollbar { display: none; }
    .tab {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 2px; padding: 8px 4px;
      cursor: pointer; color: var(--text-muted);
      font-size: 9px; font-weight: 600; letter-spacing: .3px;
      text-transform: uppercase; transition: all .15s;
      border-bottom: 2px solid transparent; user-select: none;
      position: relative;
    }
    .tab:hover { color: var(--text-dim); background: var(--surface2); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .tab-icon { font-size: 14px; line-height: 1; }
    .tab-badge {
      position: absolute; top: 4px; right: 4px;
      background: var(--accent); color: #fff;
      font-size: 8px; font-weight: 800;
      padding: 1px 4px; border-radius: 99px;
      line-height: 1.4; min-width: 14px; text-align: center;
      display: none;
    }
    .tab-badge.show { display: block; }

    /* ── CONTENT ─────────────────────────────── */
    .content { flex: 1; overflow-y: auto; padding: 12px; }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; }

    /* ── GENERIC ─────────────────────────────── */
    .sec-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .sec-title { font-size: 14px; font-weight: 700; letter-spacing: -0.3px; }
    .row { display: flex; gap: 6px; margin-bottom: 10px; }
    input, textarea, select {
      flex: 1; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r); color: var(--text); padding: 7px 10px;
      font-size: 12px; font-family: inherit; outline: none; transition: border-color .15s;
    }
    input:focus, textarea:focus, select:focus { border-color: var(--accent); }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }
    .btn {
      padding: 7px 12px; border-radius: var(--r); border: none; cursor: pointer;
      font-size: 11px; font-weight: 700; font-family: inherit; transition: all .15s; white-space: nowrap;
    }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { opacity: .88; }
    .btn-ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--surface2); color: var(--text); }
    .btn-sm { padding: 4px 9px; font-size: 10px; }
    .btn-danger { background: var(--red-dim); color: var(--red); border: 1px solid rgba(248,113,113,.2); }
    .btn-danger:hover { background: var(--red); color: #fff; }
    .pills { display: flex; gap: 5px; margin-bottom: 10px; flex-wrap: wrap; }
    .pill {
      padding: 3px 10px; border-radius: 99px; font-size: 10px; font-weight: 700;
      cursor: pointer; border: 1px solid var(--border); background: transparent;
      color: var(--text-dim); font-family: inherit; transition: all .15s;
    }
    .pill:hover { background: var(--surface2); color: var(--text); }
    .pill.active { background: var(--accent); color: #fff; border-color: var(--accent); }

    /* ── TASK CARD ───────────────────────────── */
    .tlist { display: flex; flex-direction: column; gap: 6px; }
    .tcard {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--r);
      padding: 9px 11px; display: flex; align-items: flex-start; gap: 8px; transition: border-color .15s;
    }
    .tcard:hover { border-color: rgba(255,255,255,.12); }
    [data-theme="light"] .tcard:hover { border-color: rgba(0,0,0,.16); }
    .tstatus {
      padding: 2px 7px; border-radius: 99px; font-size: 9px; font-weight: 800;
      letter-spacing: .4px; cursor: pointer; white-space: nowrap; flex-shrink: 0;
      text-transform: uppercase; margin-top: 1px;
    }
    .s-todo  { background: var(--surface3); color: var(--text-dim); }
    .s-doing { background: var(--blue-dim); color: var(--blue); }
    .s-done  { background: var(--green-dim); color: var(--green); }
    .tbody { flex: 1; min-width: 0; }
    .ttitle { font-size: 12px; line-height: 1.4; word-break: break-word; }
    .tcard.is-done .ttitle { text-decoration: line-through; opacity: .4; }
    .ttags { display: flex; gap: 3px; margin-top: 5px; flex-wrap: wrap; }
    .tag { font-size: 9px; padding: 1px 5px; border-radius: 4px; background: var(--surface3); color: var(--text-dim); font-weight: 700; }
    .bdel {
      width: 20px; height: 20px; border-radius: 4px; border: none; background: transparent;
      color: var(--text-muted); cursor: pointer; font-size: 10px;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: all .15s; flex-shrink: 0;
    }
    .tcard:hover .bdel, .ncard:hover .bdel { opacity: 1; }
    .bdel:hover { background: var(--red-dim); color: var(--red); }

    /* ── NOTES ───────────────────────────────── */
    .ngrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .add-note { border-radius: var(--r); padding: 10px; background: var(--surface); border: 2px dashed var(--border); display: flex; flex-direction: column; gap: 6px; grid-column: 1 / -1; }
    .add-note textarea { background: transparent; border: none; min-height: 50px; resize: none; font-size: 12px; padding: 0; }
    .ncard { border-radius: var(--r); padding: 10px; min-height: 80px; position: relative; border: 1px solid transparent; }
    .ncard .bdel { position: absolute; top: 6px; right: 6px; opacity: 0; }
    .nc0 { background: #2b2200; border-color: #5a4810; }
    .nc1 { background: #0a2016; border-color: #1a5038; }
    .nc2 { background: #0a1530; border-color: #1a3060; }
    .nc3 { background: #20102a; border-color: #4a1a5a; }
    [data-theme="light"] .nc0 { background: #fef9c3; border-color: #fde68a; }
    [data-theme="light"] .nc1 { background: #dcfce7; border-color: #86efac; }
    [data-theme="light"] .nc2 { background: #dbeafe; border-color: #93c5fd; }
    [data-theme="light"] .nc3 { background: #fae8ff; border-color: #e879f9; }
    .ntext { font-size: 12px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; opacity: .88; }
    .ndate { font-size: 9px; color: var(--text-muted); margin-top: 6px; }

    /* ── DECISIONS ───────────────────────────── */
    .dlist { display: flex; flex-direction: column; gap: 8px; }
    .dcard { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
    .dhead { padding: 10px 12px; display: flex; align-items: center; gap: 7px; cursor: pointer; transition: background .15s; }
    .dhead:hover { background: var(--surface2); }
    .dstatus { padding: 1px 7px; border-radius: 99px; font-size: 9px; font-weight: 800; text-transform: uppercase; flex-shrink: 0; }
    .ds-proposed  { background: var(--yellow-dim); color: var(--yellow); }
    .ds-accepted  { background: var(--green-dim);  color: var(--green); }
    .ds-deprecated{ background: var(--red-dim);    color: var(--red); }
    .dtitle { flex: 1; font-weight: 600; font-size: 12px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dchev { color: var(--text-muted); font-size: 9px; transition: transform .2s; flex-shrink: 0; }
    .dcard.open .dchev { transform: rotate(90deg); }
    .dbody { display: none; padding: 0 12px 12px; border-top: 1px solid var(--border); }
    .dcard.open .dbody { display: block; }
    .dfield { margin-top: 10px; }
    .dflabel { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: var(--text-muted); margin-bottom: 3px; }
    .dfval { font-size: 12px; line-height: 1.5; color: var(--text-dim); white-space: pre-wrap; }
    .dform { background: var(--surface); border: 1px solid var(--accent); border-radius: var(--r); padding: 12px; margin-bottom: 10px; display: none; flex-direction: column; gap: 7px; }
    .dform.open { display: flex; }
    .dform textarea { resize: vertical; min-height: 50px; }

    /* ── ROADMAP ─────────────────────────────── */
    .phases { display: flex; flex-direction: column; gap: 10px; }
    .phase { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
    .phase-hd { padding: 9px 12px; display: flex; align-items: center; gap: 8px; }
    .phase-name { font-weight: 600; font-size: 12px; flex: 1; }
    .pbar { width: 50px; height: 3px; background: var(--surface3); border-radius: 99px; overflow: hidden; }
    .pfill { height: 100%; background: var(--accent); border-radius: 99px; transition: width .3s; }
    .ppct { font-size: 10px; color: var(--text-muted); font-family: monospace; }
    .pdel { width: 20px; height: 20px; border-radius: 4px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 10px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all .15s; }
    .phase:hover .pdel { opacity: 1; }
    .pdel:hover { background: var(--red-dim); color: var(--red); }
    .pitems { border-top: 1px solid var(--border); padding: 6px; }
    .pitem { display: flex; align-items: center; gap: 7px; padding: 5px 6px; border-radius: 5px; transition: background .15s; }
    .pitem:hover { background: var(--surface2); }
    .icheck { width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 8px; flex-shrink: 0; transition: all .15s; }
    .icheck.done  { background: var(--green); border-color: var(--green); color: #fff; }
    .icheck.doing { background: var(--blue-dim); border-color: var(--blue); color: var(--blue); }
    .ilabel { flex: 1; font-size: 12px; }
    .pitem.is-done .ilabel { text-decoration: line-through; opacity: .38; }
    .padd { display: flex; gap: 5px; margin: 6px 6px 2px; }
    .padd input { font-size: 11px; padding: 5px 8px; }

    /* ── AI ──────────────────────────────────── */
    .ai-wrap { display: flex; flex-direction: column; height: calc(100vh - 108px); }
    .ai-bar { display: flex; align-items: center; gap: 7px; padding: 8px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 10px; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-muted); transition: all .3s; flex-shrink: 0; }
    .dot.on  { background: var(--green); box-shadow: 0 0 5px var(--green); }
    .dot.off { background: var(--red); }
    .ai-st { font-size: 11px; color: var(--text-dim); flex: 1; }
    .ai-provider-badge { font-size: 10px; color: var(--text-muted); font-family: monospace; background: var(--surface3); padding: 2px 6px; border-radius: 4px; }
    .msgs { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 2px; }
    .msg { display: flex; gap: 7px; align-items: flex-start; }
    .mav { width: 24px; height: 24px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; flex-shrink: 0; }
    .av-user { background: var(--accent); color: #fff; }
    .av-ai   { background: var(--surface3); color: var(--text-dim); }
    .mbody { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 8px 10px; font-size: 12px; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
    .msg.user .mbody { background: var(--accent-dim); border-color: rgba(99,102,241,.2); }
    .ai-in-row { display: flex; gap: 6px; margin-top: 10px; }
    .ai-in-row textarea { resize: none; height: 40px; padding: 9px 10px; line-height: 1.4; font-size: 12px; }

    /* ── DONATE ──────────────────────────────── */
    #confetti-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999; }
    .donate-wrap { max-width: 340px; margin: 0 auto; padding: 8px 0 24px; display: flex; flex-direction: column; gap: 20px; }
    .donate-hero { text-align: center; padding: 8px 0; }
    .donate-icon { font-size: 40px; margin-bottom: 12px; display: block; filter: drop-shadow(0 0 12px rgba(251,191,36,.4)); }
    .donate-title { font-size: 18px; font-weight: 700; letter-spacing: -.4px; margin-bottom: 8px; }
    .donate-sub { font-size: 12px; color: var(--text-dim); line-height: 1.6; }
    .amount-row { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
    .amount-btn { padding: 7px 16px; border-radius: var(--r); border: 1px solid var(--border); background: var(--surface); color: var(--text-dim); font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .15s; }
    .amount-btn:hover { border-color: var(--accent); color: var(--accent); }
    .amount-btn.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
    .custom-amount-row { display: flex; justify-content: center; }
    .custom-amount-row input { max-width: 160px; text-align: center; }
    .btn-paypal { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: #0070ba; color: #fff; border: none; border-radius: var(--r); font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; transition: all .15s; }
    .btn-paypal:hover { background: #005ea6; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,112,186,.4); }
    .donated-row { text-align: center; }
    .donated-hint { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; }
    .btn-donated { padding: 8px 20px; border-radius: 99px; border: 1px dashed var(--border); background: transparent; color: var(--text-dim); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; }
    .btn-donated:hover { border-color: var(--green); color: var(--green); }
    .thanks-msg { display: none; text-align: center; background: var(--green-dim); border: 1px solid rgba(52,211,153,.25); border-radius: var(--r); padding: 16px; }
    .thanks-msg.show { display: block; }
    .thanks-icon { font-size: 28px; display: block; margin-bottom: 8px; }
    .thanks-msg strong { font-size: 14px; display: block; margin-bottom: 6px; color: var(--green); }
    .thanks-msg p { font-size: 12px; color: var(--text-dim); }

    /* ── SETTINGS ────────────────────────────── */
    .settings-wrap { display: flex; flex-direction: column; gap: 20px; padding-bottom: 24px; }
    .settings-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
    .settings-section-title { padding: 10px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: var(--text-muted); border-bottom: 1px solid var(--border); background: var(--surface2); }
    .settings-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
    .settings-row { display: flex; flex-direction: column; gap: 5px; }
    .settings-label { font-size: 11px; font-weight: 600; color: var(--text-dim); }
    .settings-hint { font-size: 10px; color: var(--text-muted); margin-top: 3px; }
    .theme-toggle-row { display: flex; gap: 8px; }
    .theme-opt { flex: 1; padding: 8px; border-radius: var(--r); border: 1px solid var(--border); background: transparent; color: var(--text-dim); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .15s; text-align: center; }
    .theme-opt:hover { background: var(--surface2); }
    .theme-opt.active { background: var(--accent-dim); color: var(--accent); border-color: rgba(99,102,241,.25); }
    .provider-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
    .provider-tab { padding: 5px 12px; border-radius: 99px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); font-size: 11px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .15s; }
    .provider-tab:hover { background: var(--surface2); color: var(--text); }
    .provider-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }
    .provider-pane { display: none; flex-direction: column; gap: 10px; }
    .provider-pane.active { display: flex; }
    .key-row { display: flex; gap: 6px; align-items: center; }
    .key-row input { flex: 1; }
    .key-status { font-size: 10px; padding: 3px 8px; border-radius: 4px; white-space: nowrap; font-weight: 700; }
    .key-set   { background: var(--green-dim); color: var(--green); }
    .key-unset { background: var(--surface3); color: var(--text-muted); }
    .settings-save-row { display: flex; justify-content: flex-end; gap: 8px; }
    .save-feedback { font-size: 11px; color: var(--green); opacity: 0; transition: opacity .3s; align-self: center; }
    .save-feedback.show { opacity: 1; }

    /* ── EMPTY ───────────────────────────────── */
    .empty { text-align: center; padding: 40px 16px; color: var(--text-muted); }
    .empty-icon { font-size: 24px; margin-bottom: 8px; opacity: .35; }
    .empty-text { font-size: 12px; }

    /* ── SCROLLBAR ───────────────────────────── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  </style>
</head>
<body>

<canvas id="confetti-canvas"></canvas>

<!-- HEADER -->
<div class="header">
  <div class="logo-row">
    <div class="logo">D</div>
    <div class="app-name">DevTools <em>RTSI</em></div>
  </div>
  <div class="hdr-actions">
    <button class="btn-icon" id="theme-btn" title="Toggle tema">☀</button>
    <button class="btn-icon" id="settings-btn" title="Ajustes">⚙</button>
  </div>
</div>

<!-- TAB BAR -->
<div class="tabbar" id="tabbar">
  <div class="tab active" data-tab="tasks">
    <span class="tab-icon">✔</span><span>Tasks</span>
    <span class="tab-badge" id="b-tasks"></span>
  </div>
  <div class="tab" data-tab="ideas">
    <span class="tab-icon">💡</span><span>Ideas</span>
    <span class="tab-badge" id="b-ideas"></span>
  </div>
  <div class="tab" data-tab="notes">
    <span class="tab-icon">📝</span><span>Notas</span>
    <span class="tab-badge" id="b-notes"></span>
  </div>
  <div class="tab" data-tab="decisions">
    <span class="tab-icon">⚖</span><span>ADR</span>
    <span class="tab-badge" id="b-dec"></span>
  </div>
  <div class="tab" data-tab="roadmap">
    <span class="tab-icon">🗺</span><span>Mapa</span>
  </div>
  <div class="tab" data-tab="ai">
    <span class="tab-icon">✦</span><span>AI</span>
  </div>
  <div class="tab" data-tab="donate">
    <span class="tab-icon">☕</span><span>Donar</span>
  </div>
</div>

<main class="content">

  <!-- TASKS -->
  <div class="tab-pane active" id="tab-tasks">
    <div class="row">
      <input id="task-in" type="text" placeholder="Nueva tarea… (#tag)" />
      <button class="btn btn-primary" onclick="addTask()">+</button>
    </div>
    <div class="pills">
      <button class="pill active" onclick="setTF('all',this)">Todas</button>
      <button class="pill" onclick="setTF('todo',this)">Todo</button>
      <button class="pill" onclick="setTF('doing',this)">Doing</button>
      <button class="pill" onclick="setTF('done',this)">Done</button>
    </div>
    <div class="tlist" id="tasks-list"></div>
  </div>

  <!-- IDEAS -->
  <div class="tab-pane" id="tab-ideas">
    <div class="row">
      <input id="idea-in" type="text" placeholder="Nueva idea… (#tag)" />
      <button class="btn btn-primary" onclick="addIdea()">+</button>
    </div>
    <div class="tlist" id="ideas-list"></div>
  </div>

  <!-- NOTES -->
  <div class="tab-pane" id="tab-notes">
    <div class="ngrid" id="ngrid"></div>
  </div>

  <!-- DECISIONS -->
  <div class="tab-pane" id="tab-decisions">
    <div class="sec-hd">
      <h2 class="sec-title">Decisiones</h2>
      <button class="btn btn-primary btn-sm" onclick="toggleDF()">+ Nueva</button>
    </div>
    <div class="dform" id="dform">
      <input id="d-title" type="text" placeholder="Título de la decisión" />
      <select id="d-status">
        <option value="proposed">Propuesta</option>
        <option value="accepted">Aceptada</option>
        <option value="deprecated">Deprecada</option>
      </select>
      <textarea id="d-ctx"  placeholder="Contexto"></textarea>
      <textarea id="d-dec"  placeholder="Decisión tomada"></textarea>
      <textarea id="d-cons" placeholder="Consecuencias"></textarea>
      <div class="row" style="margin:0">
        <button class="btn btn-primary" onclick="addDecision()">Guardar</button>
        <button class="btn btn-ghost"   onclick="toggleDF()">Cancelar</button>
      </div>
    </div>
    <div class="dlist" id="dlist"></div>
  </div>

  <!-- ROADMAP -->
  <div class="tab-pane" id="tab-roadmap">
    <div class="row" style="margin-bottom:12px">
      <input id="phase-in" type="text" placeholder="Nueva fase…" />
      <button class="btn btn-primary" onclick="addPhase()">+</button>
    </div>
    <div class="phases" id="phases"></div>
  </div>

  <!-- AI -->
  <div class="tab-pane" id="tab-ai">
    <div class="ai-wrap">
      <div class="ai-bar">
        <div class="dot" id="ai-dot"></div>
        <span class="ai-st" id="ai-st">Verificando…</span>
        <span class="ai-provider-badge" id="ai-provider-badge">local</span>
        <button class="btn-icon" onclick="pingAI()" title="Reconectar" style="width:22px;height:22px;font-size:11px">↺</button>
      </div>
      <div class="msgs" id="msgs"></div>
      <div class="ai-in-row">
        <textarea id="ai-in" placeholder="Mensaje… (Enter para enviar)"></textarea>
        <button class="btn btn-primary" id="ai-send" onclick="sendAI()">↑</button>
      </div>
    </div>
  </div>

  <!-- DONATE -->
  <div class="tab-pane" id="tab-donate">
    <div class="donate-wrap">
      <div class="donate-hero">
        <span class="donate-icon">☕</span>
        <h2 class="donate-title">Apoya el proyecto</h2>
        <p class="donate-sub">DevTools RTSI es gratis y de código abierto.<br>Si te ayuda en tu día a día, considera invitarme un café.</p>
      </div>
      <div class="amount-row">
        <button class="amount-btn" data-amount="1">$1</button>
        <button class="amount-btn" data-amount="3">$3</button>
        <button class="amount-btn active" data-amount="5">$5</button>
        <button class="amount-btn" data-amount="10">$10</button>
        <button class="amount-btn" data-amount="">Otro</button>
      </div>
      <div class="custom-amount-row" id="custom-amount-row" style="display:none">
        <input id="custom-amount" type="number" min="1" placeholder="Monto en USD" />
      </div>
      <button class="btn-paypal" onclick="openPayPal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
        Donar con PayPal
      </button>
      <div class="donated-row">
        <p class="donated-hint">¿Ya donaste?</p>
        <button class="btn-donated" onclick="celebrate()">¡Sí, ya doné! 🎉</button>
      </div>
      <div class="thanks-msg" id="thanks-msg">
        <span class="thanks-icon">🙌</span>
        <strong>¡Muchísimas gracias!</strong>
        <p>Tu apoyo hace posible que este proyecto siga creciendo.</p>
      </div>
    </div>
  </div>

  <!-- SETTINGS (hidden pane, activado por ⚙) -->
  <div class="tab-pane" id="tab-settings">
    <div class="settings-wrap">

      <!-- Apariencia -->
      <div class="settings-section">
        <div class="settings-section-title">Apariencia</div>
        <div class="settings-body">
          <div class="settings-row">
            <div class="settings-label">Tema</div>
            <div class="theme-toggle-row">
              <button class="theme-opt active" id="opt-dark" onclick="setTheme('dark')">🌙 Oscuro</button>
              <button class="theme-opt" id="opt-light" onclick="setTheme('light')">☀ Claro</button>
            </div>
          </div>
        </div>
      </div>

      <!-- IA -->
      <div class="settings-section">
        <div class="settings-section-title">Inteligencia Artificial</div>
        <div class="settings-body">

          <div class="settings-row">
            <div class="settings-label">Proveedor activo</div>
            <div class="provider-tabs">
              <button class="provider-tab active" data-prov="local"     onclick="setProvider('local',this)">Local (Ollama)</button>
              <button class="provider-tab"         data-prov="openai"   onclick="setProvider('openai',this)">OpenAI</button>
              <button class="provider-tab"         data-prov="anthropic" onclick="setProvider('anthropic',this)">Claude</button>
              <button class="provider-tab"         data-prov="gemini"   onclick="setProvider('gemini',this)">Gemini</button>
            </div>
          </div>

          <!-- LOCAL -->
          <div class="provider-pane active" id="prov-local">
            <div class="settings-row">
              <div class="settings-label">URL de Ollama</div>
              <input id="local-url" type="text" placeholder="http://localhost:11434" />
            </div>
            <div class="settings-row">
              <div class="settings-label">Modelo</div>
              <input id="local-model" type="text" placeholder="mistral:7b-instruct" />
              <div class="settings-hint">Escribe el nombre exacto del modelo que tienes instalado en Ollama.</div>
            </div>
          </div>

          <!-- OPENAI -->
          <div class="provider-pane" id="prov-openai">
            <div class="settings-row">
              <div class="settings-label">API Key</div>
              <div class="key-row">
                <input id="openai-key" type="password" placeholder="sk-…" autocomplete="off" />
                <span class="key-status key-unset" id="openai-key-status">No configurada</span>
              </div>
              <div class="settings-hint">Se guarda en el almacén seguro de VS Code, nunca en el JSON.</div>
            </div>
            <div class="settings-row">
              <div class="settings-label">Modelo</div>
              <select id="openai-model">
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="custom">Personalizado…</option>
              </select>
              <input id="openai-model-custom" type="text" placeholder="Nombre del modelo" style="display:none;margin-top:6px" />
            </div>
          </div>

          <!-- CLAUDE -->
          <div class="provider-pane" id="prov-anthropic">
            <div class="settings-row">
              <div class="settings-label">API Key</div>
              <div class="key-row">
                <input id="anthropic-key" type="password" placeholder="sk-ant-…" autocomplete="off" />
                <span class="key-status key-unset" id="anthropic-key-status">No configurada</span>
              </div>
              <div class="settings-hint">Se guarda en el almacén seguro de VS Code, nunca en el JSON.</div>
            </div>
            <div class="settings-row">
              <div class="settings-label">Modelo</div>
              <select id="anthropic-model">
                <option value="claude-opus-4-6">claude-opus-4-6</option>
                <option value="claude-sonnet-4-6" selected>claude-sonnet-4-6</option>
                <option value="claude-haiku-4-5-20251001">claude-haiku-4-5</option>
                <option value="custom">Personalizado…</option>
              </select>
              <input id="anthropic-model-custom" type="text" placeholder="Nombre del modelo" style="display:none;margin-top:6px" />
            </div>
          </div>

          <!-- GEMINI -->
          <div class="provider-pane" id="prov-gemini">
            <div class="settings-row">
              <div class="settings-label">API Key</div>
              <div class="key-row">
                <input id="gemini-key" type="password" placeholder="AIza…" autocomplete="off" />
                <span class="key-status key-unset" id="gemini-key-status">No configurada</span>
              </div>
              <div class="settings-hint">Se guarda en el almacén seguro de VS Code, nunca en el JSON.</div>
            </div>
            <div class="settings-row">
              <div class="settings-label">Modelo</div>
              <select id="gemini-model">
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                <option value="gemini-1.5-flash" selected>gemini-1.5-flash</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                <option value="custom">Personalizado…</option>
              </select>
              <input id="gemini-model-custom" type="text" placeholder="Nombre del modelo" style="display:none;margin-top:6px" />
            </div>
          </div>

        </div>
      </div>

      <div class="settings-save-row">
        <span class="save-feedback" id="save-feedback">✓ Guardado</span>
        <button class="btn btn-primary" onclick="saveSettings()">Guardar ajustes</button>
      </div>

    </div>
  </div>

</main>

<script>
  const vscode = acquireVsCodeApi();
  let data = { tasks: [], notes: [], decisions: [], roadmap: [], settings: {} };
  let tf = 'all';
  let aiOk = false;
  let streaming = false;
  let curAiEl = null;
  let currentProvider = 'local';
  let dark = true;
  let inSettings = false;
  let prevTab = 'tasks';

  // ── THEME ────────────────────────────────────
  const html = document.documentElement;

  function setTheme(t) {
    dark = t === 'dark';
    html.setAttribute('data-theme', t);
    document.getElementById('theme-btn').textContent = dark ? '☀' : '🌙';
    document.getElementById('opt-dark').classList.toggle('active', dark);
    document.getElementById('opt-light').classList.toggle('active', !dark);
  }

  document.getElementById('theme-btn').onclick = () => setTheme(dark ? 'light' : 'dark');

  // ── SETTINGS TOGGLE (gear icon) ──────────────
  document.getElementById('settings-btn').addEventListener('click', () => {
    if (inSettings) {
      // go back to previous tab
      inSettings = false;
      document.getElementById('settings-btn').classList.remove('active');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + prevTab).classList.add('active');
      document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === prevTab));
    } else {
      inSettings = true;
      document.getElementById('settings-btn').classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('tab-settings').classList.add('active');
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    }
  });

  // ── TABS ─────────────────────────────────────
  document.querySelectorAll('.tab').forEach(el => {
    el.addEventListener('click', () => {
      const tab = el.dataset.tab;
      inSettings = false;
      document.getElementById('settings-btn').classList.remove('active');
      prevTab = tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
      if (tab === 'ai') pingAI();
    });
  });

  // ── MESSAGES ─────────────────────────────────
  window.addEventListener('message', ({ data: msg }) => {
    switch (msg.type) {
      case 'data':
        data = msg.payload;
        if (data.settings?.theme) setTheme(data.settings.theme);
        renderAll();
        break;
      case 'settings-loaded':
        applySettingsToForm(msg.settings, msg.hasKey);
        break;
      case 'settings-saved':
        const fb = document.getElementById('save-feedback');
        fb.classList.add('show');
        setTimeout(() => fb.classList.remove('show'), 2500);
        break;
      case 'ai-status':
        setAIStatus(msg.ok, msg.provider);
        break;
      case 'ai-chunk':  appendChunk(msg.text); break;
      case 'ai-done':   finishStream();         break;
      case 'ai-error':  finishStream('Error: ' + msg.msg); break;
    }
  });

  vscode.postMessage({ type: 'ready' });

  function save() {
    data.lastUpdated = new Date().toISOString();
    vscode.postMessage({ type: 'save', payload: data });
  }

  // ── RENDER ALL ────────────────────────────────
  function renderAll() { renderTasks(); renderNotes(); renderDecisions(); renderRoadmap(); badges(); }

  function badges() {
    const pt = data.tasks.filter(t => t.type === 'task' && t.status !== 'done').length;
    const pi = data.tasks.filter(t => t.type === 'idea').length;
    setBadge('b-tasks', pt); setBadge('b-ideas', pi);
    setBadge('b-notes', data.notes.length); setBadge('b-dec', data.decisions.length);
  }
  function setBadge(id, n) { const el = document.getElementById(id); el.textContent = n; el.classList.toggle('show', n > 0); }

  // ── TASKS ─────────────────────────────────────
  function addTask() {
    const el = document.getElementById('task-in');
    const raw = el.value.trim(); if (!raw) return;
    const tags = [...raw.matchAll(/#(\\w+)/g)].map(m => m[1]);
    data.tasks.push({ id: uid(), type: 'task', title: raw.replace(/#\\w+/g,'').trim(), tags, status: 'todo', at: now() });
    el.value = ''; save(); renderAll();
  }
  function addIdea() {
    const el = document.getElementById('idea-in');
    const raw = el.value.trim(); if (!raw) return;
    const tags = [...raw.matchAll(/#(\\w+)/g)].map(m => m[1]);
    data.tasks.push({ id: uid(), type: 'idea', title: raw.replace(/#\\w+/g,'').trim(), tags, status: 'todo', at: now() });
    el.value = ''; save(); renderAll();
  }
  function cycleStatus(id) {
    const t = data.tasks.find(x => x.id === id); if (!t) return;
    t.status = { todo:'doing', doing:'done', done:'todo' }[t.status] || 'todo';
    save(); renderAll();
  }
  function delTask(id) { data.tasks = data.tasks.filter(t => t.id !== id); save(); renderAll(); }
  function setTF(f, el) {
    tf = f; el.closest('.pills').querySelectorAll('.pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); renderTasks();
  }
  function renderTasks() { rlist('task','tasks-list'); rlist('idea','ideas-list'); }
  function rlist(type, id) {
    const el = document.getElementById(id);
    let items = data.tasks.filter(t => t.type === type);
    if (type === 'task' && tf !== 'all') items = items.filter(t => t.status === tf);
    if (!items.length) { el.innerHTML = '<div class="empty"><div class="empty-icon">'+(type==='task'?'✔':'💡')+'</div><div class="empty-text">Nada por aquí</div></div>'; return; }
    el.innerHTML = items.map(t => \`<div class="tcard \${t.status==='done'?'is-done':''}">
      <span class="tstatus s-\${t.status}" onclick="cycleStatus('\${t.id}')">\${sLbl(t.status)}</span>
      <div class="tbody"><div class="ttitle">\${esc(t.title)}</div>
      \${t.tags?.length?'<div class="ttags">'+t.tags.map(g=>'<span class="tag">#'+esc(g)+'</span>').join('')+'</div>':''}
      </div><button class="bdel" onclick="delTask('\${t.id}')">✕</button>
    </div>\`).join('');
  }
  const sLbl = s => ({todo:'Todo',doing:'Doing',done:'Done'}[s]||s);

  // ── NOTES ─────────────────────────────────────
  function addNote() {
    const el = document.getElementById('note-in');
    const text = el.value.trim(); if (!text) return;
    data.notes.push({ id: uid(), text, color: data.notes.length % 4, at: now() });
    el.value = ''; save(); renderNotes(); badges();
  }
  function delNote(id) { data.notes = data.notes.filter(n => n.id !== id); save(); renderNotes(); badges(); }
  function renderNotes() {
    const g = document.getElementById('ngrid');
    g.innerHTML = \`<div class="add-note">
      <textarea id="note-in" placeholder="Escribe una nota…"></textarea>
      <button class="btn btn-primary btn-sm" onclick="addNote()">Agregar</button>
    </div>\` + data.notes.map(n => \`<div class="ncard nc\${n.color%4}">
      <button class="bdel" onclick="delNote('\${n.id}')">✕</button>
      <div class="ntext">\${esc(n.text)}</div><div class="ndate">\${fmtD(n.at)}</div>
    </div>\`).join('');
  }

  // ── DECISIONS ─────────────────────────────────
  function toggleDF() { document.getElementById('dform').classList.toggle('open'); }
  function addDecision() {
    const title = document.getElementById('d-title').value.trim(); if (!title) return;
    data.decisions.push({ id:uid(), title, status:document.getElementById('d-status').value, context:document.getElementById('d-ctx').value.trim(), decision:document.getElementById('d-dec').value.trim(), consequences:document.getElementById('d-cons').value.trim(), at:now() });
    ['d-title','d-ctx','d-dec','d-cons'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('d-status').value='proposed';
    toggleDF(); save(); renderDecisions(); badges();
  }
  function delDecision(id) { data.decisions = data.decisions.filter(d=>d.id!==id); save(); renderDecisions(); badges(); }
  function toggleD(id) { document.getElementById('dc-'+id).classList.toggle('open'); }
  function renderDecisions() {
    const el = document.getElementById('dlist');
    if (!data.decisions.length) { el.innerHTML='<div class="empty"><div class="empty-icon">⚖</div><div class="empty-text">Sin decisiones registradas</div></div>'; return; }
    el.innerHTML = [...data.decisions].reverse().map(d=>\`<div class="dcard" id="dc-\${d.id}">
      <div class="dhead" onclick="toggleD('\${d.id}')">
        <span class="dstatus ds-\${d.status}">\${d.status}</span>
        <span class="dtitle">\${esc(d.title)}</span>
        <button class="bdel" onclick="event.stopPropagation();delDecision('\${d.id}')">✕</button>
        <span class="dchev">▶</span>
      </div>
      <div class="dbody">
        \${d.context?\`<div class="dfield"><div class="dflabel">Contexto</div><div class="dfval">\${esc(d.context)}</div></div>\`:''}
        \${d.decision?\`<div class="dfield"><div class="dflabel">Decisión</div><div class="dfval">\${esc(d.decision)}</div></div>\`:''}
        \${d.consequences?\`<div class="dfield"><div class="dflabel">Consecuencias</div><div class="dfval">\${esc(d.consequences)}</div></div>\`:''}
      </div>
    </div>\`).join('');
  }

  // ── ROADMAP ───────────────────────────────────
  function addPhase() { const el=document.getElementById('phase-in'); const name=el.value.trim(); if(!name)return; data.roadmap.push({id:uid(),name,items:[]}); el.value=''; save(); renderRoadmap(); }
  function addItem(pid) { const el=document.getElementById('pi-'+pid); const label=el.value.trim(); if(!label)return; const p=data.roadmap.find(p=>p.id===pid); if(!p)return; p.items.push({id:uid(),label,status:'todo'}); el.value=''; save(); renderRoadmap(); }
  function cycleItem(pid,iid) { const item=data.roadmap.find(p=>p.id===pid)?.items.find(i=>i.id===iid); if(!item)return; item.status={todo:'doing',doing:'done',done:'todo'}[item.status]||'todo'; save(); renderRoadmap(); }
  function delPhase(id) { data.roadmap=data.roadmap.filter(p=>p.id!==id); save(); renderRoadmap(); }
  function delItem(pid,iid) { const p=data.roadmap.find(p=>p.id===pid); if(!p)return; p.items=p.items.filter(i=>i.id!==iid); save(); renderRoadmap(); }
  function phasePct(p) { if(!p.items.length)return 0; return Math.round(p.items.filter(i=>i.status==='done').length/p.items.length*100); }
  function renderRoadmap() {
    const el=document.getElementById('phases');
    if(!data.roadmap.length){el.innerHTML='<div class="empty"><div class="empty-icon">🗺</div><div class="empty-text">Agrega una fase para empezar</div></div>';return;}
    el.innerHTML=data.roadmap.map(phase=>{const pct=phasePct(phase);return\`<div class="phase">
      <div class="phase-hd"><span class="phase-name">\${esc(phase.name)}</span>
        <div class="pbar"><div class="pfill" style="width:\${pct}%"></div></div>
        <span class="ppct">\${pct}%</span>
        <button class="pdel" onclick="delPhase('\${phase.id}')">✕</button>
      </div>
      <div class="pitems">
        \${phase.items.map(item=>\`<div class="pitem \${item.status==='done'?'is-done':''}">
          <div class="icheck \${item.status}" onclick="cycleItem('\${phase.id}','\${item.id}')">\${item.status==='done'?'✓':item.status==='doing'?'·':''}</div>
          <span class="ilabel">\${esc(item.label)}</span>
          <button class="bdel" onclick="delItem('\${phase.id}','\${item.id}')">✕</button>
        </div>\`).join('')}
        <div class="padd"><input id="pi-\${phase.id}" type="text" placeholder="Agregar item…" onkeydown="if(event.key==='Enter')addItem('\${phase.id}')"/>
        <button class="btn btn-ghost btn-sm" onclick="addItem('\${phase.id}')">+</button></div>
      </div>
    </div>\`;}).join('');
  }

  // ── AI ────────────────────────────────────────
  function pingAI() { document.getElementById('ai-st').textContent='Verificando…'; vscode.postMessage({type:'ai-ping'}); }
  function setAIStatus(ok, provider) {
    aiOk=ok; currentProvider=provider||'local';
    document.getElementById('ai-dot').className='dot '+(ok?'on':'off');
    document.getElementById('ai-st').textContent=ok?'Conectado':'No disponible';
    document.getElementById('ai-provider-badge').textContent=currentProvider;
    document.getElementById('ai-send').disabled=!ok||streaming;
  }
  function sendAI() {
    if(!aiOk||streaming)return;
    const el=document.getElementById('ai-in'); const text=el.value.trim(); if(!text)return;
    addMsg('user',text); curAiEl=addMsg('ai',''); el.value='';
    streaming=true; document.getElementById('ai-send').disabled=true;
    vscode.postMessage({type:'ai-chat',prompt:text});
  }
  function addMsg(role,text) {
    const wrap=document.getElementById('msgs'); const div=document.createElement('div');
    div.className='msg '+role;
    div.innerHTML=\`<div class="mav av-\${role}">\${role==='user'?'Tú':'AI'}</div><div class="mbody">\${esc(text)}</div>\`;
    wrap.appendChild(div); wrap.scrollTop=wrap.scrollHeight; return div.querySelector('.mbody');
  }
  function appendChunk(text) { if(!curAiEl)return; curAiEl.textContent+=text; document.getElementById('msgs').scrollTop=9999; }
  function finishStream(err) { streaming=false; document.getElementById('ai-send').disabled=false; if(err&&curAiEl)curAiEl.textContent=err; curAiEl=null; }

  // ── DONATE ────────────────────────────────────
  let selectedAmount='5';
  document.querySelectorAll('.amount-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.amount-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      selectedAmount=btn.dataset.amount;
      document.getElementById('custom-amount-row').style.display=selectedAmount===''?'flex':'none';
    });
  });
  function openPayPal() {
    let amt=selectedAmount;
    if(amt===''){amt=document.getElementById('custom-amount').value.trim(); if(!amt||isNaN(Number(amt))||Number(amt)<=0){document.getElementById('custom-amount').focus();return;}}
    vscode.postMessage({type:'open-url',url:amt?\`https://paypal.me/fantactico/\${amt}USD\`:'https://paypal.me/fantactico'});
  }
  function celebrate() {
    document.getElementById('thanks-msg').classList.add('show'); launchConfetti();
  }
  function launchConfetti() {
    const canvas=document.getElementById('confetti-canvas'); const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    const COLORS=['#6366f1','#34d399','#fbbf24','#f87171','#60a5fa','#a78bfa','#fb7185','#4ade80'];
    const parts=Array.from({length:160},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,w:6+Math.random()*8,h:10+Math.random()*6,color:COLORS[Math.floor(Math.random()*COLORS.length)],rot:Math.random()*Math.PI*2,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,vr:(Math.random()-.5)*.15}));
    const end=Date.now()+3500;
    function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.vy+=.05;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.globalAlpha=Math.max(0,(end-Date.now())/3500);ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});
    if(Date.now()<end)requestAnimationFrame(draw);else ctx.clearRect(0,0,canvas.width,canvas.height);}
    draw();
  }

  // ── SETTINGS FORM ─────────────────────────────
  function applySettingsToForm(settings, hasKey) {
    if (!settings) return;
    const ai = settings.ai || {};
    // theme
    if (settings.theme) setTheme(settings.theme);
    // provider
    if (ai.provider) {
      document.querySelectorAll('.provider-tab').forEach(t => t.classList.toggle('active', t.dataset.prov === ai.provider));
      document.querySelectorAll('.provider-pane').forEach(p => p.classList.remove('active'));
      const pane = document.getElementById('prov-' + ai.provider);
      if (pane) pane.classList.add('active');
      currentProvider = ai.provider;
    }
    // local
    if (ai.local) {
      document.getElementById('local-url').value   = ai.local.url   || '';
      document.getElementById('local-model').value = ai.local.model || '';
    }
    // models
    setModelSelect('openai-model',    'openai-model-custom',    ai.openai?.model);
    setModelSelect('anthropic-model', 'anthropic-model-custom', ai.anthropic?.model);
    setModelSelect('gemini-model',    'gemini-model-custom',    ai.gemini?.model);
    // key status badges
    setKeyStatus('openai',    hasKey?.openai);
    setKeyStatus('anthropic', hasKey?.anthropic);
    setKeyStatus('gemini',    hasKey?.gemini);
  }

  function setModelSelect(selectId, customId, model) {
    if (!model) return;
    const sel = document.getElementById(selectId);
    const opt = [...sel.options].find(o => o.value === model);
    if (opt) { sel.value = model; document.getElementById(customId).style.display = 'none'; }
    else { sel.value = 'custom'; document.getElementById(customId).style.display = 'block'; document.getElementById(customId).value = model; }
  }

  function setKeyStatus(provider, isSet) {
    const el = document.getElementById(provider + '-key-status');
    if (!el) return;
    el.textContent = isSet ? '✓ Configurada' : 'No configurada';
    el.className   = 'key-status ' + (isSet ? 'key-set' : 'key-unset');
  }

  function setProvider(prov, el) {
    document.querySelectorAll('.provider-tab').forEach(t => t.classList.remove('active')); el.classList.add('active');
    document.querySelectorAll('.provider-pane').forEach(p => p.classList.remove('active'));
    document.getElementById('prov-' + prov).classList.add('active');
  }

  // model selects with custom option
  ['openai','anthropic','gemini'].forEach(p => {
    document.getElementById(p+'-model').addEventListener('change', function() {
      document.getElementById(p+'-model-custom').style.display = this.value === 'custom' ? 'block' : 'none';
    });
  });

  function getModelValue(selectId, customId) {
    const sel = document.getElementById(selectId);
    return sel.value === 'custom' ? document.getElementById(customId).value.trim() : sel.value;
  }

  function saveSettings() {
    const activeProv = document.querySelector('.provider-tab.active')?.dataset.prov || 'local';
    const settings = {
      theme: dark ? 'dark' : 'light',
      ai: {
        provider: activeProv,
        openai:    { model: getModelValue('openai-model',    'openai-model-custom') },
        anthropic: { model: getModelValue('anthropic-model', 'anthropic-model-custom') },
        gemini:    { model: getModelValue('gemini-model',    'gemini-model-custom') },
        local:     { url: document.getElementById('local-url').value.trim() || 'http://localhost:11434', model: document.getElementById('local-model').value.trim() || 'mistral:7b-instruct' },
      },
    };
    const keys = {
      openai:    document.getElementById('openai-key').value    || undefined,
      anthropic: document.getElementById('anthropic-key').value || undefined,
      gemini:    document.getElementById('gemini-key').value    || undefined,
    };
    // clear key fields after saving
    ['openai-key','anthropic-key','gemini-key'].forEach(id => document.getElementById(id).value = '');
    // update hasKey badges optimistically
    if (keys.openai)    setKeyStatus('openai',    true);
    if (keys.anthropic) setKeyStatus('anthropic', true);
    if (keys.gemini)    setKeyStatus('gemini',    true);
    // save to data JSON too
    data.settings = settings;
    vscode.postMessage({ type: 'save-settings', settings, keys });
  }

  // ── SHORTCUTS ─────────────────────────────────
  document.getElementById('task-in').addEventListener('keydown', e => { if(e.key==='Enter')addTask(); });
  document.getElementById('idea-in').addEventListener('keydown', e => { if(e.key==='Enter')addIdea(); });
  document.getElementById('ai-in').addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAI();} });

  // ── UTILS ─────────────────────────────────────
  const uid  = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
  const now  = () => new Date().toISOString();
  const fmtD = iso => iso ? new Date(iso).toLocaleDateString('es',{day:'numeric',month:'short'}) : '';
  const esc  = s  => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
</script>
</body>
</html>`;
}
