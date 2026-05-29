'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import posthog from 'posthog-js'
import type { HeroVariant } from '@lib/ab'
import { heroHeadlines } from '@lib/ab'

export function HeroSection({ variant }: { variant: HeroVariant }) {
  function handleCTAClick() {
    posthog.capture('cta_clicked', { location: 'hero' })
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,170,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <Badge variant="outline" className="border-primary/40 text-primary">
          Now in beta — 500+ companies audited
        </Badge>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          {heroHeadlines[variant]}
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          GrowthPulse AI connects to your marketing tools and generates an automated
          diagnostic report — scoring performance across 7 growth dimensions in minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleCTAClick} className="text-lg px-8 py-6">
            Get Your Free Diagnostic
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            See a Sample Report
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
          {[
            { value: '500+', label: 'Companies audited' },
            { value: '32%', label: 'Avg ROI improvement in 90 days' },
            { value: '4.8★', label: 'Customer rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
