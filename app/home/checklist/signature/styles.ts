import styled from 'styled-components/native'

interface CanvasContainerProps {
  width: number
  height: number
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

export const PageTitle = styled.Text`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }) => theme.color['zinc-700']};
`

export const PageSubTitle = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-600']};
  text-transform: uppercase;
  letter-spacing: 3px;
`

export const CanvasContainer = styled.View<CanvasContainerProps>`
  flex: 1;
  margin: 48px;
  margin-bottom: 0px;
  border: ${({ theme }) => `4px solid ${theme.color['violet-400']}`};
  border-radius: 12px;
`

export const Buttons = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
