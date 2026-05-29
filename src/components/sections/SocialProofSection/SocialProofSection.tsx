"use client";

import type { ReactNode, SVGProps } from "react";
import { useSectionView } from "@lib/hooks/useSectionView";
import DataBridgeLogo from "./DataBridgeLogo";
import LoopifyLogo from "./LoopifyLogo";
import NovaCRMLogo from "./NovaCRMLogo";

const testimonials: {
  quote: string;
  name: string;
  role: string;
  company: string;
  stripLogo: ReactNode;
  cardLogo: ReactNode;
}[] = [
  {
    quote: "GrowthPulse found $140K in wasted ad spend we didn't know about.",
    name: "Sarah Chen",
    role: "VP Marketing (fictional)",
    company: "NovaCRM",
    stripLogo: (
      <NovaCRMLogo
        className="h-7 w-auto text-foreground/80"
        aria-hidden="true"
      />
    ),
    cardLogo: (
      <NovaCRMLogo className="h-11 w-auto text-foreground" aria-hidden="true" />
    ),
  },
  {
    quote:
      "We finally had a single view of our entire funnel. Went from chaos to clarity in a week.",
    name: "Marcus Rivera",
    role: "Head of Growth (fictional)",
    company: "Loopify",
    stripLogo: (
      <LoopifyLogo
        className="h-7 w-auto text-foreground/80"
        aria-hidden="true"
      />
    ),
    cardLogo: (
      <LoopifyLogo className="h-11 w-auto text-foreground" aria-hidden="true" />
    ),
  },
  {
    quote:
      "The 90-day action plan was better than the $15K consultant report we paid for last year.",
    name: "Priya Nair",
    role: "CMO (fictional)",
    company: "DataBridge",
    stripLogo: (
      <DataBridgeLogo
        className="h-7 w-auto text-foreground/80"
        aria-hidden="true"
      />
    ),
    cardLogo: (
      <DataBridgeLogo
        className="h-11 w-auto text-foreground"
        aria-hidden="true"
      />
    ),
  },
];

export function SocialProofSection() {
  const sectionRef = useSectionView<HTMLElement>("social_proof", 3);

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

        <h2 id="social-proof-heading" className="sr-only">
          Customer testimonials
        </h2>

        <div className="grid sm:grid-cols-3 gap-8">
          {testimonials.map(({ quote, name, role, company, cardLogo }) => (
            <article
              key={name}
              className="flex flex-col items-center text-center gap-6 px-2"
            >
              <div className="flex items-center" aria-label={company}>
                {cardLogo}
              </div>
              <p className="leading-relaxed flex-1">"{quote}"</p>
              <footer className="flex flex-col items-center gap-3">
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
  );
}
