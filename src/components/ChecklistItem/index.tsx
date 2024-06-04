import { useEquipments } from '@/src/store/equipments'
import { useLocations } from '@/src/store/location'
import { Checklist } from '@/src/types/Checklist'
import dayjs from 'dayjs'
import { Link } from 'expo-router'
import { Dimensions } from 'react-native'
import { useTheme } from 'styled-components'
import { useChecklist } from '../../store/checklist'
import { Button } from '../Button'
import { SyncedItem } from './SyncedItem'
import {
  ChecklistButton,
  ChecklistItemView,
  Container,
  Dot,
  Text,
  TextBold,
  TextContent,
  TextContentUpper,
} from './styles'

const { width } = Dimensions.get('screen')

export function ChecklistItem({ checklist }: { checklist: Checklist }) {
  const theme = useTheme()
  const { checklistLoadingId } = useChecklist()
  const { equipments } = useEquipments()
  const { locations } = useLocations()

  return (
    <ChecklistItemView>
      <Container>
        <TextBold screenWidth={width}>{checklist.id}</TextBold>
        <TextContentUpper>
          <TextContent>
            <Text screenWidth={width}>
              {dayjs(checklist.initialTime).format('DD/MM/YY HH:mm')}
            </Text>
            <Dot />
            {checklist.period && (
              <>
                <Text screenWidth={width}>{checklist.period.period}</Text>
                <Text screenWidth={width}>-</Text>
              </>
            )}
            <Text screenWidth={width}>
              {checklist.status === 'open' ? 'ABERTO' : 'FECHADO'}
            </Text>
          </TextContent>
        </TextContentUpper>
        {checklist.equipmentId && equipments ? (
          <TextContent>
            <Text screenWidth={width}>
              {equipments.find((eq) => eq.id === checklist.equipmentId).code}
            </Text>
            <Dot />
            <Text screenWidth={width}>
              {
                equipments.find((eq) => eq.id === checklist.equipmentId)
                  .description
              }
            </Text>
          </TextContent>
        ) : checklist.locationId && locations ? (
          <TextContent>
            <Text screenWidth={width}>
              {
                locations.find((loc) => loc.id === checklist.locationId)
                  ?.location
              }
            </Text>
          </TextContent>
        ) : (
          <></>
        )}
        <SyncedItem
          status={
            checklist.error
              ? 'errored'
              : checklistLoadingId === checklist.id
                ? 'loading'
                : checklist.syncStatus
          }
        />
      </Container>
      <Link
        disabled={checklistLoadingId === checklist.id}
        // onPress={() => {
        //   setCurrentChecklist(checklist.id)
        // }}
        href={{
          pathname: `/home/checklist/edit-checklist/${checklist.id}`,
        }}
        asChild
      >
        <ChecklistButton>
          <Button.Icon.ClipboardText
            size={40}
            color={theme.color['violet-600']}
          />
        </ChecklistButton>
      </Link>
    </ChecklistItemView>
  )
}
