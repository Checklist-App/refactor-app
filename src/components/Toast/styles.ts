import styled, { css } from 'styled-components/native'

const ToastStyleBasea = css`
  padding: 16px 20px;
  border-radius: 4px;
  color: ${({ theme }) => theme.color.white};
  font-weight: 800;
`

export const Success = styled.Text`
  ${ToastStyleBasea}
  background-color: ${({ theme }) => theme.color['green-500']};
`

export const Warn = styled.Text`
  ${ToastStyleBasea}
  background-color: ${({ theme }) => theme.color['amber-500']};
`

export const Error = styled.Text`
  ${ToastStyleBasea}
  background-color: ${({ theme }) => theme.color['red-500']};
`
