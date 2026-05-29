'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useSectionView } from '@lib/hooks/useSectionView'

const testimonials = [
  {
    quote: "GrowthPulse found $140K in wasted ad spend we didn't know about.",
    name: 'Sarah Chen',
    title: 'VP Marketing, NovaCRM (fictional)',
  },
  {
    quote: 'We finally had a single view of our entire funnel. Went from chaos to clarity in a week.',
    name: 'Marcus Rivera',
    title: 'Head of Growth, Loopify (fictional)',
  },
  {
    quote: 'The 90-day action plan was better than the $15K consultant report we paid for last year.',
    name: 'Priya Nair',
    title: 'CMO, DataBridge (fictional)',
  },
]

const logos = ['NovaCRM', 'Loopify', 'DataBridge']

export function SocialProofSection() {
  const sectionRef = useSectionView<HTMLElement>('social_proof', 3)

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-card/50"
      aria-labelledby="social-proof-heading"
    >
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-muted-foreground text-sm uppercase tracking-widest mb-8">
          Trusted by fast-growing B2B SaaS teams
        </p>

        <div className="flex justify-center gap-12 mb-16 flex-wrap">
          {logos.map((logo) => (
            <span key={logo} className="text-muted-foreground/60 font-bold text-xl tracking-tight">
              {logo}
            </span>
          ))}
        </div>

        <h2 id="social-proof-heading" className="sr-only">Customer testimonials</h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, title }) => (
            <Card key={name}>
              <CardContent className="pt-6 flex flex-col gap-4 h-full">
                <p className="leading-relaxed flex-1">"{quote}"</p>
                <footer>
                  <p className="text-primary font-semibold text-sm">{name}</p>
                  <p className="text-muted-foreground text-xs">{title}</p>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
