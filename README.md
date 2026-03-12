# DevTools RTSI

> 🇲🇽 [Versión en Español](#español) · 🇺🇸 [English Version](#english)

---

<a name="español"></a>
# 🇲🇽 Español

Un panel de desarrollo interno que vive dentro de VS Code. Gestiona tareas, ideas, notas, decisiones arquitectónicas, roadmaps y chatea con IA — sin salir de tu editor.

Los datos se guardan como `.dev/data.json` en la raíz de tu workspace, por lo que viajan con tu proyecto a través de Git.

## Características

### ✔ Tasks & 💡 Ideas
Crea y da seguimiento a elementos de trabajo con sintaxis `#etiqueta`. Cambia entre estados **Todo → Doing → Done** con un solo clic.

### 📝 Notas
Grid de notas con colores, siempre a un clic de distancia.

### ⚖ Decision Log (ADR)
Registra decisiones arquitectónicas con contexto, razonamiento y consecuencias. Tarjetas colapsables para mantener el orden.

### 🗺 Roadmap
Organiza tu proyecto en fases. Cada fase tiene ítems con barra de progreso en tiempo real.

### ✦ AI Assistant
Chatea con tu proveedor de IA favorito sin cambiar de ventana:

| Proveedor | Notas |
|---|---|
| **Local (Ollama)** | Funciona sin internet. URL y modelo configurables. |
| **OpenAI** | GPT-4o, GPT-4-turbo, GPT-3.5, o personalizado. |
| **Claude** | Opus, Sonnet, Haiku, o personalizado. |
| **Gemini** | 2.0 Flash, 1.5 Flash, 1.5 Pro, o personalizado. |

Las API keys se guardan en el **SecretStorage cifrado de VS Code** — nunca en tu archivo JSON.

### ☕ Donaciones
Apoya el proyecto con una donación via PayPal, desde el mismo panel.

## Instalación

### Desde el Marketplace *(próximamente)*
Busca **"DevTools RTSI"** en la pestaña de Extensiones de VS Code.

### Instalación manual (antes del Marketplace)

1. Ve a la página de [Releases en GitHub](https://github.com/tu-usuario/devtools-rtsi/releases)
2. Descarga el archivo `.vsix` de la versión más reciente
3. En VS Code abre la paleta de comandos (`Ctrl+Shift+P`)
4. Busca **"Extensions: Install from VSIX..."**
5. Selecciona el archivo `.vsix` descargado

O desde la terminal:
```bash
code --install-extension devtools-rtsi-0.0.1.vsix
```

## Primeros pasos

1. Instala la extensión.
2. Abre una carpeta de proyecto en VS Code.
3. Haz clic en el **ícono de DevTools RTSI** en la barra de actividad (sidebar izquierdo).
4. Haz clic en **▶ Abrir DevTools RTSI** para abrir el panel.

## Configuración de IA

Abre el panel → haz clic en **⚙** (esquina superior derecha) → ve a **Inteligencia Artificial**.

- **Local (Ollama):** Escribe la URL de Ollama y el nombre del modelo (ej. `llama3`, `mistral`, `codellama`).
- **Proveedores cloud:** Pega tu API key — se guarda de forma segura y nunca se escribe en disco.

## Datos & Privacidad

- Todos los datos se guardan en `.dev/data.json` dentro de tu workspace.
- Agrega `.dev/` a tu `.gitignore` para mantenerlo local, o haz commit para sincronizar entre máquinas.
- Las API keys se guardan en el SecretStorage de VS Code y **nunca** se escriben al archivo JSON.

## Usar Git como nube personal

Si trabajas en varias computadoras con el mismo repositorio remoto:

1. Quita `.dev/` de tu `.gitignore`.
2. Haz commit de `.dev/data.json` después de tu primera sesión.
3. En cualquier otra máquina: `git pull` → abre VS Code → los datos cargan automáticamente.

## Comandos

| Comando | Descripción |
|---|---|
| `Abrir DevTools RTSI` | Abre el panel (también disponible desde la barra de actividad) |

## Requisitos

- VS Code 1.85 o superior.
- Para IA local: [Ollama](https://ollama.com) instalado y corriendo.
- Para IA cloud: API key válida de OpenAI, Anthropic o Google.

## Notas de versión

### 0.0.1 — Beta
Versión inicial. Tasks, Ideas, Notas, Decisiones, Roadmap, IA (Ollama + OpenAI + Claude + Gemini), Donaciones, Ajustes con tema y proveedor de IA.

## Soporte

¿Encontraste un bug o tienes una sugerencia? Abre un issue en GitHub.

¿Te gusta la extensión? Considera [invitarme un café ☕](https://paypal.me/fantactico).

Hecho con ♥ por [RTSI](https://rtsi.mx)

---
---

<a name="english"></a>
# 🇺🇸 English

An internal developer panel that lives inside VS Code. Manage tasks, ideas, sticky notes, architectural decisions, roadmaps, and chat with AI — all without leaving your editor.

Data is saved as `.dev/data.json` in your workspace root, so it travels with your project through Git.

## Features

### ✔ Tasks & 💡 Ideas
Create and track work items with a simple `#tag` syntax. Cycle through **Todo → Doing → Done** statuses with a single click.

### 📝 Sticky Notes
Color-coded notes grid, always one click away.

### ⚖ Decision Log (ADR)
Record architectural decisions with context, rationale, and consequences. Collapsible cards keep things tidy.

### 🗺 Roadmap
Organize your project into phases. Each phase has items with a live progress bar.

### ✦ AI Assistant
Chat with your preferred AI provider without switching windows:

| Provider | Notes |
|---|---|
| **Local (Ollama)** | Works offline. Configurable URL and model. |
| **OpenAI** | GPT-4o, GPT-4-turbo, GPT-3.5, or custom. |
| **Claude** | Opus, Sonnet, Haiku, or custom. |
| **Gemini** | 2.0 Flash, 1.5 Flash, 1.5 Pro, or custom. |

API keys are stored in **VS Code's encrypted SecretStorage** — never in your JSON file.

### ☕ Donate
Support the project with a PayPal donation, right from the panel.

## Installation

### From the Marketplace *(coming soon)*
Search for **"DevTools RTSI"** in the VS Code Extensions tab.

### Manual installation (before Marketplace listing)

1. Go to the [Releases page on GitHub](https://github.com/tu-usuario/devtools-rtsi/releases)
2. Download the `.vsix` file from the latest release
3. In VS Code, open the Command Palette (`Ctrl+Shift+P`)
4. Search for **"Extensions: Install from VSIX..."**
5. Select the downloaded `.vsix` file

Or via terminal:
```bash
code --install-extension devtools-rtsi-0.0.1.vsix
```

## Getting Started

1. Install the extension.
2. Open a project folder in VS Code.
3. Click the **DevTools RTSI icon** in the Activity Bar (left sidebar).
4. Click **▶ Abrir DevTools RTSI** to open the panel.

## AI Setup

Open the panel → click **⚙** in the top-right corner → go to **Inteligencia Artificial**.

- **Local (Ollama):** Set your Ollama URL and model name (e.g. `llama3`, `mistral`, `codellama`).
- **Cloud providers:** Paste your API key — it is stored securely and never written to disk.

## Data & Privacy

- All panel data is saved to `.dev/data.json` in your workspace.
- Add `.dev/` to your `.gitignore` to keep it local, or commit it to sync across machines.
- AI API keys are stored in VS Code's built-in SecretStorage and are **never** written to the JSON file.

## Using Git as your personal cloud

If you work across multiple computers with the same Git remote:

1. Remove `.dev/` from your project's `.gitignore`.
2. Commit `.dev/data.json` after your first session.
3. On any other machine: `git pull` → open VS Code → data loads automatically.

## Commands

| Command | Description |
|---|---|
| `Abrir DevTools RTSI` | Opens the panel (also available from the Activity Bar) |

## Requirements

- VS Code 1.85 or higher.
- For Local AI: [Ollama](https://ollama.com) installed and running.
- For cloud AI: a valid API key from OpenAI, Anthropic, or Google.

## Release Notes

### 0.0.1 — Beta
Initial release. Tasks, Ideas, Notes, Decisions, Roadmap, AI (Ollama + OpenAI + Claude + Gemini), Donations, Settings with theme and AI provider configuration.

## Support

Found a bug or have a suggestion? Open an issue on GitHub.

Like the extension? Consider [buying me a coffee ☕](https://paypal.me/fantactico).

Made with ♥ by [RTSI](https://rtsi.mx)
