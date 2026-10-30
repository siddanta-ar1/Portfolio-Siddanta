import { Project } from "@/types/project";
import { absoluteUrl, projectUrl } from "@/lib/site";
import { SharePayload } from "./types";

const CATEGORY_TAGS: Record<string, string[]> = {
  STARTUPS: ["startup", "buildinpublic"],
  "FULL-STACK": ["webdev", "nextjs", "fullstack"],
  QUANTUM: ["quantumcomputing", "qiskit"],
  COMMUNITY: ["opensource", "community"],
  RESEARCH: ["research", "ai"],
  AWARDS: ["hackathon", "achievement"],
  CERTIFICATIONS: ["learning", "certification"],
  CONTRIBUTIONS: ["opensource", "github"],
  EXPERIENCE: ["career", "softwareengineering"],
  ABOUT: ["developer", "nepal"],
};

export function buildPayload(project: Project, customText?: string): SharePayload {
  const hashtags = [...(CATEGORY_TAGS[project.category] ?? []), "nepal"].filter(
    (t, i, all) => all.indexOf(t) === i,
  );
  const defaultText = project.description?.trim()
    ? `${project.title}\n\n${project.description.trim()}`
    : project.title;

  return {
    project,
    link: projectUrl(project.id),
    imageUrl: absoluteUrl(project.image_url?.split("?")[0] ?? ""),
    videoUrl: absoluteUrl(project.video_url ?? ""),
    text: customText?.trim() || defaultText,
    hashtags,
  };
}

export function hashtagLine(tags: string[], max = tags.length): string {
  return tags.slice(0, max).map((t) => `#${t}`).join(" ");
}

/** Cut text to `max` characters on a word boundary, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  const cut = chars.slice(0, Math.max(0, max - 1)).join("");
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
