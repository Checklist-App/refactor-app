import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  padding-top: 42px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.color['zinc-100']};
  gap: 16px;
`

export const ContainerList = styled.View`
  height: 80%;
`

export const Buttons = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
