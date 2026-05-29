'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

function readVisitorIdCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)visitor_id=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const visitorId = readVisitorIdCookie()
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
      capture_pageview: true,
      bootstrap: visitorId ? { distinctID: visitorId } : undefined,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
