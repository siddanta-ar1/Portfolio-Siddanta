/** fetch() that throws with the platform's error body, so results show the real reason. */
export async function request<T = unknown>(url: string, init: RequestInit): Promise<{ data: T; res: Response }> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  const raw = await res.text();
  let data: unknown = raw;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // non-JSON body — keep the raw text
  }
  if (!res.ok) {
    const detail = typeof data === "string" ? data : JSON.stringify(data);
    throw new Error(`HTTP ${res.status}: ${detail.slice(0, 400)}`);
  }
  return { data: data as T, res };
}

export function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function hasEnv(...names: string[]): boolean {
  return names.every((n) => env(n) !== "");
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
