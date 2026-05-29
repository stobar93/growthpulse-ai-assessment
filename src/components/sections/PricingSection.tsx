'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import posthog from 'posthog-js'
import { useSectionView } from '@lib/hooks/useSectionView'

const tiers = [
  {
    name: 'Starter',
    price: '$499',
    featured: false,
    features: [
      'Up to 5 integrations',
      'Monthly diagnostic report',
      'Quarterly action plan',
      '2 seats',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$1,299',
    featured: true,
    features: [
      'Up to 15 integrations',
      'Weekly diagnostic report',
      'Monthly action plan',
      '5 seats',
      'Priority email + chat',
    ],
  },
  {
    name: 'Scale',
    price: '$2,999',
    featured: false,
    features: [
      'Unlimited integrations',
      'Daily diagnostic + alerts',
      'Monthly + live dashboard',
      'Unlimited seats',
      'Dedicated success manager',
    ],
  },
] as const

export function PricingSection() {
  const sectionRef = useSectionView<HTMLElement>('pricing', 4)

  function handleTierClick(tierName: string) {
    posthog.capture('cta_clicked', {
      location: `pricing_${tierName.toLowerCase()}`,
      cta_label: 'Get started',
    })
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6"
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-bold">
            Straightforward pricing
          </h2>
          <p className="mt-4 text-muted-foreground">No setup fees. Cancel anytime.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {tiers.map(({ name, price, featured, features }) => (
            <Card
              key={name}
              className={featured ? 'border-primary shadow-[0_0_40px_hsl(var(--primary)/0.15)]' : ''}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  {featured && <Badge>Most popular</Badge>}
                </div>
                <p>
                  <span className="text-4xl font-bold">{price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <ul className="space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={featured ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handleTierClick(name)}
                >
                  Get started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
