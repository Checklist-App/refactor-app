import { useActions } from '@/src/store/actions'
import { Action } from '@/src/types/Action'
import { FlashList } from '@shopify/flash-list'
import { ActionCard } from './ActionCard'
import { Container, EmptyContainer, EmptyText, Title } from './styles'

export default function Actions() {
  const { actions } = useActions()

  return (
    <Container>
      <Title>Ações Geradas</Title>
      <FlashList
        estimatedItemSize={10}
        data={actions}
        extraData={actions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: Action }) => (
          <ActionCard key={item.id} action={item} />
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
