import { Platform } from "./types";
import { hashtagLine, truncate } from "./compose";
import { env, hasEnv, request } from "./http";
import { SITE_URL } from "@/lib/site";

// TikTok Content Posting API, Direct Post. Until TikTok audits the app, posts
// are forced to private (SELF_ONLY) — keep TIKTOK_PRIVACY_LEVEL at the default
// until the audit passes. PULL_FROM_URL only accepts URLs on a domain verified
// in the TikTok developer portal, so Supabase media is served via /media/*
// (rewritten in next.config.ts) on the portfolio's own domain.

const API = "https://open.tiktokapis.com/v2";

/** Map a Supabase public-storage URL onto the portfolio domain's /media/* rewrite. */
function onVerifiedDomain(url: string): string {
  const match = url.match(/\/storage\/v1\/object\/public\/(.+)$/);
  return match ? `${SITE_URL}/media/${match[1]}` : url;
}

/** Access tokens last 24h; refresh tokens a year. Exchange on every publish. */
async function accessToken(): Promise<string> {
  const { data } = await request<{ access_token?: string; error_description?: string }>(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY"),
      client_secret: env("TIKTOK_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: env("TIKTOK_REFRESH_TOKEN"),
    }),
  });
  if (!data.access_token) throw new Error(`TikTok token refresh failed: ${data.error_description ?? "unknown error"}`);
  return data.access_token;
}

function caption(text: string, tags: string[]): string {
  return truncate(`${text}\n\n${hashtagLine(tags, 5)}`, 2200);
}

export const tiktok: Platform = {
  id: "tiktok",
  label: "TikTok",
  configured: () => hasEnv("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"),
  preview: (p) => caption(p.text, p.hashtags),
  async publish(p) {
    if (!p.videoUrl && !p.imageUrl) {
      return { platform: "tiktok", status: "skipped", message: "TikTok needs a video or image." };
    }
    const token = await accessToken();
    const privacy = env("TIKTOK_PRIVACY_LEVEL") || "SELF_ONLY";
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8" };

    const body = p.videoUrl
      ? {
          url: `${API}/post/publish/video/init/`,
          json: {
            post_info: { title: caption(p.text, p.hashtags), privacy_level: privacy },
            source_info: { source: "PULL_FROM_URL", video_url: onVerifiedDomain(p.videoUrl) },
          },
        }
      : {
          url: `${API}/post/publish/content/init/`,
          json: {
            post_info: {
              title: truncate(p.project.title, 90),
              description: truncate(caption(p.text, p.hashtags), 4000),
              privacy_level: privacy,
            },
            source_info: { source: "PULL_FROM_URL", photo_images: [onVerifiedDomain(p.imageUrl)], photo_cover_index: 0 },
            post_mode: "DIRECT_POST",
            media_type: "PHOTO",
          },
        };

    const { data } = await request<{ data?: { publish_id?: string }; error?: { code: string; message: string } }>(
      body.url,
      { method: "POST", headers, body: JSON.stringify(body.json) },
    );
    if (data.error && data.error.code !== "ok") throw new Error(`${data.error.code}: ${data.error.message}`);
    return {
      platform: "tiktok",
      status: "posted",
      id: data.data?.publish_id,
      message:
        privacy === "SELF_ONLY"
          ? "Uploaded as private (SELF_ONLY). Make it public from the TikTok app until the API audit passes."
          : "Uploaded; TikTok processes it in the background.",
    };
  },
};
