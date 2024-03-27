import { create } from 'zustand'
import db from '../libs/database'
import { Location } from '../types/Location'

interface LocationsData {
  locations: Location[] | null
  locationId: number | null

  updateLocation: (arg: number) => void
  loadLocations: (user: string) => void
}

export const useLocations = create<LocationsData>((set) => {
  return {
    locations: null,
    locationId: null,

    updateLocation: (arg) => {
      set({ locationId: arg })
    },

    loadLocations: (user) => {
      const locations = db.retrieveLocations(user)
      set({ locations })
    },
  }
})
