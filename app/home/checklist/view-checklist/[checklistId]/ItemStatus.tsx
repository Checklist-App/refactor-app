import { Warning, WifiSlash } from 'phosphor-react-native'
import { ContainerStatus } from './styles'

interface ItemStatusProps {
  status: string
}

export function ItemStatus({ status }: ItemStatusProps) {
  return (
    <ContainerStatus status={status}>
      {status === 'errored' ? (
        <Warning size={12} color="#95a316" />
      ) : (
        <WifiSlash size={12} color="#EF4444" />
      )}
    </ContainerStatus>
  )
}
