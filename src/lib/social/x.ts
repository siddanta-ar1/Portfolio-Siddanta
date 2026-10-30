import crypto from "node:crypto";
import { Platform } from "./types";
import { hashtagLine, truncate } from "./compose";
import { env, hasEnv, request } from "./http";

// X API v2 POST /2/tweets with OAuth 1.0a user context (the four keys from the
// developer portal, app permissions set to "Read and write"). Write access
// depends on your X developer plan.

const ENDPOINT = "https://api.x.com/2/tweets";
const LINK_WEIGHT = 23; // every URL counts as 23 characters on X

/** RFC 3986 percent-encoding, as OAuth 1.0a requires. */
const pct = (s: string) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

function oauthHeader(method: string, url: string): string {
  const oauth: Record<string, string> = {
    oauth_consumer_key: env("X_API_KEY"),
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: env("X_ACCESS_TOKEN"),
    oauth_version: "1.0",
  };
  // JSON bodies are not part of the signature base string.
  const params = Object.keys(oauth)
    .sort()
    .map((k) => `${pct(k)}=${pct(oauth[k])}`)
    .join("&");
  const base = [method.toUpperCase(), pct(url), pct(params)].join("&");
  const key = `${pct(env("X_API_SECRET"))}&${pct(env("X_ACCESS_TOKEN_SECRET"))}`;
  oauth.oauth_signature = crypto.createHmac("sha1", key).update(base).digest("base64");
  return (
    "OAuth " +
    Object.keys(oauth)
      .sort()
      .map((k) => `${pct(k)}="${pct(oauth[k])}"`)
      .join(", ")
  );
}

function compose(text: string, link: string, tags: string[]): string {
  const tagLine = hashtagLine(tags, 2);
  // 280 minus the link, two line breaks before it and before the tags, and a small safety margin for wide characters.
  const budget = 280 - LINK_WEIGHT - 4 - tagLine.length - 6;
  return `${truncate(text, budget)}\n\n${tagLine}\n${link}`;
}

export const x: Platform = {
  id: "x",
  label: "X",
  configured: () => hasEnv("X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"),
  preview: (p) => compose(p.text, p.link, p.hashtags),
  async publish(p) {
    const { data } = await request<{ data: { id: string } }>(ENDPOINT, {
      method: "POST",
      headers: { Authorization: oauthHeader("POST", ENDPOINT), "Content-Type": "application/json" },
      body: JSON.stringify({ text: compose(p.text, p.link, p.hashtags) }),
    });
    return { platform: "x", status: "posted", id: data.data.id, url: `https://x.com/i/web/status/${data.data.id}` };
  },
};
