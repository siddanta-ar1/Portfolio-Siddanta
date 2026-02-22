"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuOverlay from "@/components/MenuOverlay";
import ImageCarousel from "@/components/ImageCarousel";
import GridView from "@/components/GridView";
import { Project } from "@/types/project";

interface HomeClientProps {
  projects: Project[];
}

/**
 * Deduplicate projects by image_url — keeps the first occurrence only.
 * This prevents the same image from appearing multiple times in the
 * carousel or grid when different category entries share an image.
 */
function deduplicateByImage(items: Project[]): Project[] {
  const seen = new Set<string>();
  return items.filter((p) => {
    if (seen.has(p.image_url)) return false;
    seen.add(p.image_url);
    return true;
  });
}

export default function HomeClient({ projects }: HomeClientProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<"LIST" | "GRID">("LIST");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeIndex, setActiveIndex] = useState(0);
  const [time, setTime] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shared time clock — Nepal Time (NPT = UTC+5:45)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nptOffset = 5 * 60 + 45;
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const npt = new Date(utc + nptOffset * 60000);
      const hours = npt.getHours();
      const minutes = npt.getMinutes().toString().padStart(2, "0");
      const seconds = npt.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHour = (hours % 12 || 12).toString().padStart(2, "0");
      setTime(`NPT - ${displayHour}:${minutes}:${seconds} ${ampm}`);
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const toggleView = () =>
    setView((prev) => (prev === "LIST" ? "GRID" : "LIST"));

  // Filter projects by category, then deduplicate by image
  const filteredProjects = useMemo(() => {
    const byCategory =
      activeCategory === "ALL"
        ? projects
        : projects.filter((p) => p.category === activeCategory);
    return deduplicateByImage(byCategory);
  }, [activeCategory, projects]);

  // Current display project (the active carousel slide)
  const currentProject = filteredProjects[activeIndex] || null;

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setActiveIndex(0);
  };

  // ── STABLE callback — prevents re-render cascades from the GSAP ticker ──
  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleGridSelect = useCallback((index: number) => {
    setActiveIndex(index);
    setView("LIST");
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onMenuOpen={() => setMenuOpen(true)}
      />

      {/* ── LIST VIEW: Horizontal Filmstrip ── */}
      {view === "LIST" && (
        <ImageCarousel
          projects={filteredProjects}
          activeIndex={activeIndex}
          onIndexChange={handleIndexChange}
        />
      )}

      {/* ── GRID VIEW: Clean CSS Grid ── */}
      {view === "GRID" && (
        <GridView
          filteredProjects={filteredProjects}
          onSelectProject={handleGridSelect}
        />
      )}

      <Footer
        currentProject={currentProject}
        view={view}
        onToggleView={toggleView}
      />

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        theme={theme}
        onToggleTheme={toggleTheme}
        time={time}
      />
    </main>
  );
}
