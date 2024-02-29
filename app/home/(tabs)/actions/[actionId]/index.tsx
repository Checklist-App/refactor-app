import { Button } from '@/src/components/Button'
import { EmptyDateInput } from '@/src/components/EmptyDateInput'
import { Form } from '@/src/components/Form'
import { KeyboardCoverPrevent } from '@/src/components/KeyboradCoverPrevent'
import { Loading } from '@/src/components/Loading'
import { ObservationField } from '@/src/components/ObservationField'
import { Toast } from '@/src/components/Toast'
import { useActions } from '@/src/store/actions'
import { useCamera } from '@/src/store/camera'
import { useChecklist } from '@/src/store/checklist'
import { useEquipments } from '@/src/store/equipments'
import { useResponsibles } from '@/src/store/responsibles'
import { Action } from '@/src/types/Action'
import {
  ChecklistPeriod,
  ChecklistPeriodImage,
} from '@/src/types/ChecklistPeriod'
import { Equipment } from '@/src/types/Equipment'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { ScrollView, useToast } from 'native-base'
import { XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, BackHandler, Dimensions } from 'react-native'
import { z } from 'zod'
import { ListImages } from '../../checklist/edit-checklist/[checklistId]/CardImage'
import {
  Buttons,
  Container,
  ContainerHeader,
  FormInput,
  FormInputs,
  HeaderUpper,
  IconContainer,
  InfoCard,
  InfoCardBody,
  InfoCardLabel,
  InfoCardRow,
  InfoCardText,
  InfoCardValue,
  InfoField,
  StatusContainer,
  StatusText,
  SubTitleRow,
  Title,
  TitleText,
} from './styles'

const editActionSchema = z.object({
  responsible: z.string(),
  title: z.string(),
  endDate: z.date().nullable(),
})

type EditActionData = z.infer<typeof editActionSchema>

export default function ActionScreen() {
  const editActionForm = useForm<EditActionData>({
    resolver: zodResolver(editActionSchema),
  })
  const { handleSubmit, setValue } = editActionForm
  const { allChecklists } = useChecklist()
  const { actions, updateAction } = useActions()
  const { currentImages } = useCamera()
  const { equipments } = useEquipments()
  const { responsibles } = useResponsibles()
  const { actionId } = useLocalSearchParams()
  const toast = useToast()
  const [currentAction, setCurrentAction] = useState<Action | null>(null)
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(
    null,
  )
  const [currentPeriod, setCurrentPeriod] = useState<ChecklistPeriod | null>(
    null,
  )
  const [observationText, setObservationText] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  const [images, setImages] = useState<ChecklistPeriodImage[]>([])

  const deviceWidth = Dimensions.get('window').width
  const isSmallDevice = deviceWidth < 400

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      handleStopEditing(isAnswering),
    )

    return () => backHandler.remove()
  }, [isAnswering])

  useEffect(() => {
    const action = actions.find((item) => item.id === Number(actionId))
    if (action) {
      setCurrentAction(action)
    }
  }, [actions, actionId])

  useEffect(() => {
    if (currentAction) {
      setValue('responsible', currentAction.responsible)
      setValue('title', currentAction.title)
      setObservationText(currentAction.description)
      setImages(currentAction.img)
      if (currentAction?.endDate) {
        setValue('endDate', new Date(currentAction.endDate))
      }

      const checklist = allChecklists.find(
        (item) => item.id === currentAction.checklistId,
      )
      if (checklist) {
        const period = checklist.checklistPeriods.find(
          (item) => item.id === currentAction.checklistPeriodId,
        )
        if (period) {
          setCurrentPeriod(period)
        }
      }

      const equipment = equipments?.find(
        (item) => item.id === currentAction.equipmentId,
      )
      if (equipment) {
        setCurrentEquipment(equipment)
      }
    }
  }, [currentAction, allChecklists, equipments])

  useEffect(() => {
    if (currentImages && currentAction) {
      if (currentImages.actionId === currentAction.id) {
        setImages(currentImages.images)
      }
    }
  }, [currentImages, currentAction])

  function handleEdit(data: EditActionData) {
    try {
      if (!observationText) {
        return toast.show({
          render: () => <Toast.Error>Adicione uma descrição</Toast.Error>,
        })
      }
      if (!images.length) {
        return toast.show({
          render: () => <Toast.Error>Adicione uma ou mais imagens</Toast.Error>,
        })
      }
      updateAction({
        ...currentAction,
        endDate: new Date(data.endDate) || currentAction.endDate,
        responsible: data.responsible || currentAction.responsible,
        description: observationText,
        img: images,
      })
      setIsAnswering(false)
      toast.show({
        render: () => <Toast.Success>Ação Salva!</Toast.Success>,
      })
    } catch (err) {
      setIsAnswering(false)
      console.log(err)
      toast.show({
        render: () => <Toast.Error>Erro ao salvar ação!</Toast.Error>,
      })
    }
  }

  function handleStopEditing(isEditing: boolean) {
    if (isEditing) {
      Alert.alert('Cancelar', 'Deseja cancelar a edição dessa ação?', [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            setIsAnswering(false)
          },
        },
      ])
      return true
    } else {
      router.back()
      return true
    }
  }

  if (!currentAction || !currentEquipment || !currentPeriod) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <Container>
      <ContainerHeader>
        <HeaderUpper>
          <Title>
            <IconContainer>
              <XCircle color="white" />
            </IconContainer>
            <TitleText isSmallDevice={isSmallDevice}>
              {currentEquipment.code} - {currentEquipment.description}
            </TitleText>
          </Title>
          <Button.Trigger
            rounded
            size="sm"
            disabled={isAnswering}
            onPress={() => setIsAnswering(true)}
          >
            <Button.Icon.Pencil />
          </Button.Trigger>
        </HeaderUpper>
        <SubTitleRow>
          <InfoCardText>
            <InfoCardLabel>Id Checklist:</InfoCardLabel>
            <InfoCardValue> {currentAction.checklistId}</InfoCardValue>
          </InfoCardText>
          <StatusContainer>
            <StatusText>
              {currentAction.endDate
                ? dayjs(currentAction.endDate).isBefore(currentAction.dueDate)
                  ? 'CONCLUÍDO'
                  : 'VENCIDO'
                : 'EM ANDAMENTO'}
            </StatusText>
          </StatusContainer>
        </SubTitleRow>
      </ContainerHeader>
      <KeyboardCoverPrevent>
        <ScrollView
          contentContainerStyle={{
            rowGap: 16,
          }}
        >
          <InfoField>
            <InfoCard>
              {/* <InfoCardTitle>Informações</InfoCardTitle> */}
              <InfoCardBody>
                <InfoCardRow>
                  <InfoCardText>
                    <InfoCardLabel>
                      {currentPeriod.task.description}:
                    </InfoCardLabel>
                    <InfoCardValue>{currentPeriod.task.answer}</InfoCardValue>
                  </InfoCardText>
                </InfoCardRow>
                <InfoCardRow>
                  <InfoCardText>
                    <InfoCardLabel>Data Início:</InfoCardLabel>
                    <InfoCardValue>
                      {dayjs(currentAction.startDate).format('DD/MM/YY HH:mm')}
                    </InfoCardValue>
                  </InfoCardText>
                  <InfoCardText>
                    <InfoCardLabel>Prazo:</InfoCardLabel>
                    <InfoCardValue>
                      {dayjs(currentAction.dueDate).format('DD/MM/YY HH:mm')}
                    </InfoCardValue>
                  </InfoCardText>
                </InfoCardRow>
              </InfoCardBody>
            </InfoCard>
          </InfoField>
          <FormProvider {...editActionForm}>
            <Form.Field>
              <Form.Label>Ação:</Form.Label>
              <Form.Input name="title" editable={false} />
            </Form.Field>
            <FormInputs>
              <FormInput>
                <Form.Field>
                  <Form.Label>Responsável: </Form.Label>
                  <Form.SelectFlash
                    name="responsible"
                    disabled={!isAnswering}
                    options={responsibles.map((responsible) => ({
                      label: responsible.name,
                      value: responsible.login,
                    }))}
                  />
                </Form.Field>
              </FormInput>
              <FormInput>
                <Form.Field>
                  <Form.Label>Data Conclusão: </Form.Label>
                  {isAnswering ? (
                    <Form.DatePicker
                      name="endDate"
                      placehilderFormat="DD/MM/YYYY HH:mm"
                      mode="datetime"
                      disabled={!isAnswering}
                    />
                  ) : currentAction.endDate ? (
                    <Form.DatePicker
                      name="endDate"
                      placehilderFormat="DD/MM/YYYY HH:mm"
                      mode="datetime"
                      disabled={!isAnswering}
                    />
                  ) : (
                    <EmptyDateInput placeholder="DD/MM/YYYY HH:mm" />
                  )}
                </Form.Field>
              </FormInput>
            </FormInputs>

            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <ObservationField
                observationText={observationText}
                setObservationText={setObservationText}
                disabled={!isAnswering}
              />
            </Form.Field>

            {images?.length > 0 && <ListImages images={images} size={100} />}
            {isAnswering && (
              <>
                <Link
                  asChild
                  href={{
                    pathname: 'camera',
                    params: {
                      actionId: currentAction.id,
                    },
                  }}
                >
                  <Button.Trigger>
                    <Button.Icon.Camera />
                    <Button.Text>Tirar foto</Button.Text>
                  </Button.Trigger>
                </Link>
                <Buttons>
                  <Button.Trigger
                    onPress={() => handleStopEditing(isAnswering)}
                    variant="secondary"
                    style={{ width: '49%' }}
                  >
                    <Button.Text>Cancelar</Button.Text>
                  </Button.Trigger>
                  <Button.Trigger
                    variant="green"
                    style={{ width: '49%' }}
                    onPress={handleSubmit(handleEdit)}
                  >
                    <Button.Text>Confirmar</Button.Text>
                    <Button.Icon.CheckCircle />
                  </Button.Trigger>
                </Buttons>
              </>
            )}
          </FormProvider>
        </ScrollView>
      </KeyboardCoverPrevent>
    </Container>
  )
}
