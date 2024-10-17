import { useAuth } from '@/src/store/auth'
import { useCrashlytics } from '@/src/store/crashlytics-report'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { Button } from '../src/components/Button'

export default function AppIndex() {
  const { authenticateLastUser, getUser } = useAuth()
  const { setUserId, sendLog, initCrashlyticsReport, sendStacktrace } = useCrashlytics()

  async function handleInitApp() {
    sendStacktrace(handleInitApp)
    const isUserAuthenticated = authenticateLastUser()
    const user = getUser()
    console.log(`isUserAuthenticated: ${isUserAuthenticated}`);
    console.log(`user: `, user);
    
    if (isUserAuthenticated) {
      const userLoginConsole = `userData.login => ${user.login}`
      sendLog(userLoginConsole);
      await setUserId(user.login)
      router.replace('/home')
    } else {
      console.log('não autenticado')
      router.replace('/login')
    }
  }

  async function crashlyticsSettings() {
    await initCrashlyticsReport()
  }

  useEffect(() => {
    crashlyticsSettings()
  }, [])

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
