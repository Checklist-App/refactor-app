import { Dimensions } from 'react-native'
import { Container, EmptyDateText } from './styles'

interface EmptyDateInputProps {
  placeholder: string
}

export function EmptyDateInput({ placeholder }: EmptyDateInputProps) {
  const deviceWidth = Dimensions.get('window').width
  const isSmallDevice = deviceWidth < 400

  return (
    <Container>
      <EmptyDateText isSmallDevice={isSmallDevice}>{placeholder}</EmptyDateText>
    </Container>
  )
}
