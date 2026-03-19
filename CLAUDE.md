# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run type-check # TypeScript check without emitting
```

Copy `.env.local.example` → `.env.local` and fill all vars before running.

## Architecture

**Framework:** Next.js 16, App Router, React 19, TypeScript strict, Tailwind CSS v4 (PostCSS plugin — no `tailwind.config.js`).

**Route groups:**
- `app/page.tsx` — Public hero/landing
- `app/(auth)/login/` — 00-Agent auth portal (Supabase email+password)
- `app/(dashboard)/` — Protected routes; `layout.tsx` redirects unauthenticated users to `/login`
  - `/dashboard` — `NodeGrid` bento (6 nodes: n8n, Retell, GHL, Supabase, Square, Claude)
  - `/audit` — `AuditCalculator` revenue leak engine

**Auth:** Supabase SSR via `@supabase/ssr`. Two client factories:
- `lib/supabase-browser.ts` — client components (`createBrowserClient`)
- `lib/supabase-server.ts` — server components/Route Handlers (`createServerClient` with `cookies()`)
- `middleware.ts` — protects `/dashboard/*` and `/audit/*`, refreshes session cookie

**Payment flow** (`lib/square.ts` + `app/api/subscribe/route.ts`):
1. Client tokenizes card with Square Web Payments JS SDK → `sourceId`
2. `POST /api/subscribe` with `{ sourceId }` (session verified server-side)
3. Server: creates Square Customer → Card → Subscription (plan ID from `SQUARE_GHOST_PLAN_ID` env var)
4. Creates GHL contact tagged `GHOST_ARCHITECT`
5. Persists to Supabase `subscriptions` table

**GHL integration** (`lib/ghl.ts`): Location Bearer token auth (`GHL_API_KEY`). API version `2021-07-28`. Functions: `createGhostSubscriber`, `addTagToContact`, `findContactByEmail`. Tag used on signup: `GHOST_ARCHITECT`.

**Design system** (`app/globals.css` — `@theme` block):
- Palette: `--color-obsidian: #010101`, `--color-neon-orange: #fa7002`
- Fonts: `--font-display` = Chakra Petch (headlines), `--font-mono` = JetBrains Mono (all body/data)
- Key utility classes: `.border-lightpipe` (1px white border + neon orange glow), `.glow-orange` (text glow), `.btn-ghost-primary` (the "AUTHORIZE" CTA button pattern)
- Font variables are set in `app/layout.tsx` via `next/font/google` and applied as CSS vars

**ConsoleLog** (`components/ConsoleLog.tsx`): Fixed bottom terminal. Boot sequence runs on mount. Any component can push a log entry by calling the exported `ghostLog(tag, message)` function — it dispatches a `ghost:log` CustomEvent. The `RevenueOdometer` uses `requestAnimationFrame` with easeOutExpo for smooth stabilization.

**AuditCalculator logic** (`components/AuditCalculator.tsx`): Calculates two leak streams from user inputs — missed calls (30% assumed close rate) and failed follow-up (20% close rate). Generates 5 tactical SOPs. No server calls — pure client calculation.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin operations |
| `NEXT_PUBLIC_SQUARE_APP_ID` / `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Square client-side SDK init |
| `SQUARE_ACCESS_TOKEN` | Square server-side API |
| `SQUARE_ENVIRONMENT` | `sandbox` or `production` |
| `SQUARE_GHOST_PLAN_ID` | Square subscription plan variation ID for $49/mo |
| `GHL_API_KEY` / `GHL_LOCATION_ID` | GoHighLevel Location Bearer token |

## Supabase Schema (required)

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text,
  square_customer_id text,
  square_subscription_id text,
  ghl_contact_id text,
  status text default 'active',
  created_at timestamptz default now()
);
```

RLS: Enable and restrict reads/writes to `auth.uid() = user_id`.

## Square Setup

1. Create a subscription plan in Square Dashboard at $49/mo
2. Copy the Plan Variation ID → `SQUARE_GHOST_PLAN_ID` env var
3. Load the Square Web Payments JS SDK in the checkout page: `https://sandbox.web.squarecdn.com/v1/square.js` (sandbox) or `https://web.squarecdn.com/v1/square.js` (production)
4. Initialize with `window.Square.payments(appId, locationId)` using the `NEXT_PUBLIC_*` vars
