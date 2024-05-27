import {
  fetchActions,
  fetchCheckListPeriods,
  fetchChecklistItems,
  fetchChecklistProductions,
  fetchChecklistStatusActions,
  fetchChecklistStatuses,
  fetchChecklists,
  fetchControlIds,
  fetchEquipments,
  fetchLocations,
  fetchPeriods,
  fetchResponsibles,
  fetchTasks,
} from '@/src/libs/api/requests'
import * as MediaLibrary from 'expo-media-library'
import { useState } from 'react'
import db from '../libs/database'
import { useActions } from '../store/actions'
import { useChecklist } from '../store/checklist'
import { useConnection } from '../store/connection'
import { useEquipments } from '../store/equipments'
import { useLocations } from '../store/location'
import { useResponsibles } from '../store/responsibles'
import { useSyncStatus } from '../store/syncStatus'

interface SyncData {
  syncData: (login: string, token: string) => Promise<void>
  requestData: (login: string, token: string) => Promise<void>
}

export function useSync(): SyncData {
  const { isConnected } = useConnection()
  const { syncChecklists, loadChecklists } = useChecklist()
  const { syncActions, loadActions } = useActions()
  const { loadEquipments } = useEquipments()
  const { loadLocations } = useLocations()
  const { loadResponsibles } = useResponsibles()
  const [needToClearImages, setNeedToClearImages] = useState(true)
  const { increaseDoneRequests, updateSyncing } = useSyncStatus()

  async function requestData(login: string, token: string) {
    if (isConnected) {
      console.log('request data')
      await Promise.all([
        fetchChecklists(login, token).then(() => increaseDoneRequests()),
        fetchEquipments(login, token).then(() => increaseDoneRequests()),
        fetchTasks(login, token).then(() => increaseDoneRequests()),
        fetchPeriods(login, token).then(() => increaseDoneRequests()),
        fetchCheckListPeriods(login, token).then(() => increaseDoneRequests()),
        fetchChecklistItems(login, token).then(() => increaseDoneRequests()),
        fetchChecklistProductions(login, token).then(() =>
          increaseDoneRequests(),
        ),
        fetchChecklistStatusActions(login, token).then(() =>
          increaseDoneRequests(),
        ),
        fetchChecklistStatuses(login, token).then(() => increaseDoneRequests()),
        fetchControlIds(login, token).then(() => increaseDoneRequests()),
        fetchActions(login, token).then(() => increaseDoneRequests()),
        fetchResponsibles(login, token).then(() => increaseDoneRequests()),
        fetchLocations(login, token).then(() => increaseDoneRequests()),
      ])
    }
  }

  async function syncData(login: string, token: string) {
    console.log('sync data')
    await syncChecklists(login, token)
      .then(() => increaseDoneRequests())
      .catch((err) => {
        console.log('Erro ao sincronizar checklists')
        console.log(err)
      })

    await syncActions(login, token)
      .then(() => increaseDoneRequests())
      .catch((err) => {
        console.log('Erro ao sincronizar ações')
        console.log(err)
      })
  }

  async function clearImagesIfNeeded() {
    if (needToClearImages) {
      const permission = await MediaLibrary.requestPermissionsAsync()
      if (permission.status === 'granted') {
        const album = await MediaLibrary.getAlbumAsync('Smartlist')
        await MediaLibrary.deleteAlbumsAsync(album, true)
        setNeedToClearImages(false)
      }
    }
  }

  return {
    syncData: async (login: string, token: string) => {
      updateSyncing(true)
      loadChecklists(login)
      await requestData(login, token)
        .then(() => clearImagesIfNeeded())
        .then(() => syncData(login, token))
        .then(() => {
          console.log('Synced')
          db.setNeedToUpdate(false)
        })
        .finally(() => {
          updateSyncing(false)
          loadChecklists(login)
          loadActions(login)
          loadEquipments(login)
          loadLocations(login)
          loadResponsibles(login)
        })
    },
    requestData,
  }
}
