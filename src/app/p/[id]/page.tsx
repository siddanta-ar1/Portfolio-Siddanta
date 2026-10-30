import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioProject } from "@/lib/projects";
import { getImageUrl } from "@/lib/placeholder";
import { absoluteUrl, projectUrl } from "@/lib/site";

// Share target for social posts: one URL per project, with its own Open Graph
// tags so LinkedIn / Facebook / X render the project's image and title.

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

async function load(params: Props["params"]) {
  const { id } = await params;
  const num = Number(id);
  return Number.isFinite(num) ? getPortfolioProject(num) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await load(params);
  if (!project) return { title: "Not found", robots: { index: false } };
  const description = project.description || `${project.category} · ${project.year}`;
  const image = project.image_url ? absoluteUrl(project.image_url.split("?")[0]) : undefined;
  return {
    title: project.title,
    description,
    alternates: { canonical: projectUrl(project.id) },
    openGraph: {
      type: "article",
      url: projectUrl(project.id),
      title: project.title,
      description,
      ...(image && { images: [{ url: image, alt: project.title }] }),
      ...(project.video_url && { videos: [{ url: absoluteUrl(project.video_url) }] }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: project.title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProjectSharePage({ params }: Props) {
  const project = await load(params);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 sm:px-8 py-10 flex justify-center">
      <article className="w-full max-w-3xl flex flex-col gap-6">
        <Link
          href="/"
          className="text-[10px] font-bold uppercase tracking-[0.14em] font-[family-name:var(--font-geist-mono)] opacity-60 hover:opacity-100 no-underline text-inherit"
        >
          ← Siddanta Sodari
        </Link>

        {project.video_url ? (
          <video src={project.video_url} autoPlay loop muted playsInline controls className="w-full" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={getImageUrl(project.image_url, project.category)} alt={project.title} className="w-full h-auto" />
        )}

        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-[0.14em] font-[family-name:var(--font-geist-mono)] opacity-60">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-normal leading-tight">{project.title}</h1>
        {project.description && <p className="leading-relaxed opacity-80 whitespace-pre-line">{project.description}</p>}

        {project.links && project.links.length > 0 && (
          <ul className="flex flex-wrap gap-4 list-none p-0 m-0">
            {project.links.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] font-[family-name:var(--font-geist-mono)] text-inherit"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </main>
  );
}
