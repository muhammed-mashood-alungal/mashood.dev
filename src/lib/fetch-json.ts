const DEFAULT_TIMEOUT_MS = 8000;

/**
 * fetch + JSON with a hard timeout. Throws on network errors, timeouts and
 * non-2xx responses so callers can fall back in one catch block.
 */
export async function fetchJson<T>(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${url} responded ${res.status}`);
  }
  return (await res.json()) as T;
}
