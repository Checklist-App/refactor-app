import { create } from 'zustand'
import { ChecklistPeriodImage } from '../types/ChecklistPeriod'
import { useCrashlytics } from './crashlytics-report'

interface CameraData {
  currentImages: {
    checklistId: number | null
    checklistPeriodId: number | null
    actionId: number | null
    images: ChecklistPeriodImage[]
  } | null
  saveCurrentImages: ({
    checklistId,
    checklistPeriodId,
    actionId,
    images,
  }: {
    checklistId?: number
    checklistPeriodId?: number
    actionId?: number
    images: ChecklistPeriodImage[]
  }) => void
}

export const useCamera = create<CameraData>((set, get) => {

  const { sendLog, reportError, sendStacktrace } = useCrashlytics.getState()

  return {
    currentImages: null,

    saveCurrentImages: ({
      checklistId,
      checklistPeriodId,
      actionId,
      images,
    }) => {
      sendStacktrace(get().saveCurrentImages)
      sendLog(`checklistId: ${checklistId} | checklistPeriodId: ${checklistPeriodId} | actionId: ${actionId} | images: ${images}`)
      set({
        currentImages: {
          checklistId: checklistId || null,
          checklistPeriodId: checklistPeriodId || null,
          actionId: actionId || null,
          images,
        },
      })
    },
  }
})
