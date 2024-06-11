import { ChecklistPeriod } from './ChecklistPeriod'

export interface Checklist {
  id: number
  equipmentId: number | null
  locationId: number | null
  initialTime: Date
  finalTime: Date | null
  status: 'close' | 'open'
  period?: {
    id: number
    period: string
    branchId: number
  }
  model: number[]
  checklistPeriods: ChecklistPeriod[]

  syncStatus: 'inserted' | 'synced' | 'updated'
  error: string | null

  mileage?: number
  hourmeter?: number
}

export interface ReceivedChecklist {
  id: number
  equipmentId: number | null
  locationId: number | null
  periodId: number | null
  login: string
  initialTime: Date
  finalTime: Date | null
  status: 'open' | 'close'
}
