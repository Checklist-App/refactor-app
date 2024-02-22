import dayjs from 'dayjs'
import { useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Dimensions } from 'react-native'
import DatePickerLib, {
  DatePickerProps as DatePickerLibProps,
} from 'react-native-date-picker'
import { Button } from '../../Button'
import { InputDatePicker, InputDatePickerText } from './styles'

interface DatePickerProps extends Omit<DatePickerLibProps, 'date'> {
  name: string
  date?: Date
  placehilderFormat?: string
  disabled?: boolean
}

export function DatePicker({
  name,
  mode = 'time',
  date = new Date(),
  modal = true,
  placehilderFormat = 'DD/MM/YYYY HH:mm',
  disabled = false,
  ...props
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    defaultValue: date,
  })

  const deviceWidth = Dimensions.get('window').width
  const isSmallDevice = deviceWidth < 400

  function handleOpen() {
    if (!disabled) {
      setIsOpen(true)
    }
  }

  return (
    <>
      <InputDatePicker variant="transparent" onPress={handleOpen}>
        <InputDatePickerText isSmallDevice={isSmallDevice}>
          {dayjs(field.value).format(placehilderFormat) ||
            'Clique para selecionar'}
        </InputDatePickerText>
        <Button.Icon.Calendar />
      </InputDatePicker>
      <DatePickerLib
        {...props}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        date={field.value}
        // onDateChange={field.onChange}
        onConfirm={(date) => {
          setIsOpen(false)
          field.onChange(date)
        }}
        mode={mode}
        modal={modal}
      />
    </>
  )
}
