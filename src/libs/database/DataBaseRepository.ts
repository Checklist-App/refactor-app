import { Action } from '@/src/types/Action'
import { Checklist } from '@/src/types/Checklist'
import { ChecklistProduction } from '@/src/types/ChecklistProduction'
import { Equipment } from '@/src/types/Equipment'
import { Location } from '@/src/types/Location'
import { Responsible } from '@/src/types/Responsible'
import { User } from '@/src/types/User'
import * as MediaLibrary from 'expo-media-library'
import { Asset } from 'expo-media-library'
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
      return []
    }
  }

  retrieveActions(user: string) {
    const storedActions = this.mmkv.getString(`${user}/actions`)
    if (storedActions) {
      const actions: Action[] = JSON.parse(storedActions)
      return actions
    } else {
      return []
    }
  }

  retrieveEquipments(user: string) {
    const storedEquipments = this.mmkv.getString(`${user}/@equipments`)
    if (storedEquipments) {
      const equipments: Equipment[] = JSON.parse(storedEquipments)
      return equipments
    } else {
      return []
    }
  }

  retrieveLocations(user: string) {
    const storedLocations = this.mmkv.getString(`${user}/@locations`)
    if (storedLocations) {
      const locations: Location[] = JSON.parse(storedLocations)
      return locations
    } else {
      return []
    }
  }

  retrieveResponsibles(user: string) {
    const storedResponsibles = this.mmkv.getString(`${user}/@responsibles`)
    if (storedResponsibles) {
      const responsibles: Responsible[] = JSON.parse(storedResponsibles)
      return responsibles
    } else {
      return []
    }
  }

  retrieveModels(user: string) {
    const storedModels = this.mmkv.getString(`${user}/@checklistProductions`)
    if (storedModels) {
      const models: ChecklistProduction[] = JSON.parse(storedModels)
      return models
    } else {
      return []
    }
  }

  retrieveReceivedData(user: string, path: string) {
    const stored = this.mmkv.getString(user + path)
    if (stored) {
      const data = JSON.parse(stored)
      //console.log("data =>", data)
      
      return data
    } else {
      return []
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

  retrieveImages(){
    const allImagesString = this.mmkv.getString('images')
    if(allImagesString){
      const allImages: MediaLibrary.Asset[] = JSON.parse(allImagesString) 
      return allImages
    }else{
      return null
    }
  }

  updateEquipment(user: string, equipment: Equipment){
    const equipments = this.retrieveEquipments(user)

    console.log("updatedEquipment =>", equipment)

    equipments.map((eq) => (
      eq.id === equipment.id ? {...equipment} : eq
    ))

    console.log("updatedEquipments =>", equipments)

    this.mmkv.set(`${user}/@equipments`, JSON.stringify(equipment))
  }

  storeChecklists(checklists: Checklist[]) {
    const user = this.retrieveLastUser()
    if (user) {
      this.mmkv.set(`${user.login}/checklists`, JSON.stringify(checklists))
    } else {
      throw new Error('Usuário não encontrado')
    }
  }

  storeActions(actions: Action[]) {
    const user = this.retrieveLastUser()
    if (user) {
      this.mmkv.set(`${user.login}/actions`, JSON.stringify(actions))
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
  
  storeImage(image: Asset){
    try {
      const allImages: MediaLibrary.Asset[] = this.retrieveImages() ?? []
      allImages.push(image)
      const allImagesString = JSON.stringify(allImages)

      this.mmkv.set("images", allImagesString)
    } catch (error) {
      console.log("StoreImage error:", error);
      
    }
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
