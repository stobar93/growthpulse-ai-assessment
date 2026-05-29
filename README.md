# GrowthPulse AI

Marketing landing page for **GrowthPulse AI** (a fictional B2B SaaS product). Built as a take-home assessment for Azarian Growth Agency: capture leads, track analytics, run an A/B test, deploy on Vercel.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Supabase · PostHog · Vitest.

## Documentation

| Document | What's inside |
|---|---|
| [Project documentation](docs/documentation.md) | API surface, frontend, architecture, project setup, A/B test configuration in PostHog, test accounts, AI tools used, and trade-offs. |
| [Tracking plan](docs/tracking-plan.md) | Conversion funnel, super-properties, full PostHog event catalogue, PII handling, and naming conventions. |

Full index in [`docs/`](docs/).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Five environment variables are required in `.env.local`. See [Project setup](docs/documentation.md#4-project-setup) for the full list and how to provision Supabase + PostHog.

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve the production build locally
npm test         # vitest run
```

## Deploy

Deploys to Vercel. Make sure all five env vars are configured in the Vercel dashboard before deploying. See [Deploy to Vercel](docs/documentation.md#5-deploy-to-vercel).
