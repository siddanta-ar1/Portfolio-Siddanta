import { Platform, PlatformId, PublishResult, SharePayload } from "./types";
import { linkedin } from "./linkedin";
import { facebook, instagram } from "./meta";
import { x } from "./x";
import { tiktok } from "./tiktok";
import { medium, googleSites } from "./manual";

export const PLATFORMS: Platform[] = [linkedin, facebook, instagram, x, tiktok, medium, googleSites];

export function getPlatform(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

/** Publish to each platform independently — one failure never blocks the others. */
export async function publishAll(payload: SharePayload, ids: PlatformId[]): Promise<PublishResult[]> {
  return Promise.all(
    ids.map(async (id): Promise<PublishResult> => {
      const platform = getPlatform(id);
      if (!platform) return { platform: id, status: "error", message: "Unknown platform." };
      if (!platform.configured()) {
        return { platform: id, status: "skipped", message: "Not configured — add its env vars." };
      }
      try {
        return await platform.publish(payload);
      } catch (err) {
        return { platform: id, status: "error", message: err instanceof Error ? err.message : String(err) };
      }
    }),
  );
}

export type { PlatformId, PublishResult } from "./types";
