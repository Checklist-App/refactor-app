import { ChecklistStatus } from './ChecklistStatus'
import { ChecklistStatusAction } from './ChecklistStatusAction'

export interface ChildType extends ChecklistStatusAction {
  type: string
}

export interface ChecklistPeriodImage {
  name: string
  path: string
  url: string
}

export interface ChecklistPeriod {
  id: number
  _id: string
  productionRegisterId: number
  statusId: number
  branchId: number
  checklistItemId: number
  controlId: number
  statusNC: number
  img: ChecklistPeriodImage[]
  options: ChecklistStatus[]
  task: {
    children: ChildType[]
    id: number
    familyId: number
    description: string
    answer: string
    type: string
  }
  syncStatus: 'inserted' | 'synced' | 'updated' | 'errored'
  error: {
    message: string
    code: string
  } | null
}

export interface ReceivedChecklistPeriod {
  id: number
  branchId: number
  productionRegisterId: number
  checkListItemId: number
  statusItem: number
  logDate: string
  img: ChecklistPeriodImage[]
  statusNC: number
}
