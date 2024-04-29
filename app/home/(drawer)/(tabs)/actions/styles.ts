import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: #fff;
  padding: 24px;
  gap: 24px;
  flex: 1;
`

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  font-family: 'Poppins_700Bold';
`

export const ActionCardView = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  gap: 16px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.color['slate-300']};
  border-radius: 8px;
  padding: 16px;
`

export const ActionCardInfo = styled.View`
  flex: 1;
  gap: 8px;
`

export const ActionCardBody = styled.View`
  flex: 1;
  gap: 2px;
`

export const ActionCardTitle = styled.Text`
  color: ${({ theme }) => theme.color['zinc-700']};
  font-size: 20px;
  font-weight: 700;
  font-family: 'Poppins_700Bold';
`

export const ActionCardFooter = styled.View`
  flex-direction: column;
  gap: 2px;
`

export const ActionCardFooterInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
`

export const ActionCardFooterText = styled.Text`
  color: ${({ theme }) => theme.color['slate-500']};
  font-size: 14px;
`

export const Actions = styled.View`
  width: 100%;
  gap: 16px;
`

export const ActionsTitle = styled.Text`
  color: ${({ theme }) => theme.color['violet-400']};
  font-size: 16px;
`

export const IconContainer = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color['red-400']};
`

export const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 82px;
  background-color: ${({ theme }) => theme.color['violet-200']};
  padding: 8px;
  border-radius: 99px;
`

export const StatusText = styled.Text`
  color: ${({ theme }) => theme.color['violet-600']};
  font-size: 12px;
`

export const Text = styled.Text<{ screenWidth: number }>`
  font-size: ${({ screenWidth }) => (screenWidth <= 400 ? '10px' : '14px')};
`

export const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
`
export const EmptyText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.color['zinc-500']};
`
