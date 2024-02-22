import { create } from 'zustand'
import { api } from '../libs/api'

interface ConnectionStore {
  isConnected: boolean
  establishConnection: () => Promise<void>
  testConnection: () => Promise<void>
}

export const useConnection = create<ConnectionStore>((set) => {
  return {
    isConnected: false,

    establishConnection: async () => {
      await api
        .get('/')
        .then(() => {
          set({ isConnected: true })
          console.log(
            `Conectado no endereço ${process.env.EXPO_PUBLIC_API_URL}`,
          )
        })
        .catch(() => set({ isConnected: false }))
    },

    testConnection: async () => {
      await api
        .get('/')
        .then(() => set({ isConnected: true }))
        .catch(() => set({ isConnected: false }))
    },
  }
})
