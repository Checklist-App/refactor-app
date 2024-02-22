import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components/native'
import { Container } from './styles'

interface LoadingProps {
  onlyIcon?: boolean
  size?: number
  customColor?: string
}

export function Loading({ onlyIcon, size, customColor }: LoadingProps) {
  const { color } = useTheme()
  return onlyIcon ? (
    <ActivityIndicator
      size={size || 64}
      color={customColor || color['violet-500']}
    />
  ) : (
    <Container>
      <ActivityIndicator
        size={size || 64}
        color={customColor || color['violet-500']}
      />
    </Container>
  )
}
