'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { useSectionView } from '@lib/hooks/useSectionView'

const features = [
  {
    icon: '⚡',
    illustration: '/illustrations/integration.png',
    title: 'One-Click Stack Integration',
    description: 'Connects to HubSpot, Google Analytics, Meta Ads, Klaviyo, Salesforce, and 30+ tools via API in under 5 minutes.',
  },
  {
    icon: '📊',
    illustration: '/illustrations/score.png',
    title: '7-Dimension Growth Score',
    description: 'Proprietary scoring algorithm rates each growth dimension on a 0–100 scale with benchmarks against industry peers.',
  },
  {
    icon: '🤖',
    illustration: '/illustrations/action-plan.png',
    title: 'AI-Generated Action Plan',
    description: 'Produces a prioritized 90-day roadmap with specific recommendations ranked by expected impact and effort.',
  },
  {
    icon: '📄',
    illustration: '/illustrations/report.png',
    title: 'Executive Summary Report',
    description: 'Auto-generates a board-ready PDF with key findings, visualized scores, and strategic recommendations.',
  },
  {
    icon: '📡',
    illustration: '/illustrations/dashboard.png',
    title: 'Live Dashboard',
    description: 'Real-time monitoring of all 7 dimensions with alerts when performance dips below benchmarks.',
  },
]

export function FeaturesSection() {
  const sectionRef = useSectionView<HTMLElement>('features', 2)

  return (
    <section ref={sectionRef} className="py-24 px-6" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold">
            Everything your marketing team needs to stop guessing
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            One platform. Seven dimensions. Zero spreadsheets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, illustration, title, description }) => (
            <Card key={title} className="hover:border-primary/40 transition-colors overflow-hidden">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
                <Image
                  src={illustration}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="pt-6">
                <span className="text-3xl" aria-hidden>{icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
