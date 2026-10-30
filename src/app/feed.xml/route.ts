import { getPortfolioProjects } from "@/lib/projects";
import { SITE_URL, absoluteUrl, projectUrl } from "@/lib/site";

// RSS feed of portfolio entries. Plug it into IFTTT / Zapier / Make / Buffer
// "RSS → post" automations for platforms whose APIs you can't get access to.

export const revalidate = 60;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

export async function GET() {
  const projects = (await getPortfolioProjects()).filter((p) => p.category !== "ABOUT");

  const items = projects
    .map((p) => {
      const link = projectUrl(p.id);
      const image = p.image_url ? absoluteUrl(p.image_url.split("?")[0]) : "";
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description || `${p.category} · ${p.year}`)}</description>${
        image ? `\n      <enclosure url="${esc(image)}" type="image/jpeg" length="0" />` : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Siddanta Sodari — Portfolio</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Projects, awards, research and certifications by Siddanta Sodari.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}
