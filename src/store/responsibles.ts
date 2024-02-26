import { create } from 'zustand'
import db from '../libs/database'
import { Responsible } from '../types/Responsible'

interface ResponsibleData {
  responsibles: Responsible[] | undefined

  loadResponsibles: (user: string) => void
}

export const useResponsibles = create<ResponsibleData>((set) => {
  return {
    responsibles: undefined,

    loadResponsibles: (user) => {
      const responsibles = db.retrieveResponsibles(user)
      set({ responsibles })
    },
  }
})
