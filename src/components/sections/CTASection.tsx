'use client'

import { useRef, useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import posthog from 'posthog-js'
import { submitLead } from '@lib/actions'
import { companySizes, marketingTeamSizes } from '@features/leads/domain/models'
import type { HeroVariant } from '@lib/ab-variants'
import { useSectionView } from '@lib/hooks/useSectionView'
import { useFormAbandonment } from '@lib/hooks/useFormAbandonment'

type ActionState = { error: string } | null
type FieldName = 'name' | 'email' | 'company_size' | 'marketing_team_size'

const NON_PII_FIELDS: ReadonlySet<FieldName> = new Set(['company_size', 'marketing_team_size'])

async function submitLeadAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const result = await submitLead(formData)
  return result ?? null
}

export function CTASection({ abVariant }: { abVariant: HeroVariant }) {
  const sectionRef = useSectionView<HTMLElement>('cta_form', 5)
  const [state, formAction] = useActionState(submitLeadAction, null)

  const startedRef = useRef(false)
  const submittedRef = useRef(false)
  const completedFieldsRef = useRef<Set<FieldName>>(new Set())
  const lastFieldRef = useRef<string | null>(null)
  const completedCountRef = useRef(0)
  const lastErrorRef = useRef<string | null>(null)

  useFormAbandonment({
    startedRef,
    submittedRef,
    lastFieldRef,
    completedCountRef,
  })

  function handleFirstInteraction(field: FieldName) {
    lastFieldRef.current = field
    if (!startedRef.current) {
      startedRef.current = true
      posthog.capture('form_started', { first_field: field })
    }
  }

  function handleFieldCompleted(field: FieldName, value: string) {
    lastFieldRef.current = field
    if (!value || completedFieldsRef.current.has(field)) return
    completedFieldsRef.current.add(field)
    completedCountRef.current = completedFieldsRef.current.size

    const props: Record<string, unknown> = { field }
    if (NON_PII_FIELDS.has(field)) {
      props.value = value
    }
    posthog.capture('form_field_completed', props)
  }

  function handleSubmit() {
    submittedRef.current = true
    posthog.capture('cta_clicked', {
      location: 'final_submit',
      cta_label: 'Diagnose My Marketing Stack',
    })
    posthog.capture('form_submitted', {
      fields_completed_count: completedFieldsRef.current.size,
    })
  }

  // Track Zod validation errors returned from the Server Action.
  // Error format is "${field}: ${message}".
  useEffect(() => {
    const err = state?.error
    if (!err || err === lastErrorRef.current) return
    lastErrorRef.current = err
    submittedRef.current = false // user can still submit again; not abandoned
    const sep = err.indexOf(':')
    const field = sep > 0 ? err.slice(0, sep).trim() : 'unknown'
    const message = sep > 0 ? err.slice(sep + 1).trim() : err
    posthog.capture('form_validation_failed', { field, message })
  }, [state])

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="py-24 px-6 bg-card/50"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold">
            Get your free marketing diagnostic
          </h2>
          <p className="mt-4 text-muted-foreground">
            See exactly where your marketing is underperforming — in minutes.
          </p>
        </div>

        {state?.error && (
          <p className="mb-4 text-sm text-destructive text-center">{state.error}</p>
        )}

        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="ab_variant" value={abVariant} />

          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-muted-foreground">Full name</label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Smith"
              required
              data-ph-no-capture
              onFocus={() => handleFirstInteraction('name')}
              onBlur={(e) => handleFieldCompleted('name', e.currentTarget.value.trim())}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-muted-foreground">Work email</label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@company.com"
              required
              data-ph-no-capture
              onFocus={() => handleFirstInteraction('email')}
              onBlur={(e) => handleFieldCompleted('email', e.currentTarget.value.trim())}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="company_size" className="text-sm text-muted-foreground">Company size</label>
            <Select
              name="company_size"
              onOpenChange={(open) => open && handleFirstInteraction('company_size')}
              onValueChange={(v: unknown) => handleFieldCompleted('company_size', String(v ?? ''))}
            >
              <SelectTrigger id="company_size">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((s) => (
                  <SelectItem key={s} value={s}>{s} employees</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="marketing_team_size" className="text-sm text-muted-foreground">Marketing team size</label>
            <Select
              name="marketing_team_size"
              onOpenChange={(open) => open && handleFirstInteraction('marketing_team_size')}
              onValueChange={(v: unknown) => handleFieldCompleted('marketing_team_size', String(v ?? ''))}
            >
              <SelectTrigger id="marketing_team_size">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                {marketingTeamSizes.map((s) => (
                  <SelectItem key={s} value={s}>{s} people</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full text-lg py-6 mt-2">
            Diagnose My Marketing Stack →
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No credit card required. Results ready in minutes.
          </p>
        </form>
      </div>
    </section>
  )
}
