import { useSync } from '@/src/hooks/useSync'
import { useAuth } from '@/src/store/auth'
import { DrawerActions } from '@react-navigation/native'
import { router, useNavigation, useSegments } from 'expo-router'
import { Jeep, User } from 'phosphor-react-native'
import { useTheme } from 'styled-components'
import { Button } from '../Button'
import { WifiIndicator } from '../WifiIndicator'
import {
  ButtonsContainer,
  HeaderContainer,
  HeaderText,
  TextBackground,
} from './styles'

export function Header() {
  const { dispatch } = useNavigation()
  const { isSyncing, syncData } = useSync()
  const { color } = useTheme()
  const { user } = useAuth()
  const segments = useSegments()

  function handleGoBack() {
    if (!router.canGoBack()) return
    router.back()
  }
  return segments.includes('answer') ? (
    <HeaderContainer>
      <TextBackground>
        <User size={16} color={color['violet-600']} />
        <HeaderText>{user?.name || 'Usuário'}</HeaderText>
      </TextBackground>
      <WifiIndicator reduced />
      <TextBackground>
        <Jeep size={16} color={color['violet-600']} />
        {/* <HeaderText>
          {currentChecklist
            ? currentChecklist.equipment.code
            : 'Sem equipamento'}
        </HeaderText> */}
      </TextBackground>
    </HeaderContainer>
  ) : (
    <HeaderContainer>
      <ButtonsContainer>
        <Button.Trigger
          onPress={handleGoBack}
          onlyIcon
          variant="transparent"
          size="sm"
          style={segments.length < 4 && { display: 'none' }}
        >
          <Button.Icon.CaretLeft />
        </Button.Trigger>
        <WifiIndicator />
      </ButtonsContainer>
      <ButtonsContainer>
        <Button.Trigger
          variant="secondary"
          rounded
          onlyIcon
          size="sm"
          onPress={() => syncData}
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
