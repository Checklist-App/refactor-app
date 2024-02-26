import * as MediaLibrary from 'expo-media-library'
import { create } from 'zustand'

interface SyncStore {
  syncCount: number
  doneRequests: number
  isSyncing: boolean
  needToClearImages: boolean

  increaseDoneRequests: () => void
  updateSyncing: (arg: boolean) => void
  clearImagesIfNeeded: () => Promise<void>
}

export const useSync = create<SyncStore>((set, get) => {
  return {
    syncCount: 0,
    doneRequests: 0,
    isSyncing: false,
    needToClearImages: true,

    increaseDoneRequests: () => {
      set({ doneRequests: get().doneRequests + 1 })
    },

    updateSyncing: (arg) => {
      if (arg === false) {
        set({ syncCount: get().syncCount + 1 })
      }
      set({ isSyncing: arg })
    },

    clearImagesIfNeeded: async () => {
      if (get().needToClearImages) {
        const permission = await MediaLibrary.requestPermissionsAsync()
        if (permission.status === 'granted') {
          console.log('Buscando album...')
          const album = await MediaLibrary.getAlbumAsync('Smartlist')
          console.log(album)
          console.log('Deletando imagens...')
          await MediaLibrary.deleteAlbumsAsync(album, true).then(() =>
            console.log('Imagens excluidas'),
          )
          set({ needToClearImages: false })
        }
      }
    },
  }
})
