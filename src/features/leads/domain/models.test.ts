import { describe, it, expect } from 'vitest'
import { leadSchema } from '@features/leads/domain/models'

describe('leadSchema', () => {
  it('accepts a valid lead', () => {
    const result = leadSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      company_size: '11-50',
      marketing_team_size: '3-5',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing email', () => {
    const result = leadSchema.safeParse({
      name: 'Jane Smith',
      company_size: '11-50',
      marketing_team_size: '3-5',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = leadSchema.safeParse({
      name: 'Jane Smith',
      email: 'not-an-email',
      company_size: '11-50',
      marketing_team_size: '3-5',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid company_size enum value', () => {
    const result = leadSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      company_size: 'huge',
      marketing_team_size: '3-5',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid marketing_team_size enum value', () => {
    const result = leadSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      company_size: '11-50',
      marketing_team_size: '99',
    })
    expect(result.success).toBe(false)
  })
})
