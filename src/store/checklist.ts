import { AxiosError } from 'axios'
import { getTime } from 'date-fns'
import dayjs from 'dayjs'
import { create } from 'zustand'
import { api } from '../libs/api'
import db from '../libs/database'
import { createTasks } from '../services/createTasks'
import { downloadImage } from '../services/downloadImage'
import { findTasks } from '../services/findTasks'
import { uploadSingleImage } from '../services/uploadImages'
import { Action } from '../types/Action'
import { Checklist } from '../types/Checklist'
import { ChecklistPeriod, ChecklistPeriodImage } from '../types/ChecklistPeriod'
import { ChecklistSchema } from '../types/ChecklistSchema'
import { Equipment } from '../types/Equipment'
import { Location } from '../types/Location'
import { Period } from '../types/Period'
import { useCrashlytics } from './crashlytics-report'

interface ChecklistsData {
  allChecklists: Checklist[] | null
  checklistLoadingId: number
  isAnswering: boolean

  updateAnswering: (arg: boolean) => void
  loadChecklists: (user: string) => void
  findChecklist: (checklistId: number) => Checklist
  updateChecklist: (checklist: Checklist) => void
  createChecklist: ({
    period,
    equipment,
    location,
    user,
    model,
    mileage,
    hourmeter,
  }: {
    period?: Checklist['period']
    equipment: Equipment | null
    location: Location | null
    user: string
    model: number[]
    mileage?: number
    hourmeter?: number
  }) => Checklist
  deleteChecklist: (checklistId: number) => void
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
  setChecklistLoadingId: (arg: number) => void
  updateChecklistSync: ({
    oldId,
    newId,
    syncStatus,
  }: {
    oldId: number
    newId: number
    syncStatus: 'synced' | 'updated'
  }) => void
  updatePeriodSync: ({
    oldId,
    newId,
    productionRegisterId,
    oldChecklistId,
    syncStatus,
  }: {
    oldId: number
    newId: number
    oldChecklistId: number
    productionRegisterId: number
    syncStatus: 'synced' | 'updated' | 'errored'
  }) => void
  loadImages: (checklists: Checklist[]) => Promise<void>
  generateChecklists: (user: string) => Checklist[]
  syncChecklists: (user: string, token: string) => Promise<void>
}

export const useChecklist = create<ChecklistsData>((set, get) => {

  const { sendStacktrace, sendLog, reportError} = useCrashlytics.getState()

  return {
    allChecklists: null,
    checklistLoadingId: 0,
    isAnswering: false,

    updateAnswering: (arg) => {
      sendStacktrace(get().updateAnswering)
      sendLog(`arg: ${arg}`)
      set({ isAnswering: arg })
    },

    loadChecklists: async (user) => {
      sendStacktrace(get().loadChecklists)
      sendLog(`user: ${user}`)
      try {
        const checklists = db.retrieveChecklists(user)

        set({
          allChecklists: checklists,
        })
      } catch(err) {
        reportError(err)
        // console.log(err)
      }
    },

    findChecklist: (checklistId) => {
      sendStacktrace(get().findChecklist)
      const allChecklists = get().allChecklists
      if (!allChecklists) throw new Error('Checklists não carregados')

      const checklist = allChecklists.find((item) => item.id === checklistId)
      if (!checklist) throw new Error('Checklist não encontrado')

      return checklist
    },

    updateChecklist: (checklist) => {
      sendStacktrace(get().updateChecklist)
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

    createChecklist: ({
      period,
      equipment,
      model,
      user,
      location,
      mileage,
      hourmeter,
    }) => {
      sendStacktrace(get().createChecklist)
      console.log("Entrou createChecklist");
      
      const productionRegisterId = Number(
        new Date().getTime().toFixed().slice(6),
      )

      console.log('mileage | hourmeter =>', mileage, hourmeter)

      const newChecklist: Checklist = {
        id: productionRegisterId,
        equipmentId: equipment?.id || null,
        locationId: location?.id || null,
        model,
        finalTime: null,
        initialTime: new Date(),
        period,
        status: 'open',
        checklistPeriods: createTasks({
          checklistId: productionRegisterId,
          model,
          branchId: equipment ? equipment.branchId : location.branchId,
          user,
        }),
        error: null,
        syncStatus: 'inserted',
        mileage,
        hourmeter,
      }

      const checklists = get().allChecklists
      if (!checklists) throw new Error('Checklists não carregados')
      console.log("checklists: ", checklists);

      console.log("newChecklist: ", newChecklist);
      console.log("newChecklist.checklistPeriods: ", newChecklist.checklistPeriods);
      console.log("newChecklist.checklistPeriods.length: ", newChecklist.checklistPeriods.length)
      if (!newChecklist.checklistPeriods.length) {
        throw new Error('Não há perguntas vinculadas para esse registro')
      }
      
      checklists.forEach((checklist) => {
        if (
          checklist.equipmentId === equipment?.id ||
          checklist.locationId === location?.id
          ) {
            if (
              checklist.period?.id === period?.id &&
              dayjs(dayjs(checklist.initialTime).format('YYYY-MM-DD')).isSame(
                dayjs().format('YYYY-MM-DD'),
                )
                ) {
            throw new Error(
              'Já existe um checklist para esse registro nesse turno',
            )
          }
        }
      })
      
      const newChecklists = [...get().allChecklists, newChecklist]
      console.log("newChecklist: ", newChecklist);
      set({ allChecklists: newChecklists })
      db.storeChecklists(newChecklists)
      db.setNeedToUpdate(true)

      return newChecklist
    },

    deleteChecklist: (checklistId) => {
      sendStacktrace(get().deleteChecklist)

      const newChecklists = get().allChecklists.filter(
        (item) => item.id !== checklistId,
      )
      set({ allChecklists: newChecklists })
      db.storeChecklists(newChecklists)
    },

    finalizeChecklist: (checklistId) => {
      sendStacktrace(get().finalizeChecklist)
      const checklist = get().findChecklist(checklistId)

      checklist.status = 'close'
      checklist.finalTime = new Date()

      get().updateChecklist(checklist)
    },

    findChecklistPeriod: (checklistPeriodId, checklistId) => {
      sendStacktrace(get().findChecklistPeriod)
      const checklist = get().findChecklist(checklistId)

      const checklistPeriod = checklist.checklistPeriods.find(
        (item) => item.id === checklistPeriodId,
      )
      if (!checklistPeriod)
        throw new Error('Não foi possível encontrar o ChecklistPeriod')

      return checklistPeriod
    },

    updateChecklistPeriod: (checklistPeriod) => {
      sendStacktrace(get().updateChecklistPeriod)
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
                item.syncStatus === 'synced' ? 'updated' : item.syncStatus
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
      sendStacktrace(get().answerChecklistPeriod)
      const period = get().findChecklistPeriod(checklistPeriodId, checklistId)

      period.statusId = statusId
      period.task.answer = answer
      period.statusNC = statusNC
      period.img = images

      get().updateChecklistPeriod(period)
    },

    setChecklistLoadingId: (id) => {
      sendStacktrace(get().setChecklistLoadingId)
      if (id) {
        console.log('Sincronizando checklist de id ' + id)
        sendLog(`Sincronizando checklist de id ${id}`)
      }
      set({ checklistLoadingId: id })
    },

    updateChecklistSync: ({ newId, oldId, syncStatus }) => {
      sendStacktrace(get().updateChecklistSync)
      sendLog(`newId: ${newId} | oldId: ${oldId} | syncStatus: ${syncStatus}`)

      const checklists = get().allChecklists
      const storedActions = db.retrieveActions(db.retrieveLastUser().login)

      const newChecklists: Checklist[] = []
      const newActions: Action[] = []
      checklists.forEach((checklist) => {
        if (checklist.id === oldId) {
          checklist.id = newId
          checklist.syncStatus = syncStatus
          checklist.error = null
        }
        newChecklists.push(checklist)
      })

      console.log(`OLD ID => ${oldId}`)
      storedActions.forEach((action) => {
        console.log(action.checklistId, action.checklistId === oldId)

        if (action.checklistId === oldId) {
          console.log(`ACTION => ${JSON.stringify(action, null, 2)}`)

          action.checklistId = newId
        }
        newActions.push(action)
      })

      db.storeChecklists(newChecklists)
      db.storeActions(newActions)
      set({ allChecklists: newChecklists })
    },

    updatePeriodSync: ({
      newId,
      oldId,
      productionRegisterId,
      oldChecklistId,
      syncStatus,
    }) => {
      sendStacktrace(get().updatePeriodSync)
      const checklists = get().allChecklists
      const storedActions = db.retrieveActions(db.retrieveLastUser().login)
      const paramsMessage = `OLD ID: ${oldId}; NEW ID: ${newId} PRODUCTION ID: ${productionRegisterId}`
      console.log(
        paramsMessage,
      )
      sendLog(paramsMessage)

      const newChecklists: Checklist[] = []
      const newActions: Action[] = []
      checklists.forEach((checklist) => {
        if (checklist.id === oldChecklistId) {
          const newPeriods: ChecklistPeriod[] = []
          checklist.checklistPeriods.forEach((period) => {
            if (period.id === oldId) {
              const periodIdMessage = `PERIOD ID ${period.id}`
              console.log(periodIdMessage)

              period.id = newId
              period.productionRegisterId = productionRegisterId
              period.syncStatus = syncStatus
            }
            newPeriods.push(period)
          })
        }
        newChecklists.push(checklist)
      })

      storedActions.forEach((action) => {
        if (action.checklistPeriodId === oldId) {
          action.checklistId = productionRegisterId
          action.checklistPeriodId = newId
        }
        newActions.push(action)
      })

      db.storeChecklists(newChecklists)
      db.storeActions(newActions)
      set({ allChecklists: newChecklists })
    },

    loadImages: async (checklists) => {
      sendStacktrace(get().loadImages)
      console.log('load images')
      try {
        const newChecklists: Checklist[] = []
        const storedChecklists = db.retrieveChecklists(
          db.retrieveLastUser().login,
        )
        for await (const checklist of checklists) {
          const newPeriods: ChecklistPeriod[] = []
          const matchChecklist = storedChecklists.find(
            (item) => item.id === checklist.id,
          )
          for await (const period of checklist.checklistPeriods) {
            const newImages: { name: string; url: string; path: string }[] = []
            const matchPeriod = matchChecklist?.checklistPeriods.find(
              (item) => item.id === period.id,
            )
            for await (const img of period.img) {
              const matchImg = matchPeriod?.img.find(
                (item) => item.name === img.name,
              )
              if (matchImg?.path) {
                console.log('Imagem ja baixada')
                sendLog('Imagem já baixada')
              }
              if (img.url && !matchImg?.path) {
                sendLog(`Baixando imagem ${JSON.stringify(img)}`)
                const newImgPath = await downloadImage(img.url)
                newImages.push({ ...img, path: newImgPath })
              } else {
                newImages.push(img)
              }
            }
            newPeriods.push({ ...period, img: newImages })
          }
          newChecklists.push({ ...checklist, checklistPeriods: newPeriods })
        }
        console.log('terminou load images')
        sendLog('Terminou load images')
        db.storeChecklists(newChecklists)
      } catch (err) {
        reportError(err)
        console.log('Erro ao carregar imagens')
        throw err
      }
    },

    generateChecklists: (user) => {
      sendStacktrace(get().generateChecklists)
      try {
        console.log('generate')
        const equipments = db.retrieveEquipments(user)
        const locations = db.retrieveLocations(user)
        const checklistSchemas: ChecklistSchema[] = db.retrieveReceivedData(
          user,
          '/@checklistSchemas',
        )

        const periods: Period[] = db.retrieveReceivedData(user, '/@periods')
        const checklists: Checklist[] = checklistSchemas.map((checklist) => {
          const matchEquipment = equipments.find(
            (eq) => eq.id === checklist.equipmentId,
          )

          const matchLocation = locations.find(
            (item) => item.id === checklist.locationId,
          )

          const data: Checklist = {
            id: checklist.id,
            equipmentId: checklist.equipmentId,
            locationId: checklist.locationId,
            initialTime: checklist.initialTime,
            finalTime: checklist.finalTime,
            status: checklist.status,
            model: [],
            period: periods
              .map((period) => ({
                id: period.id,
                period: period.period,
                branchId: period.branchId,
              }))
              .find((period) => period.id === checklist.periodId),
            checklistPeriods: findTasks({
              branchId: matchEquipment
                ? matchEquipment.branchId
                : matchLocation.branchId,
              checklistId: checklist.id,
              user,
            }),
            syncStatus: 'synced',
            error: null,
          }

          return data
        })

        if (!checklists || !checklists?.length) {
          console.log('Nenhum checklist')
          sendLog('Nenhum checklist')
        }
        return checklists
      } catch (err) {
        reportError(err)
        console.log('Erro generate')
        console.log(err)
        throw new Error('Falha ao escrever checklists', {
          cause: err,
        })
      }
    },

    syncChecklists: async (user, token) => {
      sendStacktrace(get().syncChecklists)
      console.log('Sync checklists')
      try {
        const storedChecklists = db.retrieveChecklists(user)
        if (!storedChecklists) {
          const emptyChecklists = 'Não há checklists'
          console.log(emptyChecklists)
          sendLog(emptyChecklists)
          return get().loadImages(get().generateChecklists(user))
        }
        const checklists = storedChecklists.filter(
          (item) =>
            item.syncStatus === 'inserted' || item.syncStatus === 'updated',
        ).sort(((a, b) => getTime(a.initialTime) - getTime(b.initialTime))) 

        if (checklists.length) {
          sendLog(`${checklists.length} para sincronizar.`)
          const options = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

          for await (const checklist of checklists) {
            get().setChecklistLoadingId(checklist.id)
            const postChecklist = {
              equipmentId: checklist.equipmentId,
              locationId: checklist.locationId,
              periodId: checklist.period?.id || null,
              model: checklist.model,
              initialTime: checklist.initialTime,
              finalTime: checklist.finalTime,
              status: checklist.status,
              hourMeter: checklist.hourmeter,
              mileage: checklist.mileage,
            }

            const updateChecklist = {
              id: checklist.id,
              status: checklist.status,
              finalTime: checklist.finalTime,
            }

            function requestMethod() {
              if (checklist.syncStatus === 'inserted') {
                return api.post('/checkList', postChecklist, options)
              } else {
                return api.put(
                  '/checkList/putCheckList',
                  updateChecklist,
                  options,
                )
              }
            }

            await requestMethod()
              .then((res) => res.data)
              .then(async ({ id: newId }: { id: number }) => {
                const sendedChecklistLog = 'Checklist enviado'
                console.log(sendedChecklistLog)
                const checklistSyncingLog = `Checklist newId ${newId} sincronizado`
                sendLog(checklistSyncingLog)
                for await (const checklistPeriod of checklist.checklistPeriods) {
                  if (checklistPeriod.syncStatus !== 'synced') {
                    const sendingCheckistPeriodLog = `Enviando checklistPeriod de id ${checklistPeriod.id}...`
                    console.log(
                      sendingCheckistPeriodLog
                    )
                    sendLog(sendingCheckistPeriodLog)
                    const period = {
                      type: checklistPeriod.syncStatus,
                      checkListPeriod: {
                        _id: String(checklistPeriod.id),
                        id: checklistPeriod.id,
                        branchId: checklistPeriod.branchId,
                        productionRegisterId: newId || checklist.id,
                        checkListItemId: checklistPeriod.checklistItemId,
                        statusItem: checklistPeriod.statusId || 0,
                        statusNC: checklistPeriod.statusNC,
                        logDate: new Date().toISOString(),
                        observation: '',
                      },
                    }
                    const checkListPeriodRoute = '/sync/checkListPeriod'
                    const postingEndpointLog = `posting endpoint ${checkListPeriodRoute}`
                    sendLog(postingEndpointLog)
                    await api
                      .post(checkListPeriodRoute, period, options)
                      .then((res) => {
                        sendLog(`${postingEndpointLog} status: ${res.status}`)
                        return res.data
                      })
                      .then(async (insertedPeriod: { id: number }) => {
                        get().updatePeriodSync({
                          newId: insertedPeriod.id,
                          oldId: checklistPeriod.id,
                          oldChecklistId: checklist.id,
                          productionRegisterId: newId,
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
                          reportError(err)
                          console.log(
                            'Erro ao enviar imagem para rota /image/upload',
                          )
                          if (err instanceof AxiosError) {
                            throw err
                          } else {
                            throw new Error('Erro ao enviar imagens')
                          }
                        }
                      })
                      .catch((err) => {
                        console.log('Erro ao subir esse checklist:')
                        reportError(err)
                        console.log(period)
                        if (err instanceof AxiosError) {
                          throw err
                        } else {
                          throw new Error(
                            'Erro ao enviar checklistPeriod para rota',
                          )
                        }
                      })
                  }
                }

                return newId
              })
              .then((newId) => {
                get().updateChecklistSync({
                  oldId: checklist.id,
                  newId,
                  syncStatus: 'synced',
                })
              })

              .then(() => {
                get().setChecklistLoadingId(0)
              })
              .catch((err) => {
                reportError(err)
                console.log(err)
                const erroredChecklist = get().findChecklist(checklist.id)
                if (err instanceof AxiosError) {
                  console.log(err.response?.data)
                  get().updateChecklist({
                    ...erroredChecklist,
                    error: err.response.data?.message,
                  })
                } else {
                  get().updateChecklist({
                    ...erroredChecklist,
                    error: 'unknown',
                  })
                }
                get().setChecklistLoadingId(0)
                console.log('Checklist que não subiu: ')
                console.log(checklist)

                throw new Error('Teve erro no checklist ' + checklist.id)
              })
          }
        } else {
          const emptyChecklistsToSync = 'Não há checklists para sincronizar.'
          console.log(emptyChecklistsToSync)
          sendLog(emptyChecklistsToSync)
          return get().loadImages(get().generateChecklists(user))
        }
      } catch (err) {
        console.log('Erro na sincronização dos checklists')
        reportError(err)
        get().setChecklistLoadingId(0)
        console.log(err)
      }
    },
  }
})
