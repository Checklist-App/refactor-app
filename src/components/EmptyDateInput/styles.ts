import styled from 'styled-components/native'

export const Container = styled.View`
  border: 1px solid ${({ theme }) => theme.color['zinc-300']};
  padding: 16px 20px;
  border-radius: 4px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.color.white};
  justify-content: space-between;
`

export const EmptyDateText = styled.Text`
  font-size: ${(props) => (props.isSmallDevice ? '12px' : '16px')};
  color: ${({ theme }) => theme.color['zinc-700']};
`
