import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color['purple-500']};
`

export const Main = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`

export const TitleContainer = styled.View`
  flex: 1;
  justify-content: center;
  gap: 16px;
`

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
`
