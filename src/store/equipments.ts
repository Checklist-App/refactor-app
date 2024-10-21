import { create } from 'zustand'
import db from '../libs/database'
import { Equipment } from '../types/Equipment'
import { useCrashlytics } from './crashlytics-report'

interface EquipmentsData {
  equipments: Equipment[] | null
  equipmentId: number | null

  loadEquipments: (user: string) => void
  updateEquipmentId: (arg: number) => void
  updateEquipmentById: (user: string, equipment: Equipment) => void
}

export const useEquipments = create<EquipmentsData>((set, get) => {

  const {sendLog, sendStacktrace} = useCrashlytics.getState()

  return {
    equipments: null,
    equipmentId: null,

    loadEquipments: (user) => {
      sendStacktrace(get().loadEquipments)
      sendLog(`user: ${user}`)
      const equipments = db.retrieveEquipments(user)
      set({ equipments })
    },

    updateEquipmentId: (arg) => {
      sendStacktrace(get().updateEquipmentId)
      sendLog(`arg: ${arg}`)
      set({ equipmentId: arg })
    },

    updateEquipmentById: (user, equipment) => {
      sendStacktrace(get().updateEquipmentById)
      const logMessage = `${user} / mileage => ${equipment.mileage} | hourmeter => ${equipment.hourMeter}`
      sendLog(logMessage)
      console.log("logMessage: ", logMessage)
      
      set((state) => ({
        equipments: state.equipments?.map((eq) =>
        eq.id === equipment.id ? equipment : eq,
        ),
      }))
      
      db.updateEquipment(user, equipment)
    },
  }
})
