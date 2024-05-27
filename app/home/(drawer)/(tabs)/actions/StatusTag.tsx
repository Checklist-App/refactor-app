import dayjs from 'dayjs'
import { StatusContainer, StatusText } from './styles'

interface StatusTagProps {
  dueDate: Date | undefined
  endDate: Date | undefined
  startDate: Date | undefined
}

export function StatusTag({ dueDate, endDate, startDate }: StatusTagProps) {
  // console.log(
  //   `DATA INICIO: ${startDate} PRAZO: ${endDate} CONCLUSAO: ${dueDate}`,
  // )

  return (
    <StatusContainer>
      <StatusText>
        {dayjs(dueDate).isAfter(startDate)
          ? 'CONCLUÍDO'
          : dayjs(endDate).isBefore(dayjs())
            ? 'VENCIDO'
            : 'ABERTO'}
      </StatusText>
    </StatusContainer>
  )
}
