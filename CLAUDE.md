# Reglas de Comportamiento (Caveman Mode)
Tu objetivo principal es la eficiencia absoluta de tokens. 
- NO uses saludos, despedidas, ni cortesías.
- NO des explicaciones de lo que vas a hacer ni resúmenes de lo que hiciste.
- Responde EXCLUSIVAMENTE con los comandos a ejecutar o el código exacto a modificar.
- Sé extremadamente breve, directo y robótico. Menos palabras es mejor.
# Vitola — Gestor de Inventario de Puros Premium

Aplicación web de gestión integral para un inventario híbrido de puros, con catálogo visual de lujo y sincronización con Google Sheets.

## Commands

- `pnpm dev` — Start development server (http://localhost:3000)
- `pnpm build` — Production build
- `pnpm lint` — ESLint
- `pnpm test` — Unit + integration tests
- `pnpm test:e2e` — E2E tests (Playwright)

## Tech Stack

Next.js 15 (App Router) + TypeScript + TailwindCSS + Google Sheets API + Cloudinary + Vercel

## Architecture

### Directory Structure

- `src/app/` — App Router pages (catalogo/, admin/, api/)
- `src/components/` — UI components (ui/, catalogo/, admin/)
- `src/lib/` — Business logic (sheets.ts, cloudinary.ts, auth.ts, calculations.ts, filters.ts)
- `src/types/` — Shared TypeScript interfaces (Puro, Venta, FilterParams, etc)
- `public/` — Static assets

### Data Flow

1. **Server Components by default** — Pages fetch data from Google Sheets directly via `src/lib/sheets.ts`
2. **Client Components minimal** — Only SearchBar, FilterBar, forms use "use client"
3. **API Routes** — `/api/puros`, `/api/auth/login` handle CRUD and auth
4. **Caching** — Next.js caches `/api/puros` responses 60s, admin can revalidate
5. **Images** → Cloudinary (auto-optimized, CDN, no server overhead)
6. **Auth** → JWT in httpOnly cookie, middleware protects `/admin/*`

### Key Patterns

- **Server Components**: All pages, dashboards, lists
- **Client Components**: Forms, filters, interactive features
- **API routes with auth middleware**: All mutations require JWT
- **No external state library** — URL params for filters, cookies for auth, server-side caching
- **Image uploads**: File input → Cloudinary widget → URL → Google Sheets

## Code Organization Rules

1. **One component per file**, max 300 lines. Extract sub-components if longer.
2. **Path alias:** Always use `@/` for imports (e.g., `@/lib/sheets.ts`, `@/types/index.ts`).
3. **No barrel exports** — import directly from source: `import { Puro } from '@/types/index.ts'`
4. **Server Components by default**, add "use client" ONLY for interactivity (forms, filters, client-side state).
5. **Colocate related files** — page-specific components live next to their page folder.
6. **No commented-out code** — delete or fix, don't comment.

## Design System

### Colors (Maderas Oscuras + Lujo)

- Primary: `#2C1810` (madera oscura profunda) — buttons, links, accents
- Secondary: `#8B6F47` (latón/oro oscuro) — secondary actions, highlights
- Background: `#0F0F0F` (casi negro) — page background
- Surface: `#1A1A1A` (dark surface) — cards, panels
- Text: `#F0E6D2` (crema/beige claro) — main text
- Accent (Success): `#10B981` — confirmations
- Destructive: `#EF4444` — errors, deletes
- Warning: `#F59E0B` — alerts (hitos de añejamiento)

### Typography

- **Headings (H1-H4):** Syne (serif, bold) → 32px, 24px, 20px, 18px
- **Body:** Inter → 16px, weight 400
- **Labels:** Inter → 14px, weight 500
- **Small:** Inter → 12px, weight 400

Import in `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
Style
Border radius: 6px (default), 12px (cards)
Shadows: subtle (0 1px 2px rgba(0,0,0,0.3)) to medium (0 4px 12px)
Spacing base: 4px → scale 4, 8, 12, 16, 24, 32, 48, 64
Aesthetic: minimalism de lujo, whitespace amplios, tipografía serif elegante, transiciones 200ms
No rounded corners excesivos, bordes sutiles, hover states con color shift sutil
Environment Variables
Variable	Descripción
GOOGLE_PROJECT_ID	Google Cloud project
GOOGLE_PRIVATE_KEY	Service account key
GOOGLE_CLIENT_EMAIL	Service account email
GOOGLE_SHEETS_ID	Sheet ID from URL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME	Cloudinary account
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET	Unsigned upload preset
CLOUDINARY_SECRET	Cloudinary API secret
ADMIN_PASSWORD	Admin login password (strong!)
JWT_SECRET	Random string for JWT signing
Reglas No Negociables
TypeScript strict mode — all files .ts or .tsx, no any types
Google Sheets is the single source of truth — no local database, all data syncs through sheets
No external state libraries — use Next.js Server Components + URL params + cookies only
All image uploads go through Cloudinary — never store images locally
Admin routes require JWT auth — middleware in src/middleware.ts enforces this
Catálogo is 100% public — no auth required for /catalogo/*
One commit = one meaningful feature — no half-finished implementations
No commented-out code — delete or fix, always
Responsive mobile-first — all pages work on phones, tablets, desktop
Performance first — images optimized, API responses cached, no N+1 queries
