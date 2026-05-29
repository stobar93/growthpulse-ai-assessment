import { posthogServer } from '@lib/posthog'
import type { HeroVariant } from '@lib/ab-variants'

export type { HeroVariant }
export { heroHeadlines } from '@lib/ab-variants'

const HERO_FLAG = 'hero-headline'

export async function getHeroVariant(visitorId: string): Promise<HeroVariant> {
  try {
    const flag = await posthogServer.getFeatureFlag(HERO_FLAG, visitorId)
    return flag === 'variant-b' ? 'variant-b' : 'control'
  } catch {
    return 'control'
  }
}
