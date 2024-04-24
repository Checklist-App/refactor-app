import { MotiView } from 'moti'
import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
`

export const IndicatorContainer = styled.View`
  position: relative;
  height: 8px;
  flex: 1;
  background-color: ${({ theme }) => theme.color['violet-200']};
  border-radius: 999px;
  overflow: hidden;
`

export const IndicatorThumb = styled(MotiView)<{ width: string }>`
  background-color: ${({ theme }) => theme.color['violet-500']};
  height: 8px;
  width: ${({ width }) => width};
`

export const PaginationText = styled.Text`
  color: ${({ theme }) => theme.color['violet-500']};
  font-weight: bold;
  font-size: 24px;
`

export const PaginationContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`
