'use client'
import { SyncedItem } from '@/src/components/ChecklistItem/SyncedItem'
import { useChecklist } from '@/src/store/checklist'
import { useEquipments } from '@/src/store/equipments'
import { useLocations } from '@/src/store/location'
import { Action } from '@/src/types/Action'
import dayjs from 'dayjs'
import { Link } from 'expo-router'
import { Calendar, Dot, User, XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import {
  ActionCardBody,
  ActionCardFooter,
  ActionCardFooterInfo,
  ActionCardFooterText,
  ActionCardInfo,
  ActionCardTitle,
  ActionCardView,
  IconContainer,
  StatusContainer,
  StatusText,
} from './styles'

export function ActionCard({ action }: { action: Action }) {
  const { equipments } = useEquipments()
  const { locations } = useLocations()
  const { allChecklists } = useChecklist()
  const [description, setDescription] = useState('')

  const currentChecklist = allChecklists.find(
    (checklist) => checklist.id === action.checklistId,
  )

  useEffect(() => {
    if (currentChecklist.equipmentId) {
      const equipment = equipments?.find(
        (item) => item.id === currentChecklist.equipmentId,
      )

      setDescription(`${equipment.code} - ${equipment.description}`)
    } else if (currentChecklist.locationId) {
      const location = locations?.find(
        (item) => item.id === currentChecklist.locationId,
      )

      setDescription(`${location.location}`)
    }
  }, [action])

  return (
    <Link asChild href={`/home/actions/${action.id}`}>
      <ActionCardView>
        <SyncedItem status={action.syncStatus} />
        <IconContainer>
          <XCircle size={40} color="white" weight="bold" />
        </IconContainer>
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
            <ActionCardFooterText>{description}</ActionCardFooterText>
            <ActionCardFooterInfo>
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
            </ActionCardFooterInfo>
          </ActionCardFooter>
        </ActionCardInfo>
      </ActionCardView>
    </Link>
  )
}
