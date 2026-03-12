# DevTools RTSI

An internal developer panel that lives inside VS Code. Manage tasks, ideas, sticky notes, architectural decisions, roadmaps, and chat with AI — all without leaving your editor.

Data is saved as `.dev/data.json` in your workspace root, so it travels with your project through Git.

---

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

---

## Getting Started

1. Install the extension.
2. Open a project folder in VS Code.
3. Click the **DevTools RTSI icon** in the Activity Bar (left sidebar).
4. Click **▶ Abrir DevTools RTSI** to open the panel.

---

## AI Setup

Open the panel → click **⚙** in the top-right corner → go to **Inteligencia Artificial**.

- **Local (Ollama):** Set your Ollama URL and model name (e.g. `llama3`, `mistral`, `codellama`).
- **Cloud providers:** Paste your API key — it is stored securely and never written to disk.

---

## Data & Privacy

- All panel data is saved to `.dev/data.json` in your workspace.
- Add `.dev/` to your `.gitignore` to keep it local, or commit it to sync across machines.
- AI API keys are stored in VS Code's built-in SecretStorage and are never written to the JSON file.

---

## Using as a Team Cloud

If you work across multiple computers with the same Git remote:

1. Remove `.dev/` from your project's `.gitignore`.
2. Commit `.dev/data.json` after your first session.
3. On any other machine: `git pull` → open VS Code → data loads automatically.

---

## Commands

| Command | Description |
|---|---|
| `Abrir DevTools RTSI` | Opens the panel (also available from the Activity Bar) |

---

## Requirements

- VS Code 1.85 or higher.
- For Local AI: [Ollama](https://ollama.com) installed and running.
- For cloud AI: a valid API key from OpenAI, Anthropic, or Google.

---

## Release Notes

### 0.0.1 — Beta
Initial release. Tasks, Ideas, Notes, Decisions, Roadmap, AI (Ollama + OpenAI + Claude + Gemini), Donations, Settings with theme and AI provider configuration.

---

## Support

Found a bug or have a suggestion? Open an issue on GitHub.

Like the extension? Consider [buying me a coffee ☕](https://paypal.me/fantactico).

---

Made with ♥ by [RTSI](https://rtsi.mx)
