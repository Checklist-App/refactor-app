import { useAuth } from '@/src/store/auth'
import { Jeep, User } from 'phosphor-react-native'
import { useTheme } from 'styled-components'
import { WifiIndicator } from '../WifiIndicator'
import { HeaderContainer, HeaderText, TextBackground } from './styles'

export function AnswerHeader() {
  const { user } = useAuth()
  const { color } = useTheme()

  return (
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
  )
}
