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
import { useCrashlytics } from '@/src/store/crashlytics-report'
import { useEquipments } from '@/src/store/equipments'
import { useLocations } from '@/src/store/location'
import { useResponsibles } from '@/src/store/responsibles'
import { Action } from '@/src/types/Action'
import {
  ChecklistPeriod,
  ChecklistPeriodImage,
} from '@/src/types/ChecklistPeriod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { useRouteInfo } from 'expo-router/build/hooks'
import { ScrollView, useToast } from 'native-base'
import { XCircle } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, BackHandler, Dimensions } from 'react-native'
import { z } from 'zod'
import { ListImages } from '../../checklist/edit-checklist/[checklistId]/CardImage'
import { StatusTag } from '../StatusTag'
import { WrongContainer, WrongText, WrongWrapper } from '../styles'
import {
  Buttons,
  Container,
  ContainerHeader,
  FormInput,
  FormInputs,
  HeaderUpper,
  InfoCard,
  InfoCardBody,
  InfoCardLabel,
  InfoCardLabelTask,
  InfoCardRow,
  InfoCardText,
  InfoCardValue,
  InfoField,
  SubTitleRow,
  Title,
  TitleText,
} from './styles'

const editActionSchema = z.object({
  responsible: z.string(),
  title: z.string(),
  dueDate: z.date().optional(),
})

type EditActionData = z.infer<typeof editActionSchema>

export default function ActionScreen() {
  const editActionForm = useForm<EditActionData>({
    resolver: zodResolver(editActionSchema),
  })
  const { handleSubmit, setValue } = editActionForm
  const { allChecklists } = useChecklist()
  const { equipments } = useEquipments()
  const { locations } = useLocations()
  const { actions, updateAction } = useActions()
  const { currentImages } = useCamera()
  const { responsibles } = useResponsibles()
  const { actionId } = useLocalSearchParams()
  const toast = useToast()
  const [currentAction, setCurrentAction] = useState<Action | null>(null)
  const [title, setTitle] = useState<string | null>('')
  const [currentPeriod, setCurrentPeriod] = useState<ChecklistPeriod | null>(
    null,
  )
  const [observationText, setObservationText] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  const [images, setImages] = useState<ChecklistPeriodImage[]>([])

  const { sendPathname, sendLog, reportError, sendStacktrace } = useCrashlytics()
  const { pathname } = useRouteInfo()

  const deviceWidth = Dimensions.get('window').width
  const isSmallDevice = deviceWidth < 400

  useEffect(() => {
    sendPathname(pathname)
  }, [pathname])

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
    sendLog(`actionId: ${actionId}`)
  }, [actions, actionId])

  useEffect(() => {
    if (currentAction) {
      sendLog(`currentAction: ${JSON.stringify(currentAction)}`)

      setValue('responsible', currentAction.responsible)
      setValue('title', currentAction.title)
      setObservationText(currentAction.description)
      setImages(currentAction.img)
      console.log(currentAction.dueDate)

      if (currentAction?.dueDate) {
        setValue('dueDate', new Date(currentAction.dueDate))
      }

      const currentChecklist = allChecklists.find(
        (checklist) => checklist.id === currentAction.checklistId,
      )

      sendLog(`currentChecklist: ${JSON.stringify(currentChecklist)}`)

      // console.log(
      //   `CURRENT CHECKLIST: ${JSON.stringify(currentChecklist, null, 2)}`,
      // )

      if (currentChecklist.equipmentId) {
        const equipment = equipments?.find(
          (item) => item.id === currentChecklist.equipmentId,
        )

        setTitle(`${equipment.code} - ${equipment.description}`)
      } else if (currentChecklist.locationId) {
        const location = locations?.find(
          (item) => item.id === currentChecklist.locationId,
        )

        setTitle(`${location.location}`)
      }

      // const period = allChecklists
      //   .map(({ checklistPeriods }) => checklistPeriods)
      //   .flat()
      //   .find((item) => item.id === currentAction.checklistPeriodId)
      // setCurrentPeriod(period)

      if (currentChecklist) {
        // console.log(
        //   JSON.stringify(currentChecklist.checklistPeriods, null, 2),
        //   currentAction.checklistPeriodId,
        // )

        const period = currentChecklist.checklistPeriods.find(
          (item) => item.id === currentAction.checklistPeriodId,
        )
        if (period) {
          setCurrentPeriod(period)
          sendLog(`currentPeriod: ${JSON.stringify(currentPeriod)}`)
        }
      }
    }
  }, [currentAction, allChecklists])

  useEffect(() => {
    if (currentImages && currentAction) {
      if (currentImages.actionId === currentAction.id) {
        setImages(currentImages.images)
      }
    }
  }, [currentImages, currentAction])

  function handleEdit(data: EditActionData) {
    sendStacktrace(handleEdit)
    try {
      if (!observationText) {
        const addDescErrorMessage = `Adicione uma descrição`
        sendLog(addDescErrorMessage)
        return toast.show({
          render: () => <Toast.Error>{addDescErrorMessage}</Toast.Error>,
        })
      }
      if (!images.length) {
        const addImagesErrorMessage = `Adicione uma ou mais imagens`
        sendLog(addImagesErrorMessage)
        return toast.show({
          render: () => <Toast.Error>{addImagesErrorMessage}</Toast.Error>,
        })
      }

      console.log(data.dueDate)

      const actionBody = {
        ...currentAction,
        dueDate: data.dueDate,
        responsible: data.responsible || currentAction.responsible,
        description: observationText,
        img: images,
      }
      const actionEditedBody = `ACTION EDITED BODY ${JSON.stringify(actionBody, null, 2)}`
      console.log(actionEditedBody)
      sendLog(actionEditedBody)

      updateAction(actionBody)
      setIsAnswering(false)
      const actionMessage = `Ação Salva!`
      sendLog(actionMessage)
      toast.show({
        render: () => <Toast.Success>{actionMessage}</Toast.Success>,
      })
    } catch (err) {
      reportError(err)
      const actionErrorMessage = `Erro ao salvar ação!`
      setIsAnswering(false)
      console.log(err)
      sendLog(actionErrorMessage)
      toast.show({
        render: () => <Toast.Error>{actionErrorMessage}</Toast.Error>,
      })
    }
  }

  function handleStopEditing(isEditing: boolean) {
    sendStacktrace(handleStopEditing)
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

  // console.log(`ACTION: ${JSON.stringify(currentAction, null, 2)}`)
  // console.log(`PERIOD: ${JSON.stringify(currentPeriod, null, 2)}`)
  // console.log(`CHECKLISTS: ${JSON.stringify(allChecklists, null, 2)}`)
  // console.log(`EQUIPMENT: ${JSON.stringify(currentEquipment, null, 2)}`)

  if (!currentAction || !currentPeriod) {
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
            {/* <IconContainer>
              <XCircle color="white" />
            </IconContainer> */}
            <TitleText isSmallDevice={isSmallDevice}>{title}</TitleText>
          </Title>
          <Button.Trigger
            rounded
            onlyIcon
            size="md"
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
          <StatusTag
            dueDate={currentAction.dueDate}
            endDate={currentAction.endDate}
            startDate={currentAction.startDate}
          />
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
                <WrongWrapper>
                  <InfoCardLabelTask>
                    {currentPeriod.task.description}:
                  </InfoCardLabelTask>
                  {/* <InfoCardValueTask>
                    {currentPeriod.task.answer}
                  </InfoCardValueTask> */}
                  <WrongContainer>
                    <XCircle color="red" />
                    <WrongText>{currentPeriod.task.answer}</WrongText>
                  </WrongContainer>
                </WrongWrapper>
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
                      {dayjs(currentAction.endDate).format('DD/MM/YY HH:mm')}
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
                      name="dueDate"
                      placehilderFormat="DD/MM/YYYY"
                      mode="datetime"
                      disabled={!isAnswering}
                    />
                  ) : currentAction.dueDate ? (
                    <Form.DatePicker
                      name="dueDate"
                      placehilderFormat="DD/MM/YYYY"
                      mode="datetime"
                      disabled={!isAnswering}
                    />
                  ) : (
                    <EmptyDateInput placeholder="DD/MM/YYYY" />
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
