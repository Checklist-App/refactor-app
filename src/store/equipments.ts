import { create } from 'zustand'
import db from '../libs/database'
import { Equipment } from '../types/Equipment'

interface EquipmentsData {
  equipments: Equipment[] | null
  equipmentId: number | null

  loadEquipments: (user: string) => void
  updateEquipmentId: (arg: number) => void
}

export const useEquipments = create<EquipmentsData>((set) => {
  return {
    equipments: null,
    equipmentId: null,

    loadEquipments: (user) => {
      const equipments = db.retrieveEquipments(user)
      set({ equipments })
    },

    updateEquipmentId: (arg) => {
      set({ equipmentId: arg })
    },
  }
})
