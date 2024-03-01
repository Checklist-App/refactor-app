import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: #fff;
  padding: 24px;
  gap: 24px;
  flex: 1;
`

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  font-family: 'Poppins_700Bold';
`

export const HomeHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ChecklistContent = styled.ScrollView`
  gap: 16px;
  flex: 1;
`
export const Loading = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
`
export const LoadingText = styled.Text`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.color['zinc-500']};
`

export const ErrorText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.color['zinc-500']};
  padding: 80px 16px;
`

export const NoPermission = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`

export const NoPermissionText = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.color['zinc-600']};
  font-weight: bold;
`
