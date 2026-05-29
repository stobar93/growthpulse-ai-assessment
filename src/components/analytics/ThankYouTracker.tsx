'use client'

import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export function ThankYouTracker() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    posthog.capture('thank_you_viewed')
  }, [])

  return null
}
