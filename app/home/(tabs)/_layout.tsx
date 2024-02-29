import { Toast } from '@/src/components/Toast'
import { useSync } from '@/src/hooks/useSync'
import db from '@/src/libs/database'
import { useActions } from '@/src/store/actions'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useConnection } from '@/src/store/connection'
import { useEquipments } from '@/src/store/equipments'
import { useResponsibles } from '@/src/store/responsibles'
import { useSyncStatus } from '@/src/store/syncStatus'
import { Tabs, useSegments } from 'expo-router'
import { Text, useToast } from 'native-base'
import { ClipboardText, XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Container } from './styles'

export default function HomeLayout() {
  const { syncData } = useSync()
  const { doneRequests, isSyncing, syncCount } = useSyncStatus()
  const { isConnected } = useConnection()
  const { allChecklists, loadChecklists } = useChecklist()
  const { actions, loadActions } = useActions()
  const { equipments, loadEquipments } = useEquipments()
  const { responsibles, loadResponsibles } = useResponsibles()
  const { user, token } = useAuth()
  const segments = useSegments()
  const toast = useToast()

  const [needToUpdate, setNeedToUpdate] = useState(true)

  useEffect(() => {
    if (
      (!allChecklists || !actions || !equipments || !responsibles) &&
      !syncCount &&
      user
    ) {
      console.log('load')
      loadChecklists(user.login)
      loadActions(user.login)
      loadEquipments(user.login)
      loadResponsibles(user.login)
    }
  }, [allChecklists, actions, equipments, responsibles])

  useEffect(() => {
    if (
      needToUpdate &&
      user &&
      token &&
      !isSyncing &&
      segments.length < 4 &&
      segments.includes('checklist')
    ) {
      syncData(user.login, token).catch((err: Error) => {
        console.log(err)
        toast.show({
          render: () => <Toast.Error>{err.message}</Toast.Error>,
        })
      })
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
