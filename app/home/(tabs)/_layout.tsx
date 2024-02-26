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
import db from '@/src/libs/database'
import { useActions } from '@/src/store/actions'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useConnection } from '@/src/store/connection'
import { useEquipments } from '@/src/store/equipments'
import { useResponsibles } from '@/src/store/responsibles'
import { useSync } from '@/src/store/sync'
import { Tabs, useSegments } from 'expo-router'
import { Text } from 'native-base'
import { ClipboardText, XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container } from './styles'

export default function HomeLayout() {
  const { isConnected } = useConnection()
  const { allChecklists, loadChecklists, syncChecklists } = useChecklist()
  const { actions, loadActions, syncActions } = useActions()
  const { equipments, loadEquipments } = useEquipments()
  const { responsibles, loadResponsibles } = useResponsibles()
  const { user, token } = useAuth()
  const {
    isSyncing,
    updateSyncing,
    syncCount,
    clearImagesIfNeeded,
    increaseDoneRequests,
    doneRequests,
  } = useSync()
  const segments = useSegments()

  const [needToUpdate, setNeedToUpdate] = useState(true)

  async function requestData(login: string, token: string) {
    console.log('request data')
    return await Promise.all([
      fetchChecklists(login, token).then(() => increaseDoneRequests()),
      fetchEquipments(user.login, token).then(() => increaseDoneRequests()),
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
    ])
  }

  async function syncData(login: string, token: string) {
    console.log('sync data')
    return await Promise.all([
      syncChecklists(login, token).then(() => increaseDoneRequests()),
      syncActions(login, token).then(() => increaseDoneRequests()),
    ])
  }

  useEffect(() => {
    if (
      (!allChecklists || !actions || !equipments || !responsibles) &&
      !needToUpdate &&
      user
    ) {
      loadChecklists(user.login)
      loadActions(user.login)
      loadEquipments(user.login)
      loadResponsibles(user.login)
    }
  }, [allChecklists, actions, equipments, responsibles])

  useEffect(() => {
    if (isConnected && needToUpdate && user && token && segments.length < 3) {
      updateSyncing(true)
      requestData(user.login, token)
        .then(() => clearImagesIfNeeded())
        .then(() => syncData(user.login, token))
        .then(() => {
          updateSyncing(false)
          console.log('Synced')
          db.setNeedToUpdate(false)
          loadChecklists(user.login)
          loadActions(user.login)
          loadEquipments(user.login)
          loadResponsibles(user.login)
        })
        .catch((err) => console.log(err))
    }
  }, [isConnected, needToUpdate, user, token])

  useEffect(() => {
    const interval = setInterval(() => {
      setNeedToUpdate(db.checkNeedToUpdate())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isSyncing && syncCount === 0) {
    return (
      <Container>
        <ActivityIndicator size={64} />
        <Text>Carregando requisições {doneRequests + 1}/14...</Text>
      </Container>
    )
  }

  return (
    <Tabs initialRouteName="checklist">
      <Tabs.Screen
        name="checklist"
        options={{
          headerShown: false,
          tabBarLabel: 'Checklist',
          tabBarIcon: ({ color, size }) => (
            <ClipboardText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="actions"
        options={{
          headerShown: false,
          tabBarLabel: 'Ações Geradas',
          tabBarIcon: ({ color, size }) => (
            <XCircle color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
