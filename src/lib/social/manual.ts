import { Platform } from "./types";
import { truncate } from "./compose";
import { env, hasEnv, request } from "./http";
import { SITE_URL } from "@/lib/site";

// Medium stopped issuing API integration tokens to new accounts. If you have a
// legacy token, posts are created through the API (as drafts by default);
// otherwise the result points to Medium's "Import a story" tool.

const MEDIUM_API = "https://api.medium.com/v1";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

export const medium: Platform = {
  id: "medium",
  label: "Medium",
  // Always available: falls back to the manual import link without a token.
  configured: () => true,
  preview: (p) => `${p.project.title}\n\n${p.text}\n\nOriginally published at ${p.link}`,
  async publish(p) {
    if (!hasEnv("MEDIUM_INTEGRATION_TOKEN")) {
      return {
        platform: "medium",
        status: "manual",
        url: "https://medium.com/p/import",
        message: `No Medium token. Open the import tool and paste ${p.link}`,
      };
    }
    const headers = {
      Authorization: `Bearer ${env("MEDIUM_INTEGRATION_TOKEN")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const { data: me } = await request<{ data: { id: string } }>(`${MEDIUM_API}/me`, { method: "GET", headers });
    const status = env("MEDIUM_PUBLISH_STATUS") || "draft";
    const paragraphs = p.text
      .split(/\n{2,}/)
      .map((para) => `<p>${escapeHtml(para)}</p>`)
      .join("");
    const { data } = await request<{ data: { id: string; url: string } }>(`${MEDIUM_API}/users/${me.data.id}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: truncate(p.project.title, 100),
        contentFormat: "html",
        content: `<h1>${escapeHtml(p.project.title)}</h1>${p.imageUrl ? `<img src="${p.imageUrl}">` : ""}${paragraphs}<p><a href="${p.link}">View on my portfolio</a></p>`,
        canonicalUrl: p.link,
        tags: p.hashtags.slice(0, 5),
        publishStatus: status,
      }),
    });
    return { platform: "medium", status: status === "public" ? "posted" : "draft", id: data.data.id, url: data.data.url };
  },
};

// Google Sites has no publishing API. Embed /embed once (Insert → Embed → By URL)
// and it shows the latest portfolio entries on every page load.
export const googleSites: Platform = {
  id: "google-sites",
  label: "Google Sites",
  configured: () => true,
  preview: () => `Embedded live feed: ${SITE_URL}/embed`,
  async publish() {
    return {
      platform: "google-sites",
      status: "manual",
      url: `${SITE_URL}/embed`,
      message: "Nothing to post: embed this URL once in Google Sites and it updates automatically.",
    };
  },
};
