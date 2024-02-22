import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: #fff;
  padding: 24px;
  gap: 24px;
  flex: 1;
`

export const ContainerHeader = styled.View``

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  font-family: 'Poppins_700Bold';
`

export const Body = styled.View``

export const ActionCardView = styled.View`
  width: 100%;
  gap: 8px;
  margin-bottom: 48px;
`

export const ActionCardHeader = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
`

export const ActionCardLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`

export const ActionCardTitle = styled.Text`
  color: ${({ theme }) => theme.color['zinc-600']};
  font-size: 20px;
  font-family: 'Poppins_700Bold';
`

export const ActionSubtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-700']};
`

export const ActionCardContent = styled.View`
  gap: 24px;
  width: 100%;
`

export const Actions = styled.View`
  width: 100%;
  gap: 16px;
`

export const ActionsTitle = styled.Text`
  color: ${({ theme }) => theme.color['violet-400']};
  font-size: 16px;
`

export const ActionsList = styled.View`
  width: 100%;
  gap: 10px;
`

export const ActionsListRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ActionsListColumn = styled.View`
  align-items: flex-start;
`

export const ActionsListHeaderText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-700']};
  font-weight: bold;
`

export const ActionsListContentText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-500']};
`

export const IconContainer = styled.TouchableOpacity`
  padding: 12px;
  background-color: ${({ theme }) => theme.color['red-400']};
  border-radius: 12px;
`

export const StatusContainer = styled.View`
  background-color: ${({ theme }) => theme.color['zinc-400']};
  padding: 8px;
`

export const StatusText = styled.Text`
  color: ${({ theme }) => theme.color['zinc-700']};
  font-size: 12px;
  font-weight: bold;
`

export const Text = styled.Text<{ screenWidth: number }>`
  font-size: ${({ screenWidth }) => (screenWidth <= 400 ? '10px' : '14px')};
`

export const ActionButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.color['green-200']};
  border-radius: 8px;
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
