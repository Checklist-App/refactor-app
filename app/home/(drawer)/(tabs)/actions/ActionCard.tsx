'use client'
import { SyncedItem } from '@/src/components/ChecklistItem/SyncedItem'
import { useChecklist } from '@/src/store/checklist'
import { useEquipments } from '@/src/store/equipments'
import { useLocations } from '@/src/store/location'
import { useSyncStatus } from '@/src/store/syncStatus'
import { Action } from '@/src/types/Action'
import dayjs from 'dayjs'
import { Link } from 'expo-router'
import { Calendar, User, XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { StatusTag } from './StatusTag'
import {
  ActionCardBody,
  ActionCardFooter,
  ActionCardFooterInfo,
  ActionCardFooterItem,
  ActionCardFooterRow,
  ActionCardFooterText,
  ActionCardInfo,
  ActionCardTitle,
  ActionCardView,
  DividerVertical,
  IconContainer,
} from './styles'

export function ActionCard({ action }: { action: Action }) {
  const { equipments } = useEquipments()
  const { locations } = useLocations()
  const { allChecklists } = useChecklist()
  const [description, setDescription] = useState('')
  const { isSyncing } = useSyncStatus()

  const currentChecklist = allChecklists.find(
    (checklist) => checklist.id === action.checklistId,
  )

  useEffect(() => {
    if (currentChecklist?.equipmentId) {
      const equipment = equipments?.find(
        (item) => item.id === currentChecklist.equipmentId,
      )

      setDescription(`${equipment.code} - ${equipment.description}`)
    } else if (currentChecklist?.locationId) {
      const location = locations?.find(
        (item) => item.id === currentChecklist.locationId,
      )

      setDescription(`${location.location}`)
    }
  }, [action])

  const actionInLoading = isSyncing && action.syncStatus === 'updated'
  const statusAction = actionInLoading ? 'loading' : action.syncStatus

  return (
    <Link
      asChild
      href={`/home/actions/${action.id}`}
      disabled={actionInLoading}
    >
      <ActionCardView>
        <SyncedItem status={statusAction} />
        <IconContainer>
          <XCircle size={40} color="white" weight="bold" />
        </IconContainer>
        <ActionCardInfo>
          <ActionCardBody>
            <ActionCardTitle>{action.title}</ActionCardTitle>

            <StatusTag
              dueDate={action.dueDate}
              endDate={action.endDate}
              startDate={action.startDate}
            />
          </ActionCardBody>
          <ActionCardFooter>
            <ActionCardFooterText>{description}</ActionCardFooterText>

            <ActionCardFooterRow>
              <User size={14} color="#64748B" />
              <ActionCardFooterText>{action.responsible}</ActionCardFooterText>
            </ActionCardFooterRow>

            <ActionCardFooterRow>
              <ActionCardFooterItem>
                <ActionCardFooterText>Data inicio:</ActionCardFooterText>
                <ActionCardFooterInfo>
                  <Calendar size={14} color="#64748B" />
                  <ActionCardFooterText>
                    {dayjs(action.startDate).format('DD/MM/YYYY')}
                  </ActionCardFooterText>
                </ActionCardFooterInfo>
              </ActionCardFooterItem>

              <DividerVertical />

              <ActionCardFooterItem>
                <ActionCardFooterText>Prazo:</ActionCardFooterText>
                <ActionCardFooterInfo>
                  <Calendar size={14} color="#64748B" />
                  <ActionCardFooterText>
                    {action.endDate
                      ? dayjs(action.endDate).format('DD/MM/YY HH:mm')
                      : '--/--/----'}
                  </ActionCardFooterText>
                </ActionCardFooterInfo>
              </ActionCardFooterItem>
            </ActionCardFooterRow>
          </ActionCardFooter>
        </ActionCardInfo>
      </ActionCardView>
    </Link>
  )
}
