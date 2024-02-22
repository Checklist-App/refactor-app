import { Checklist } from '../../types/Checklist'
import { Equipment } from '../../types/Equipment'
import { User } from '../../types/User'

export default interface IDataBaseRepository {
  retrieveChecklists: (user: string) => Checklist[]
  retrieveReceivedData: (user: string, path: string) => unknown
  retrieveEquipments: (user: string) => Equipment[]
  retrieveLastUser: () => User | null
  retriveUsers: () => User[] | null
  retrieveActiveToken: () => string | null

  storeChecklists: (checklists: Checklist[]) => void
  storeReceivedData: (path: string, data: object) => void
  storeUser: (user: User) => void
  storeToken: (token: string) => void

  checkNeedToUpdate: () => boolean
  setNeedToUpdate: (arg: boolean) => void
  deleteKey: (key: string) => void
}
