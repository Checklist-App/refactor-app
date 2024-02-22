import { FlashList } from '@shopify/flash-list'
import { Actionsheet, useDisclose } from 'native-base'
import { CaretDown } from 'phosphor-react-native'
import { ReactNode } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Dimensions, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { SelectFlashText, SelectFlashTrigger } from './styles'

interface SelectFlashProps {
  name: string
  options: Array<{
    label: string
    value: string
    disabled?: boolean
  }>
  header?: ReactNode
  defaultValue?: string
  disabled?: boolean
}

export function SelectFlash({
  name,
  options,
  header,
  defaultValue,
  disabled = false,
}: SelectFlashProps) {
  const { color } = useTheme()
  const sheetSettings = useDisclose()
  const { onOpen, onClose } = sheetSettings

  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    defaultValue,
  })

  const deviceWidth = Dimensions.get('window').width
  const isSmallDevice = deviceWidth < 400

  function handleSelect(value: string) {
    field.onChange(value)
    onClose()
  }

  function handleOpen() {
    if (!disabled) {
      onOpen()
    }
  }

  return (
    <>
      <SelectFlashTrigger onPress={handleOpen}>
        <SelectFlashText isSmallDevice={isSmallDevice}>
          {field.value
            ? options.find((option) => option.value === field.value).label
            : 'Selecione...'}
        </SelectFlashText>
        <CaretDown color={color['zinc-800']} size={16} />
      </SelectFlashTrigger>

      <Actionsheet
        {...sheetSettings}
        style={{ justifyContent: 'flex-end', padding: 0 }}
      >
        <Actionsheet.Content style={{ maxHeight: '90%', marginBottom: 0 }}>
          <View style={{ height: '100%', width: '100%' }}>
            {header}
            <FlashList
              data={options}
              estimatedItemSize={60}
              keyExtractor={({ value }) => value}
              renderItem={({ item }) => {
                return (
                  <Actionsheet.Item
                    aria-selected={field.value === item.value}
                    disabled={item.disabled}
                    onPress={() => handleSelect(item.value)}
                  >
                    {item.label}
                  </Actionsheet.Item>
                )
              }}
            />
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  )
}
