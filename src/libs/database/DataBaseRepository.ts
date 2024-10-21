import { CrashlyticsReportProps } from '@/src/store/crashlytics-report'
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

  private sendLog: (message: string) => void;
  private reportError: (error: Error) => void;
  private sendStacktrace: (fn: Function) => void;

  constructor(private mmkv: IDataBaseService, private crashlyticsOperations: CrashlyticsReportProps) {
    const {
      sendLog,
      reportError,
      sendStacktrace
    } = crashlyticsOperations

    this.sendLog = sendLog
    this.reportError = reportError
    this.sendStacktrace = sendStacktrace
  }
  

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
    this.sendStacktrace(this.retrieveActions)
    const storedActions = this.mmkv.getString(`${user}/actions`)

    if (storedActions) {
      const actions: Action[] = JSON.parse(storedActions)
      this.sendLog(`actions length: ${actions.length}`)
      return actions
    } else {
      return []
    }
  }

  retrieveEquipments(user: string) {
    this.sendStacktrace(this.retrieveEquipments)
    const storedEquipmentsKey = `${user}/@equipments`
    const storedEquipments = this.mmkv.getString(storedEquipmentsKey)
    if (storedEquipments) {
      const equipments: Equipment[] = JSON.parse(storedEquipments)
      this.sendLog(`equipments length: ${equipments.length}`)
      return equipments
    } else {
      return []
    }
  }

  retrieveLocations(user: string) {
    this.sendStacktrace(this.retrieveLocations)
    const storedLocations = this.mmkv.getString(`${user}/@locations`)
    if (storedLocations) {
      const locations: Location[] = JSON.parse(storedLocations)
      this.sendLog(`locations length: ${locations.length}`)
      return locations
    } else {
      return []
    }
  }

  retrieveResponsibles(user: string) {
    this.sendStacktrace(this.retrieveResponsibles)
    const storedResponsibles = this.mmkv.getString(`${user}/@responsibles`)
    if (storedResponsibles) {
      const responsibles: Responsible[] = JSON.parse(storedResponsibles)
      this.sendLog(`responsibles length: ${responsibles.length}`)
      return responsibles
    } else {
      return []
    }
  }

  retrieveModels(user: string) {
    this.sendStacktrace(this.retrieveModels)
    const storedModels = this.mmkv.getString(`${user}/@checklistProductions`)
    if (storedModels) {
      const models: ChecklistProduction[] = JSON.parse(storedModels)
      this.sendLog(`models length: ${models.length}`)
      return models
    } else {
      return []
    }
  }

  retrieveReceivedData(user: string, path: string) {
    this.sendStacktrace(this.retrieveReceivedData)
    const stored = this.mmkv.getString(user + path)
    if (stored) {
      const data = JSON.parse(stored)
      // console.log("data =>", data)
      
      this.sendLog(`data length: ${data.length}`)
      return data
    } else {
      return []
    }
  }

  retrieveLastUser() {
    this.sendStacktrace(this.retrieveLastUser)
    const storedUser = this.mmkv.getString('lastUser')
    this.sendLog(`storedUser: ${storedUser}`)
    if (storedUser) {
      const user: User = JSON.parse(storedUser)
      return user
    } else {
      return null
    }
  }

  retrieveActiveToken() {
    this.sendStacktrace(this.retrieveActiveToken)
    const token = this.mmkv.getString('activeToken')
    this.sendLog(`token: ${token}`)
    if (token) {
      return token
    } else {
      return null
    }
  }

  retriveUsers() {
    this.sendStacktrace(this.retriveUsers)
    const allUsersString = this.mmkv.getString('users')
    this.sendLog(`allUsersString: ${allUsersString}`)
    if (allUsersString) {
      const allUsers: User[] = JSON.parse(allUsersString)
      return allUsers
    } else {
      return null
    }
  }

  retrieveImages(){
    this.sendStacktrace(this.retrieveImages)
    const allImagesString = this.mmkv.getString('images')
    this.sendLog(`allImagesString: ${allImagesString}`)
    if(allImagesString){
      try {
        const allImages: MediaLibrary.Asset[] = JSON.parse(allImagesString) 
        return allImages
      } catch (error) {
        console.log(`retrieveImages error: ${error}`);
      }
    }else{
      return null
    }
  }

  updateEquipment(user: string, equipment: Equipment) {
    this.sendStacktrace(this.updateEquipment)
    const equipments = this.retrieveEquipments(user)
    console.log("equipments length: ", equipments.length);
    
    this.sendLog(`equipments length: ${equipments.length}`)

    console.log("updateEquipment.equipments =>", equipments);
    console.log('updatedEquipment =>', equipment)
    this.sendLog(`updatedEquipment: ${JSON.stringify(equipment)}`)
    
    equipments.map((eq) => (eq.id === equipment.id ? { ...equipment } : eq))
    console.log('updatedEquipments =>', equipments)
    
    const equipmentList: Equipment[] = Array.isArray(equipment) ? equipment : [equipment]
    console.log('equipmentToList =>', equipmentList)
    this.sendLog(`equipmentList length: ${equipmentList.length}`)
    
    this.mmkv.set(`${user}/@equipments`, JSON.stringify(equipmentList))
  }

  storeChecklists(checklists: Checklist[]) {
    this.sendStacktrace(this.storeChecklists)
    const user = this.retrieveLastUser()
    if (user) {
      this.mmkv.set(`${user.login}/checklists`, JSON.stringify(checklists))
    } else {
      throw new Error('Usuário não encontrado')
    }
  }

  storeActions(actions: Action[]) {
    this.sendStacktrace(this.storeActions)
    const user = this.retrieveLastUser()
    if (user) {
      this.mmkv.set(`${user.login}/actions`, JSON.stringify(actions))
    } else {
      throw new Error('Usuário não encontrado')
    }
  }

  storeReceivedData(path: string, data: object) {
    this.sendStacktrace(this.storeReceivedData)
    this.mmkv.set(path, JSON.stringify(data))
  }

  storeUser(user: User) {
    this.sendStacktrace(this.storeUser)
    this.sendLog(`user: ${user}`)
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
    this.sendStacktrace(this.storeToken)
    this.sendLog(`token: ${token}`)
    this.mmkv.set('activeToken', token)
  }
  
  storeImage(image: Asset){
    this.sendStacktrace(this.storeImage)
    this.sendLog(`image: ${image}`)
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
    this.sendStacktrace(this.checkNeedToUpdate)
    const needToUpdate = this.mmkv.getBoolean('needToUpdate')
    this.sendLog(`needToUpdate: ${needToUpdate}`)
    if (needToUpdate === undefined) {
      this.setNeedToUpdate(false)
      return false
    } else {
      return needToUpdate
    }
  }

  setNeedToUpdate(arg: boolean) {
    this.sendStacktrace(this.setNeedToUpdate)
    this.sendLog(`arg: ${arg}`)
    this.mmkv.set('needToUpdate', arg)
  }

  deleteKey(key: string) {
    this.sendStacktrace(this.deleteKey)
    this.sendLog(`key: ${key}`)
    this.mmkv.delete(key)
  }
}
