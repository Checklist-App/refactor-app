import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

export const HeaderContainer = styled(SafeAreaView)`
  padding: 24px;
  padding-top: 16px;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.color.white};
`

export const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const TextBackground = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.color['violet-200']};
  border-radius: 999px;
`

export const HeaderText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.color['violet-600']};
`
