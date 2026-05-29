import { PostHog } from 'posthog-node'

// Server-side PostHog client (Node.js — used in Server Actions and Server Components)
export const posthogServer = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com' }
)
