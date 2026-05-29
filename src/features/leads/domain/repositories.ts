import type { Lead } from './models'

export interface ILeadRepository {
  create(lead: Lead): Promise<Lead>
}
