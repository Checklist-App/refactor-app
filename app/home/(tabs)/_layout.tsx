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
  fetchTasks,
} from '@/src/libs/api/requests'
import db from '@/src/libs/database'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useConnection } from '@/src/store/connection'
import { useEquipments } from '@/src/store/equipments'
import { Tabs, useSegments } from 'expo-router'
import { ClipboardText, XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'

export default function HomeLayout() {
  const { isConnected } = useConnection()
  const { allChecklists, loadChecklists, syncChecklists } = useChecklist()
  const { equipments, loadEquipments } = useEquipments()
  const { user, token } = useAuth()
  const segments = useSegments()

  const [needToUpdate, setNeedToUpdate] = useState(true)

  async function requestData(login: string, token: string) {
    console.log('request data')
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        // fetchResponsibles(login, token),
        fetchChecklists(login, token),
        fetchEquipments(user.login, token),
        fetchTasks(login, token),
        fetchPeriods(login, token),
        fetchCheckListPeriods(login, token),
        fetchChecklistItems(login, token),
        fetchChecklistProductions(login, token),
        fetchChecklistStatusActions(login, token),
        fetchChecklistStatuses(login, token),
        fetchControlIds(login, token),
        fetchActions(login, token),
      ])
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  }

  useEffect(() => {
    if ((!allChecklists || !equipments) && !needToUpdate && user) {
      loadChecklists(user.login)
      loadEquipments(user.login)
    }
  }, [allChecklists, equipments])

  useEffect(() => {
    console.log({ needToUpdate })
    console.log(segments)
    if (isConnected && needToUpdate && user && token && segments.length < 3) {
      requestData(user.login, token)
        .then(() => syncChecklists(user.login, token))
        .then(() => {
          console.log('Synced')
          db.setNeedToUpdate(false)
          loadChecklists(user.login)
          loadEquipments(user.login)
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
