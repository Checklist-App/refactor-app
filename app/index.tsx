import { useAuth } from '@/src/store/auth'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../src/components/Button'
import { Container, Main, Title, TitleContainer } from './styles'

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
          <Button.Trigger onPress={handleInitApp}>
            <Button.Text>Iniciar</Button.Text>
            <Button.Icon.ArrowRight size={20} color="#FFF" />
          </Button.Trigger>
        </Main>
      </SafeAreaView>
    </Container>
  )
}
