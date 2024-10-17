import { create } from 'zustand'
import db from '../libs/database'
import { Responsible } from '../types/Responsible'
import { useCrashlytics } from './crashlytics-report'

interface ResponsibleData {
  responsibles: Responsible[] | undefined

  loadResponsibles: (user: string) => void
}

export const useResponsibles = create<ResponsibleData>((set, get) => {

  const {sendLog, reportError, sendStacktrace} = useCrashlytics.getState()

  return {
    responsibles: undefined,

    loadResponsibles: (user) => {
      sendStacktrace(get().loadResponsibles)
      sendLog(`user: ${user}`)
      const responsibles = db.retrieveResponsibles(user)
      set({ responsibles })
    },
  }
})
