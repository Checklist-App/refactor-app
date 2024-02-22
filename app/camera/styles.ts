import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
`

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  margin-top: 16px;
`

export const Footer = styled.View`
  padding: 16px;
  gap: 28px;
`

export const ContainerPictures = styled.View`
  align-items: flex-start;
  gap: 8px;
`

export const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const NoPermissionCamera = styled.View`
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
