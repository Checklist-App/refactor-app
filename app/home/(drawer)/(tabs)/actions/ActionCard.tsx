// import { DrawerActions } from '@react-navigation/native'
import { Action } from '@/src/types/Action'
import dayjs from 'dayjs'
import { Link } from 'expo-router'
import { Calendar, Dot, User, XCircle } from 'phosphor-react-native'
import {
  ActionCardBody,
  ActionCardFooter,
  ActionCardFooterText,
  ActionCardInfo,
  ActionCardTitle,
  ActionCardView,
  IconContainer,
  StatusContainer,
  StatusText,
} from './styles'

export function ActionCard({ action }: { action: Action }) {
  console.log(action.startDate, action.endDate, action.dueDate)
  console.log(dayjs(action.endDate).isBefore(action.dueDate))

  return (
    <ActionCardView>
      <Link asChild href={`/home/actions/${action.id}`}>
        <IconContainer>
          <XCircle size={40} color="white" weight="bold" />
        </IconContainer>
      </Link>
      <ActionCardInfo>
        <ActionCardBody>
          <StatusContainer>
            <StatusText>
              {dayjs(action.dueDate).isAfter(action.startDate)
                ? 'CONCLUÍDO'
                : dayjs(action.endDate).isBefore(dayjs())
                  ? 'VENCIDO'
                  : 'ABERTO'}
            </StatusText>
          </StatusContainer>
          <ActionCardTitle>{action.title}</ActionCardTitle>
        </ActionCardBody>
        <ActionCardFooter>
          <User size={14} color="#64748B" />
          <ActionCardFooterText>{action.responsible}</ActionCardFooterText>
          <Calendar size={14} color="#64748B" />
          <ActionCardFooterText>
            {dayjs(action.startDate).format('DD/MM/YYYY')}
          </ActionCardFooterText>
          <Dot size={14} color="#64748B" />
          <ActionCardFooterText>
            {action.endDate
              ? dayjs(action.endDate).format('DD/MM/YY HH:mm')
              : '--/--/----'}
          </ActionCardFooterText>
        </ActionCardFooter>
      </ActionCardInfo>
    </ActionCardView>
  )
}
