# SIDDANTA — Portfolio

Minimal, gallery-style developer portfolio built with Next.js 16, GSAP, and Supabase. Features a cinematic horizontal filmstrip carousel, grid view, category filtering via a frosted-glass menu overlay, and a full admin CMS — all driven by micro-typography and CSS-variable theming.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Features

- **Horizontal Filmstrip Carousel** — GSAP-powered lerp loop with drag/swipe, wheel, keyboard navigation, and center-focus scaling
- **Grid View** — Masonry-style CSS Grid with varied aspect ratios
- **Category Filtering** — Frosted-glass menu overlay with category toggling
- **Light / Dark Theme** — CSS variable system with smooth 0.6s transitions
- **Admin CMS** (`/admin`) — Full CRUD for projects with Supabase Storage image upload
- **ISR** — Incremental Static Regeneration (60s revalidation)
- **Micro-Typography** — 9–10px monospace uppercase tracking throughout

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + vanilla CSS variables |
| Animation | GSAP 3 (RAF lerp loop, no tween-kill jank) |
| Database | Supabase (PostgreSQL + Storage) |
| Fonts | Space Grotesk + JetBrains Mono |

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin CMS (page.tsx + layout.tsx)
│   ├── globals.css     # Design system — all CSS variables & components
│   ├── layout.tsx      # Root layout (fonts, metadata)
│   └── page.tsx        # Server component — fetches projects via ISR
├── components/
│   ├── HomeClient.tsx   # Client orchestrator (theme, view, category state)
│   ├── ImageCarousel.tsx# GSAP filmstrip carousel
│   ├── GridView.tsx     # CSS Grid masonry view
│   ├── Header.tsx       # Fixed micro-text header bar
│   ├── Footer.tsx       # Fixed footer with caption + social links
│   ├── ListView.tsx     # Typographic list view
│   └── MenuOverlay.tsx  # Frosted-glass category navigation
├── lib/
│   ├── supabase.ts      # Server-side Supabase client
│   └── placeholder.ts   # Category-aware fallback images
└── types/
    └── project.ts       # Project & ProjectLink type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/siddanta-ar1/siddanta.git
   cd siddanta
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
   ```

4. **Set up Supabase**

   Run `supabase-schema.sql` in your Supabase Dashboard → SQL Editor. This creates the `projects` table, storage bucket, RLS policies, and seeds sample data.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Admin Panel

Navigate to `/admin` and enter the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`.

- Create, edit, and delete projects
- Upload images to Supabase Storage
- Manage gallery images, video URLs, and external links
- Category and year management

## Design System

The entire UI is driven by CSS variables defined in `globals.css`:

```css
:root {
  --background: #f2f2f0;
  --foreground: #0a0a0a;
  --border-color: rgba(10, 10, 10, 0.08);
  --muted: #9ca3af;
}

[data-theme="dark"] {
  --background: #0c0c0c;
  --foreground: #ebebeb;
}
```

Typography follows a strict micro-text pattern: monospace, 9–10px, 700 weight, uppercase, 0.14em letter-spacing.

## Deployment

```bash
npm run build
npm start
```

Deploy to [Vercel](https://vercel.com) for zero-config Next.js hosting with automatic ISR.

## License

[MIT](./LICENSE) © 2026 Siddanta Sodari
