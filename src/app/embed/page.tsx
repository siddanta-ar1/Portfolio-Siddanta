import type { Metadata } from "next";
import { getPortfolioProjects } from "@/lib/projects";
import { getImageUrl } from "@/lib/placeholder";
import { projectUrl } from "@/lib/site";

// Compact, frame-friendly list of the latest work for Google Sites
// (Insert → Embed → By URL). It re-renders every 60s, so the Google Site stays
// current without being edited.

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Latest work",
  robots: { index: false, follow: true },
};

const SHOWCASE = new Set(["STARTUPS", "FULL-STACK", "AWARDS", "RESEARCH"]);

export default async function EmbedPage() {
  const projects = (await getPortfolioProjects())
    .filter((p) => SHOWCASE.has(p.category))
    .sort((a, b) => b.year.localeCompare(a.year))
    .slice(0, 12);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 list-none p-0 m-0">
        {projects.map((p) => (
          <li key={p.id}>
            <a href={projectUrl(p.id)} target="_blank" rel="noreferrer" className="block no-underline text-inherit group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(p.image_url, p.category)}
                alt=""
                loading="lazy"
                className="w-full aspect-[4/3] object-cover transition-opacity group-hover:opacity-80"
              />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] font-[family-name:var(--font-geist-mono)] opacity-60">
                {p.category} · {p.year}
              </p>
              <p className="mt-1 text-sm leading-snug">{p.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
