import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { CheckCircle, Question, XCircle } from 'phosphor-react-native'
import { useState } from 'react'
import { Dimensions } from 'react-native'
import { Container, Option, TextOption } from './styles'

interface OptionsModelProps {
  options: ChecklistStatus[]
  alternativeSelected: number
  setAlternativeSelected: (arg: number) => void
}

export function OptionsModel({
  options,
  alternativeSelected,
  setAlternativeSelected
}: OptionsModelProps) {
  const icons = {
    'remove-circle': Question,
    'close-circle': XCircle,
    'checkmark-circle': CheckCircle,
  }

  const [width] = useState(Dimensions.get('window').width)
  const [desc, setDesc] = useState('')

  const colors = {
    dark: 'black',
    success: 'green',
    danger: 'red',
  }

  function resumedDesc(index: number): string {
    switch (index) {
      case 0:
        return "OK"
      case 1:
        return "NC"
      default:
        return "NA"
    }
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
              {width > 720 ? option.description : resumedDesc(index)}
            </TextOption>
            <Icon color={selected ? 'white' : color} size={40} weight="bold" />
          </Option>
        )
      })}
    </Container>
  )
}
