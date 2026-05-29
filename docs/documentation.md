# GrowthPulse — Project Documentation

Engineering reference for the GrowthPulse AI landing page: API surface, frontend, architecture, local setup, A/B test configuration in PostHog, test accounts, AI tools used during development, and the trade-offs taken.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Supabase · PostHog · Vitest.

## Table of contents

1. [API](#1-api)
2. [Frontend](#2-frontend)
3. [Architecture](#3-architecture)
4. [Project setup](#4-project-setup)
5. [Configuring an A/B test in PostHog](#5-configuring-an-ab-test-in-posthog)
6. [Test accounts (Supabase, PostHog)](#6-test-accounts-supabase-posthog)
7. [AI tools used](#7-ai-tools-used)
8. [Trade-offs](#8-trade-offs)

---

## 1. API

The app has no public REST API. All write paths run through a single **Next.js Server Action**, and analytics is fired server-side from the same action. This keeps the service role key and the PostHog API key off the client.

### `submitLead(formData)` — Server Action

Defined in `src/lib/actions.ts`. Invoked by the lead-capture form via `<form action={submitLead}>`. On success it issues a `redirect('/thank-you')`; on validation failure it returns `{ error: string }` for the client to render.

#### Input (FormData)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Trimmed, 1–100 chars. |
| `email` | string | yes | Validated via Zod `z.string().email()`. |
| `company_size` | enum | yes | `"1-10" \| "11-50" \| "51-200" \| "201-1000" \| "1000+"` |
| `marketing_team_size` | enum | yes | `"solo" \| "2-5" \| "6-15" \| "16+"` |
| `ab_variant` | string | yes | Hidden input, set from the SSR-resolved variant. |

#### Server-only side effects

1. Reads `visitor_id` and `utm_data` cookies.
2. Validates body with `leadSchema` (Zod).
3. Calls `LeadService.createLead()` → persists into the Supabase `leads` table.
4. Calls `AnalyticsService.trackLeadCaptured()` → fires `lead_captured` on PostHog (server-side) with the captured UTM + variant.
5. Redirects to `/thank-you`.

#### Responses

| Case | Behaviour |
|---|---|
| Valid input | `redirect('/thank-you')` (HTTP 303 by Next). |
| Invalid input | Returns `{ error: "<field>: <message>" }`. |
| Analytics failure | Logged, swallowed — lead is still persisted and redirect proceeds. |
| DB failure | Throws — Next renders the error boundary. |

> For the full conversion event catalogue (client and server PostHog events), see [tracking-plan.md](tracking-plan.md).

---

## 2. Frontend

Server-rendered landing page composed of section components. Tailwind v4 with shadcn/ui primitives. PostHog runs in the browser for funnel/section/CTA events; lead persistence and the `lead_captured` event run server-side.

### Pages

| Route | File | Behaviour |
|---|---|---|
| `/` | `app/page.tsx` | SSR landing page. Resolves the A/B variant via `getHeroVariant(visitorId)` and passes it to `Hero` and the form's hidden input. |
| `/thank-you` | `app/thank-you/page.tsx` | Conversion confirmation. Fires `thank_you_viewed`. |

### Sections

Each section is an isolated component in `src/components/sections/`:

- `Hero` — Headline (A/B), subhead, primary + secondary CTA.
- `Features` — Six product capabilities.
- `SocialProof` — Testimonials and brand logos.
- `Pricing` — Three tiers (Starter / Growth / Scale).
- `CTA` — Final form, posts to the `submitLead` Server Action.

### Cross-cutting client components

- `PostHogProvider` — Initializes the browser SDK. Registers super-properties (`ab_variant`, UTM keys).
- `UTMCapture` — Reads `?utm_*` on first load and writes them to the `utm_data` cookie.
- `AnalyticsBootstrap` — Fires `experiment_exposed` once per pageview.

### Design tokens

Tailwind v4 with the shadcn oklch token set defined in `app/globals.css`. Use shadcn primitives from `components/ui/` (`button`, `input`, `select`, `card`, `badge`) instead of bare HTML. Brand tone is "confident, data-driven, slightly provocative" — no stock photography of people; rely on gradients and data viz only.

---

## 3. Architecture

Feature-based clean architecture. The presentation layer never touches Supabase or PostHog directly — it goes through a Service, which goes through a Repository.

### Folder layout

```
app/                                Next.js App Router (NOT src/app)
  layout.tsx                        Metadata, PostHogProvider, UTMCapture
  page.tsx                          SSR landing page
  thank-you/page.tsx
middleware.ts                       Sets the visitor_id cookie
src/
  features/
    leads/
      domain/
        models.ts                   Lead, UTMData, Zod schema, enums
        repositories.ts             ILeadRepository interface
      data/
        lead-repository.ts          Supabase impl of ILeadRepository
        lead-service.ts             LeadService — orchestrates lead creation
    analytics/
      data/
        analytics-service.ts        Server-side PostHog event reporting
  lib/
    supabase.ts                     Server-only Supabase singleton
    posthog.ts                      PostHog Node client
    ab.ts                           getHeroVariant + heroHeadlines
    actions.ts                      submitLead Server Action
  components/
    PostHogProvider.tsx             Browser SDK wrapper
    UTMCapture.tsx                  Reads ?utm_* → cookie
    sections/                       Hero, Features, SocialProof, Pricing, CTA
components/ui/                      shadcn primitives
```

### Layer rules

| Layer | May depend on | Forbidden |
|---|---|---|
| Domain (`features/*/domain`) | Standard library, `zod` | Framework imports, infrastructure clients. |
| Data (`features/*/data`) | Domain, `src/lib/*` infra singletons | React, Next, browser-only globals. |
| Presentation (`app/`, `src/components/`) | Services via Server Actions in `src/lib/actions.ts` | Direct Supabase / PostHog imports. |

### Request flow — lead submission

1. User submits the form. Browser POSTs FormData to the Server Action.
2. `submitLead` validates the payload with Zod.
3. `LeadService.createLead()` → `LeadRepository.insert()` → Supabase.
4. `AnalyticsService.trackLeadCaptured()` → PostHog server SDK.
5. `redirect('/thank-you')`.

### Database

Single table, RLS disabled, write access via the service role key.

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

### Path aliases

| Alias | Maps to |
|---|---|
| `@/*` | `./*` (project root) — shadcn convention |
| `@features/*` | `./src/features/*` |
| `@components/*` | `./src/components/*` |
| `@lib/*` | `./src/lib/*` |

---

## 4. Project setup

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ (project uses `package-lock.json`)
- A Supabase project (free tier is fine)
- A PostHog Cloud project (free tier is fine)

### 1. Clone and install

```bash
git clone <repo-url>
cd growthpulse
npm install
```

### 2. Create the `leads` table in Supabase

In the Supabase SQL editor, run the SQL from the Architecture section above. Confirm that **RLS is disabled** on the `leads` table (server-only writes use the service role key).

### 3. Environment variables

Create `.env.local` at the project root with all five values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>       # server-only, never expose
NEXT_PUBLIC_POSTHOG_KEY=phc_<project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  # or eu.i.posthog.com
POSTHOG_API_KEY=phx_<personal-api-key>             # server-only
```

> ⚠️ Never ship the `SUPABASE_SERVICE_ROLE_KEY` or `POSTHOG_API_KEY` to the browser. Anything prefixed `NEXT_PUBLIC_` is inlined into the client bundle — keep server-only keys un-prefixed.

### 4. Run

```bash
npm run dev      # starts the dev server at http://localhost:3000
npm test         # runs the Vitest suite
npm run build    # production build
npm run start    # serves the production build locally
```

### 5. Deploy to Vercel

1. Import the repository into Vercel.
2. In *Project Settings → Environment Variables*, add the same five vars for the `Production` and `Preview` scopes.
3. Trigger a deploy (push to `main` or use the `vercel:deploy` skill / `vercel --prod`).

---

## 5. Configuring an A/B test in PostHog

The hero headline test is resolved server-side at request time and persisted on the lead row at submission. Setting up a new experiment requires both a PostHog flag and a code wiring in `src/lib/ab.ts`.

### Existing experiment

| Field | Value |
|---|---|
| Flag key | `hero-headline` |
| Type | Multivariate |
| Variants | `control` (50%), `variant-b` (50%) |
| Copy | **control:** "Your marketing stack, diagnosed in minutes."<br/>**variant-b:** "Find out exactly where your marketing is bleeding money." |
| Distinct ID | `visitor_id` cookie (set by `middleware.ts`) |

### Step-by-step: setting up the flag in PostHog

1. In the PostHog dashboard, go to *Feature flags → New feature flag*.
2. Fill in the key field — for this project it is `hero-headline`. The key must match the string passed to `getHeroVariant()` in `src/lib/ab.ts`.
3. Set *Served value* to **Multiple variants with rollout percentages (Multivariate)**.
4. Add two variants:
   - `control` — rollout 50%
   - `variant-b` — rollout 50%
5. Under *Release conditions*, leave the default ("100% of all users"). Save.
6. Go to *Experiments → New experiment*, link it to the flag, pick a primary metric (e.g. `lead_captured`), and set the secondary metric to `cta_clicked`.
7. Click **Launch** when you're ready to start collecting exposures.

### Step-by-step: wiring a new variant in code

1. Open `src/lib/ab.ts` and add the variant copy to `heroHeadlines`:

   ```ts
   export const heroHeadlines = {
     control: 'Your marketing stack, diagnosed in minutes.',
     'variant-b': 'Find out exactly where your marketing is bleeding money.',
     // 'variant-c': '<new copy>',
   }
   ```

2. `getHeroVariant(visitorId)` calls `posthog.getFeatureFlag('hero-headline', visitorId)` on the server. It returns `'control'` when the flag is undefined, so the page stays renderable even if PostHog is down.
3. The variant is passed as a prop into `<Hero>` and into the hidden `ab_variant` input on the form. `submitLead` persists it on the `leads.ab_variant` column.
4. On the client, `AnalyticsBootstrap` fires `experiment_exposed` with `{ flag_key: 'hero-headline', variant }` exactly once per pageview so PostHog can compute exposure-adjusted conversion.

> Server-side resolution means the variant is already in the HTML — no flicker, no client re-render, and it's pinned to the same `visitor_id` that PostHog will use to attribute the conversion.

---

## 6. Test accounts (Supabase, PostHog)

Real credentials are **not** committed to the repository. Share the values below with reviewers out-of-band (1Password, encrypted note, or the brief response email).

### Supabase (read-only reviewer)

| Field | Value |
|---|---|
| Project URL | `https://<project-ref>.supabase.co` |
| Dashboard login | `reviewer+aga@growthpulse.test` |
| Password | shared out-of-band |
| Role | Read-only on the `leads` table |
| What you can do | Browse rows in the Table editor and run SELECT queries in the SQL editor. |

### PostHog (member with read access)

| Field | Value |
|---|---|
| Region / URL | `https://us.posthog.com` |
| Project | GrowthPulse — Landing |
| Login | `reviewer+aga@growthpulse.test` |
| Password | shared out-of-band |
| Role | Member (read events, dashboards, experiments) |
| What you can do | Inspect the live funnel, the `hero-headline` experiment results, and replays of test sessions. |

> ⚠️ Before sharing the deliverable, replace the placeholders above with the real reviewer credentials and double-check that the Supabase user has read-only access on the `leads` table and no admin role on the project.

---

## 7. AI tools used

The project was built with AI assistance for design, planning, implementation, and asset generation. The list below covers every model and tool that meaningfully contributed.

### Claude Code — design · planning · implementation

- **Design.** Drafted the visual direction, picked the Tailwind v4 token set, and produced the structured design spec at `docs/superpowers/specs/2026-05-28-growthpulse-landing-page-design.md`.
- **Planning.** Wrote the implementation plan at `~/.claude/plans/pure-beaming-hopcroft.md` — feature decomposition, task ordering, and acceptance criteria.
- **Implementation.** Generated and refactored every file under `app/`, `src/`, `components/`, and the test suite, following the feature-based clean architecture described above.

### ChatGPT — illustration generation

- Generated all of the abstract illustrations and gradient/data-viz assets used across the landing page. The brand rule of "no stock photography of people" was kept by prompting only for abstract, data-driven visuals.
- Output was downscaled and converted to web formats before being placed under `public/`.

---

## 8. Trade-offs

Explicit list of decisions that bought speed, simplicity, or safety at a cost. Each entry names what was given up and when we would revisit it.

### Server Action over a public REST endpoint

- **Chose:** Single `submitLead` Server Action handling validation, persistence, and analytics.
- **Gave up:** A reusable API surface that mobile clients or external integrations could call.
- **Why:** Single-page landing — no other consumer exists. Server Actions remove a network hop, keep types end-to-end, and let us keep the service role key off the client.
- **Revisit when:** A second consumer needs to create leads (mobile, partner integration, marketing automation tool).

### RLS disabled on `leads` with service-role-only access

- **Chose:** No row-level security; the server holds the only key that can insert.
- **Gave up:** Defence in depth — a leaked service key gives unrestricted write access.
- **Why:** RLS adds friction for a table that is write-only from a single trusted server. The threat model is exactly "leaked service key," which RLS doesn't mitigate either.
- **Revisit when:** Any read path is added that needs anonymous access (e.g. a public "leads counter"), or the table starts holding cross-tenant data.

### SSR variant resolution instead of client flags

- **Chose:** Resolve `hero-headline` in `app/page.tsx` via `getHeroVariant(visitorId)`.
- **Gave up:** One server-side PostHog round-trip per cold render — slightly higher TTFB.
- **Why:** No client flicker, no layout shift, and the variant is pinned to the same `visitor_id` the conversion will be attributed to.
- **Revisit when:** PostHog server latency becomes a meaningful share of TTFB, or we add many flags to the critical path.

### Swallow analytics failures, never block the redirect

- **Chose:** `try/catch` around `trackLeadCaptured`, log and continue.
- **Gave up:** Strict conversion accuracy — a PostHog outage drops the server-side `lead_captured` event.
- **Why:** The lead row is the source of truth for revenue impact. Analytics is observability, not a system of record. Blocking on PostHog would punish the user for our vendor's outage.
- **Revisit when:** We move to a durable event queue (e.g. Vercel Queues) where we can persist and retry without blocking.

### No backend pagination / admin UI

- **Chose:** Reviewers inspect leads in the Supabase Table editor.
- **Gave up:** A polished internal dashboard.
- **Why:** Out of scope for a take-home assessment. Supabase already provides a usable read interface.
- **Revisit when:** The sales team starts asking for filters, exports, or notifications.

### Feature-based clean architecture for a single feature

- **Chose:** Full `domain / data` split with a repository interface for one entity.
- **Gave up:** A few extra files vs. inlining Supabase calls in the Server Action.
- **Why:** The brief explicitly evaluates architectural decisions, and the boundary cost is paid once — but it makes the second feature (e.g. a follow-up email flow, a calendar booking) cheap.
- **Revisit when:** Never — but if the project stays a single page forever, the structure is over-engineered for what it does.

### Cookie-based `visitor_id` over PostHog's anonymous ID

- **Chose:** Middleware sets a `visitor_id` cookie used by both the server (flag resolution, analytics) and the browser SDK.
- **Gave up:** One extra cookie; manual identity reconciliation if PostHog ever changes its ID strategy.
- **Why:** Server and client must hash to the same bucket for the A/B test to be honest. Owning the ID is simpler than threading PostHog's distinct ID through SSR.
- **Revisit when:** We adopt a real auth system that already gives us a stable user ID.

### No end-to-end browser test, Vitest unit tests only

- **Chose:** Vitest around `submitLead` and the Zod schema; manual QA in the browser.
- **Gave up:** Regression coverage on the form interaction, the redirect, and the thank-you page.
- **Why:** Take-home scope, single happy path, no real risk of cross-page state. The validation logic is where bugs would actually land, so that's where the tests are.
- **Revisit when:** A second form is added, or the flow grows multi-step.
