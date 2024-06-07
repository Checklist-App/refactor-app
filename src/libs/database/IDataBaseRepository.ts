import { Action } from '@/src/types/Action'
import { ChecklistProduction } from '@/src/types/ChecklistProduction'
import { Location } from '@/src/types/Location'
import { Responsible } from '@/src/types/Responsible'
import { Checklist } from '../../types/Checklist'
import { Equipment } from '../../types/Equipment'
import { User } from '../../types/User'

export default interface IDataBaseRepository {
  retrieveChecklists: (user: string) => Checklist[]
  retrieveActions: (user: string) => Action[]
  retrieveEquipments: (user: string) => Equipment[]
  retrieveLocations: (user: string) => Location[]
  retrieveResponsibles: (user: string) => Responsible[]
  retrieveModels: (user: string) => ChecklistProduction[]
  retrieveReceivedData: (user: string, path: string) => unknown
  retrieveLastUser: () => User | null
  retriveUsers: () => User[] | null
  retrieveActiveToken: () => string | null

  storeChecklists: (checklists: Checklist[]) => void
  storeActions: (actions: Action[]) => void
  storeReceivedData: (path: string, data: object) => void
  storeUser: (user: User) => void
  storeToken: (token: string) => void

  updateEquipment: (user: string, equipment: Equipment) => void

  checkNeedToUpdate: () => boolean
  setNeedToUpdate: (arg: boolean) => void
  deleteKey: (key: string) => void
}
