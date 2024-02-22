import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: ${({ theme }) => theme['zinc-300']};
  backdrop-filter: blur(15px);
  padding: 24px;
  gap: 24px;
  flex: 1;
  justify-content: center;
  align-items: center;
`
