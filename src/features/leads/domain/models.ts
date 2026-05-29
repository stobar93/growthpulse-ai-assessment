import { z } from 'zod'

export const utmDataSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
})

export const companySizes = ['1-10', '11-50', '51-200', '200+'] as const
export const marketingTeamSizes = ['1-2', '3-5', '6-8', '8+'] as const

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  company_size: z.enum(companySizes, { message: 'Select a company size' }),
  marketing_team_size: z.enum(marketingTeamSizes, { message: 'Select a team size' }),
})

export type UTMData = z.infer<typeof utmDataSchema>
export type Lead = z.infer<typeof leadSchema> & {
  id?: string
  utm: UTMData
  ab_variant: string
  created_at?: string
}
