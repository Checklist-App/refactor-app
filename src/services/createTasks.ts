import db from '../libs/database'
import { ChecklistItemType } from '../types/ChecklistItemType'
import { ChecklistPeriod } from '../types/ChecklistPeriod'
import { ChecklistProduction } from '../types/ChecklistProduction'
import { ChecklistStatus } from '../types/ChecklistStatus'
import { ChecklistStatusAction } from '../types/ChecklistStatusAction'
import { ControlId } from '../types/ControlId'
import { Task } from '../types/Task'

export function createTasks({
  familyId,
  checklistId,
  branchId,
  user,
}: {
  familyId: number
  checklistId: number
  branchId: number
  user: string
}): ChecklistPeriod[] {
  const checklistItems: ChecklistItemType[] = db.retrieveReceivedData(
    user,
    '/@checklistItems',
  )

  const checklistProductions: ChecklistProduction[] = db.retrieveReceivedData(
    user,
    '/@checklistProductions',
  )

  const tasks: Task[] = db.retrieveReceivedData(user, '/@tasks')
  const checklistStatusAction: ChecklistStatusAction[] =
    db.retrieveReceivedData(user, '/@checklistStatusAction')

  const checklistStatus: ChecklistStatus[] = db.retrieveReceivedData(
    user,
    '/@checklistStatus',
  )

  const controlIds: ControlId[] = db.retrieveReceivedData(user, '/@controlIds')

  let randomPeriodId = Math.floor(Math.random() * 100000)

  return checklistItems
    .filter(
      (checklistItem) =>
        checklistItem.checklistId ===
        checklistProductions.find(
          (checklistProduction) => checklistProduction.familyId === familyId,
        )?.id,
    )
    .map((checklistItem) => ({
      ...checklistItem,
      task: {
        ...tasks.find((task) => task.id === checklistItem.taskId),
        children: checklistStatusAction
          .filter((item) => item.taskId === checklistItem.taskId)
          .map((child) => ({
            ...child,
            type: controlIds.find((item) => item.id === child.controlId)
              .description,
          })),
        type: controlIds.find((item) => item.id === checklistItem.controlId)
          .description,
      },
    }))

    .map((checklistItem) => {
      randomPeriodId++
      return {
        id: randomPeriodId,
        _id: String(randomPeriodId),
        productionRegisterId: checklistId,
        statusId: 0,
        statusNC: 0,
        branchId,
        checklistItemId: checklistItem.id,
        controlId: checklistItem.controlId,
        img: [],
        task: {
          ...checklistItem.task,
          answer: 'NÃO RESPONDIDO',
        },
        syncStatus: 'inserted',
        options: checklistStatus.filter(
          (item) => item.controlId === checklistItem.controlId,
        ),
        error: null,
      }
    })
}
