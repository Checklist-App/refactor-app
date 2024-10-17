import { create } from 'zustand'
import db from '../libs/database'
import { Location } from '../types/Location'
import { useCrashlytics } from './crashlytics-report'

interface LocationsData {
  locations: Location[] | null
  locationId: number | null

  updateLocation: (arg: number) => void
  loadLocations: (user: string) => void
}

export const useLocations = create<LocationsData>((set, get) => {

  const {sendLog, reportError, sendStacktrace} = useCrashlytics.getState()

  return {
    locations: null,
    locationId: null,

    updateLocation: (arg) => {
      sendStacktrace(get().updateLocation)
      sendLog(`arg: ${arg}`)
      set({ locationId: arg })
    },

    loadLocations: (user) => {
      sendStacktrace(get().loadLocations)
      sendLog(`user: ${user}`)
      const locations = db.retrieveLocations(user)
      set({ locations })
    },
  }
})
