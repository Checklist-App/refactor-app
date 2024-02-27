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
import { useResponsibles } from '../store/responsibles'

interface SyncData {
  isSyncing: boolean
  syncCount: number
  doneRequests: number
  syncData: (login: string, token: string) => Promise<void>
}

export function useSync(): SyncData {
  const { isConnected } = useConnection()
  const { syncChecklists, loadChecklists } = useChecklist()
  const { syncActions, loadActions } = useActions()
  const { loadEquipments } = useEquipments()
  const { loadResponsibles } = useResponsibles()
  const [syncCount, setSyncCount] = useState(0)
  const [doneRequests, setDoneRequests] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [needToClearImages, setNeedToClearImages] = useState(true)

  function updateSyncing(arg: boolean) {
    if (!arg) {
      setSyncCount(syncCount + 1)
    }
    setIsSyncing(arg)
  }

  function increaseDoneRequests() {
    setDoneRequests(doneRequests + 1)
  }

  async function requestData(login: string, token: string) {
    if (isConnected) {
      console.log('request data')
      return await Promise.all([
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
      ]).catch(() => {
        throw new Error('Erro ao buscar dados')
      })
    }
  }

  async function syncData(login: string, token: string) {
    console.log('sync data')
    return await Promise.all([
      syncChecklists(login, token).then(() => increaseDoneRequests()),
      syncActions(login, token).then(() => increaseDoneRequests()),
    ])
  }

  async function clearImagesIfNeeded() {
    if (needToClearImages) {
      const permission = await MediaLibrary.requestPermissionsAsync()
      if (permission.status === 'granted') {
        console.log('Buscando album...')
        const album = await MediaLibrary.getAlbumAsync('Smartlist')
        console.log(album)
        console.log('Deletando imagens...')
        await MediaLibrary.deleteAlbumsAsync(album, true).then(() =>
          console.log('Imagens excluidas'),
        )
        setNeedToClearImages(false)
      }
    }
  }

  return {
    isSyncing,
    syncCount,
    doneRequests,

    syncData: async (login: string, token: string) => {
      updateSyncing(true)
      await requestData(login, token)
        .then(() => clearImagesIfNeeded())
        .then(() => syncData(login, token))
        .finally(() => {
          updateSyncing(false)
          console.log('Synced')
          db.setNeedToUpdate(false)
          loadChecklists(login)
          loadActions(login)
          loadEquipments(login)
          loadResponsibles(login)
        })
    },
  }
}
