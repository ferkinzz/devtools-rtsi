import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const comando = vscode.commands.registerCommand(
    "mi-extension.abrir",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "miExtension",
        "Mi Extension",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();
    }
  );

  context.subscriptions.push(comando);
}

function getWebviewContent(): string {
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi Extension</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: sans-serif;
        background: var(--vscode-editor-background);
        color: var(--vscode-editor-foreground);
      }
      h1 {
        font-size: 3rem;
      }
    </style>
  </head>
  <body>
    <h1>Hola Mundo</h1>
  </body>
</html>`;
}

export function deactivate() {}
