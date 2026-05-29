import { posthogServer } from '@lib/posthog'

export class AnalyticsService {
  async trackLeadCaptured(distinctId: string, abVariant: string, utmSource?: string) {
    posthogServer.capture({
      distinctId,
      event: 'form_submitted',
      properties: { ab_variant: abVariant, utm_source: utmSource },
    })
    await posthogServer.flush()
  }
}
