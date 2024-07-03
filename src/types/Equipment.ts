import { Family } from "./Family"

export interface Equipment {
  id: number
  code: string
  description: string
  hasPeriod: boolean
  hasMileage: boolean
  hasHourMeter: boolean
  costCenter: number
  clientId: number
  branchId: number
  mileage: number
  familyId: number
  family: Family
  hourMeter: number
}
