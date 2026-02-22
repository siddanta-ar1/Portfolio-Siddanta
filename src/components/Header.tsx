"use client";

import { useEffect, useState, useRef } from "react";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onMenuOpen: () => void;
}

export default function Header({
  theme,
  onToggleTheme,
  onMenuOpen,
}: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  return (
    <header className="fixed top-0 left-0 z-100 flex items-center justify-between w-full px-8 py-6 pointer-events-none">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--foreground)] select-none pointer-events-auto whitespace-nowrap">
        SIDDANTA
      </span>
      <span className="text-sm font-bold text-[var(--foreground)] opacity-50 font-[family-name:var(--font-geist-mono)] pointer-events-auto whitespace-nowrap">
        {time}
      </span>
      <div className="flex items-center gap-2 pointer-events-auto font-[family-name:var(--font-geist-mono)]">
        <button
          onClick={theme === "light" ? undefined : onToggleTheme}
          className={`bg-transparent border-none text-sm font-bold uppercase cursor-pointer p-0 transition-colors duration-300 ${theme === "light" ? "text-[var(--foreground)]" : "text-gray-400"
            }`}
        >
          LIGHT
        </button>
        <span className="text-sm text-[var(--foreground)] opacity-20 select-none">
          |
        </span>
        <button
          onClick={theme === "dark" ? undefined : onToggleTheme}
          className={`bg-transparent border-none text-sm font-bold uppercase cursor-pointer p-0 transition-colors duration-300 ${theme === "dark" ? "text-[var(--foreground)]" : "text-gray-400"
            }`}
        >
          DARK
        </button>
      </div>
      <a
        href="mailto:siddanta.sodari@proton.me"
        className="text-sm font-bold lowercase tracking-normal text-[var(--foreground)] no-underline transition-opacity duration-300 hover:opacity-60 font-[family-name:var(--font-geist-mono)] pointer-events-auto whitespace-nowrap"
      >
        siddanta.sodari@proton.me
      </a>
      <button
        className="flex items-center gap-2.5 bg-transparent border-none text-[var(--foreground)] text-sm font-bold uppercase cursor-pointer p-0 transition-opacity duration-300 hover:opacity-50 font-[family-name:var(--font-geist-mono)] pointer-events-auto whitespace-nowrap"
        onClick={onMenuOpen}
      >
        <span>MENU</span>
        <span className="text-sm leading-none">○</span>
      </button>
    </header>
  );
}
