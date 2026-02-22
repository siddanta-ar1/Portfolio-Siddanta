/**
 * placeholder.ts
 *
 * Provides category-aware Unsplash placeholder images for projects
 * that have a missing, empty, or broken image_url.
 *
 * All photo IDs are well-known, stable Unsplash images that do not
 * require an API key — they resolve directly via images.unsplash.com.
 *
 * Usage:
 *   import { getImageUrl, handleImageError } from "@/lib/placeholder";
 *
 *   // In JSX:
 *   <img
 *     src={getImageUrl(project.image_url, project.category)}
 *     onError={handleImageError(project.category)}
 *   />
 */

// ── Category → curated Unsplash photo ──────────────────────────────────────
//   Each URL uses ?w=800&q=80 for a reasonable file size.
//   Swap any photo ID here to change the placeholder for that category.

const CATEGORY_MAP: Record<string, string> = {
  // Startup / product work
  startups:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  startup:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",

  // Team collaboration / open-source contribution
  contribution:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  contributions:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",

  // Award / recognition
  award:
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
  awards:
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",

  // Certificate / course completion
  certification:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  certifications:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  certificate:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",

  // Hackathon / competition
  hackathon:
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  hackathons:
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",

  // Community / event
  community:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  event:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  events:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
};

// Fallback when the category doesn't match anything above
const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80";

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the best image URL to display for a project.
 *
 * Priority:
 *   1. The project's own image_url (if non-empty)
 *   2. A category-matched Unsplash placeholder
 *   3. The generic default placeholder
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
  category?: string | null,
): string {
  if (imageUrl && imageUrl.trim() !== "") return imageUrl;
  return getPlaceholderByCategory(category);
}

/**
 * Returns the placeholder URL for a given category string.
 * Safe to call with null / undefined.
 */
export function getPlaceholderByCategory(
  category?: string | null,
): string {
  const key = (category ?? "").toLowerCase().trim();
  return CATEGORY_MAP[key] ?? DEFAULT_PLACEHOLDER;
}

/**
 * Returns an onError handler for <img> elements.
 *
 * When the browser fails to load an image (404, CORS, invalid URL, etc.)
 * this swaps the src to the appropriate placeholder.
 * The guard `target.src !== placeholder` prevents infinite error loops
 * in case the placeholder itself fails to load.
 *
 * Usage:
 *   <img
 *     src={project.image_url}
 *     onError={handleImageError(project.category)}
 *   />
 */
export function handleImageError(
  category?: string | null,
): React.ReactEventHandler<HTMLImageElement> {
  return (e) => {
    const target = e.currentTarget;
    const placeholder = getPlaceholderByCategory(category);
    if (target.src !== placeholder) {
      target.src = placeholder;
    }
  };
}
