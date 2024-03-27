import { Button } from '@/src/components/Button'
import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.black};
`

export const ContainerWarn = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const TextWarn = styled.Text`
  color: ${({ theme }) => theme.color['zinc-700']};
  font-weight: 700;
  font-size: 18px;
`

export const ScanButton = styled(Button.Trigger)`
  position: absolute;
  bottom: 16px;
  left: 50%;
  right: 50%;
`
