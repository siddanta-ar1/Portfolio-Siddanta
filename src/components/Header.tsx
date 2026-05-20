"use client";

interface HeaderProps {
  theme: "light" | "dark";
  time: string;
  onToggleTheme: () => void;
  onMenuOpen: () => void;
}

export default function Header({ theme, time, onToggleTheme, onMenuOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 z-[100] flex items-center justify-between w-full px-4 sm:px-8 pointer-events-none safe-top">
      {/* Logo */}
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--foreground)] select-none pointer-events-auto font-[family-name:var(--font-geist-sans)]">
        SIDDANTA
      </span>

      {/* Clock — hidden on mobile */}
      <span className="hidden md:inline text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--foreground)] opacity-45 pointer-events-auto font-[family-name:var(--font-geist-mono)]">
        {time}
      </span>

      {/* Theme toggle — hidden on mobile, accessible via Menu overlay */}
      <div className="hidden md:flex items-center gap-2 pointer-events-auto font-[family-name:var(--font-geist-mono)]">
        <button
          onClick={theme === "light" ? undefined : onToggleTheme}
          className={`bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.14em] cursor-pointer p-0 transition-colors duration-300 ${
            theme === "light" ? "text-[var(--foreground)]" : "text-[var(--muted)]"
          }`}
        >
          LIGHT
        </button>
        <span className="text-[10px] text-[var(--muted)] opacity-40 select-none font-light">|</span>
        <button
          onClick={theme === "dark" ? undefined : onToggleTheme}
          className={`bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.14em] cursor-pointer p-0 transition-colors duration-300 ${
            theme === "dark" ? "text-[var(--foreground)]" : "text-[var(--muted)]"
          }`}
        >
          DARK
        </button>
      </div>

      {/* Email — hidden on mobile */}
      <a
        href="mailto:siddanta.sodari@proton.me"
        className="hidden md:inline text-[10px] font-medium tracking-[0.08em] uppercase text-[var(--foreground)] no-underline opacity-45 transition-opacity duration-300 hover:opacity-100 pointer-events-auto font-[family-name:var(--font-geist-mono)]"
      >
        siddanta.sodari@proton.me
      </a>

      {/* MENU — always visible */}
      <button
        className="flex items-center gap-2.5 bg-transparent border-none text-[var(--foreground)] text-[10px] font-bold uppercase tracking-[0.14em] cursor-pointer p-0 transition-opacity duration-300 hover:opacity-50 font-[family-name:var(--font-geist-mono)] pointer-events-auto"
        onClick={onMenuOpen}
      >
        <span>MENU</span>
        <span className="w-3 h-3 rounded-full border-[1.5px] border-[var(--foreground)] transition-all duration-300 group-hover:bg-[var(--foreground)] group-hover:scale-110 inline-block" />
      </button>
    </header>
  );
}
