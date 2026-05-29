'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const fields = ['source', 'medium', 'campaign', 'term', 'content'] as const
    const utm: Partial<Record<typeof fields[number], string>> = {}

    fields.forEach((field) => {
      const value = searchParams.get(`utm_${field}`)
      if (value) utm[field] = value
    })

    if (Object.keys(utm).length > 0) {
      document.cookie = `utm_data=${encodeURIComponent(JSON.stringify(utm))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    }
  }, [searchParams])

  return null
}
