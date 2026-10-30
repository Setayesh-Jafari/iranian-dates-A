/** Shared guards for anonymous, JSON-only write APIs. */
export function checkWriteOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  // Non-browser integrations do not always send Origin. CORS remains disabled
  // and JSON content-type is required, so browsers cannot post cross-origin.
  if (!origin) {
    if (request.headers.get("sec-fetch-site") === "cross-site") return forbidden();
    return null;
  }
  try {
    const parsed = new URL(origin);
    const host = request.headers.get("host") ?? new URL(request.url).host;
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const proto = forwardedProto || new URL(request.url).protocol.replace(":", "");
    if (
      parsed.origin !== origin ||
      !["http", "https"].includes(proto) ||
      parsed.protocol !== `${proto}:` ||
      parsed.host.toLowerCase() !== host.toLowerCase()
    ) return forbidden();
  } catch {
    return forbidden();
  }
  return null;
}

function forbidden(): Response {
  return Response.json({ code: "FORBIDDEN", error: "Request origin is not allowed." }, { status: 403 });
}

export type JsonBodyResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; response: Response };

/** Read at most maxBytes from the stream, including chunked bodies. */
export async function readJsonObject(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  const fail = (message: string, status: number): JsonBodyResult => ({
    ok: false,
    response: Response.json({ code: "INVALID_REQUEST", error: message }, { status }),
  });
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("content-type") ?? "")) {
    return fail("Content-Type must be application/json.", 415);
  }
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) {
    return fail("Request payload is too large.", 413);
  }
  if (!request.body) return fail("Invalid request body.", 400);

  try {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel().catch(() => {});
        return fail("Request payload is too large.", 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const value: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return fail("Invalid request body.", 400);
    }
    return { ok: true, value: value as Record<string, unknown> };
  } catch {
    return fail("Invalid request body.", 400);
  }
}
