import { ReceivedChecklist } from '@/src/types/Checklist'
import { ChecklistItemType } from '@/src/types/ChecklistItemType'
import { ReceivedChecklistPeriod } from '@/src/types/ChecklistPeriod'
import { ChecklistProduction } from '@/src/types/ChecklistProduction'
import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { ChecklistStatusAction } from '@/src/types/ChecklistStatusAction'
import { ControlId } from '@/src/types/ControlId'
import { Equipment } from '@/src/types/Equipment'
import { Period } from '@/src/types/Period'
import { Task } from '@/src/types/Task'
import { AxiosError } from 'axios'
import { api } from '.'
import db from '../database'

interface TaskResponse {
  task: Task[]
}

interface ChecklistItemResponse {
  checkListItem: ChecklistItemType[]
}

interface CheckListPeriodResponse {
  checkListPeriod: ReceivedChecklistPeriod[]
}

interface ChecklistProductionResponse {
  checkList: ChecklistProduction[]
}

interface ChecklistStatusResponse {
  checkListStatus: ChecklistStatus[]
}

interface ChecklistStatusActionResponse {
  checkListStatusAction: ChecklistStatusAction[]
}

export async function fetchChecklists(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/checklists'

    api
      .get(route, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: ReceivedChecklist[]) => {
        db.storeReceivedData(login + '/@checklistSchemas', data)
        resolve()
      })
      .catch((error: AxiosError) => {
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        )
      })
  })
}

export async function fetchPeriods(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/period/byClient'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: Period[]) => {
        db.storeReceivedData(login + '/@periods', data)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchTasks(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/task'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: TaskResponse) => {
        db.storeReceivedData(login + '/@tasks', data.task)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchChecklistItems(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/infoItem'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: ChecklistItemResponse) => {
        db.storeReceivedData(login + '/@checklistItems', data.checkListItem)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchCheckListPeriods(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/period/infoByLogin'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: CheckListPeriodResponse) => {
        db.storeReceivedData(login + '/@checklistPeriods', data.checkListPeriod)
        resolve()
      })
      .catch((error: AxiosError) => {
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        )
      })
  })
}

export async function fetchChecklistProductions(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/boundFamily'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: ChecklistProductionResponse) => {
        db.storeReceivedData(login + '/@checklistProductions', data.checkList)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchChecklistStatuses(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/status'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: ChecklistStatusResponse) => {
        db.storeReceivedData(login + '/@checklistStatus', data.checkListStatus)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchChecklistStatusActions(
  login: string,
  token: string,
) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkList/infoStatusAction'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: ChecklistStatusActionResponse) => {
        db.storeReceivedData(
          `${login}/@checklistStatusAction`,
          data.checkListStatusAction,
        )
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchControlIds(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/checkListControl/info'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: ControlId[]) => {
        db.storeReceivedData(login + '/@controlIds', data)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchActions(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/actions'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: object) => {
        console.log(`ACTION RESPONSE => ${JSON.stringify(data, null, 2)}`)

        db.storeReceivedData(login + '/@actions', data)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchEquipments(login: string, token: string) {
  return new Promise<void | Error>((resolve, reject) => {
    const route = '/equipment/byBranch'
    api
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data: Equipment[]) => {
        db.storeReceivedData(login + '/@equipments', data)
        resolve()
      })
      .catch((error: AxiosError) =>
        reject(
          new Error(
            `Erro ao fazer requisição à rota ${route}: ${error.message}, ${error.cause}`,
          ),
        ),
      )
  })
}

export async function fetchResponsibles(login: string, token: string) {
  return await api
    .get('/responsibles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((data) => db.storeReceivedData(login + '/@responsibles', data))
}

export async function fetchLocations(login: string, token: string) {
  return await api
    .get('/locations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((data) => db.storeReceivedData(login + '/@locations', data))
}
