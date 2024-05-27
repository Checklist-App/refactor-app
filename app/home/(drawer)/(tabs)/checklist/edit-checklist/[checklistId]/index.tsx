import { Button } from '@/src/components/Button'
import { Loading } from '@/src/components/Loading'
import db from '@/src/libs/database'
import { useChecklist } from '@/src/store/checklist'
import { useEquipments } from '@/src/store/equipments'
import { useLocations } from '@/src/store/location'
import { Checklist } from '@/src/types/Checklist'
import { ChecklistPeriodImage } from '@/src/types/ChecklistPeriod'
import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { ChecklistStatusAction } from '@/src/types/ChecklistStatusAction'
import { FlashList } from '@shopify/flash-list'
import { Link, useLocalSearchParams } from 'expo-router'
import { Text } from 'native-base'
import { Dot } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
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
  const { allChecklists, loadChecklists } = useChecklist()
  const { checklistId } = useLocalSearchParams()
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(
    null,
  )
  const { equipments } = useEquipments()
  const { locations } = useLocations()
  const [canCloseChecklist, setCanCloseChecklist] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)

  useEffect(() => {
    loadChecklists(db.retrieveLastUser().login)
  }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log({
  //       checklistId,
  //       periods: currentChecklist?.checklistPeriods,
  //       // currentChecklist,
  //     })
  //   }, 15000)
  //   return () => clearInterval(interval)
  // }, [])

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
    const update = currentChecklist?.checklistPeriods.some(
      (period) => !period.statusId,
    )
    setCanCloseChecklist(update)
  }, [currentChecklist])

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
          {currentChecklist.equipmentId && equipments
            ? equipments.find((eq) => eq.id === currentChecklist.equipmentId)
                ?.code +
              ' - ' +
              equipments.find((eq) => eq.id === currentChecklist.equipmentId)
                ?.description
            : currentChecklist.locationId && locations
              ? locations.find((loc) => loc.id === currentChecklist.locationId)
                  ?.location
              : ''}
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
          <Link
            asChild
            href={{
              pathname: `/home/answer/${checklistId}`,
              params: {
                // checklistPeriodIndex: String(checklistPeriodIndex),
                isEditing: 'false',
              },
            }}
          >
            <Button.Trigger size="sm">
              <Button.Text>Responder checklist</Button.Text>
            </Button.Trigger>
          </Link>
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
            <CardQuestion>{item.task?.description}</CardQuestion>
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
                      )?.description
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
                  {item.img.map((img, index) => {
                    const src = img.url.length > 0 ? img.url : img.path

                    return (
                      <CardImage
                        src={src}
                        size={64}
                        key={img.name + '-' + index}
                      />
                    )
                  })}
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
