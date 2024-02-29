import { useAuth } from '@/src/store/auth'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { Button } from '../src/components/Button'

export default function AppIndex() {
  const { authenticateLastUser } = useAuth()

  function handleInitApp() {
    const isUserAuthenticated = authenticateLastUser()

    if (isUserAuthenticated) {
      router.replace('/home')
    } else {
      console.log('não autenticado')
      router.replace('/login')
    }
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <Main>
          <TitleContainer>
            <Title>Olá 👋, seja bem vindo ao Smartlist!</Title>
          </TitleContainer>
          <Button.Trigger onPress={handleInitApp} variant="secondary">
            <Button.Text>Iniciar</Button.Text>
            <Button.Icon.ArrowRight size={20} color="#7C3AED" />
          </Button.Trigger>
        </Main>
      </SafeAreaView>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color['purple-500']};
`

const Main = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`

const TitleContainer = styled.View`
  flex: 1;
  justify-content: center;
  gap: 16px;
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
`
