"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Project } from "@/types/project";

interface FooterProps {
  currentProject: Project | null;
  view: "LIST" | "GRID";
  onToggleView: () => void;
}

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer({
  currentProject,
  view,
  onToggleView,
}: FooterProps) {
  const captionRef = useRef<HTMLSpanElement>(null);

  const captionText = currentProject
    ? `${currentProject.title}, ${currentProject.category} ${currentProject.year}`
    : "";

  useEffect(() => {
    if (!captionRef.current || !captionText) return;

    gsap.fromTo(
      captionRef.current,
      { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
  }, [captionText, currentProject?.id]);

  return (
    <>
      {/* ── Floating caption — positioned above the footer bar ── */}
      {captionText && (
        <div className="fixed bottom-16 left-0 z-100 w-full flex justify-center px-4 pointer-events-none">
          <span
            key={currentProject?.id ?? "empty-caption"}
            ref={captionRef}
            className="text-sm font-bold not-italic tracking-normal text-[var(--foreground)] max-w-[90vw] md:max-w-[600px] text-center whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis pointer-events-auto"
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            {captionText}
          </span>
        </div>
      )}

      {/* ── Footer bar — single clean row ── */}
      <footer className="fixed bottom-0 left-0 z-100 flex items-center justify-between w-full px-4 py-3 sm:px-8 sm:py-6 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-[var(--foreground)] opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)"
            className="text-[var(--foreground)] opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <XIcon />
          </a>
          <a
            href="https://github.com/siddanta-ar1"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-[var(--foreground)] opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://linkedin.com/in/siddanta-sodari-08596a335"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--foreground)] opacity-40 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <LinkedInIcon />
          </a>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 font-[family-name:var(--font-geist-mono)]">
          <button
            onClick={view === "LIST" ? undefined : onToggleView}
            className={`bg-transparent border-none p-0 cursor-pointer text-sm font-bold uppercase transition-colors duration-300 ${view === "LIST" ? "text-[var(--foreground)]" : "text-gray-400"
              }`}
            style={{
              fontFamily: "inherit",
            }}
          >
            LIST
          </button>
          <span className="text-sm text-[var(--foreground)] opacity-20 select-none">
            |
          </span>
          <button
            onClick={view === "GRID" ? undefined : onToggleView}
            className={`bg-transparent border-none p-0 cursor-pointer text-sm font-bold uppercase transition-colors duration-300 ${view === "GRID" ? "text-[var(--foreground)]" : "text-gray-400"
              }`}
            style={{
              fontFamily: "inherit",
            }}
          >
            GRID
          </button>
        </div>

        <span
          className="hidden md:inline pointer-events-auto text-right text-sm font-bold tracking-normal normal-case text-[var(--foreground)]"
          style={{
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          &copy; 2026 Siddanta Sodari.
        </span>
      </footer>
    </>
  );
}
