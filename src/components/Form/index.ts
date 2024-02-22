import { Select as SelectLib } from 'native-base'
import { DatePicker } from './DatePicker'
import { ErrorMessage } from './ErrorMessage'
import { Field } from './Field'
import { Input } from './Input'
import { Label } from './Label'
import { Select } from './Select'
import { SelectFlash } from './SelectFlash'
// import { TextArea } from './TextArea'

export const Form = {
  Label,
  Input,
  ErrorMessage,
  Field,
  // TextArea,
  Select,
  SelectFlash,
  SelectItem: SelectLib.Item,
  DatePicker,
}
