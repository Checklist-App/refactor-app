import { create } from 'zustand'
import { useCrashlytics } from './crashlytics-report'

interface SyncStatus {
  isSyncing: boolean
  syncCount: number
  doneRequests: number
  updateSyncing: (arg: boolean) => void
  increaseDoneRequests: () => void
}

export const useSyncStatus = create<SyncStatus>((set, get) => {

  const {sendLog, sendStacktrace} = useCrashlytics.getState()

  return {
    isSyncing: false,
    syncCount: 0,
    doneRequests: 0,

    updateSyncing: (arg) => {
      sendStacktrace(get().updateSyncing)
      sendLog(`arg: ${arg}`)
      if (!arg) {
        set({ syncCount: get().syncCount + 1 })
      }
      set({ isSyncing: arg })
    },

    increaseDoneRequests: () => {
      sendStacktrace(get().increaseDoneRequests)
      set({ doneRequests: get().doneRequests + 1 })
    },
  }
})
