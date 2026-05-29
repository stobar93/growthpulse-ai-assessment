import type { ILeadRepository } from '../domain/repositories'
import type { Lead } from '../domain/models'
import { supabase } from '@lib/supabase'

export class LeadRepository implements ILeadRepository {
  async create(lead: Lead): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: lead.name,
        email: lead.email,
        company_size: lead.company_size,
        marketing_team_size: lead.marketing_team_size,
        utm: lead.utm,
        ab_variant: lead.ab_variant,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to save lead: ${error.message}`)
    return data as Lead
  }
}
