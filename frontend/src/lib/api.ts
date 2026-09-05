// Typed fetch layer over the FastAPI backend. Base is the relative "/api" prefix so the
// same code works in dev (Vite proxies /api → :8001) and behind a single origin in prod.
const BASE = "/api";

// Fields are declared, not constructor parameter properties: tsconfig sets
// erasableSyntaxOnly, which rejects `constructor(readonly status: number)`.
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`request failed with ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type JsonBody = unknown;

async function request<T>(method: string, path: string, body?: JsonBody): Promise<T> {
  // Auth rides the httpOnly session cookie automatically — never add auth headers here.
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // FastAPI reports request-validation failures as 422 with a {detail: [...]} body.
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new ApiError(res.status, errBody);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// The response type is yours to declare: nothing infers across the Python boundary, so a
// TS interface here mirrors the endpoint's Pydantic model by hand — keep the two in sync.
export const apiGet = <T>(path: string) => request<T>("GET", path);
export const apiPost = <T>(path: string, body?: JsonBody) => request<T>("POST", path, body ?? null);
export const apiPut = <T>(path: string, body?: JsonBody) => request<T>("PUT", path, body ?? null);
export const apiPatch = <T>(path: string, body?: JsonBody) =>
  request<T>("PATCH", path, body ?? null);
export const apiDelete = <T>(path: string) => request<T>("DELETE", path);

interface StreamPayload {
  token?: string;
}

export async function apiPostStream<T>(
  path: string,
  body: JsonBody,
  onToken?: (token: string) => void,
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 65_000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new ApiError(res.status, errBody);
    }
    if (!res.body) throw new ApiError(502, { detail: "Streaming response unavailable" });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let result: T | undefined;

    const processEvent = (block: string) => {
      const lines = block.split("\n");
      const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
      const rawData = lines.filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
      if (!event || !rawData) return;
      const payload = JSON.parse(rawData) as StreamPayload | T;
      if (event === "token") {
        const token = (payload as StreamPayload).token;
        if (token) onToken?.(token);
      } else if (event === "result") {
        result = payload as T;
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";
      blocks.forEach(processEvent);
      if (done) break;
    }
    if (buffer.trim()) processEvent(buffer);
    if (!result) throw new ApiError(502, { detail: "AI stream ended without a result" });
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, { detail: "AI request timed out" });
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
