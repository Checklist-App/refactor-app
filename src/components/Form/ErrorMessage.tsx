import { useFormContext } from 'react-hook-form'
import styled from 'styled-components/native'

interface ErrorMessageProps {
  field: string
}

function get(obj: Record<any, any>, path: string) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  return result
}

export function ErrorMessage({ field }: ErrorMessageProps) {
  const {
    formState: { errors },
  } = useFormContext()

  const fieldError = get(errors, field)

  if (!fieldError) {
    return null
  }

  return <Message>{fieldError.message?.toString()}</Message>
}

const Message = styled.Text`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.color['red-500']};
`
