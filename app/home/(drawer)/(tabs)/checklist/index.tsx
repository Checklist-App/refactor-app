/* eslint-disable camelcase */
import { FlashList } from '@shopify/flash-list'
import { Link } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

import { Button } from '@/src/components/Button'
import { ChecklistItem } from '@/src/components/ChecklistItem'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useConnection } from '@/src/store/connection'
import { useSyncStatus } from '@/src/store/syncStatus'
import {
  Container,
  ErrorText,
  HomeHeader,
  Loading,
  LoadingText,
  Title,
} from './styles'

export default function Page() {
  const { color } = useTheme()
  const { isConnected } = useConnection()
  const { allChecklists } = useChecklist()
  const { isSyncing } = useSyncStatus()
  const { user } = useAuth()

  if (!user && isConnected) {
    return (
      <Loading>
        <LoadingText>Carregando requisições...</LoadingText>
        <ActivityIndicator color={color['violet-500']} size={28} />
      </Loading>
    )
  }

  return (
    <Container>
      <HomeHeader>
        <Title>Checklists Criados</Title>
        <Link href="/home/checklist/new-checklist" asChild>
          {/* <Link href="/home/answer/2784696" asChild> */}
          <Button.Trigger rounded onlyIcon size="lg" disabled={isSyncing}>
            <Button.Icon.Plus />
          </Button.Trigger>
        </Link>
      </HomeHeader>
      <FlashList
        estimatedItemSize={40}
        data={allChecklists}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <ChecklistItem
            key={Math.random() * 100000 + '-' + index}
            checklist={item}
          />
        )}
        ListEmptyComponent={() => (
          <Loading>
            <ErrorText>
              Não há checklists registrados para essa filial nas últimas 24
              horas
            </ErrorText>
          </Loading>
        )}
      />
    </Container>
  )
}
