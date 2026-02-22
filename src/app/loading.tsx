export default function Loading() {
  return (
    <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
        <span
          className="font-mono text-xs tracking-widest uppercase opacity-50"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Loading
        </span>
      </div>
    </main>
  );
}
