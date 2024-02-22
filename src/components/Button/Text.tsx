import styled from 'styled-components/native'
import { variantsColorButton, variantsSizeButton } from './styles'
import { ReactNode } from 'react'
import { useButtonTheme } from './Trigger'

interface TextProps {
  children: ReactNode
}

type TextStyleProps = {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
}

export function Text({ children }: TextProps) {
  const { variant, size } = useButtonTheme()
  return (
    <TextStyle variant={variant} size={size}>
      {children}
    </TextStyle>
  )
}

const TextStyle = styled.Text<TextStyleProps>`
  color: ${({ theme, variant }) => theme.color[variantsColorButton[variant]]};
  font-weight: bold;
  font-size: ${({ size }) => +variantsSizeButton[size]}px;
`
