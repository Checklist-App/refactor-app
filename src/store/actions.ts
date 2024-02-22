// import { create } from 'zustand'
// import { Action } from '../types/Action'
// import { ChecklistPeriodImage } from '../types/ChecklistPeriod'

// interface ActionsData {
//   actions: Action[] | null
//   createNewAction: ({
//     checklistPeriodId,
//     checklistId,
//     actionProps,
//     user,
//   }: {
//     checklistPeriodId: number
//     checklistId: number
//     actionProps: {
//       title: string
//       responsible: string
//       description: string
//       startDate: string
//       dueDate: string
//       endDate: string
//     }
//     user: string
//   }) => Action
//   updateAction: ({
//     checklistId,
//     checklistPeriodId,
//     actionProps,
//     user,
//   }: {
//     checklistId: number
//     checklistPeriodId: number
//     actionProps: {
//       id: number
//       responsible: string
//       title: string
//       description: string
//       endDate: string
//       img: ChecklistPeriodImage[]
//     }
//     user: string
//   }) => void
//   editActionImages: ({
//     actionId,
//     images,
//   }: {
//     actionId: number
//     images: ChecklistPeriodImage[]
//   }) => void
// }

// export const useActions = create<ActionsData>((set, get) => {
//   return {
//     actions: null,

//     createNewAction: async ({
//       actionProps,
//       checklistPeriodId,
//       checklistId,
//       user,
//     }) => {
//       try {
//         const checklist = get().allChecklists.find(
//           (item) => item.id === checklistId,
//         )
//         if (!checklist) return

//         const period = checklist.checklistPeriods.find(
//           (item) => item.id === checklistPeriodId,
//         )
//         if (!period) return

//         const dataAction: ActionType = {
//           id: new Date().getTime(),
//           checklistId,
//           checklistPeriodId,
//           ...actionProps,
//           img: [],
//           equipmentId: checklist.equipment.id,
//           type: 'inserted',
//         }

//         period.actions.push(dataAction)
//         if (period.status !== 'inserted') {
//           period.status = 'updated'
//         }
//         set({
//           currentChecklist: checklist,
//         })

//         await fillDbs.update({
//           checklistId: checklist.id,
//           checklistPeriods: checklist.checklistPeriods,
//           user,
//         })
//         // await Promise.all([
//         //   fillDbs.update({
//         //     checklistId: checklist.id,
//         //     checklistPeriods: checklist.checklistPeriods,
//         //     user,
//         //   }),
//         //   fillDbs.updateActions({
//         //     actionId: dataAction.id,
//         //     user,
//         //     props: { ...dataAction },
//         //   }),
//         // ])
//         return dataAction
//       } catch (err) {
//         console.log('Erro ao criar ')
//         console.log(err)
//       }
//     },

//     updateAction: async ({
//       actionProps,
//       checklistId,
//       checklistPeriodId,
//       user,
//     }) => {
//       console.log('UpdateAction')
//       const checklist = get().allChecklists.find(
//         (item) => item.id === checklistId,
//       )
//       if (!checklist) {
//         throw Error('Checklist não encontrado')
//       }

//       const period = checklist.checklistPeriods.find(
//         (item) => item.id === checklistPeriodId,
//       )
//       if (!period) {
//         throw Error('Período não encontrado')
//       }

//       const action = period.actions?.find((act) => act.id === actionProps.id)
//       if (!action) {
//         throw Error('Essa ação não foi encontrada')
//       }

//       action.responsible = actionProps.responsible
//       action.title = actionProps.title
//       action.description = actionProps.description
//       action.endDate = actionProps.endDate
//       action.img = actionProps.img
//       if (action.img.length) {
//         console.log(action.img)
//       }

//       if (action.type !== 'inserted') {
//         action.type = 'updated'
//       }
//       if (period.status !== 'inserted') {
//         period.status = 'updated'
//       }
//       set({
//         currentChecklist: checklist,
//       })

//       await fillDbs.update({
//         checklistId: checklist.id,
//         checklistPeriods: checklist.checklistPeriods,
//         user,
//       })
//       // await Promise.all([
//       //   fillDbs.update({
//       //     checklistId: checklist.id,
//       //     checklistPeriods: checklist.checklistPeriods,
//       //     user,
//       //   }),
//       // fillDbs.updateActions({
//       //   actionId: action.id,
//       //   user,
//       //   props: newAction,
//       // }),
//       // ])
//     },

//     editActionImages: ({ actionId, images }) => {
//       console.log('Definindo imagens para ação atual...')
//       const newAction = { ...get().currentAction }
//       newAction.img = images
//       console.log(images)
//     },
//   }
// })
