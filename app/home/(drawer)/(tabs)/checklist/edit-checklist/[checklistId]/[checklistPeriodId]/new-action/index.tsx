import { Button } from '@/src/components/Button'
import { Form } from '@/src/components/Form'
import { KeyboardCoverPrevent } from '@/src/components/KeyboradCoverPrevent'
import { Loading } from '@/src/components/Loading'
import { Toast } from '@/src/components/Toast'
import { useChecklist } from '@/src/store/checklist'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, useLocalSearchParams } from 'expo-router'
import { useToast } from 'native-base'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert, BackHandler } from 'react-native'
import { z } from 'zod'
// import { useResponsibles } from '@/src/store/responsibles'
import { useActions } from '@/src/store/actions'
import { useResponsibles } from '@/src/store/responsibles'
import { ChecklistPeriod } from '@/src/types/ChecklistPeriod'
import {
  Buttons,
  Container,
  FormContainer,
  Header,
  SubTitle,
  Title,
} from './styles'

const newActionSchema = z.object({
  title: z.string({ required_error: 'Escreva o nome da ação ' }),
  responsible: z.string({ required_error: 'Selecione um responsável' }),
  endDate: z.date(),
})

type NewActionData = z.infer<typeof newActionSchema>

export default function NewAction() {
  const newActionForm = useForm<NewActionData>({
    resolver: zodResolver(newActionSchema),
  })
  const { handleSubmit, reset } = newActionForm
  const { allChecklists } = useChecklist()
  const { createNewAction } = useActions()
  const { responsibles } = useResponsibles()
  // const { responsibles, fetchResponsibles } = useResponsibles()
  const { checklistId, checklistPeriodId } = useLocalSearchParams()
  const toast = useToast()
  // const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(
  //   null,
  // )
  const [currentPeriod, setCurrentPeriod] = useState<ChecklistPeriod | null>(
    null,
  )

  console.log(`PERIOD ID => ${checklistPeriodId}`)

  function handleStop() {
    Alert.alert('Sair', 'Deseja abandonar essa ação?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => {
          router.replace('/home/checklist')
        },
      },
    ])
    return true
  }

  async function handleNewAction(data: NewActionData) {
    try {
      createNewAction({
        checklistId: Number(checklistId),
        checklistPeriodId: Number(checklistPeriodId),
        description: '',
        endDate: new Date(data.endDate),
        responsible: data.responsible,
        title: data.title,
      })
      reset()
      toast.show({
        render: () => (
          <Toast.Success>Ação registrada com sucesso!</Toast.Success>
        ),
      })
      router.replace('/home/actions')
    } catch (err) {
      console.log(err)
      toast.show({
        render: () => <Toast.Error>Erro ao registrar ação!</Toast.Error>,
      })
    }
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleStop,
    )

    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    const checklist = allChecklists.find(
      (item) => item.id === Number(checklistId),
    )
    console.log(checklist.checklistPeriods)

    if (checklist) {
      // setCurrentChecklist(checklist)
      const period = checklist.checklistPeriods.find(
        (item) => item.id === Number(checklistPeriodId),
      )
      if (period) {
        setCurrentPeriod(period)
      }
    }
  }, [checklistId, checklistPeriodId])

  // console.log(`PERIOD: ${JSON.stringify(currentPeriod, null, 2)}`)

  if (!currentPeriod || !responsibles) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <KeyboardCoverPrevent>
      <Container>
        <Header>
          <Title>Registrar nova Ação</Title>
          <SubTitle>
            {currentPeriod.task.description} - {currentPeriod.task.answer}
          </SubTitle>
        </Header>

        <FormProvider {...newActionForm}>
          <FormContainer>
            <Form.Field>
              <Form.Label>Ação:</Form.Label>
              <Form.Input name="title" />
              <Form.ErrorMessage field="title" />
            </Form.Field>
            <Form.Field>
              <Form.Label>Responsável:</Form.Label>
              <Form.SelectFlash
                name="responsible"
                options={responsibles.map((responsible) => ({
                  label: responsible.name,
                  value: responsible.login,
                }))}
              />
              <Form.ErrorMessage field="responsible" />
            </Form.Field>
            <Form.Field>
              <Form.Label>Prazo:</Form.Label>
              <Form.DatePicker
                placehilderFormat="DD/MM/YYYY"
                name="endDate"
                mode="datetime"
              />
            </Form.Field>
          </FormContainer>
          <Buttons>
            <Button.Trigger
              onPress={handleStop}
              variant="secondary"
              style={{ width: '49%' }}
            >
              <Button.Text>Cancelar</Button.Text>
            </Button.Trigger>
            <Button.Trigger
              variant="green"
              style={{ width: '49%' }}
              onPress={handleSubmit(handleNewAction)}
            >
              <Button.Text>Confirmar</Button.Text>
              <Button.Icon.CheckCircle />
            </Button.Trigger>
          </Buttons>
        </FormProvider>
      </Container>
    </KeyboardCoverPrevent>
  )
}
