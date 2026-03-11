const OLLAMA_BASE = "http://localhost:11434";
const MODEL = "mistral:7b-instruct";
const TIMEOUT_MS = 5000;

export class OllamaConnectionError extends Error {
  constructor() {
    super("Ollama no disponible");
  }
}

export async function pingOllama(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export async function* streamOllama(
  prompt: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: true,
    }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No stream reader");

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter(Boolean);

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) yield json.response;
        if (json.done) return;
      } catch {
        // partial JSON chunk, skip
      }
    }
  }
}
