import { AxiosError } from 'axios'
import { create } from 'zustand'
import { api } from '../libs/api'
import { useCrashlytics } from './crashlytics-report'

interface ConnectionStore {
  isConnected: boolean
  establishConnection: () => Promise<void>
  testConnection: () => Promise<void>
}

export const useConnection = create<ConnectionStore>((set, get) => {

  const {sendLog, reportError, sendStacktrace} = useCrashlytics.getState()

  return {
    isConnected: false,

    establishConnection: async () => {
      sendStacktrace(get().establishConnection)
      sendLog(`endpoint / get`)
      await api
        .get('/')
        .then(() => {
          set({ isConnected: true })
          const addressConnectedLog = `Conectado no endereço ${process.env.EXPO_PUBLIC_API_URL}`
          sendLog(addressConnectedLog)
          console.log(
            addressConnectedLog
          )
        })
        .catch((err: AxiosError) => {
          console.log('Erro ao estabilizar conexão')
          console.log(err.request)
          reportError(err)
          set({ isConnected: false })
        })
    },

    testConnection: async () => {
      sendStacktrace(get().testConnection)
      sendLog(`endpoint / get`)
      await api
        .get('/')
        .then(() => set({ isConnected: true }))
        .catch(() => set({ isConnected: false }))
    },
  }
})
