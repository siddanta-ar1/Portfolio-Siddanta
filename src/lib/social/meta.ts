import { Platform } from "./types";
import { hashtagLine, truncate } from "./compose";
import { env, hasEnv, request, sleep } from "./http";

// Facebook Page + Instagram professional account through the Meta Graph API.
// Personal Facebook profiles cannot be posted to by any API — only Pages.

const graph = (path: string) => `https://graph.facebook.com/${env("META_GRAPH_VERSION") || "v23.0"}/${path}`;

function form(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams(Object.entries(params).filter(([, v]) => v !== ""));
}

function facebookText(text: string, tags: string[]): string {
  return `${text}\n\n${hashtagLine(tags, 4)}`;
}

export const facebook: Platform = {
  id: "facebook",
  label: "Facebook Page",
  configured: () => hasEnv("FACEBOOK_PAGE_ID", "FACEBOOK_PAGE_ACCESS_TOKEN"),
  preview: (p) => `${facebookText(p.text, p.hashtags)}\n\n${p.link}`,
  async publish(p) {
    // A link post renders the /p/[id] Open Graph card (image + title) automatically.
    const { data } = await request<{ id: string }>(graph(`${env("FACEBOOK_PAGE_ID")}/feed`), {
      method: "POST",
      body: form({
        message: facebookText(p.text, p.hashtags),
        link: p.link,
        access_token: env("FACEBOOK_PAGE_ACCESS_TOKEN"),
      }),
    });
    return { platform: "facebook", status: "posted", id: data.id, url: `https://www.facebook.com/${data.id}` };
  },
};

function instagramCaption(text: string, link: string, tags: string[]): string {
  // Links in captions aren't clickable, but keep it so people can copy it.
  return truncate(`${text}\n\n🔗 ${link}\n\n${hashtagLine(tags, 8)}`, 2200);
}

export const instagram: Platform = {
  id: "instagram",
  label: "Instagram",
  configured: () => hasEnv("INSTAGRAM_USER_ID", "INSTAGRAM_ACCESS_TOKEN"),
  preview: (p) => instagramCaption(p.text, p.link, p.hashtags),
  async publish(p) {
    if (!p.videoUrl && !p.imageUrl) {
      return { platform: "instagram", status: "skipped", message: "Instagram needs an image or video." };
    }
    const igUser = env("INSTAGRAM_USER_ID");
    const token = env("INSTAGRAM_ACCESS_TOKEN");

    // 1) Create a media container. Images must be publicly reachable JPEGs.
    const { data: container } = await request<{ id: string }>(graph(`${igUser}/media`), {
      method: "POST",
      body: form({
        caption: instagramCaption(p.text, p.link, p.hashtags),
        access_token: token,
        ...(p.videoUrl ? { media_type: "REELS", video_url: p.videoUrl } : { image_url: p.imageUrl }),
      }),
    });

    // 2) Videos are processed asynchronously — wait until the container is ready (max ~2 min).
    if (p.videoUrl) {
      for (let i = 0; i < 24; i++) {
        const { data } = await request<{ status_code: string }>(
          graph(`${container.id}?fields=status_code&access_token=${encodeURIComponent(token)}`),
          { method: "GET" },
        );
        if (data.status_code === "FINISHED") break;
        if (data.status_code === "ERROR" || data.status_code === "EXPIRED") {
          throw new Error(`Instagram could not process the video (${data.status_code}).`);
        }
        if (i === 23) throw new Error("Instagram is still processing the video; try again in a few minutes.");
        await sleep(5000);
      }
    }

    // 3) Publish, then look up the permalink.
    const { data: media } = await request<{ id: string }>(graph(`${igUser}/media_publish`), {
      method: "POST",
      body: form({ creation_id: container.id, access_token: token }),
    });
    const { data: info } = await request<{ permalink?: string }>(
      graph(`${media.id}?fields=permalink&access_token=${encodeURIComponent(token)}`),
      { method: "GET" },
    ).catch(() => ({ data: {} as { permalink?: string } }));
    return { platform: "instagram", status: "posted", id: media.id, url: info.permalink };
  },
};
