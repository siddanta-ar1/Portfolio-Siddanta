# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm start        # Run production build
npm run lint     # ESLint (Next.js core-web-vitals + TypeScript rules)
```

No test suite is configured.

## Environment

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
```

`src/lib/supabase.ts` returns `null` when env vars are missing — the app renders with an empty project list rather than crashing.

The Supabase schema is in `supabase-schema.sql`; run it in the Supabase Dashboard SQL Editor to create the `projects` table, storage bucket, and RLS policies.

## Architecture

### Data flow

`src/app/page.tsx` is a **server component** with `export const revalidate = 60` (ISR). It fetches all projects from Supabase, applies a hardcoded `VIDEO_MAP` (title → Supabase Storage video URL), and handles the **KKhane special case** (one DB row expanded into two synthetic sub-project entries). The transformed list is passed to `HomeClient`.

`src/components/HomeClient.tsx` is the **client-side orchestrator**. It holds all UI state: `theme`, `view` (LIST/GRID), `activeCategory`, `activeIndex`, and the Nepal Time clock. It filters projects by category, deduplicates by `video_url || image_url`, and distributes data down to leaf components. The "ALL" category filter hardcodes which categories/titles appear (STARTUPS, FULL-STACK, and specific QUANTUM/COMMUNITY/AWARDS entries).

### GSAP carousel (`ImageCarousel.tsx`)

The filmstrip carousel stores all animation state in refs (`liveXRef`, `targetXRef`, `targetIndexRef`) and runs a RAF lerp loop via GSAP — **zero React re-renders during motion**. Only `slideWidth`, `maxImgHeight`, `slideGap`, `padLeft`, and `ready` are React state; layout dimensions are mirrored into refs (`swRef`, `sgRef`, `plRef`, `pcRef`) so event handlers and the RAF callback can read them without closing over stale values.

### Admin panel (`/admin`)

`src/app/admin/page.tsx` is a client component with its own Supabase client instance (not the server one from `src/lib/supabase.ts`). Access is gated by `NEXT_PUBLIC_ADMIN_PASSWORD`. It provides full CRUD for projects and image upload to Supabase Storage.

### Design system

All theming lives in `src/app/globals.css` as CSS variables. Theme switching sets `data-theme="dark"` on `<html>` via `HomeClient`. The micro-typography convention throughout the UI is: monospace font, 9–10px, 700 weight, uppercase, ~0.14em letter-spacing.

### Placeholder images

`src/lib/placeholder.ts` provides category-aware Unsplash fallback images. Use `getImageUrl(project.image_url, project.category)` for `src` and `handleImageError(project.category)` for `onError` on any `<img>` tag.

### Categories

Valid category strings (used in the DB and `CATEGORIES` constant in admin): `STARTUPS`, `FULL-STACK`, `QUANTUM`, `COMMUNITY`, `RESEARCH`, `AWARDS`, `CERTIFICATIONS`, `CONTRIBUTIONS`, `EXPERIENCE`, `ABOUT`.
