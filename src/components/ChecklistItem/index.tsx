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
  return (
    <ChecklistItemView>
      <Container>
        <TextContentUpper>
          <TextContent>
            <Text screenWidth={width}>
              {dayjs(checklist.initialTime).format('DD/MM/YYYY HH:mm')}
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
          <TextContent>
            <TextBold screenWidth={width}>{checklist.id}</TextBold>
          </TextContent>
        </TextContentUpper>
        <TextContent>
          {/* <Text screenWidth={width}>{checklist.equipment.code}</Text> */}
          <Text>Codigo eq</Text>
          <Dot />
          <Text>Descricao eq</Text>
          {/* <Text screenWidth={width}>{checklist.equipment.description}</Text> */}
        </TextContent>
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
