import db from '../libs/database'
import { ChecklistItemType } from '../types/ChecklistItemType'
import {
  ChecklistPeriod,
  ReceivedChecklistPeriod,
} from '../types/ChecklistPeriod'
import { ChecklistStatus } from '../types/ChecklistStatus'
import { ChecklistStatusAction } from '../types/ChecklistStatusAction'
import { ControlId } from '../types/ControlId'
import { Task } from '../types/Task'

export function findTasks({
  checklistId,
  branchId,
  user,
}: {
  checklistId: number
  branchId: number
  user: string
}): ChecklistPeriod[] {
  try {
    const checklistItems: ChecklistItemType[] = db.retrieveReceivedData(
      user,
      '/@checklistItems',
    )
    const tasks: Task[] = db.retrieveReceivedData(user, '/@tasks')
    const checklistStatusAction: ChecklistStatusAction[] =
      db.retrieveReceivedData(user, '/@checklistStatusAction')
    const checklistPeriods: ReceivedChecklistPeriod[] = db.retrieveReceivedData(
      user,
      '/@checklistPeriods',
    )

    const checklistStatus: ChecklistStatus[] = db.retrieveReceivedData(
      user,
      '/@checklistStatus',
    )
    const controlIds: ControlId[] = db.retrieveReceivedData(
      user,
      '/@controlIds',
    )
    // const actions: IAction[] = JSON.parse(db.getString(user + '/@actions'))

    return checklistPeriods
      .filter((item) => item.productionRegisterId === checklistId)
      .map((checklistPeriod) => ({
        ...checklistPeriod,
        checklistItem: checklistItems.find(
          (item) => item.id === checklistPeriod.checkListItemId,
        ),
      }))

      .map((checklistPeriod) => ({
        ...checklistPeriod,
        task: {
          ...tasks.find(
            (task) => task.id === checklistPeriod.checklistItem.taskId,
          ),
          children: checklistStatusAction
            .filter(
              (item) => item.taskId === checklistPeriod.checklistItem?.taskId,
            )
            .map((child) => ({
              ...child,
              type: controlIds.find((item) => item.id === child.controlId)
                .description,
            })),
        },
      }))

      .map((checklistPeriod) => {
        const returned: ChecklistPeriod = {
          id: checklistPeriod.id,
          _id: '',
          productionRegisterId: checklistPeriod.productionRegisterId,
          checklistItemId: checklistPeriod.checklistItem?.id,
          statusId: checklistPeriod.statusItem,
          statusNC: checklistPeriod.statusNC,
          controlId: checklistPeriod.checklistItem?.controlId,
          branchId,
          img: checklistPeriod.img
            .map((img) => ({
              name: img.name,
              url: img.url,
              path: '',
            }))
            .reverse(),
          task: {
            ...checklistPeriod.task,
            answer: checklistStatus.find(
              (item) => item.id === checklistPeriod.statusItem,
            )?.description,
            type: controlIds.find(
              (item) => item.id === checklistPeriod.checklistItem?.controlId,
            ).description,
          },
          syncStatus: 'synced',
          options: checklistStatus.filter(
            (item) =>
              item.controlId === checklistPeriod.checklistItem?.controlId,
          ),
          error: null,
        }
        return returned
      })
  } catch (err) {
    console.log('Erro ao gerar tasks')
    throw new Error(err)
  }
}
