import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getWebviewHtml } from "./webview";

// ── DATA ─────────────────────────────────────────────────────────────────────

function dataPath(): string | null {
  const folders = vscode.workspace.workspaceFolders;
  return folders?.length ? path.join(folders[0].uri.fsPath, ".dev", "data.json") : null;
}

function emptyData() {
  return {
    tasks: [], notes: [], decisions: [], roadmap: [],
    settings: {
      theme: "dark",
      ai: {
        provider: "local",
        openai:    { model: "gpt-4o" },
        anthropic: { model: "claude-sonnet-4-6" },
        gemini:    { model: "gemini-1.5-flash" },
        local:     { url: "http://localhost:11434", model: "mistral:7b-instruct" },
      },
    },
    lastUpdated: new Date().toISOString(),
  };
}

function readData(): any {
  const p = dataPath();
  if (!p) return emptyData();
  try {
    if (!fs.existsSync(p)) return emptyData();
    const e = emptyData();
    const s = JSON.parse(fs.readFileSync(p, "utf-8"));
    return {
      ...e, ...s,
      settings: {
        ...e.settings, ...s.settings,
        ai: { ...e.settings.ai, ...s.settings?.ai },
      },
    };
  } catch { return emptyData(); }
}

function saveData(data: object): void {
  const p = dataPath();
  if (!p) return;
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}

// ── AI PROVIDERS ─────────────────────────────────────────────────────────────

type Send = (m: object) => void;

async function chatLocal(prompt: string, url: string, model: string, send: Send) {
  const res = await fetch(`${url || "http://localhost:11434"}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: model || "mistral:7b-instruct", prompt, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error(`Ollama error ${res.status}`);
  const reader = res.body.getReader();
  const dec    = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) { send({ type: "ai-done" }); break; }
    for (const line of dec.decode(value, { stream: true }).split("\n").filter(Boolean)) {
      try { const j = JSON.parse(line); if (j.response) send({ type: "ai-chunk", text: j.response }); } catch {}
    }
  }
}

async function chatOpenAI(prompt: string, model: string, key: string, send: Send) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
    body: JSON.stringify({ model: model || "gpt-4o", messages: [{ role: "user", content: prompt }], stream: true }),
  });
  if (!res.ok) { const e = await res.json() as any; throw new Error(e.error?.message || res.statusText); }
  if (!res.body) throw new Error("No stream");
  const reader = res.body.getReader();
  const dec    = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) { send({ type: "ai-done" }); break; }
    for (const line of dec.decode(value, { stream: true }).split("\n")) {
      if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
      try { const t = (JSON.parse(line.slice(6)) as any).choices?.[0]?.delta?.content; if (t) send({ type: "ai-chunk", text: t }); } catch {}
    }
  }
}

async function chatAnthropic(prompt: string, model: string, key: string, send: Send) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: model || "claude-sonnet-4-6", max_tokens: 2048, messages: [{ role: "user", content: prompt }], stream: true }),
  });
  if (!res.ok) { const e = await res.json() as any; throw new Error(e.error?.message || res.statusText); }
  if (!res.body) throw new Error("No stream");
  const reader = res.body.getReader();
  const dec    = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value, { stream: true }).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      try {
        const j = JSON.parse(line.slice(6)) as any;
        if (j.type === "content_block_delta" && j.delta?.text) send({ type: "ai-chunk", text: j.delta.text });
        if (j.type === "message_stop") send({ type: "ai-done" });
      } catch {}
    }
  }
}

async function chatGemini(prompt: string, model: string, key: string, send: Send) {
  const mdl = model || "gemini-1.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${mdl}:generateContent?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  );
  if (!res.ok) { const e = await res.json() as any; throw new Error(e.error?.message || res.statusText); }
  const j = await res.json() as any;
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
  send({ type: "ai-chunk", text });
  send({ type: "ai-done" });
}

// ── EXTENSION ────────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider("devtools-rtsi.launcher", {
    getTreeItem: (el) => el,
    getChildren:  ()  => [],
  });

  let panel: vscode.WebviewPanel | undefined;

  const cmd = vscode.commands.registerCommand("devtools-rtsi.abrir", () => {
    if (panel) { panel.reveal(vscode.ViewColumn.One); return; }

    panel = vscode.window.createWebviewPanel(
      "devtools-rtsi", "DevTools RTSI",
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    panel.webview.html = getWebviewHtml();

    panel.webview.onDidReceiveMessage(async (msg) => {
      const send = (m: object) => panel?.webview.postMessage(m);

      switch (msg.type) {

        case "ready": {
          const data = readData();
          send({ type: "data", payload: data });
          // also send hasKey status for settings form
          const hasKey = {
            openai:    !!(await context.secrets.get("devtools-rtsi.openai-key")),
            anthropic: !!(await context.secrets.get("devtools-rtsi.anthropic-key")),
            gemini:    !!(await context.secrets.get("devtools-rtsi.gemini-key")),
          };
          send({ type: "settings-loaded", settings: data.settings, hasKey });
          break;
        }

        case "save":
          saveData(msg.payload);
          break;

        case "open-url":
          vscode.env.openExternal(vscode.Uri.parse(msg.url));
          break;

        case "save-settings": {
          const d = readData();
          d.settings = msg.settings;
          saveData(d);
          if (msg.keys?.openai    !== undefined) {
            msg.keys.openai    ? await context.secrets.store("devtools-rtsi.openai-key",    msg.keys.openai)
                               : await context.secrets.delete("devtools-rtsi.openai-key");
          }
          if (msg.keys?.anthropic !== undefined) {
            msg.keys.anthropic ? await context.secrets.store("devtools-rtsi.anthropic-key", msg.keys.anthropic)
                               : await context.secrets.delete("devtools-rtsi.anthropic-key");
          }
          if (msg.keys?.gemini    !== undefined) {
            msg.keys.gemini    ? await context.secrets.store("devtools-rtsi.gemini-key",    msg.keys.gemini)
                               : await context.secrets.delete("devtools-rtsi.gemini-key");
          }
          send({ type: "settings-saved" });
          break;
        }

        case "ai-ping": {
          const ai = readData().settings?.ai || {};
          const prov = ai.provider || "local";
          if (prov === "local") {
            try {
              const ctrl = new AbortController();
              setTimeout(() => ctrl.abort(), 3000);
              const r = await fetch(`${ai.local?.url || "http://localhost:11434"}/api/tags`, { signal: ctrl.signal });
              send({ type: "ai-status", ok: r.ok, provider: prov });
            } catch { send({ type: "ai-status", ok: false, provider: prov }); }
          } else {
            const keyName = prov === "openai" ? "devtools-rtsi.openai-key"
                          : prov === "anthropic" ? "devtools-rtsi.anthropic-key"
                          : "devtools-rtsi.gemini-key";
            const key = await context.secrets.get(keyName);
            send({ type: "ai-status", ok: !!key, provider: prov });
          }
          break;
        }

        case "ai-chat": {
          const ai   = readData().settings?.ai || {};
          const prov = ai.provider || "local";
          try {
            if (prov === "local") {
              await chatLocal(msg.prompt, ai.local?.url, ai.local?.model, send);
            } else if (prov === "openai") {
              const key = await context.secrets.get("devtools-rtsi.openai-key");
              if (!key) throw new Error("No hay API key de OpenAI. Configúrala en ⚙ Ajustes.");
              await chatOpenAI(msg.prompt, ai.openai?.model, key, send);
            } else if (prov === "anthropic") {
              const key = await context.secrets.get("devtools-rtsi.anthropic-key");
              if (!key) throw new Error("No hay API key de Claude. Configúrala en ⚙ Ajustes.");
              await chatAnthropic(msg.prompt, ai.anthropic?.model, key, send);
            } else if (prov === "gemini") {
              const key = await context.secrets.get("devtools-rtsi.gemini-key");
              if (!key) throw new Error("No hay API key de Gemini. Configúrala en ⚙ Ajustes.");
              await chatGemini(msg.prompt, ai.gemini?.model, key, send);
            }
          } catch (e) {
            send({ type: "ai-error", msg: String(e) });
          }
          break;
        }
      }
    }, undefined, context.subscriptions);

    panel.onDidDispose(() => { panel = undefined; }, null, context.subscriptions);
  });

  context.subscriptions.push(cmd);
}

export function deactivate() {}
