export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://siddanta.vercel.app").replace(/\/$/, "");

/** Resolve a site-relative path (e.g. /cv/cert.jpg) to an absolute URL. Absolute URLs pass through. */
export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Public share page for a project — carries per-project Open Graph tags for link previews. */
export function projectUrl(id: number): string {
  return `${SITE_URL}/p/${id}`;
}
