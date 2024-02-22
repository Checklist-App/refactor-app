import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { CheckCircle, Question, XCircle } from 'phosphor-react-native'
import { Container, Option, TextOption } from './styles'

interface OptionsModelProps {
  options: ChecklistStatus[]
  alternativeSelected: number
  setAlternativeSelected: (arg: number) => void
}

export function OptionsModel({
  options,
  alternativeSelected,
  setAlternativeSelected,
}: OptionsModelProps) {
  const icons = {
    'remove-circle': Question,
    'close-circle': XCircle,
    'checkmark-circle': CheckCircle,
  }

  const colors = {
    dark: 'black',
    success: 'green',
    danger: 'red',
  }

  return (
    <Container>
      {options?.map((option, index) => {
        const Icon = icons[option.icon]
        const selected = alternativeSelected === option.id
        const color = colors[option.color] || 'white'
        return (
          <Option
            key={index}
            color={color}
            selected={selected}
            onPress={() => {
              setAlternativeSelected(option.id)
            }}
          >
            <TextOption color={color} selected={selected} numberOfLines={2}>
              {option.description}
            </TextOption>
            <Icon color={selected ? 'white' : color} size={40} weight="bold" />
          </Option>
        )
      })}
    </Container>
  )
}
