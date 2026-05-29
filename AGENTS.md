<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GrowthPulse AI — Project Guide

Marketing landing page for **GrowthPulse AI** (a fictional B2B SaaS product). Built as a take-home assessment for Azarian Growth Agency. The site must capture leads, track analytics, run an A/B test, and deploy on Vercel.

Brief: `docs/AGA_Vibe_Coder_Assessment_Brief.pdf` (the product definition is in section 2). Design spec: `docs/superpowers/specs/2026-05-28-growthpulse-landing-page-design.md`. Implementation plan: `~/.claude/plans/pure-beaming-hopcroft.md`.

## Stack

- **Next.js 16** (App Router, SSR) — App Router lives at root `app/`, NOT `src/app/`
- **TypeScript** strict mode
- **Tailwind CSS v4** with **shadcn/ui** components (in root `components/ui/`)
- **Supabase** (Postgres) — server-only client, service role key
- **PostHog** — analytics + feature flags (A/B testing in one SDK)
- **Vitest** for unit tests
- **Zod** for validation

Note: `package.json` pins Next 16.2.6, React 19, Tailwind v4. shadcn was initialized with v4 oklch tokens in `app/globals.css`, not the v3 hsl syntax — match this when adding colors.

## Architecture

Feature-based clean architecture under `src/`. Shared infra clients live in `src/lib/`. Each feature owns its own `domain/` and `data/` layers. The presentation layer (`app/` + `src/components/`) imports from features via Services — never touches Supabase or PostHog directly.

```
app/                                # Next.js App Router (NOT src/app)
  layout.tsx                        # Metadata, PostHogProvider, UTMCapture
  page.tsx                          # SSR landing page
  thank-you/page.tsx
middleware.ts                       # visitor_id cookie
src/
  features/
    leads/
      domain/
        models.ts                   # Lead, UTMData, Zod schema, enums
        repositories.ts             # ILeadRepository interface
      data/
        lead-repository.ts          # Supabase impl of ILeadRepository
        lead-service.ts             # LeadService — orchestrates lead creation
    analytics/
      data/
        analytics-service.ts        # Server-side PostHog event reporting
  lib/
    supabase.ts                     # Server-only Supabase singleton
    posthog.ts                      # PostHog Node client
    ab.ts                           # getHeroVariant + heroHeadlines
    actions.ts                      # submitLead Server Action
  components/
    PostHogProvider.tsx             # Browser SDK wrapper
    UTMCapture.tsx                  # Reads ?utm_* → cookie
    sections/                       # Hero, Features, SocialProof, Pricing, CTA
components/ui/                      # shadcn primitives (button, input, select, card, badge)
lib/utils.ts                        # shadcn's cn() helper
```

### Layer Rules

- **Domain** = pure TS, zero framework deps. Types + interfaces + Zod schemas only.
- **Data** = implements domain interfaces. Wraps infra clients from `src/lib/`. Services orchestrate; Repositories persist.
- **Presentation** = `app/` + `src/components/`. Calls Services via Server Actions in `src/lib/actions.ts`. Never imports Supabase/PostHog directly.

When adding a new persistent thing: create a model + repository interface in `domain/`, implement the repository in `data/`, expose a service in `data/`, and call the service from a Server Action.

## Path Aliases

| Alias | Maps to |
|---|---|
| `@/*` | `./*` (project root) — used by shadcn (`@/components/ui/...`, `@/lib/utils`) |
| `@features/*` | `./src/features/*` |
| `@components/*` | `./src/components/*` |
| `@lib/*` | `./src/lib/*` |

Mirror these in `vitest.config.ts` if you add new ones.

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm test         # vitest run
npm run start    # serve production build locally
```

## Environment Variables

Required in `.env.local` (and Vercel). Never expose `SUPABASE_SERVICE_ROLE_KEY` or `POSTHOG_API_KEY` to the browser.

```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY        # server-only
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
POSTHOG_API_KEY                  # server-only
```

## Database

Single `leads` table in Supabase (RLS disabled — server-only access via service role):

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company_size text not null,
  marketing_team_size text not null,
  utm jsonb default '{}'::jsonb,
  ab_variant text,
  created_at timestamptz default now()
);
```

## A/B Testing

PostHog feature flag `hero-headline` resolves server-side in `app/page.tsx` via `getHeroVariant(visitorId)`. Variant is passed as a prop into the Hero and persisted on the lead row at submission. Two variants:

- **control:** "Your marketing stack, diagnosed in minutes."
- **variant-b:** "Find out exactly where your marketing is bleeding money."

## Custom Events

Tracked in PostHog (3+ as required by the brief):

- `cta_clicked` (props: `location: 'hero' | 'final'`)
- `form_started` (fired on first form field focus)
- `form_submitted` (server-side via `AnalyticsService`, includes `ab_variant`, `utm_source`)

## UTM Capture

`middleware.ts` sets a `visitor_id` cookie on first visit. `UTMCapture.tsx` (client) reads `?utm_*` params and writes them to a `utm_data` cookie. `submitLead` reads both cookies server-side and stores them on the lead.

## Deployment

Vercel. Use `vercel:deploy` skill or `vercel --prod`. Make sure all 5 env vars are configured in Vercel dashboard before deploying.

## Working in this codebase

- Follow the feature-based structure — don't add data access in `app/` or components
- Match existing shadcn patterns when adding UI (`@/components/ui/<name>`)
- Keep files small and focused — split when they grow past one clear responsibility
- Brand tone: confident, data-driven, slightly provocative — "the honest friend who reads your dashboards"
- No stock photography of people — use abstract visuals, gradients, data viz only
- Pricing tiers, features list, testimonials, and tagline are pinned by the brief — don't paraphrase
