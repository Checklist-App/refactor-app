import { useController, useFormContext } from 'react-hook-form'
import { TextInputProps } from 'react-native'
import styled from 'styled-components/native'

interface InputType extends TextInputProps {
  name?: string
}

export function Input({ name, ...props }: InputType) {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name,
  })

  return (
    <InputBase value={field.value} onChangeText={field.onChange} {...props} />
  )
}

const InputBase = styled.TextInput`
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color['zinc-300']};
  padding: 16px 20px;
  border-radius: 4px;
  font-size: 16px;
`
