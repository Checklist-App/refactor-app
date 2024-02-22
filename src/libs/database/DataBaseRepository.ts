import { Checklist } from '@/src/types/Checklist'
import { Equipment } from '@/src/types/Equipment'
import { User } from '@/src/types/User'
import IDataBaseRepository from './IDataBaseRepository'
import IDataBaseService from './IDataBaseService'

export default class DataBaseRepository implements IDataBaseRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(private mmkv: IDataBaseService) {}

  retrieveChecklists(user: string) {
    const storedChecklists = this.mmkv.getString(`${user}/checklists`)
    if (storedChecklists) {
      const checklists: Checklist[] = JSON.parse(storedChecklists)
      return checklists
    } else {
      throw new Error('Não foi possível carregar os atendimentos')
    }
  }

  retrieveReceivedData(user: string, path: string) {
    const stored = this.mmkv.getString(user + path)
    if (stored) {
      const data = JSON.parse(stored)
      return data
    } else {
      throw new Error(
        'Não foi possível carregar as informações salvas de ' + path,
      )
    }
  }

  retrieveEquipments(user: string) {
    const storedEquipments = this.mmkv.getString(`${user}/@equipments`)
    if (storedEquipments) {
      const equipments: Equipment[] = JSON.parse(storedEquipments)
      return equipments
    } else {
      throw new Error('Não foi possível carregar os atendimentos')
    }
  }

  retrieveLastUser() {
    const storedUser = this.mmkv.getString('lastUser')
    if (storedUser) {
      const user: User = JSON.parse(storedUser)
      return user
    } else {
      return null
    }
  }

  retrieveActiveToken() {
    const token = this.mmkv.getString('activeToken')
    if (token) {
      return token
    } else {
      return null
    }
  }

  retriveUsers() {
    const allUsersString = this.mmkv.getString('users')
    if (allUsersString) {
      const allUsers: User[] = JSON.parse(allUsersString)
      return allUsers
    } else {
      return null
    }
  }

  storeChecklists(checklists: Checklist[]) {
    const user = this.retrieveLastUser()
    if (user) {
      this.mmkv.set(`${user.login}/checklists`, JSON.stringify(checklists))
    } else {
      throw new Error('Usuário não encontrado')
    }
  }

  storeReceivedData(path: string, data: object) {
    this.mmkv.set(path, JSON.stringify(data))
  }

  storeUser(user: User) {
    this.mmkv.set('lastUser', JSON.stringify(user))
    const allUsers = this.retriveUsers()
    const newUsers: User[] = []
    if (allUsers) {
      allUsers.forEach((item) => {
        if (item.login !== user.login) {
          newUsers.push(item)
        }
      })
    }
    newUsers.push(user)
    this.mmkv.set('users', JSON.stringify(newUsers))
  }

  storeToken(token: string) {
    this.mmkv.set('activeToken', token)
  }

  checkNeedToUpdate() {
    const needToUpdate = this.mmkv.getBoolean('needToUpdate')
    if (needToUpdate === undefined) {
      this.setNeedToUpdate(false)
      return false
    } else {
      return needToUpdate
    }
  }

  setNeedToUpdate(arg: boolean) {
    this.mmkv.set('needToUpdate', arg)
  }

  deleteKey(key: string) {
    this.mmkv.delete(key)
  }
}
