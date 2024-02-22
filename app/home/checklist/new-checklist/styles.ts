import styled from 'styled-components/native'

export const Container = styled.View`
  gap: 16px;
  flex: 1;
  background-color: ${({ theme }) => theme.color.white};
  padding: 24px;
`

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
`

export const FormContainer = styled.View`
  gap: 8px;
`

export const ButtonsContent = styled.View`
  gap: 8px;
  flex-direction: row;
  width: 100%;
  align-items: stretch;
`

export const ContainerLoading = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

export const Loading = styled.ActivityIndicator`
  font-size: 40px;
  color: ${({ theme }) => theme.color['violet-500']};
`

export const LoadingText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.color['zinc-700']};
`
export const ToastChecklistCreated = styled.Text`
  padding: 16px 20px;
  background-color: ${({ theme }) => theme.color['green-500']};
  border-radius: 4px;
  color: ${({ theme }) => theme.color.white};
  font-weight: 800;
`
