import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

export function Field(props: ViewProps) {
  return <Content {...props} />
}

const Content = styled.View`
  gap: 8px;
`
