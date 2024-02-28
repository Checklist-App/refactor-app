import { create } from 'zustand'

interface SyncStatus {
  isSyncing: boolean
  syncCount: number
  doneRequests: number
  updateSyncing: (arg: boolean) => void
  increaseDoneRequests: () => void
}

export const useSyncStatus = create<SyncStatus>((set, get) => {
  return {
    isSyncing: false,
    syncCount: 0,
    doneRequests: 0,

    updateSyncing: (arg) => {
      if (!arg) {
        set({ syncCount: get().syncCount + 1 })
      }
      set({ isSyncing: arg })
    },

    increaseDoneRequests: () => {
      set({ doneRequests: get().doneRequests + 1 })
    },
  }
})
