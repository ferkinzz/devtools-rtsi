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
  return { tasks: [], notes: [], decisions: [], roadmap: [], lastUpdated: new Date().toISOString() };
}

function readData(): object {
  const p = dataPath();
  if (!p) return emptyData();
  try {
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : emptyData();
  } catch {
    return emptyData();
  }
}

function saveData(data: object): void {
  const p = dataPath();
  if (!p) return;
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}

// ── EXTENSION ────────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand("mi-extension.abrir", () => {
    const panel = vscode.window.createWebviewPanel(
      "devPanel",
      "Dev Panel",
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    panel.webview.html = getWebviewHtml();

    panel.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case "ready":
          panel.webview.postMessage({ type: "data", payload: readData() });
          break;

        case "save":
          saveData(msg.payload);
          break;

        case "ollama-ping":
          try {
            const ctrl = new AbortController();
            setTimeout(() => ctrl.abort(), 3000);
            const res = await fetch("http://localhost:11434/api/tags", { signal: ctrl.signal });
            panel.webview.postMessage({ type: "ollama-status", ok: res.ok });
          } catch {
            panel.webview.postMessage({ type: "ollama-status", ok: false });
          }
          break;

        case "ollama-chat":
          try {
            const res = await fetch("http://localhost:11434/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ model: "mistral:7b-instruct", prompt: msg.prompt, stream: true }),
            });
            if (!res.body) { throw new Error("No stream"); }
            const reader  = res.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) { panel.webview.postMessage({ type: "ollama-done" }); break; }
              const chunk = decoder.decode(value, { stream: true });
              for (const line of chunk.split("\n").filter(Boolean)) {
                try {
                  const j = JSON.parse(line);
                  if (j.response) { panel.webview.postMessage({ type: "ollama-chunk", text: j.response }); }
                } catch { /* partial chunk */ }
              }
            }
          } catch (e) {
            panel.webview.postMessage({ type: "ollama-error", msg: String(e) });
          }
          break;
      }
    }, undefined, context.subscriptions);
  });

  context.subscriptions.push(cmd);
}

export function deactivate() {}
