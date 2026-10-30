import { Project } from "@/types/project";

export type PlatformId =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "x"
  | "tiktok"
  | "medium"
  | "google-sites";

export type PublishStatus = "posted" | "draft" | "manual" | "skipped" | "error";

export interface PublishResult {
  platform: PlatformId;
  status: PublishStatus;
  /** Link to the created post, or to the page where the manual step happens. */
  url?: string;
  id?: string;
  message?: string;
}

/** Everything a publisher needs, resolved once per request. */
export interface SharePayload {
  project: Project;
  /** Absolute /p/[id] URL — the link every post points at. */
  link: string;
  /** Absolute image URL, if the project has one. */
  imageUrl: string;
  /** Absolute video URL, if the project has one. */
  videoUrl: string;
  /** Post text without the link; publishers append the link where the platform allows it. */
  text: string;
  hashtags: string[];
}

export interface Platform {
  id: PlatformId;
  label: string;
  /** True when the env vars this platform needs are present. */
  configured: () => boolean;
  /** Text exactly as it would be posted — used for dry runs and the admin preview. */
  preview: (p: SharePayload) => string;
  publish: (p: SharePayload) => Promise<PublishResult>;
}
