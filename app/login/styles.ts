import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.white};
  justify-content: space-between;
`

type WaveContainerProps = {
  screenWidth: number
  screenHeight: number
}

export const WaveContainer = styled.View<WaveContainerProps>`
  height: ${({ screenHeight }) => String(screenHeight / 1.6)}px;
  top: 0;
  position: absolute;
  background-color: red;
`

export const ContainerWelcome = styled.View`
  max-width: 60%;
  flex: 1;
  justify-content: flex-end;
`

export const Description = styled.Text`
  color: ${({ theme }) => theme.color['zinc-200']};
`

export const Header = styled.View`
  padding: 40px;
  justify-content: center;
  height: 50%;
  position: relative;
  margin-top: -40px;
`

export const Main = styled.View`
  padding: 40px;
  min-height: 40%;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 8px;
  gap: 16px;
`

export const Welcome = styled.Text<{ screenWidth: number }>`
  font-size: ${({ screenWidth }) => (screenWidth <= 400 ? '38px' : '58px')};
  font-weight: bold;
  color: ${({ theme }) => theme.color.white};
`

export const ConnectedView = styled.View`
  width: '100%';
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2px;
`

export const OfflineText = styled.Text`
  color: ${({ theme }) => theme.color['red-500']};
`
