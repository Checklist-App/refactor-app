import dayjs from 'dayjs'
import { create } from 'zustand'
import { api } from '../libs/api'
import db from '../libs/database'
import { createTasks } from '../services/createTasks'
import { findTasks } from '../services/findTasks'
import { uploadSingleImage } from '../services/uploadImages'
import { Checklist } from '../types/Checklist'
import { ChecklistPeriod, ChecklistPeriodImage } from '../types/ChecklistPeriod'
import { ChecklistSchema } from '../types/ChecklistSchema'
import { Period } from '../types/Period'

interface ChecklistsData {
  allChecklists: Checklist[] | null
  checklistLoadingId: number
  currentImages: {
    checklistId: number
    checklistPeriodId: number
    images: ChecklistPeriodImage[]
  } | null

  loadChecklists: (user: string) => void
  findChecklist: (checklistId: number) => Checklist
  updateChecklist: (checklist: Checklist) => void
  createChecklist: ({
    period,
    mileage,
    equipment,
    user,
  }: {
    period?: Checklist['period']
    mileage: number
    equipment: Checklist['equipment']
    user: string
  }) => Checklist
  finalizeChecklist: (checklistId: number) => void

  findChecklistPeriod: (
    checklistPeriodId: number,
    checklistId: number,
  ) => ChecklistPeriod
  updateChecklistPeriod: (checklistPeriod: ChecklistPeriod) => void
  answerChecklistPeriod: ({
    checklistId,
    checklistPeriodId,
    statusId,
    answer,
    statusNC,
    images,
  }: {
    checklistId: number
    checklistPeriodId: number
    statusId: number
    statusNC?: number
    images?: ChecklistPeriodImage[]
    answer: string
  }) => void
  saveCurrentImages: ({
    checklistId,
    checklistPeriodId,
    images,
  }: {
    checklistId: number
    checklistPeriodId: number
    images: ChecklistPeriodImage[]
  }) => void
  setChecklistLoadingId: (arg: number) => void
  updateChecklistSync: ({
    oldId,
    newId,
    syncStatus,
  }: {
    oldId: number
    newId: number
    syncStatus: 'synced' | 'updated' | 'errored'
  }) => void
  updatePeriodSync: ({
    oldId,
    newId,
    productionRegisterId,
    syncStatus,
  }: {
    oldId: number
    newId: number
    productionRegisterId: number
    syncStatus: 'synced' | 'updated' | 'errored'
  }) => void
  generateChecklists: (user: string) => Promise<void>
  syncChecklists: (user: string, token: string) => Promise<void>
}

export const useChecklist = create<ChecklistsData>((set, get) => {
  return {
    allChecklists: null,
    checklistLoadingId: 0,
    currentImages: null,

    loadChecklists: async (user) => {
      try {
        const checklists = db.retrieveChecklists(user)

        set({
          allChecklists: checklists,
        })
      } catch {
        // console.log(err)
      }
    },

    findChecklist: (checklistId) => {
      const allChecklists = get().allChecklists
      if (!allChecklists) throw new Error('Checklists não carregados')

      const checklist = allChecklists.find((item) => item.id === checklistId)
      if (!checklist) throw new Error('Checklist não encontrado')

      return checklist
    },

    updateChecklist: (checklist) => {
      const allChecklists = get().allChecklists
      const newChecklists: Checklist[] = []
      if (!allChecklists) throw new Error('Checklists não carregados')

      allChecklists.forEach((item) => {
        if (item.id === checklist.id) {
          checklist.syncStatus =
            item.syncStatus === 'inserted' ? 'inserted' : 'updated'
          newChecklists.push(checklist)
        } else {
          newChecklists.push(item)
        }
      })

      db.storeChecklists(newChecklists)
      db.setNeedToUpdate(true)
      set({ allChecklists: newChecklists })
    },

    createChecklist: ({ period, mileage, equipment, user }) => {
      const productionRegisterId = Number(
        new Date().getTime().toFixed().slice(6),
      )

      const newChecklist: Checklist = {
        id: productionRegisterId,
        date: new Date().toISOString(),
        finalTime: '',
        initialTime: new Date().toISOString(),
        period,
        mileage,
        status: 'open',
        equipment,
        signatures: [],
        checklistPeriods: createTasks({
          familyId: equipment.familyId,
          checklistId: productionRegisterId,
          branchId: equipment.branchId,
          user,
        }),
        error: {},
        syncStatus: 'inserted',
      }

      const checklists = get().allChecklists
      if (!checklists) throw new Error('Checklists não carregados')

      if (!newChecklist.checklistPeriods.length) {
        throw new Error('Não há perguntas vinculadas para esse equipamento')
      }

      checklists.forEach((checklist) => {
        if (checklist.equipment.id === equipment.id) {
          if (
            checklist.period?.id === period?.id &&
            dayjs(checklist.initialTime).isAfter(
              dayjs(new Date()).subtract(1, 'day'),
            )
          ) {
            throw new Error(
              'Já existe um checklist para esse equipamento nesse turno',
            )
          } else if (
            dayjs(checklist.initialTime).isAfter(
              dayjs(new Date()).subtract(1, 'day'),
            )
          ) {
            throw new Error(
              'Já existe um checklist para esse equipamento nesse turno',
            )
          }
        }
      })

      const newChecklists = [...get().allChecklists, newChecklist]
      set({ allChecklists: newChecklists })
      db.storeChecklists(newChecklists)
      db.setNeedToUpdate(true)

      return newChecklist
    },

    finalizeChecklist: (checklistId) => {
      const checklist = get().findChecklist(checklistId)

      checklist.status = 'close'

      get().updateChecklist(checklist)
    },

    findChecklistPeriod: (checklistPeriodId, checklistId) => {
      const checklist = get().findChecklist(checklistId)

      const checklistPeriod = checklist.checklistPeriods.find(
        (item) => item.id === checklistPeriodId,
      )
      if (!checklistPeriod)
        throw new Error('Não foi possível encontrar o ChecklistPeriod')

      return checklistPeriod
    },

    updateChecklistPeriod: (checklistPeriod) => {
      const allChecklists = get().allChecklists
      const newChecklists: Checklist[] = []
      if (!allChecklists) throw new Error('Checklists não carregados')

      allChecklists.forEach((checklist) => {
        if (checklist.id === checklistPeriod.productionRegisterId) {
          const updatedChecklist = { ...checklist }
          const newChecklistPeriods: ChecklistPeriod[] = []
          updatedChecklist.checklistPeriods.forEach((item) => {
            if (item.id === checklistPeriod.id) {
              checklistPeriod.syncStatus =
                item.syncStatus !== 'inserted' ? 'updated' : 'inserted'
              newChecklistPeriods.push(checklistPeriod)
            } else {
              newChecklistPeriods.push(item)
            }
          })
          updatedChecklist.checklistPeriods = newChecklistPeriods
          newChecklists.push(updatedChecklist)
        } else {
          newChecklists.push(checklist)
        }
      })

      const updated = newChecklists.find(
        (item) => item.id === checklistPeriod.productionRegisterId,
      )
      if (!updated) return
      get().updateChecklist(updated)
    },

    answerChecklistPeriod: ({
      checklistId,
      checklistPeriodId,
      answer,
      statusId,
      statusNC,
      images = [],
    }) => {
      const period = get().findChecklistPeriod(checklistPeriodId, checklistId)

      period.statusId = statusId
      period.task.answer = answer
      period.statusNC = statusNC
      period.img = images

      get().updateChecklistPeriod(period)
    },

    saveCurrentImages: ({ checklistId, checklistPeriodId, images }) => {
      // const period = get().findChecklistPeriod(checklistPeriodId, checklistId)

      // period.img = images

      // get().updateChecklistPeriod(period)
      set({ currentImages: { checklistId, checklistPeriodId, images } })
    },

    setChecklistLoadingId: (id) => {
      if (id) console.log('Sincronizando checklist de id ' + id)
      set({ checklistLoadingId: id })
    },

    updateChecklistSync: ({ newId, oldId, syncStatus }) => {
      const checklists = get().allChecklists

      const newChecklists: Checklist[] = []
      checklists.forEach((checklist) => {
        if (checklist.id === oldId) {
          checklist.id = newId
          checklist.syncStatus = syncStatus
        }
        newChecklists.push(checklist)
      })

      db.storeChecklists(newChecklists)
      set({ allChecklists: newChecklists })
    },

    updatePeriodSync: ({ newId, oldId, productionRegisterId, syncStatus }) => {
      const checklists = get().allChecklists

      const newChecklists: Checklist[] = []
      checklists.forEach((checklist) => {
        if (checklist.id === productionRegisterId) {
          const newPeriods: ChecklistPeriod[] = []
          checklist.checklistPeriods.forEach((period) => {
            if (period.id === oldId) {
              period.id = newId
              period.syncStatus = syncStatus
            }
            newPeriods.push(period)
          })
        }
        newChecklists.push(checklist)
      })

      db.storeChecklists(newChecklists)
      set({ allChecklists: newChecklists })
    },

    generateChecklists: async (user) => {
      try {
        const equipments = db.retrieveEquipments(user)
        const checklistSchemas: ChecklistSchema[] = db.retrieveReceivedData(
          user,
          '/@checklistSchemas',
        )

        const periods: Period[] = db.retrieveReceivedData(user, '/@periods')
        const checklists: Checklist[] = checklistSchemas
          .map((checklist) => {
            const matchEquipment = equipments.find(
              (eq) => eq.id === checklist.equipmentId,
            )
            return {
              id: checklist.id,
              _id: '',
              initialTime: checklist.initialTime,
              finalTime: checklist.finalTime,
              date: checklist.date,
              status: checklist.status,
              mileage: matchEquipment.mileage,
              signatures: [],
              equipment: matchEquipment,
              period: periods
                .map((period) => ({
                  id: period.id,
                  period: period.period,
                  branchId: period.branchId,
                }))
                .find((period) => period.id === checklist.periodId),
              checklistPeriods: findTasks({
                familyId: matchEquipment.familyId,
                branchId: matchEquipment.branchId,
                checklistId: checklist.id,
                user,
              }),
              syncStatus: 'synced',
              error: {},
            } as Checklist
          })
          .filter((checklist) => checklist.initialTime?.length)

        db.storeChecklists(checklists)
        if (!checklists || !checklists?.length) {
          console.log('Nenhum checklist')
        }
      } catch (err) {
        console.log('Erro generate')
        console.log(err)
        throw new Error('Falha ao escrever checklists', {
          cause: err,
        })
      }
    },

    syncChecklists: async (user, token) => {
      try {
        const storedChecklists = db.retrieveChecklists(user)
        if (!storedChecklists) {
          console.log('Não há checklists carregados')
          return get().generateChecklists(user)
        }
        const checklists = storedChecklists.filter(
          (item) =>
            item.syncStatus === 'inserted' || item.syncStatus === 'updated',
        )

        if (checklists.length) {
          console.log('Há checklists para serem sincronizados')
          console.log('Enviando dados...')

          const options = {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }

          for await (const checklist of checklists) {
            const updatedIdChecklist = { ...checklist }
            get().setChecklistLoadingId(checklist.id)
            const postChcklist = {
              type: checklist.syncStatus,
              checkListSchema: {
                _id: String(checklist.id),
                id: checklist.id,
                date: checklist.date,
                code: checklist.equipment.code,
                period: '',
                description: checklist.equipment.description,
                status: checklist.status,
                equipmentId: checklist.equipment.id,
                mileage: checklist.mileage,
                finalMileage: checklist.mileage,
                initialTime: checklist.initialTime,
                finalTime: checklist.finalTime || '',
                login: user,
                periodId: checklist.period?.id || 0,
              },
            }

            console.log(JSON.stringify(postChcklist, null, 2))
            try {
              await api
                .post('/sync/checkListSchema', postChcklist, options)
                .then((res) => res.data)
                .then(async (data: { id: number }) => {
                  if (checklist.syncStatus === 'inserted') {
                    updatedIdChecklist.id = data.id
                  }

                  for await (const checklistPeriod of checklist.checklistPeriods) {
                    if (checklistPeriod.syncStatus !== 'synced') {
                      console.log(
                        `Enviando checklistPeriod de id ${checklistPeriod.id}...`,
                      )
                      await api
                        .post(
                          '/sync/checkListPeriod',
                          {
                            type: checklistPeriod.syncStatus,
                            checkListPeriod: {
                              _id: String(checklistPeriod.id),
                              id: checklistPeriod.id,
                              branchId: checklistPeriod.branchId,
                              productionRegisterId: data?.id || checklist.id,
                              checkListItemId: checklistPeriod.checklistItemId,
                              statusItem: checklistPeriod.statusId || 0,
                              statusNC: checklistPeriod.statusNC || 0,
                              logDate: new Date().toISOString(),
                              observation: '',
                              img: checklistPeriod.img,
                              actions: [],
                            },
                          },
                          options,
                        )
                        .then((res) => res.data)
                        .then(async (insertedPeriod: { id: number }) => {
                          get().updatePeriodSync({
                            newId: insertedPeriod.id,
                            oldId: checklistPeriod.id,
                            productionRegisterId:
                              checklistPeriod.productionRegisterId,
                            syncStatus: 'synced',
                          })
                          try {
                            for (const img of checklistPeriod.img) {
                              if (img.url === '') {
                                await uploadSingleImage({
                                  img,
                                  route: 'image/upload',
                                  id: insertedPeriod.id,
                                  token,
                                })
                              }
                            }
                          } catch (err) {
                            console.log(err)
                            throw new Error('Erro ao enviar imagens ')
                          }
                        })
                        .catch((err) => {
                          console.log(err)
                          throw new Error(
                            'Erro ao enviar checklistPeriod para rota',
                          )
                        })
                    }
                  }
                })
                .then(() => {
                  get().updateChecklistSync({
                    oldId: checklist.id,
                    newId: updatedIdChecklist.id,
                    syncStatus: 'synced',
                  })
                })
            } catch (err) {
              get().setChecklistLoadingId(0)
              console.log(JSON.stringify(err, null, 2))
              console.log(JSON.stringify(postChcklist, null, 2))
              throw new Error('Teve erro no checklist ' + checklist.id)
            }
          }
        } else {
          await get().generateChecklists(user)
        }
      } catch (err) {
        console.log(err)
      }
    },
  }
})
