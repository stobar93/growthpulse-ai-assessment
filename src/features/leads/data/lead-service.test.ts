import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Lead } from '@features/leads/domain/models'

const mockCreate = vi.fn()

vi.mock('@features/leads/data/lead-repository', () => ({
  LeadRepository: vi.fn(function () {
    return { create: mockCreate }
  }),
}))

import { LeadService } from '@features/leads/data/lead-service'

const validLead: Lead = {
  name: 'Jane Smith',
  email: 'jane@acme.com',
  company_size: '11-50',
  marketing_team_size: '3-5',
  utm: { source: 'google', medium: 'cpc' },
  ab_variant: 'control',
}

describe('LeadService', () => {
  let service: LeadService

  beforeEach(() => {
    service = new LeadService()
    vi.clearAllMocks()
  })

  it('delegates to repository and returns the saved lead', async () => {
    const saved = { ...validLead, id: 'uuid-123', created_at: '2026-05-28T00:00:00Z' }
    mockCreate.mockResolvedValue(saved)

    const result = await service.createLead(validLead)
    expect(mockCreate).toHaveBeenCalledOnce()
    expect(result.id).toBe('uuid-123')
  })

  it('propagates repository errors', async () => {
    mockCreate.mockRejectedValue(new Error('Failed to save lead: DB error'))

    await expect(service.createLead(validLead)).rejects.toThrow('Failed to save lead')
  })
})
