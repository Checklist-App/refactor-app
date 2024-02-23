import { ChecklistPeriod } from './ChecklistPeriod'

export interface Checklist {
  id: number
  initialTime: string
  finalTime: string
  date: string
  mileage: number
  signatures: unknown[]
  status: 'close' | 'open'
  equipment: {
    id: number
    clientId: number
    branchId: number
    familyId: number
    costCenter: number
    code: string
    description: string
    mileage: number
    hourMeter: number
  }
  period?: {
    id: number
    period: string
    branchId: number
  }
  checklistPeriods: ChecklistPeriod[]
  syncStatus: 'inserted' | 'synced' | 'errored' | 'updated'
  error: object
}

export interface ReceivedChecklist {
  id: number
  costCenterId: number
  equipmentId: number
  periodId: number
  date: string
  initialTime: string
  finalTime: string
  status: 'close' | 'open'
  dataLog: string
  login: string
  initialMileage: number
  finalMileage: number
  period: string
  code: string
  description: string
}
