import { useActions } from '@/src/store/actions'
import { useCrashlytics } from '@/src/store/crashlytics-report'
import { FlashList } from '@shopify/flash-list'
import { useRouteInfo } from 'expo-router/build/hooks'
import { useEffect } from 'react'
import { ActionCard } from './ActionCard'
import { Container, EmptyContainer, EmptyText, Title } from './styles'

export default function Actions() {
  const { actions } = useActions()

  const { sendPathname, sendLog, reportError, sendStacktrace } = useCrashlytics()
  const { pathname } = useRouteInfo()

  useEffect(() => {
    sendPathname(pathname)
  }, [pathname])

  return (
    <Container>
      <Title>Ações Geradas</Title>
      <FlashList
        estimatedItemSize={10}
        data={actions}
        extraData={actions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <ActionCard key={item.responsible + index} action={item} />
        )}
        ListEmptyComponent={() => (
          <EmptyContainer>
            <EmptyText>Não há nenhuma ação registrada</EmptyText>
          </EmptyContainer>
        )}
      />
    </Container>
  )
}
