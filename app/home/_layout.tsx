import { Button } from '@/src/components/Button'
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
import { usePermissions } from 'expo-media-library'
import { Stack, useSegments } from 'expo-router'
import { Text, useToast } from 'native-base'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

export default function HomeLayout() {
  const { syncData } = useSync()
  const { doneRequests, isSyncing, syncCount } = useSyncStatus()
  const { isConnected } = useConnection()
  const { allChecklists, loadChecklists } = useChecklist()
  const { actions, loadActions } = useActions()
  const { equipments, loadEquipments } = useEquipments()
  const { responsibles, loadResponsibles } = useResponsibles()
  const { user, token } = useAuth()
  const [permissions, requestPermissions] = usePermissions()
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
      (needToUpdate || syncCount === 0) &&
      user &&
      token &&
      !isSyncing &&
      segments.length < 5 &&
      segments.includes('home')
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

  if (!permissions) {
    return (
      <NoPermission>
        <NoPermissionText style={{ textAlign: 'center' }}>
          Sem permissão para acessar os arquivos!
        </NoPermissionText>
        <Button.Trigger onPress={requestPermissions}>
          <Button.Icon.ShieldCheck />
          <Button.Text>Pedir permissão</Button.Text>
        </Button.Trigger>
      </NoPermission>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="answer/[checklistId]/index" />
    </Stack>
  )
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const NoPermission = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`

const NoPermissionText = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.color['zinc-600']};
  font-weight: bold;
`
