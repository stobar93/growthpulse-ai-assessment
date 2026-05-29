'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { leadSchema } from '@features/leads/domain/models'
import { LeadService } from '@features/leads/data/lead-service'
import { AnalyticsService } from '@features/analytics/data/analytics-service'

export async function submitLead(formData: FormData) {
  const leadService = new LeadService()
  const analyticsService = new AnalyticsService()
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    company_size: formData.get('company_size'),
    marketing_team_size: formData.get('marketing_team_size'),
  }

  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return { error: `${firstError.path[0]}: ${firstError.message}` }
  }

  const cookieStore = await cookies()
  const utmRaw = cookieStore.get('utm_data')?.value
  const utm = utmRaw ? JSON.parse(decodeURIComponent(utmRaw)) : {}
  const abVariant = (formData.get('ab_variant') as string) ?? 'control'
  const visitorId = cookieStore.get('visitor_id')?.value ?? 'anonymous'

  await leadService.createLead({ ...parsed.data, utm, ab_variant: abVariant })
  await analyticsService.trackLeadCaptured(visitorId, abVariant, utm.source)

  redirect('/thank-you')
}
