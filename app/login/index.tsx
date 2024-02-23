import { Button } from '@/src/components/Button'
import { Form } from '@/src/components/Form'
import { Toast } from '@/src/components/Toast'
import { useAuth } from '@/src/store/auth'
import { useConnection } from '@/src/store/connection'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useToast } from 'native-base'
import { Warning } from 'phosphor-react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { Dimensions } from 'react-native'
import { z } from 'zod'
import BackgroundSvg from '../../assets/images/wave.svg'
import {
  ConnectedView,
  Container,
  ContainerWelcome,
  Description,
  Header,
  Main,
  OfflineText,
  WaveContainer,
  Welcome,
} from './styles'

const loginSchema = z.object({
  login: z.string({ required_error: 'Login obrigatório' }),
  pass: z.string({ required_error: 'Senha obrigatória' }),
})

export type LoginData = {
  login: string
  pass: string
}

const { width, height } = Dimensions.get('screen')

export default function Login() {
  const { isConnected } = useConnection()
  const { login, offlineLogin } = useAuth()
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })
  const toast = useToast()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = loginForm

  async function handleFormLogin(data: LoginData) {
    if (isConnected) {
      login(data)
        .then(() => router.replace('/home'))
        .catch((err: Error) => {
          toast.show({
            render: () => <Toast.Error>{err.message}</Toast.Error>,
          })
        })
    } else {
      offlineLogin(data)
        .then(() => router.replace('/home'))
        .catch((err: Error) => {
          toast.show({
            render: () => <Toast.Error>{err.message}</Toast.Error>,
          })
        })
    }
  }

  return (
    <Container>
      <StatusBar style="light" />
      <Header>
        <BackgroundSvg
          style={{ height: height / 1.6, width, position: 'absolute', top: 0 }}
        />
        <WaveContainer
          screenWidth={width}
          screenHeight={height}
        ></WaveContainer>

        <ContainerWelcome>
          <Welcome screenWidth={width}>Bem vindo de volta!</Welcome>
          <Description>
            Insira suas informações para começar a usar o app
          </Description>
        </ContainerWelcome>
      </Header>

      <FormProvider {...loginForm}>
        <Main>
          <Form.Field>
            <Form.Label>Login:</Form.Label>
            <Form.Input
              autoCorrect={false}
              allowFontScaling={false}
              autoCapitalize="none"
              name="login"
              placeholder="Insira seu login"
            />
            <Form.ErrorMessage field="login" />
          </Form.Field>

          <Form.Field>
            <Form.Label>Senha:</Form.Label>
            <Form.Input
              name="pass"
              autoCorrect={false}
              allowFontScaling={false}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Insira sua senha"
            />
            <Form.ErrorMessage field="pass" />
          </Form.Field>

          <Button.Trigger
            variant="primary"
            onPress={handleSubmit(handleFormLogin)}
            loading={isSubmitting}
          >
            <Button.Text>Entrar</Button.Text>
          </Button.Trigger>

          {isConnected || (
            <ConnectedView>
              <Warning color="red" size={16} />
              <OfflineText>Off-line</OfflineText>
            </ConnectedView>
          )}
        </Main>
      </FormProvider>
    </Container>
  )
}
