import { useActions } from '@/src/store/actions'
import { Action } from '@/src/types/Action'
import { FlashList } from '@shopify/flash-list'
import { ActionCard } from './ActionCard'
import { Container, EmptyContainer, EmptyText, Title } from './styles'

export default function Actions() {
  // const { user } = useAuth()
  const { actions } = useActions()
  // const segments = useSegments()

  // useEffect(() => {
  //   if (user) {
  //     loadActions(user.login)
  //   }
  // }, [segments])

  // console.log(actions)

  // if (!actions) {
  //   return (
  //     <EmptyContainer>
  //       <Loading />
  //     </EmptyContainer>
  //   )
  // }

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
