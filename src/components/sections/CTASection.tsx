'use client'

import { useRef } from 'react'
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
import type { HeroVariant } from '@lib/ab'

export function CTASection({ abVariant }: { abVariant: HeroVariant }) {
  const hasStarted = useRef(false)

  function handleFirstInteraction() {
    if (!hasStarted.current) {
      hasStarted.current = true
      posthog.capture('form_started')
    }
  }

  return (
    <section id="cta" className="py-24 px-6 bg-card/50" aria-labelledby="cta-heading">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold">
            Get your free marketing diagnostic
          </h2>
          <p className="mt-4 text-muted-foreground">
            See exactly where your marketing is underperforming — in minutes.
          </p>
        </div>

        <form
          action={submitLead}
          onSubmit={() => posthog.capture('cta_clicked', { location: 'final' })}
          className="space-y-4"
        >
          <input type="hidden" name="ab_variant" value={abVariant} />

          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-muted-foreground">Full name</label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Smith"
              required
              onFocus={handleFirstInteraction}
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
              onFocus={handleFirstInteraction}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="company_size" className="text-sm text-muted-foreground">Company size</label>
            <Select name="company_size" onOpenChange={handleFirstInteraction}>
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
            <Select name="marketing_team_size" onOpenChange={handleFirstInteraction}>
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
