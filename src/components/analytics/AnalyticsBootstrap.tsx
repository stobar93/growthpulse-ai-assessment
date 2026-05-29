'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import type { HeroVariant } from '@lib/ab-variants'

type UTMKeys = 'source' | 'medium' | 'campaign' | 'term' | 'content'

function readUtmFromCookie(): Partial<Record<UTMKeys, string>> {
  if (typeof document === 'undefined') return {}
  const match = document.cookie.match(/(?:^|;\s*)utm_data=([^;]+)/)
  if (!match) return {}
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return {}
  }
}

export function AnalyticsBootstrap({ abVariant }: { abVariant: HeroVariant }) {
  useEffect(() => {
    const utm = readUtmFromCookie()
    const utmProps = Object.fromEntries(
      Object.entries(utm).map(([k, v]) => [`utm_${k}`, v])
    )

    posthog.register({
      ab_variant: abVariant,
      ...utmProps,
    })

    posthog.capture('experiment_exposed', {
      flag_key: 'hero-headline',
      variant: abVariant,
    })
  }, [abVariant])

  return null
}
