import styled from 'styled-components/native'

type Props = {
  isConnected: boolean
}

export const connectionColors = {
  true: 'green',
  false: 'red',
}

export const WifiIndicatorContainer = styled.View<Props>`
  padding: 8px 12px;
  background-color: ${({ theme, isConnected }) =>
    theme.color[`${connectionColors[isConnected]}-200`]};
  border-radius: 999px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`

export const StatusName = styled.Text<Props>`
  color: ${({ theme, isConnected }) =>
    theme.color[`${connectionColors[isConnected]}-600`]};
  font-size: 16px;
`
