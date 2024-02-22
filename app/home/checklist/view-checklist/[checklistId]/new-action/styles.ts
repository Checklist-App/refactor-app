import styled from 'styled-components/native'

export const Container = styled.View`
  gap: 16px;
  flex: 1;
  background-color: ${({ theme }) => theme.color.white};
  padding: 24px;
`
export const Header = styled.View`
  gap: 8px;
`

export const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
`

export const SubTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.color['zinc-700']};
`

export const FormContainer = styled.View`
  gap: 8px;
`

export const Buttons = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
