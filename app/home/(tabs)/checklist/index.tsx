/* eslint-disable camelcase */
import { FlashList } from '@shopify/flash-list'
import { usePermissions } from 'expo-media-library'
import { Link } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

import { Button } from '@/src/components/Button'
import { ChecklistItem } from '@/src/components/ChecklistItem'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useConnection } from '@/src/store/connection'
import { Checklist } from '@/src/types/Checklist'
import {
  Container,
  ErrorText,
  HomeHeader,
  Loading,
  LoadingText,
  NoPermission,
  NoPermissionText,
  Title,
} from './styles'

export default function Page() {
  const { color } = useTheme()
  const { isConnected } = useConnection()
  const { allChecklists } = useChecklist()
  const { user } = useAuth()
  const [permissions, requestPermissions] = usePermissions()

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
        <Title>Home</Title>
        <Link href="/home/checklist/new-checklist" asChild>
          <Button.Trigger rounded onlyIcon size="lg">
            <Button.Icon.Plus />
          </Button.Trigger>
        </Link>
      </HomeHeader>
      <FlashList
        estimatedItemSize={40}
        data={allChecklists}
        extraData={allChecklists}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: Checklist }) => (
          <ChecklistItem key={item.id} checklist={item} />
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
