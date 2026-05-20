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
      <div className="flex items-center justify-between w-full px-5 sm:px-8 md:px-14 lg:px-20 flex-shrink-0 safe-top">
        {/* Left: Logo + Time */}
        <div className="flex items-center gap-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white select-none font-[family-name:var(--font-geist-sans)]">
            SIDDANTA
          </span>
          <span className="hidden md:inline text-[10px] font-medium text-white/45 font-[family-name:var(--font-geist-mono)] tracking-[0.1em] uppercase">
            {time}
          </span>
        </div>

        {/* Center: Theme Toggle */}
        <div className="hidden md:flex items-center gap-2 font-[family-name:var(--font-geist-mono)]">
          <button
            onClick={theme === "light" ? undefined : onToggleTheme}
            className={`bg-transparent border-none cursor-pointer p-0 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
              theme === "light" ? "text-white" : "text-white/30 hover:text-white/55"
            }`}
          >
            LIGHT
          </button>
          <span className="text-[10px] text-white/20 select-none font-light">|</span>
          <button
            onClick={theme === "dark" ? undefined : onToggleTheme}
            className={`bg-transparent border-none cursor-pointer p-0 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-white/30 hover:text-white/55"
            }`}
          >
            DARK
          </button>
        </div>

        {/* Right: Email + Close */}
        <div className="flex items-center gap-5">
          <a
            href="mailto:siddanta.sodari@proton.me"
            className="hidden lg:inline text-[10px] font-medium tracking-[0.08em] uppercase text-white/45 hover:text-white transition-colors duration-300 no-underline font-[family-name:var(--font-geist-mono)]"
          >
            siddanta.sodari@proton.me
          </a>
          <button
            className="flex items-center gap-2.5 bg-transparent border-none text-white cursor-pointer p-0 group font-[family-name:var(--font-geist-mono)]"
            onClick={onClose}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]">CLOSE</span>
            <span className="w-3 h-3 rounded-full border-[1.5px] border-white transition-all duration-300 group-hover:bg-white group-hover:scale-110 inline-block" />
          </button>
        </div>
      </div>

      {/* ── Navigation — Centered ── */}
      <nav className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16 py-2 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-y-4 sm:gap-x-8 sm:gap-y-5 md:gap-x-10 max-w-[1000px] w-full">
          {menuItems.map((item) => {
            const isActive = activeCategory === item.label;
            return (
              <button
                key={item.label}
                onClick={() => handleCategoryClick(item.label)}
                className={`
                  bg-transparent border-none text-white cursor-pointer
                  px-2 py-1 sm:p-0 flex items-center gap-1.5 whitespace-nowrap
                  transition-all duration-300
                  ${isActive ? "opacity-100" : "opacity-55 hover:opacity-90"}
                `}
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "clamp(0.82rem, 3.5vw, 1.1rem)",
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

      {/* ── Collaborate Section ── */}
      <div className="flex-shrink-0 mx-5 sm:mx-8 md:mx-14 lg:mx-20 mb-[4vh] sm:mb-[6vh] flex flex-col items-center justify-center text-center">
        <h3
          className="text-white text-[13px] sm:text-[15px] md:text-lg font-bold mb-2 sm:mb-3 uppercase tracking-[0.22em] sm:tracking-[0.25em]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          Let&apos;s Collaborate
        </h3>
        <p className="text-white/40 text-[12px] sm:text-[13px] md:text-[14px] mb-4 sm:mb-6 max-w-sm sm:max-w-lg font-light leading-relaxed tracking-wide">
          Available for freelance app &amp; web development, research efforts, and creative collaborations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none sm:w-auto font-[family-name:var(--font-geist-mono)]">
          <a
            href="https://wa.me/9765662427?text=Hi%20Siddanta!%20I'm%20reaching%20out%20to%20discuss%20a%20potential%20collaboration%20/project.%20Let%20me%20know%20when%20you're%20free%20to%20chat!"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-center gap-3 px-6 sm:px-7 py-2.5 sm:py-3 w-full sm:w-auto rounded-full border border-transparent !bg-white hover:!bg-transparent hover:border-white !text-black hover:!text-white transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
          </a>
          <a
            href="mailto:siddanta.sodari@proton.me?subject=Inquiry:%20Freelance%20App/Web%20Dev%20&%20Research&body=Hi%20Siddanta,%0A%0AI'm%20interested%20in%20discussing%20a%20collaboration%20or%20freelance%20opportunity%20with%20you.%0A%0AProject%20Details:%0A...%0A%0ABest%20regards,"
            className="group flex items-center justify-center gap-3 px-6 sm:px-7 py-2.5 sm:py-3 w-full sm:w-auto rounded-full border border-white/25 hover:border-transparent !bg-transparent hover:!bg-white !text-white hover:!text-black transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Email Me</span>
          </a>
        </div>
      </div>

      {/* ── Menu Footer — Thin divider line, legal left, socials + copyright right ── */}
      <div className="flex-shrink-0 border-t border-white/[0.12] mx-4 sm:mx-8 md:mx-14 lg:mx-20">
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 sm:py-4"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}
        >
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
