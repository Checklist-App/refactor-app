import { Link } from 'expo-router'
import { MapPin, Truck } from 'phosphor-react-native'
import {
  Container,
  Header,
  Option,
  OptionsContainer,
  TextOption,
  Title,
} from './styles'

export default function NewChecklist() {
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
            <TextOption numberOfLines={2}>Localização</TextOption>
            <MapPin color="#7c3bed" size={40} weight="bold" />
          </Option>
        </Link>
      </OptionsContainer>
    </Container>
  )
}
