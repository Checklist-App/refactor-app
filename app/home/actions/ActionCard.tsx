// import { DrawerActions } from '@react-navigation/native'
import { Action } from '@/src/types/Action'
import { User, XCircle } from 'phosphor-react-native'
import {
  ActionCardContent,
  ActionCardHeader,
  ActionCardLeft,
  ActionCardTitle,
  ActionCardView,
  ActionSubtitle,
  Actions,
  ActionsList,
  ActionsListColumn,
  ActionsListContentText,
  ActionsListHeaderText,
  ActionsListRow,
  IconContainer,
  StatusContainer,
  StatusText,
} from './styles'

export function ActionCard({ action }: { action: Action }) {
  // const { user, token } = useAuth()
  // const { setCurrentAction, equipments, fetchEquipments, allChecklists } =
  //   useChecklist()
  // const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(
  //   null,
  // )
  // const [currentPeriod, setCurrentPeriod] = useState<IChecklistPeriod | null>(
  //   null,
  // )

  // useEffect(() => {
  //   if (equipments) {
  //     setCurrentEquipment(
  //       equipments.find((eq) => eq.id === action?.equipmentId) || null,
  //     )
  //   }
  // }, [equipments, action])

  // useEffect(() => {
  //   if (allChecklists) {
  //     const period = allChecklists
  //       .find((item) => item.id === action.checklistId)
  //       ?.checklistPeriods.find((item) => item.id === action.checklistPeriodId)

  //     setCurrentPeriod(period)
  //   }
  // }, [allChecklists, action])
  // const { dispatch } = useNavigation()

  // function handlePress() {
  //   setCurrentAction(action.id)
  //   router.push('/action')
  // }

  // if (!equipments) {
  //   if (user && token) {
  //     fetchEquipments(user.login, token)
  //   }
  //   return
  // }

  // if (!action || !currentEquipment || !currentPeriod) {
  //   return
  // }

  return (
    <ActionCardView>
      <ActionCardHeader>
        <ActionCardLeft>
          <IconContainer
          // onPress={handlePress}
          >
            <XCircle size={24} color="white" />
          </IconContainer>
          <ActionCardTitle>
            {/* {currentEquipment.code} - {currentEquipment.description} */}
            CB003 - CAMINHAO BASCULANTE
          </ActionCardTitle>
        </ActionCardLeft>
        <ActionsListContentText>
          <StatusContainer>
            <StatusText>
              {/* {action.endDate
                ? dayjs(action.endDate).isBefore(action.dueDate)
                  ? 'CONCLUÍDO'
                  : 'VENCIDO'
                : 'EM ANDAMENTO'} */}
              Em andamento
            </StatusText>
          </StatusContainer>
        </ActionsListContentText>
      </ActionCardHeader>
      <ActionCardContent>
        <ActionSubtitle>
          {/* {currentPeriod.task.description} | {currentPeriod.task.answer} */}
          Para brisa | Não conforme
        </ActionSubtitle>
        <Actions>
          <ActionsList>
            <ActionsListRow>
              <ActionsListColumn>
                <ActionsListHeaderText>Data abertura</ActionsListHeaderText>
                <ActionsListContentText>
                  23/01/2024
                  {/* {dayjs(action.startDate).format('DD/MM/YY HH:mm')} */}
                </ActionsListContentText>
              </ActionsListColumn>
              <ActionsListColumn>
                <ActionsListHeaderText>Data conclusão</ActionsListHeaderText>
                <ActionsListContentText>
                  --/--/----
                  {/* {action.endDate
                    ? dayjs(action.endDate).format('DD/MM/YY HH:mm')
                    : '-'} */}
                </ActionsListContentText>
              </ActionsListColumn>
              <ActionsListColumn>
                <ActionsListHeaderText>
                  <User />
                </ActionsListHeaderText>
                <ActionsListContentText>
                  {action.responsible}
                </ActionsListContentText>
              </ActionsListColumn>
            </ActionsListRow>
          </ActionsList>
        </Actions>
      </ActionCardContent>
    </ActionCardView>
  )
}
