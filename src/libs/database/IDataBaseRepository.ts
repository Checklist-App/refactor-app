import { Action } from '@/src/types/Action'
import { Responsible } from '@/src/types/Responsible'
import { Checklist } from '../../types/Checklist'
import { Equipment } from '../../types/Equipment'
import { User } from '../../types/User'

export default interface IDataBaseRepository {
  retrieveChecklists: (user: string) => Checklist[]
  retrieveActions: (user: string) => Action[]
  retrieveEquipments: (user: string) => Equipment[]
  retrieveResponsibles: (user: string) => Responsible[]
  retrieveReceivedData: (user: string, path: string) => unknown
  retrieveLastUser: () => User | null
  retriveUsers: () => User[] | null
  retrieveActiveToken: () => string | null

  storeChecklists: (checklists: Checklist[]) => void
  storeActions: (actions: Action[]) => void
  storeReceivedData: (path: string, data: object) => void
  storeUser: (user: User) => void
  storeToken: (token: string) => void

  checkNeedToUpdate: () => boolean
  setNeedToUpdate: (arg: boolean) => void
  deleteKey: (key: string) => void
}
