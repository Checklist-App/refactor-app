export interface ChecklistSchema {
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
