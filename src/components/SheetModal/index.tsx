import { Actionsheet } from 'native-base'
import { ReactNode } from 'react'
import { Container } from './styles'

interface SheetModalProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
  children: ReactNode
}

export function SheetModal({ children, ...props }: SheetModalProps) {
  return (
    <Container>
      <Actionsheet {...props} style={{ flex: 1 }}>
        <Actionsheet.Content>{children}</Actionsheet.Content>
      </Actionsheet>
    </Container>
  )
}
