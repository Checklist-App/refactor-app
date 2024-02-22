import dayjs from 'dayjs'
import * as MediaLibrary from 'expo-media-library'
import { useState } from 'react'
import { create } from 'zustand'
import { api } from '../libs/api'
import db from '../libs/database'
import { findTasks } from '../services/findTasks'
import { uploadSingleImage } from '../services/uploadImages'
import { Checklist } from '../types/Checklist'
import { ChecklistPeriod, ChecklistPeriodImage } from '../types/ChecklistPeriod'
import { ChecklistSchema } from '../types/ChecklistSchema'
import { Period } from '../types/Period'

interface ChecklistsData {
  allChecklists: Checklist[] | null
  currentChecklist: Checklist | null
  isLoading: boolean
  isAnswering: boolean
  checklistLoadingId: number

  loadChecklists: (user: string) => void
  findChecklist: (checklistId: number) => Checklist
  updateChecklist: (checklistId: number, checklist: Checklist) => void
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

  findChecklistPeriod: (
    checklistPeriodId: number,
    checklistId: number,
  ) => ChecklistPeriod
  updateChecklistPeriod: ({
    checklistId,
    checklistPeriodId,
    statusId,
    answer,
    images,
    statusNC,
  }: {
    checklistId: number
    checklistPeriodId: number
    statusId: number
    statusNC?: number
    answer: string
    images?: ChecklistPeriodImage[]
  }) => void
  editCurrentImage: ({
    checklistPeriodIndex,
    images,
  }: {
    checklistPeriodIndex: number
    images: ChecklistPeriodImage[]
  }) => void

  setCurrentChecklist: (arg: number) => void
  setChecklistLoadingId: (arg: number) => void
  updateLoading: (arg: boolean) => void
  updateAnswering: (arg: boolean) => void

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
  generateChecklists: (user: string) => void
  syncChecklists: (user: string, token: string) => Promise<void>
}

export const useChecklist = create<ChecklistsData>((set, get) => {
  const [needToClearImages, setNeedToClearImages] = useState(true)
  return {
    allChecklists: null,
    currentChecklist: null,
    isLoading: false,
    isAnswering: false,
    checklistLoadingId: 0,

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

    updateChecklist: (checklistId, checklist) => {
      const allChecklists = get().allChecklists
      const newChecklists: Checklist[] = []
      if (!allChecklists) throw new Error('Checklists não carregados')

      allChecklists.forEach((item) => {
        if (item.id === checklistId) {
          checklist.syncStatus = 'updated'
          newChecklists.push(checklist)
        } else {
          newChecklists.push(item)
        }
      })

      db.storeChecklists(newChecklists)
      db.setNeedToUpdate(true)
      set({ allChecklists: newChecklists })
    },

    createChecklist: ({ period, mileage, equipment }) => {
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
        checklistPeriods: [],
        error: {},
        syncStatus: 'inserted',
      }

      const checklists = get().allChecklists
      if (!checklists) throw new Error('Checklists não carregados')
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

      if (!newChecklist.checklistPeriods.length) {
        throw new Error('Não há perguntas vinculadas para esse equipamento')
      }

      return newChecklist
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

    setCurrentChecklist: (id) => {
      const checklist = get().findChecklist(id)

      set({ currentChecklist: checklist })
    },

    updateChecklistPeriod: ({
      checklistId,
      checklistPeriodId,
      statusId,
      statusNC = 0,
      answer,
      images = [],
    }) => {
      const period = get().findChecklistPeriod(checklistPeriodId, checklistId)
      period.statusId = statusId
      period.task.answer = answer
      period.img = images
      period.statusNC = statusNC

      const allChecklists = get().allChecklists
      const newChecklists: Checklist[] = []
      if (!allChecklists) throw new Error('Checklists não carregados')

      allChecklists.forEach((checklist) => {
        if (checklist.id === checklistId) {
          const updatedChecklist = { ...checklist }
          const newChecklistPeriods: ChecklistPeriod[] = []
          updatedChecklist.checklistPeriods.forEach((item) => {
            if (item.id === checklistPeriodId) {
              period.syncStatus = 'updated'
              newChecklistPeriods.push(period)
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

      const updated = newChecklists.find((item) => item.id === checklistId)
      if (!updated) return
      get().updateChecklist(checklistId, updated)
    },

    editCurrentImage: ({ checklistPeriodIndex, images }) => {
      const newChecklist = { ...get().currentChecklist }
      newChecklist.checklistPeriods[checklistPeriodIndex].img = images

      set({
        currentChecklist: newChecklist,
      })
    },

    setChecklistLoadingId: (id) => {
      if (id) console.log('Sincronizando checklist de id ' + id)
      set({ checklistLoadingId: id })
    },

    updateLoading: (state) => {
      set({ isLoading: state })
    },

    updateAnswering: (state) => {
      set({ isAnswering: state })
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

    generateChecklists: (user) => {
      console.log('generateChecklists')
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
              equipment: {
                ...matchEquipment,
              },
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
            }
          })
          .filter((checklist) => checklist.initialTime?.length)
          .map((checklist) => ({
            ...checklist,
            syncStatus: 'synced',
            error: {},
          }))

        if (!checklists || !checklists.length) {
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
        if (needToClearImages) {
          const permission = await MediaLibrary.requestPermissionsAsync()
          if (permission.status === 'granted') {
            console.log('Buscando album...')
            const album = await MediaLibrary.getAlbumAsync('Smartlist')
            console.log(album)
            console.log('Deletando imagens...')
            await MediaLibrary.deleteAlbumsAsync(album, true).then(() =>
              console.log('Imagens excluidas'),
            )
            setNeedToClearImages(false)
          }
        }

        const storedChecklists = db.retrieveChecklists(user)
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
            try {
              const updatedIdChecklist = { ...checklist }
              get().setChecklistLoadingId(checklist.id)
              await api
                .post(
                  '/sync/checkListSchema',
                  {
                    type: checklist.syncStatus,
                    checklistSchema: {
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
                      periodId: checklist.period?.id || null,
                    },
                  },
                  options,
                )
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
              console.log(err)
              throw new Error('Teve erro no checklist ' + checklist.id)
            }
          }
        } else {
          get().generateChecklists(user)
        }
      } catch {
        get().generateChecklists(user)
      }
    },
  }
})
