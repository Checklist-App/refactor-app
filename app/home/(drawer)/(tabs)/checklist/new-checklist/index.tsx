import { useCrashlytics } from '@/src/store/crashlytics-report'
import { Link } from 'expo-router'
import { useRouteInfo } from 'expo-router/build/hooks'
import { MagnifyingGlass, Truck } from 'phosphor-react-native'
import { useEffect } from 'react'
import {
  Container,
  Header,
  Option,
  OptionsContainer,
  TextOption,
  Title,
} from './styles'

export default function NewChecklist() {

  const { sendPathname } = useCrashlytics()
  const { pathname } = useRouteInfo()

  useEffect(() => {
    sendPathname(pathname)
  }, [])

  return (
    <Container>
      <Header>
        <Title>Selecione o tipo de checklist:</Title>
      </Header>
      <OptionsContainer>
        <Link href="/home/checklist/new-checklist/equipment-checklist" asChild>
          <Option>
            <TextOption numberOfLines={2}>Equipamento</TextOption>
            <Truck color="#7c3bed" size={40} weight="bold" />
          </Option>
        </Link>
        <Link href="/home/checklist/new-checklist/location-checklist" asChild>
          <Option>
            <TextOption numberOfLines={2}>Diversos</TextOption>
            <MagnifyingGlass color="#7c3bed" size={40} weight="bold" />
          </Option>
        </Link>
      </OptionsContainer>
    </Container>
  )
}
