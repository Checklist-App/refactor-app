import { useAuth } from '@/src/store/auth'
import { DrawerActions } from '@react-navigation/native'
import { router, useNavigation, useSegments } from 'expo-router'
import { Jeep, User } from 'phosphor-react-native'
import { useTheme } from 'styled-components'
import { Button } from '../Button'
import { SyncButton } from '../SyncButton'
import { WifiIndicator } from '../WifiIndicator'
import {
  ButtonsContainer,
  HeaderContainer,
  HeaderText,
  TextBackground,
} from './styles'

export function Header() {
  const { dispatch } = useNavigation()
  const segments = useSegments()

  // const { currentChecklist } = useChecklist()

  const { color } = useTheme()
  const { user } = useAuth()

  function handleGoBack() {
    if (!router.canGoBack()) return
    console.log(segments)
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
          // style={
          //   !(
          //     segments.includes('edit-checklist') || segments.includes('action')
          //   ) && { display: 'none' }
          // }
        >
          <Button.Icon.CaretLeft />
        </Button.Trigger>
        <WifiIndicator />
      </ButtonsContainer>
      <ButtonsContainer>
        <SyncButton />
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
