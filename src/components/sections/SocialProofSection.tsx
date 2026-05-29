'use client'

import type { ReactNode, SVGProps } from 'react'
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
  role: string
  company: string
  stripLogo: ReactNode
  cardLogo: ReactNode
}[] = [
  {
    quote: "GrowthPulse found $140K in wasted ad spend we didn't know about.",
    name: 'Sarah Chen',
    role: 'VP Marketing (fictional)',
    company: 'NovaCRM',
    stripLogo: <NovaCRMLogo className="h-7 w-auto text-foreground/80" aria-hidden="true" />,
    cardLogo: <NovaCRMLogo className="h-11 w-auto text-foreground" aria-hidden="true" />,
  },
  {
    quote: 'We finally had a single view of our entire funnel. Went from chaos to clarity in a week.',
    name: 'Marcus Rivera',
    role: 'Head of Growth (fictional)',
    company: 'Loopify',
    stripLogo: <LoopifyLogo className="h-7 w-auto text-foreground/80" aria-hidden="true" />,
    cardLogo: <LoopifyLogo className="h-11 w-auto text-foreground" aria-hidden="true" />,
  },
  {
    quote: 'The 90-day action plan was better than the $15K consultant report we paid for last year.',
    name: 'Priya Nair',
    role: 'CMO (fictional)',
    company: 'DataBridge',
    stripLogo: <DataBridgeLogo className="h-7 w-auto text-foreground/80" aria-hidden="true" />,
    cardLogo: <DataBridgeLogo className="h-11 w-auto text-foreground" aria-hidden="true" />,
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
          {testimonials.map(({ company, stripLogo }) => (
            <span key={company} className="h-8 flex items-center">
              {stripLogo}
            </span>
          ))}
        </div>

        <h2 id="social-proof-heading" className="sr-only">Customer testimonials</h2>

        <div className="grid sm:grid-cols-3 gap-8">
          {testimonials.map(({ quote, name, role, company, cardLogo }) => (
            <article
              key={name}
              className="flex flex-col items-center text-center gap-6 px-2"
            >
              <p className="leading-relaxed flex-1">"{quote}"</p>
              <footer className="flex flex-col items-center gap-3">
                <div className="flex items-center" aria-label={company}>
                  {cardLogo}
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">{name}</p>
                  <p className="text-muted-foreground text-xs">{role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
