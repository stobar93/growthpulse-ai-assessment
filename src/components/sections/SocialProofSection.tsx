'use client'

import type { ReactNode, SVGProps } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useSectionView } from '@lib/hooks/useSectionView'

function NovaCRMLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"
        className="fill-primary"
      />
      <text
        x="30"
        y="17"
        className="fill-current"
        fontFamily="ui-sans-serif, system-ui"
        fontWeight="700"
        fontSize="14"
        letterSpacing="-0.02em"
      >
        NovaCRM
      </text>
    </svg>
  )
}

function LoopifyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c-2 0-3.8-1-4.9-2.5M4 6.5C5.1 5 6.9 4 8.9 4c3.3 0 6 2.7 6 6"
        className="stroke-primary"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="30"
        y="17"
        className="fill-current"
        fontFamily="ui-sans-serif, system-ui"
        fontWeight="700"
        fontSize="14"
        letterSpacing="-0.02em"
      >
        Loopify
      </text>
    </svg>
  )
}

function DataBridgeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2 18c0-5.5 4.5-10 10-10s10 4.5 10 10"
        className="stroke-primary"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="2" cy="18" r="2" className="fill-primary" />
      <circle cx="22" cy="18" r="2" className="fill-primary" />
      <text
        x="30"
        y="17"
        className="fill-current"
        fontFamily="ui-sans-serif, system-ui"
        fontWeight="700"
        fontSize="14"
        letterSpacing="-0.02em"
      >
        DataBridge
      </text>
    </svg>
  )
}

const testimonials: {
  quote: string
  name: string
  title: string
  company: string
  logo: ReactNode
}[] = [
  {
    quote: "GrowthPulse found $140K in wasted ad spend we didn't know about.",
    name: 'Sarah Chen',
    title: 'VP Marketing, NovaCRM (fictional)',
    company: 'NovaCRM',
    logo: <NovaCRMLogo className="h-6 w-auto text-foreground/80" aria-hidden="true" />,
  },
  {
    quote: 'We finally had a single view of our entire funnel. Went from chaos to clarity in a week.',
    name: 'Marcus Rivera',
    title: 'Head of Growth, Loopify (fictional)',
    company: 'Loopify',
    logo: <LoopifyLogo className="h-6 w-auto text-foreground/80" aria-hidden="true" />,
  },
  {
    quote: 'The 90-day action plan was better than the $15K consultant report we paid for last year.',
    name: 'Priya Nair',
    title: 'CMO, DataBridge (fictional)',
    company: 'DataBridge',
    logo: <DataBridgeLogo className="h-6 w-auto text-foreground/80" aria-hidden="true" />,
  },
]

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

        <div className="flex justify-center items-center gap-12 mb-16 flex-wrap text-muted-foreground/70">
          {testimonials.map(({ company, logo }) => (
            <span key={company} className="h-7 flex items-center">
              {logo}
            </span>
          ))}
        </div>

        <h2 id="social-proof-heading" className="sr-only">Customer testimonials</h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, title, company, logo }) => (
            <Card key={name}>
              <CardContent className="pt-6 flex flex-col gap-4 h-full">
                <div className="flex items-center" aria-label={company}>
                  {logo}
                </div>
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
