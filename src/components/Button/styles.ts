import styled from 'styled-components/native'
import { TriggerProps } from './Trigger'

const variantsBackground = {
  primary: 'violet-500',
  secondary: 'violet-200',
  red: 'red-500',
  green: 'emerald-500',
  transparent: 'transparent',
}

export const variantsColorButton = {
  primary: 'white',
  secondary: 'violet-600',
  red: 'white',
  green: 'white',
  transparent: 'zinc-600',
}

export const variantsSizeButton = {
  sm: '16',
  md: '20',
  lg: '28',
}

const variantsPaddings = {
  sm: '12px 16px',
  md: '16px 20px',
  lg: '20px 26px',
}

export const ButtonContainer = styled.TouchableOpacity<TriggerProps>`
  background-color: ${({ theme, variant }) =>
    theme.color[variantsBackground[variant]]};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  padding: ${({ size }) => variantsPaddings[size]};
  align-items: center;
  justify-content: center;
  gap: 16px;
  border-radius: ${({ rounded }) => (rounded ? '999px' : '4px')};
  flex-direction: row;
  ${({ onlyIcon }) => onlyIcon && 'aspect-ratio: 1/1;'}
`
