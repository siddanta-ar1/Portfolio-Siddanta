import HomeClient from "@/components/HomeClient";
import { getPortfolioProjects } from "@/lib/projects";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const projects = await getPortfolioProjects();
  return <HomeClient projects={projects} />;
}
