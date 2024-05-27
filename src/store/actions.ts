import { AxiosError } from 'axios'
import { create } from 'zustand'
import { api } from '../libs/api'
import db from '../libs/database'
import { downloadImage } from '../services/downloadImage'
import { uploadSingleImage } from '../services/uploadImages'
import { Action, ReceivedAction } from '../types/Action'

interface ActionsData {
  actions: Action[] | null

  loadActions: (user: string) => void
  createNewAction: ({
    checklistPeriodId,
    checklistId,
    title,
    responsible,
    description,
    endDate,
  }: {
    checklistPeriodId: number
    checklistId: number
    title: string
    responsible: string
    description: string
    endDate: Date
  }) => Action
  updateAction: (action: Action) => void
  updateActionSync: ({ oldId, newId }: { oldId: number; newId: number }) => void
  generateActions: (user: string) => Promise<void>
  syncActions: (user: string, token: string) => Promise<void>
}

export const useActions = create<ActionsData>((set, get) => {
  return {
    actions: null,

    loadActions: async (user) => {
      try {
        const actions = db.retrieveActions(user)
        // console.log(`LOADED ACTIONS => ${JSON.stringify(actions, null, 2)}`)

        set({ actions })
      } catch {
        // console.log(err)
      }
    },

    createNewAction: ({ ...props }) => {
      const newAction: Action = {
        id: Number(new Date().getTime()),
        checklistPeriodId: props.checklistPeriodId,
        checklistId: props.checklistId,
        title: props.title,
        description: props.description,
        startDate: new Date(),
        dueDate: null,
        endDate: props.endDate,
        responsible: props.responsible,
        img: [],
        syncStatus: 'inserted',
      }

      const newActions = [...get().actions, newAction]
      db.storeActions(newActions)
      db.setNeedToUpdate(true)
      set({ actions: newActions })
      return newAction
    },

    updateAction: (action) => {
      const allActions = get().actions
      const newActions: Action[] = []
      if (!allActions) throw new Error('Ações não carregadas')

      allActions.forEach((item) => {
        if (item.id === action.id) {
          action.syncStatus =
            item.syncStatus === 'inserted' ? 'inserted' : 'updated'
          newActions.push(action)
        } else {
          newActions.push(item)
        }
      })

      db.storeActions(newActions)
      db.setNeedToUpdate(true)
      set({ actions: newActions })
    },

    updateActionSync: ({ newId, oldId }) => {
      const actions = db.retrieveActions(db.retrieveLastUser().login)

      const newActions: Action[] = []
      actions.forEach((action) => {
        if (action.id === oldId) {
          action.id = newId
          action.syncStatus = 'synced'
        }
        newActions.push(action)
      })

      db.storeActions(newActions)
      set({ actions: newActions })
    },

    generateActions: async (user) => {
      try {
        const receivedActions: ReceivedAction[] = db.retrieveReceivedData(
          user,
          '/@actions',
        )

        const actions: Action[] = []
        for await (const action of receivedActions) {
          actions.push({
            id: action.id,
            checklistPeriodId: action.id_item,
            checklistId: action.id_checklist,
            title: action.descricao,
            description: action.descricao_acao,
            startDate: action.data_inicio ? new Date(action.data_inicio) : null,
            dueDate: action.data_fechamento
              ? new Date(action.data_fechamento)
              : null,
            endDate: action.data_fim ? new Date(action.data_fim) : null,
            responsible: action.responsavel,
            img: await Promise.all(
              action.img.map(async (img) => ({
                name: img.name,
                url: img.url,
                path: await downloadImage(img.url),
              })),
            ),
            syncStatus: 'synced',
          })
        }
        db.storeActions(actions)
        if (!actions.length) {
          console.log('Nenhuma ação')
        }
      } catch (err) {
        console.log('Erro ao gerar ações')
        console.log(err)
        throw new Error('Falha ao escrever ações', { cause: err })
      }
    },

    syncActions: async (user, token) => {
      console.log('sync actions')

      try {
        const storedActions = db.retrieveActions(user)

        if (!storedActions) {
          console.log('Não há ações carregadas')
          return get().generateActions(user)
        }
        const actions = storedActions.filter(
          (item) => item.syncStatus !== 'synced',
        )

        if (actions.length > 0) {
          const options = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

          for await (const action of actions) {
            const updatedAction = { ...action }
            console
              .log
              // `ACTION CHECKLIST ID => ${action.checklistId} ACTION STATUS ${action.syncStatus}`,
              ()

            const postAction = {
              checklistPeriodId: action.checklistPeriodId,
              description: action.description,
              checklistId: action.checklistId,
              dueDate: action.dueDate,
              endDate: action.endDate,
              responsible: action.responsible,
              startDate: action.startDate,
              title: action.title,
            }

            console.log(`ACTION BODY => ${JSON.stringify(postAction, null, 2)}`)

            if (action.syncStatus === 'inserted') {
              console.log('post')

              await api
                .post('/actions', postAction, options)
                .then((res) => res.data)
                .then(async (data: { id: number; id_grupo: number }) => {
                  updatedAction.id = data.id
                  for (const img of action.img) {
                    if (img.url === '') {
                      await uploadSingleImage({
                        img,
                        route: 'actions/image/upload',
                        id: data.id_grupo,
                        token,
                      })
                    }
                  }
                })
                .catch((err) => {
                  if (err instanceof AxiosError) {
                    console.log(err.response?.data)
                  } else {
                    console.log(err)
                  }
                  throw new Error(`Erro ao enviar ação de id ${action.id}`)
                })
            } else {
              console.log('put')
              await api
                .put(`/actions/${action.id}`, postAction, options)
                .then((res) => res.data)
                .then(async (data: { id: number; id_grupo: number }) => {
                  updatedAction.id = data.id
                  for (const img of action.img) {
                    if (img.url === '') {
                      await uploadSingleImage({
                        img,
                        route: 'actions/image/upload',
                        id: data.id_grupo,
                        token,
                      })
                    }
                  }
                })
                .catch((err) => {
                  console.log(err)
                  throw new Error(
                    `Erro ao atualizar ação para a rota /actions/${action.id}`,
                  )
                })
            }

            get().updateActionSync({
              oldId: action.id,
              newId: updatedAction.id,
            })
          }
        } else {
          return get().generateActions(user)
        }
      } catch (err) {
        console.log(err)
      }
    },
  }
})
