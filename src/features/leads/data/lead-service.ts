import type { Lead } from '../domain/models'
import { LeadRepository } from './lead-repository'

export class LeadService {
  private repo: LeadRepository

  constructor() {
    this.repo = new LeadRepository()
  }

  async createLead(lead: Lead): Promise<Lead> {
    return this.repo.create(lead)
  }
}
