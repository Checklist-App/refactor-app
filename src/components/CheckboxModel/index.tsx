import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { Radio } from 'native-base'
import { Container } from './styles'

interface CheckboxesModelProps {
  options: ChecklistStatus[]
  selectedChild: number
  setSelectedChild: (arg: number) => void
}

export function CheckboxModel({
  options,
  selectedChild,
  setSelectedChild,
}: CheckboxesModelProps) {
  return (
    <Container>
      <Radio.Group
        value={String(selectedChild)}
        onChange={(selected) => setSelectedChild(Number(selected))}
        name={'checkbox'}
        style={{ gap: 4 }}
      >
        {options.map(({ description, id }) => (
          <Radio key={id} value={String(id)}>
            {description}
          </Radio>
        ))}
      </Radio.Group>
    </Container>
  )
}
