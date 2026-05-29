import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Lead } from '@features/leads/domain/models'

const mockCreateLead = vi.fn()
const mockTrackLeadCaptured = vi.fn()

vi.mock('@features/leads/data/lead-service', () => ({
  LeadService: vi.fn(function () { return { createLead: mockCreateLead } }),
}))

vi.mock('@features/analytics/data/analytics-service', () => ({
  AnalyticsService: vi.fn(function () { return { trackLeadCaptured: mockTrackLeadCaptured } }),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: (key: string) => {
      const store: Record<string, string> = {
        utm_data: encodeURIComponent(JSON.stringify({ source: 'google' })),
        visitor_id: 'test-visitor-id',
      }
      return store[key] ? { value: store[key] } : undefined
    },
  }),
}))

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

import { submitLead } from '@lib/actions'

function makeFormData(overrides: Record<string, string> = {}) {
  const defaults: Record<string, string> = {
    name: 'Jane Smith',
    email: 'jane@acme.com',
    company_size: '11-50',
    marketing_team_size: '3-5',
    ab_variant: 'control',
  }
  const fd = new FormData()
  Object.entries({ ...defaults, ...overrides }).forEach(([k, v]) => fd.append(k, v))
  return fd
}

describe('submitLead', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls LeadService.createLead with parsed data including UTM', async () => {
    mockCreateLead.mockResolvedValue({ id: 'uuid-1', email: 'jane@acme.com' })
    mockTrackLeadCaptured.mockResolvedValue(undefined)

    await submitLead(makeFormData())

    expect(mockCreateLead).toHaveBeenCalledOnce()
    const lead = mockCreateLead.mock.calls[0][0] as Lead
    expect(lead.email).toBe('jane@acme.com')
    expect(lead.utm.source).toBe('google')
    expect(lead.ab_variant).toBe('control')
  })

  it('returns a validation error on invalid email without calling the service', async () => {
    const result = await submitLead(makeFormData({ email: 'bad-email' }))
    expect(result).toMatchObject({ error: expect.stringContaining('email') })
    expect(mockCreateLead).not.toHaveBeenCalled()
  })
})
