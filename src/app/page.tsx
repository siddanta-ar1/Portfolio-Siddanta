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

  return <HomeClient projects={projects} />;
}
