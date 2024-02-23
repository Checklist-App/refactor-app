/* eslint-disable @typescript-eslint/no-empty-function */
import { TextArea } from 'native-base'

interface ObservationFieldProps {
  observationText: string
  setObservationText: (arg: string) => void
  disabled?: boolean
}

export function ObservationField({
  observationText,
  setObservationText,
  disabled = false,
}: ObservationFieldProps) {
  return (
    <TextArea
      autoCompleteType={() => {}}
      isDisabled={disabled}
      placeholder="Observação"
      value={observationText}
      onChangeText={(text) => setObservationText(text)}
    ></TextArea>
  )
}
