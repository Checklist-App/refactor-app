import { create } from 'zustand'
import db from '../libs/database'
import { Equipment } from '../types/Equipment'

interface EquipmentsData {
  equipments: Equipment[] | null

  loadEquipments: (user: string) => void
}

export const useEquipments = create<EquipmentsData>((set) => {
  return {
    equipments: null,

    loadEquipments: (user) => {
      console.log('load equipments')
      const equipments = db.retrieveEquipments(user)
      console.log(equipments)
      set({ equipments })
    },
  }
})
