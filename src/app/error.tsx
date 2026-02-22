"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        background: "var(--background, #f5f5f0)",
        color: "var(--foreground, #000)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        gap: "24px",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          fontWeight: 700,
          fontStyle: "italic",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Something went wrong
      </h1>

      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.85rem",
          letterSpacing: "0.04em",
          opacity: 0.6,
          maxWidth: "500px",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {error.message || "Failed to load project data. Please try again."}
      </p>

      <button
        onClick={reset}
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 500,
          background: "var(--foreground, #000)",
          color: "var(--background, #f5f5f0)",
          border: "none",
          cursor: "pointer",
          transition: "opacity 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.opacity = "0.7";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.opacity = "1";
        }}
      >
        Try Again
      </button>
    </main>
  );
}
