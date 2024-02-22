import { useConnection } from '@/src/store/connection'
import { WifiHigh, WifiSlash } from 'phosphor-react-native'
import { useTheme } from 'styled-components'
import { StatusName, WifiIndicatorContainer } from './styles'

interface WifiIndicatorProps {
  reduced?: boolean
}

export function WifiIndicator({ reduced = false }: WifiIndicatorProps) {
  const { color } = useTheme()
  const { isConnected } = useConnection()

  return (
    <WifiIndicatorContainer isConnected={isConnected}>
      {isConnected ? (
        <WifiHigh size={16} weight="bold" color={color['emerald-600']} />
      ) : (
        <WifiSlash size={16} weight="bold" color={color['red-600']} />
      )}
      {!reduced && (
        <StatusName isConnected={isConnected}>
          {isConnected ? 'On-line' : 'Off-line'}{' '}
        </StatusName>
      )}
    </WifiIndicatorContainer>
  )
}
