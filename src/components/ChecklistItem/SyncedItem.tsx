import { Warning, WifiHigh, WifiSlash } from 'phosphor-react-native'
import { Loading } from '../Loading'
import { ContainerSynced } from './styles'

interface SyncedItemProps {
  status: string
}

export function SyncedItem({ status }: SyncedItemProps) {
  return (
    <ContainerSynced status={status}>
      {status === 'errored' ? (
        <Warning size={12} color="#95a316" />
      ) : status === 'synced' ? (
        <WifiHigh size={12} color="#16A34A" />
      ) : status === 'loading' ? (
        <Loading size={12} onlyIcon />
      ) : (
        <WifiSlash size={12} color="#EF4444" />
      )}
    </ContainerSynced>
  )
}
