import { Button } from '@/src/components/Button'
import { Loading } from '@/src/components/Loading'
import { Toast } from '@/src/components/Toast'
import { useChecklist } from '@/src/store/checklist'
import { Checklist } from '@/src/types/Checklist'
import { ChecklistPeriodImage } from '@/src/types/ChecklistPeriod'
import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { ChecklistStatusAction } from '@/src/types/ChecklistStatusAction'
import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { Text, useToast } from 'native-base'
import { Dot } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { CardImage, ListImages } from './CardImage'
import { EditModal } from './EditModal'
import { ItemStatus } from './ItemStatus'
import {
  Card,
  CardAnswer,
  CardAnswerDescription,
  CardAnswerLine,
  CardImages,
  CardQuestion,
  Container,
  Title,
  TitleView,
} from './styles'

export interface FrontendTask {
  id: number
  familyId: number
  description: string
  dataChildren: ChecklistStatusAction[]
}

export interface ModalData {
  task: {
    children: ChecklistStatusAction[]
    id: number
    familyId: number
    description: string
  }
  checklistPeriodIndex: number
  checklistPeriodId: number
  checklistId: number
  images: ChecklistPeriodImage[]
  statusNC?: number
  answer: string
  option: ChecklistStatus
}

export default function EditChecklist() {
  const { allChecklists } = useChecklist()
  const { checklistId } = useLocalSearchParams()
  const toast = useToast()
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(
    null,
  )
  const [canCloseChecklist, setCanCloseChecklist] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)

  useEffect(() => {
    if (allChecklists) {
      const found = allChecklists.find(
        (item) => item.id === Number(checklistId),
      )
      if (found) {
        setCurrentChecklist(found)
      }
    }
  }, [allChecklists])

  useEffect(() => {
    let update = true
    currentChecklist?.checklistPeriods.forEach((period) => {
      if (period.statusId === 0) {
        update = false
      }
    })
    setCanCloseChecklist(update)
  }, [currentChecklist])

  function handleFinalizeChecklist() {
    Alert.alert('Fechar Checklist', 'Deseja fechar esse checklist?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => {
          try {
            toast.show({
              render: () => (
                <Toast.Success>Checklist finalizado com sucesso!</Toast.Success>
              ),
            })
          } catch (err) {
            toast.show({
              render: () => (
                <Toast.Error>Não foi possivel salvar o checklist</Toast.Error>
              ),
            })
            console.log(err)
          }
        },
      },
    ])
    return true
  }

  if (!currentChecklist) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <Container>
      <EditModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
      />

      <TitleView>
        <Title>
          {/* {currentChecklist.equipment.code} -{' '}
          {currentChecklist.equipment.description} */}
        </Title>
        {currentChecklist.error && (
          <Button.Trigger
            variant="transparent"
            onPress={() => alert('Erro ao sincronizar esse checklist')}
          >
            <Button.Icon.WarningOctagon />
          </Button.Trigger>
        )}
        {canCloseChecklist && currentChecklist.status === 'open' && (
          <Button.Trigger size="sm" onPress={handleFinalizeChecklist}>
            <Button.Text>Fechar Checklist</Button.Text>
          </Button.Trigger>
        )}
      </TitleView>
      <FlashList
        data={currentChecklist.checklistPeriods}
        extraData={currentChecklist}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={50}
        ListEmptyComponent={
          <Text>Não há perguntas vinculadas a esse registro.</Text>
        }
        renderItem={({ item, index }) => (
          <Card
            onPress={() => {
              const option = item.options.find(
                (opt) => opt.id === item.statusId,
              )
              setModalData({
                checklistId: item.productionRegisterId,
                task: item.task,
                images: item.img,
                answer: item.task.answer,
                statusNC: item.statusNC,
                checklistPeriodIndex: index,
                // actions: item.actions,
                checklistPeriodId: item.id,
                option,
              })
              setShowModal(true)
            }}
          >
            <CardQuestion>{item.task.description}</CardQuestion>
            {item.syncStatus === 'errored' && (
              <ItemStatus status={item.syncStatus} />
            )}

            <CardAnswerLine>
              <CardAnswer>{item.task.answer || 'NÃO RESPONDIDO'}</CardAnswer>
              {item.task.answer && item.task.children && item.statusNC ? (
                <>
                  <Dot />
                  <CardAnswerDescription>
                    {
                      item.task.children.find(
                        (child) => child.id === item.statusNC,
                      ).description
                    }
                  </CardAnswerDescription>
                </>
              ) : (
                ''
              )}
            </CardAnswerLine>
            {item.img.length ? (
              item.img.length > 3 ? (
                <ListImages images={item.img} size={64} />
              ) : (
                <CardImages>
                  {item.img.map((img, index) => (
                    <CardImage
                      src={img.path}
                      size={64}
                      key={img.name + '-' + index}
                    />
                  ))}
                </CardImages>
              )
            ) : (
              ''
            )}
          </Card>
        )}
      />
    </Container>
  )
}
