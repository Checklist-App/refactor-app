export interface ChecklistStatusAction {
  id: number
  taskId: number
  statusId: number
  controlId: number
  description: string
  impeding: boolean
  logUser: string
  logDate: string
}
