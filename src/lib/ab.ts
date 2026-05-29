import { posthogServer } from '@lib/posthog'

export type HeroVariant = 'control' | 'variant-b'

const HERO_FLAG = 'hero-headline'

export async function getHeroVariant(visitorId: string): Promise<HeroVariant> {
  try {
    const flag = await posthogServer.getFeatureFlag(HERO_FLAG, visitorId)
    return flag === 'variant-b' ? 'variant-b' : 'control'
  } catch {
    return 'control'
  }
}

export const heroHeadlines: Record<HeroVariant, string> = {
  'control': 'Your marketing stack, diagnosed in minutes.',
  'variant-b': 'Find out exactly where your marketing is bleeding money.',
}
