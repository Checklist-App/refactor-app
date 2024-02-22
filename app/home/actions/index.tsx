import { Container, Title } from './styles'

export default function Actions() {
  // const { user } = useAuth()
  // const { loadActions, allActions } = useChecklist()
  // const segments = useSegments()

  // useEffect(() => {
  //   if (user) {
  //     loadActions(user.login)
  //   }
  // }, [segments])

  // console.log(allActions)

  // if (!allActions) {
  //   return (
  //     <EmptyContainer>
  //       <Loading />
  //     </EmptyContainer>
  //   )
  // }

  return (
    <Container>
      <Title>Ações Geradas</Title>
      {/* <FlashList
        estimatedItemSize={10}
        data={allActions}
        extraData={allActions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: ActionType }) => (
          <ActionCard key={item.id} action={item} />
        )}
        ListEmptyComponent={() => (
          <EmptyContainer>
            <EmptyText>Não há nenhuma ação registrada</EmptyText>
          </EmptyContainer>
        )}
      /> */}
    </Container>
  )
}
