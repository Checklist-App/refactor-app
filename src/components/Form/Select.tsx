import { ISelectProps, Select as SelectBase } from 'native-base'
import { ReactNode } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { useTheme } from 'styled-components'

interface SelectProps extends ISelectProps {
  name: string
  children: ReactNode
}

export function Select({ name, children, ...props }: SelectProps) {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name,
  })

  const { color } = useTheme()

  return (
    <SelectBase
      selectedValue={field.value}
      _selectedItem={{
        bg: color['violet-200'],
      }}
      onValueChange={field.onChange}
      p={4}
      {...props}
      bg={color.white}
    >
      {children}
    </SelectBase>
  )
}
