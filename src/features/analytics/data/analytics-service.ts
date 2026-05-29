import { posthogServer } from '@lib/posthog'
import type { Lead, UTMData } from '@features/leads/domain/models'

type TrackArgs = {
  visitorId: string
  lead: Lead
  utm: UTMData
  abVariant: string
}

export class AnalyticsService {
  async trackLeadCaptured({ visitorId, lead, utm, abVariant }: TrackArgs) {
    const utmProps = Object.fromEntries(
      Object.entries(utm).map(([k, v]) => [`utm_${k}`, v])
    )

    posthogServer.identify({
      distinctId: visitorId,
      properties: {
        email: lead.email,
        name: lead.name,
        company_size: lead.company_size,
        marketing_team_size: lead.marketing_team_size,
        ab_variant: abVariant,
        ...utmProps,
      },
    })

    posthogServer.capture({
      distinctId: visitorId,
      event: 'lead_captured',
      properties: {
        company_size: lead.company_size,
        marketing_team_size: lead.marketing_team_size,
        ab_variant: abVariant,
        ...utmProps,
      },
    })

    await posthogServer.flush()
  }
}
