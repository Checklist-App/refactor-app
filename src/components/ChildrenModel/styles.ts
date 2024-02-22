import styled from 'styled-components/native'

export const Container = styled.View`
  gap: 16px;
  margin-top: 16px;
  flex: 1;
`
export const ContainerChildAnswers = styled.ScrollView`
  padding: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.white};
  flex: 1;
`
