export interface Action {
  id: number
  title: string
  responsible: string
  description: string
  checklistId: number
  checklistPeriodId: number
  startDate: string
  dueDate: string
  endDate: string
  equipmentId: number
  type: 'inserted' | 'updated' | 'synced'
  img: {
    name: string
    path: string
    url: string
  }[]
}
