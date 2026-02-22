"use client";

import { useEffect, useRef } from "react";
import { categories } from "@/data/data";

function InstagramIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function XIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  time: string;
}

// Categories that show the "+" indicator (ones with sub-items / content)
const EXPANDABLE_CATEGORIES = new Set([
  "STARTUPS",
  "FULL-STACK",
  "QUANTUM",
  "COMMUNITY",
  "RESEARCH",
  "AWARDS",
  "CERTIFICATIONS",
  "CONTRIBUTIONS",
]);

export default function MenuOverlay({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  theme,
  onToggleTheme,
  time,
}: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onClose();
  };

  const menuItems = categories
    .filter((c) => c !== "ALL")
    .map((cat) => ({
      label: cat,
      hasPlus: EXPANDABLE_CATEGORIES.has(cat),
    }));

  return (
    <div
      ref={overlayRef}
      className={`
        fixed inset-0 z-[200]
        bg-black/90 backdrop-blur-md
        flex flex-col
        transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* ── Menu Header Bar ── */}
      <div className="flex items-center justify-between w-full px-8 md:px-14 lg:px-20 py-6 flex-shrink-0">
        {/* Left: Logo + Time */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold uppercase tracking-[0.14em] text-white select-none">
            Siddanta
          </span>
          <span className="hidden md:inline text-sm font-bold text-white/50 font-[family-name:var(--font-geist-mono)]">
            {time}
          </span>
        </div>

        {/* Center: Theme Toggle */}
        <div className="hidden md:flex items-center gap-2 font-[family-name:var(--font-geist-mono)]">
          <button
            onClick={theme === "light" ? undefined : onToggleTheme}
            className={`
              bg-transparent border-none cursor-pointer p-0 text-sm font-bold uppercase
              transition-colors duration-300
              ${theme === "light" ? "text-white" : "text-white/30 hover:text-white/50"}
            `}
            style={{ fontFamily: "inherit" }}
          >
            LIGHT
          </button>
          <span className="text-sm text-white/20 select-none">|</span>
          <button
            onClick={theme === "dark" ? undefined : onToggleTheme}
            className={`
              bg-transparent border-none cursor-pointer p-0 text-sm font-bold uppercase
              transition-colors duration-300
              ${theme === "dark" ? "text-white" : "text-white/30 hover:text-white/50"}
            `}
            style={{ fontFamily: "inherit" }}
          >
            DARK
          </button>
        </div>

        {/* Right: Email + Close */}
        <div className="flex items-center gap-6">
          <a
            href="mailto:siddanta.sodari@proton.me"
            className="hidden lg:inline text-sm font-bold text-white hover:opacity-60 transition-opacity duration-300 no-underline font-[family-name:var(--font-geist-mono)]"
          >
            siddanta.sodari@proton.me
          </a>
          <button
            className="flex items-center gap-2.5 bg-transparent border-none text-white cursor-pointer p-0 group font-[family-name:var(--font-geist-mono)]"
            onClick={onClose}
          >
            <span className="text-sm font-bold uppercase">CLOSE</span>
            <span className="w-3 h-3 rounded-full border-[1.5px] border-white transition-all duration-300 group-hover:bg-white group-hover:scale-110" />
          </button>
        </div>
      </div>

      {/* ── Navigation — Centered ── */}
      <nav className="flex-1 flex items-center justify-center px-8 md:px-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-10 md:gap-y-5 max-w-[1000px]">
          {menuItems.map((item) => {
            const isActive = activeCategory === item.label;
            return (
              <button
                key={item.label}
                onClick={() => handleCategoryClick(item.label)}
                className={`
                  bg-transparent border-none text-white cursor-pointer
                  p-0 flex items-center gap-1.5 whitespace-nowrap
                  transition-all duration-300
                  ${isActive ? "opacity-100" : "opacity-60 hover:opacity-90"}
                `}
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "clamp(0.85rem, 1.5vw, 1.15rem)",
                  fontWeight: 400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {item.label.replace("-", " ")}
                {item.hasPlus && (
                  <span className="text-[0.55em] opacity-40 font-light relative -top-px">
                    +
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Menu Footer — Thin divider line, legal left, socials + copyright right ── */}
      <div className="flex-shrink-0 border-t border-white/[0.12] mx-8 md:mx-14 lg:mx-20">
        <div className="flex items-center justify-between py-5">
          {/* Left: Legal */}
          <span className="text-xs font-bold text-white/25 font-[family-name:var(--font-geist-mono)]">
            Legal Disclaimer
          </span>

          {/* Center: Socials */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-white/35 hover:text-white transition-colors duration-300 flex items-center"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="text-white/35 hover:text-white transition-colors duration-300 flex items-center"
            >
              <XIcon />
            </a>
            <a
              href="https://github.com/siddanta-ar1"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-white/35 hover:text-white transition-colors duration-300 flex items-center"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://linkedin.com/in/siddanta-sodari-08596a335"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-white/35 hover:text-white transition-colors duration-300 flex items-center"
            >
              <LinkedInIcon />
            </a>
          </div>

          {/* Right: Copyright */}
          <span className="text-xs font-bold text-white/25 font-[family-name:var(--font-geist-mono)]">
            &copy; {new Date().getFullYear()} Siddanta Sodari.
          </span>
        </div>
      </div>
    </div>
  );
}
