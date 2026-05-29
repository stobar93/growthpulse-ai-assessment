'use client'

import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export type SectionId =
  | 'hero'
  | 'features'
  | 'social_proof'
  | 'pricing'
  | 'cta_form'

export function useSectionView<T extends Element>(section: SectionId, position: number) {
  const ref = useRef<T | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || fired.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7 && !fired.current) {
            fired.current = true
            posthog.capture('section_viewed', { section, position })
            observer.disconnect()
          }
        }
      },
      { threshold: 0.7 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [section, position])

  return ref
}
