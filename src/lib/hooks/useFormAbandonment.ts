'use client'

import { useEffect, useRef, type RefObject } from 'react'
import posthog from 'posthog-js'

type Options = {
  startedRef: RefObject<boolean>
  submittedRef: RefObject<boolean>
  lastFieldRef: RefObject<string | null>
  completedCountRef: RefObject<number>
}

export function useFormAbandonment({
  startedRef,
  submittedRef,
  lastFieldRef,
  completedCountRef,
}: Options) {
  const fired = useRef(false)

  useEffect(() => {
    function maybeFire() {
      if (fired.current) return
      if (!startedRef.current || submittedRef.current) return
      if (document.visibilityState !== 'hidden') return
      fired.current = true
      posthog.capture('form_abandoned', {
        last_field_touched: lastFieldRef.current,
        fields_completed_count: completedCountRef.current,
      })
    }

    function onPageHide() {
      if (fired.current) return
      if (!startedRef.current || submittedRef.current) return
      fired.current = true
      posthog.capture('form_abandoned', {
        last_field_touched: lastFieldRef.current,
        fields_completed_count: completedCountRef.current,
      })
    }

    document.addEventListener('visibilitychange', maybeFire)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      document.removeEventListener('visibilitychange', maybeFire)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [startedRef, submittedRef, lastFieldRef, completedCountRef])
}
