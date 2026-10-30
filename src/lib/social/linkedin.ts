import { Platform } from "./types";
import { hashtagLine, truncate } from "./compose";
import { env, hasEnv, request } from "./http";

// Posts API (https://learn.microsoft.com/linkedin/marketing/community-management/shares/posts-api).
// Needs the "Share on LinkedIn" product and a member token with the w_member_social scope.

/** LinkedIn versions are monthly (YYYYMM) and expire after about a year; default to two months back. */
function apiVersion(): string {
  if (env("LINKEDIN_API_VERSION")) return env("LINKEDIN_API_VERSION");
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - 2);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Commentary uses "little text" format: these characters must be backslash-escaped. */
function escapeLittleText(text: string): string {
  return text.replace(/[\\|{}@[\]()<>#*_~]/g, (c) => `\\${c}`);
}

function compose(text: string, link: string, tags: string[]): string {
  return truncate(`${text}\n\n${link}\n\n${hashtagLine(tags, 4)}`, 3000);
}

export const linkedin: Platform = {
  id: "linkedin",
  label: "LinkedIn",
  configured: () => hasEnv("LINKEDIN_ACCESS_TOKEN", "LINKEDIN_AUTHOR_URN"),
  preview: (p) => compose(p.text, p.link, p.hashtags),
  async publish(p) {
    const { res } = await request("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env("LINKEDIN_ACCESS_TOKEN")}`,
        "LinkedIn-Version": apiVersion(),
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: env("LINKEDIN_AUTHOR_URN"),
        commentary: escapeLittleText(compose(p.text, p.link, p.hashtags)),
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        content: {
          article: {
            source: p.link,
            title: truncate(p.project.title, 200),
            description: truncate(p.project.description || p.project.title, 250),
          },
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    });
    const urn = res.headers.get("x-restli-id") ?? "";
    return {
      platform: "linkedin",
      status: "posted",
      id: urn,
      url: urn ? `https://www.linkedin.com/feed/update/${urn}` : undefined,
    };
  },
};
