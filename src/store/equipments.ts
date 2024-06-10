import { create } from 'zustand'
import db from '../libs/database'
import { Equipment } from '../types/Equipment'

interface EquipmentsData {
  equipments: Equipment[] | null
  equipmentId: number | null

  loadEquipments: (user: string) => void
  updateEquipmentId: (arg: number) => void
  updateEquipmentById: (user: string, equipment: Equipment) => void
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

    updateEquipmentById: (user, equipment) => {
      console.log(
        `${user} / mileage => ${equipment.mileage} | hourmeter => ${equipment.hourMeter}`,
      )

      set((state) => ({
        equipments: state.equipments?.map((eq) =>
          eq.id === equipment.id ? equipment : eq,
        ),
      }))

      db.updateEquipment(user, equipment)
    },
  }
})
