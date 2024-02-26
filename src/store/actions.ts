import { create } from 'zustand'
import db from '../libs/database'
import { downloadImage } from '../services/downloadImage'
import { Action, ReceivedAction } from '../types/Action'

interface ActionsData {
  actions: Action[] | null

  loadActions: (user: string) => void
  createNewAction: ({
    checklistPeriodId,
    checklistId,
    equipmentId,
    title,
    responsible,
    description,
    dueDate,
  }: {
    checklistPeriodId: number
    checklistId: number
    equipmentId: number
    title: string
    responsible: string
    description: string
    dueDate: Date
  }) => Action
  updateAction: (action: Action) => void
  generateActions: (user: string) => Promise<void>
  syncActions: (user: string, token: string) => Promise<void>
}

export const useActions = create<ActionsData>((set, get) => {
  return {
    actions: null,

    loadActions: async (user) => {
      try {
        const actions = db.retrieveActions(user)

        set({ actions })
      } catch {
        // console.log(err)
      }
    },

    createNewAction: ({ ...props }) => {
      const newAction: Action = {
        id: Number(new Date().getTime()),
        checklistId: props.checklistId,
        checklistPeriodId: props.checklistPeriodId,
        equipmentId: props.equipmentId,
        title: props.title,
        description: props.description,
        startDate: new Date(),
        dueDate: props.dueDate,
        endDate: null,
        responsible: props.responsible,
        img: [],
        syncStatus: 'inserted',
      }

      const actions = get().actions
      actions.forEach((action) => {
        if (action.equipmentId === props.equipmentId && !action.endDate) {
          throw new Error('Já existe uma ação em aberta para esse equipamento')
        }
      })

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

    generateActions: async (user) => {
      try {
        const receivedActions: ReceivedAction[] = db.retrieveReceivedData(
          user,
          '/@actions',
        )

        const actions: Action[] = []
        for (const action of receivedActions) {
          actions.push({
            id: action.id,
            checklistId: action.id_registro_producao,
            checklistPeriodId: action.id_item,
            equipmentId: action.productionRegister.id_equipamento,
            title: action.descricao,
            description: action.descricao_acao,
            startDate: new Date(action.data_inicio),
            dueDate: new Date(action.data_fechamento),
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
          console.log('Nenuma ação')
        }
      } catch (err) {
        console.log('Erro ao gerar ações')
        console.log(err)
        throw new Error('Falha ao escrever ações', { cause: err })
      }
    },

    syncActions: async (user) => {
      try {
        const storedActions = db.retrieveActions(user)
        console.log({ storedActions })
        if (!storedActions) {
          console.log('Não há ações carregadas')
          return get().generateActions(user)
        }
        const actions = storedActions.filter(
          (item) =>
            item.syncStatus === 'inserted' || item.syncStatus === 'updated',
        )

        if (actions.length) {
          console.log('Enviar ações a API...')
        } else {
          await get().generateActions(user)
        }
      } catch (err) {
        console.log(err)
      }
    },
  }
})
