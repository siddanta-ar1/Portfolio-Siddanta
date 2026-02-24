export default function Loading() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 z-100 flex items-center justify-between w-full px-8 py-6 pointer-events-none">
        <span className="text-sm font-bold uppercase tracking-[0.14em] text-foreground select-none">
          SIDDANTA
        </span>
        <div className="h-4 w-24 bg-foreground opacity-10 animate-pulse rounded" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-foreground opacity-10 animate-pulse rounded" />
          <span className="text-sm text-foreground opacity-20 select-none">|</span>
          <div className="h-4 w-12 bg-foreground opacity-10 animate-pulse rounded" />
        </div>
        <div className="h-4 w-48 bg-foreground opacity-10 animate-pulse rounded hidden md:block" />
        <div className="flex items-center gap-2.5">
          <div className="h-4 w-10 bg-foreground opacity-10 animate-pulse rounded" />
          <span className="text-sm leading-none text-foreground">○</span>
        </div>
      </header>

      {/* Main Content Skeleton (Carousel placeholder) */}
      <div className="flex items-center justify-center w-full h-full flex-col gap-6">
        <div className="w-[80vw] md:w-[60vw] h-[50vh] bg-foreground opacity-5 animate-pulse rounded-lg" />
        <div className="h-4 w-32 bg-foreground opacity-10 animate-pulse rounded" />
      </div>

      {/* Footer Skeleton */}
      <footer className="fixed bottom-0 left-0 z-100 flex items-center justify-between w-full px-8 py-6 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 bg-foreground opacity-10 animate-pulse rounded" />
          <div className="h-4 w-4 bg-foreground opacity-10 animate-pulse rounded" />
          <div className="h-4 w-4 bg-foreground opacity-10 animate-pulse rounded" />
          <div className="h-4 w-4 bg-foreground opacity-10 animate-pulse rounded" />
        </div>

        <div className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)]">
          <div className="h-4 w-10 bg-foreground opacity-10 animate-pulse rounded" />
          <span className="text-sm text-foreground opacity-20 select-none">|</span>
          <div className="h-4 w-10 bg-foreground opacity-10 animate-pulse rounded" />
        </div>

        <div className="h-4 w-40 bg-foreground opacity-10 animate-pulse rounded hidden md:block" />
      </footer>
    </main>
  );
}
