import { useSync } from '@/src/hooks/useSync'
import { useAuth } from '@/src/store/auth'
import { useConnection } from '@/src/store/connection'
import { useSyncStatus } from '@/src/store/syncStatus'
import { DrawerActions } from '@react-navigation/native'
import { router, useNavigation, useSegments } from 'expo-router'
import { useToast } from 'native-base'
import { Button } from '../Button'
import { Toast } from '../Toast'
import { WifiIndicator } from '../WifiIndicator'
import { ButtonsContainer, HeaderContainer } from './styles'

export function Header() {
  const { dispatch } = useNavigation()
  const { syncData } = useSync()
  const { isSyncing } = useSyncStatus()
  const { isConnected } = useConnection()
  const { user, token } = useAuth()
  const segments = useSegments()
  const toast = useToast()

  function handleGoBack() {
    if (!router.canGoBack()) return
    router.back()
  }

  async function handleSync() {
    if (!isConnected) {
      return toast.show({
        render: () => (
          <Toast.Error>
            Conecte-se a internet para realizar a sincronização
          </Toast.Error>
        ),
      })
    }

    if (
      user &&
      token &&
      !isSyncing &&
      segments.length < 5 &&
      segments.includes('(tabs)')
    ) {
      await syncData(user.login, user.token).catch((err: Error) => {
        console.log(err)
        toast.show({
          render: () => <Toast.Error>{err.message}</Toast.Error>,
        })
      })
    } else {
      toast.show({
        render: () => (
          <Toast.Error>
            Navegue para a home para realizar a sincronização
          </Toast.Error>
        ),
      })
      router.replace('/home')
    }
  }

  return (
    <HeaderContainer>
      <ButtonsContainer>
        {segments.length > 4 && (
          <Button.Trigger
            onPress={handleGoBack}
            onlyIcon
            variant="transparent"
            size="sm"
          >
            <Button.Icon.CaretLeft />
          </Button.Trigger>
        )}
        <WifiIndicator />
      </ButtonsContainer>
      <ButtonsContainer>
        <Button.Trigger
          variant="secondary"
          rounded
          onlyIcon
          size="sm"
          onPress={handleSync}
          loading={isSyncing}
          disabled={isSyncing}
        >
          <Button.Icon.CloudArrowUp />
        </Button.Trigger>
        <Button.Trigger
          size="sm"
          onlyIcon
          variant="transparent"
          onPress={() => {
            dispatch(DrawerActions.toggleDrawer())
          }}
        >
          <Button.Icon.List size={28} />
        </Button.Trigger>
      </ButtonsContainer>
    </HeaderContainer>
  )
}
