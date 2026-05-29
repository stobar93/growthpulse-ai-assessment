import { cookies } from 'next/headers'
import { HeroSection } from '@components/sections/HeroSection'
import { FeaturesSection } from '@components/sections/FeaturesSection'
import { SocialProofSection } from '@components/sections/SocialProofSection'
import { PricingSection } from '@components/sections/PricingSection'
import { CTASection } from '@components/sections/CTASection'
import { getHeroVariant } from '@lib/ab'

export default async function HomePage() {
  const cookieStore = await cookies()
  const visitorId = cookieStore.get('visitor_id')?.value ?? 'anonymous'
  const variant = await getHeroVariant(visitorId)

  return (
    <main>
      <HeroSection variant={variant} />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <CTASection abVariant={variant} />
    </main>
  )
}
