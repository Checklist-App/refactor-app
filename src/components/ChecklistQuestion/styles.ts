import styled from 'styled-components/native'

export const Container = styled.View`
  width: 100%;
  height: 85%;
  gap: 16px;
`

export const QuestionText = styled.Text`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }) => theme.color['zinc-700']};
`
