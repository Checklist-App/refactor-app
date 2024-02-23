import styled from 'styled-components/native'

export const Footer = styled.View`
  padding: 8px;
`
export const FooterTextLight = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.color['zinc-400']};
  text-align: center;
`

export const FooterText = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.color['zinc-500']};
  text-align: center;
`

export const Divider = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  padding: 8px;
`

export const DividerLine = styled.View`
  height: 1px;
  width: 100%;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color['zinc-400']};
`
