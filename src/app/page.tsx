import { supabase } from "@/lib/supabase";
import { Project } from "@/types/project";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  let projects: Project[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error.message);
    }

    projects = data ?? [];
  } else {
    console.warn(
      "[page] Supabase client is not configured. Rendering with an empty project list. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to connect.",
    );
  }

  // Video dictionary mappings based on the fetched project titles
  const VIDEO_MAP: Record<string, string> = {
    "NOTEacher": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/noteacher.mp4",
    "HumanSign": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/humansign.mp4",
    "ScholarsPoint": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/scholarspoint.mp4",
    // KKhane is handled uniquely (we keep its image/video if provided, or inject sub-projects below)
    "OpenShelf": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/librarysystem.mp4",
    "Startup Resource Hub": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/startupresourecehub.mp4",
    "RSGRT Website": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/rsgrt.mp4",
    "Naari Sringaar": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/naarisringaar.mp4",
    "TechRaj Digital Bazaar": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/techrajshop.mp4",
    "TeachersLog": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/teacherslog.mp4",
    "gnetgroups": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/gnetsgroup.mp4",
    "Qubits For Change": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/qubitsforchange.mp4",
    "20 Days of Quantum Computing Challenge ⚛️": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/Quantum20dayschallenge.mp4",
    "BOSC Website — bosc.org.np": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/boscwebsite.mp4",
    "Best Functional Prototype — Ideathon 2025": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/RakshaNet.mp4",
    "Sortrace": "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/sortrace.mp4",
  };

  const enhancedProjects: Project[] = [];

  // 2) Iterate and transform/inject
  for (const proj of projects) {
    if (proj.title === "KKhane") {
      enhancedProjects.push({
        id: proj.id + 0.1, // Floating point ID so React key doesn't clash
        title: "Fine Diners (KKhane)",
        category: proj.category,
        year: proj.year,
        description: "Fine Diners project under KKhane",
        image_url: proj.image_url + "?proj=finediners", // Unique fallback so it doesn't get deduplicated out
        video_url: "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/finediners.mp4"
      });

      enhancedProjects.push({
        id: proj.id + 0.2,
        title: "The House Cafe (KKhane)",
        category: proj.category,
        year: proj.year,
        description: "The House Cafe project under KKhane",
        image_url: proj.image_url + "?proj=thehousecafe", // Unique fallback so it doesn't get deduplicated out
        video_url: "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/thehousecafe.mp4"
      });

      // We do NOT push the original KKhane object, removing its placeholder image
      continue;
    }

    // 1) Add the existing project, mapping its video if it exists in the dictionary
    const enhanced = { ...proj };
    if (VIDEO_MAP[proj.title]) {
      enhanced.video_url = VIDEO_MAP[proj.title];
    }

    // Loose matching for Raksha-Net to prevent database string mismatches
    const lowerTitle = enhanced.title.toLowerCase();
    if (lowerTitle.includes("ideathon") || lowerTitle.includes("raksha") || lowerTitle.includes("best functional prototype")) {
      enhanced.video_url = "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/RakshaNet.mp4";
      enhanced.title = "Best Functional prototype : Raksha-Net";
    }

    // Loose match for sortrace just in case
    if (lowerTitle.includes("sortrace")) {
      enhanced.video_url = "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-videos/sortrace.mp4";
      enhanced.title = "Sortrace"; // Ensure clean title
    }

    // Specific overrides for the AWARDS category menu
    if (enhanced.category === "AWARDS") {
      if (lowerTitle.includes("hackathon") || lowerTitle.includes("top 5 team")) {
        enhanced.image_url = "https://jbqofmpwepmukcviwuzn.supabase.co/storage/v1/object/public/project-images/USEmbassyNOTEacher.jpg";
      }
      // Note: User explicitly requested RakshaNet to remain a video, so we do not override it with an image anymore.
    }

    enhancedProjects.push(enhanced);
  }

  return <HomeClient projects={enhancedProjects} />;
}
