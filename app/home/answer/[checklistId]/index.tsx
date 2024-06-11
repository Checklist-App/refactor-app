/* eslint-disable react-hooks/exhaustive-deps */
import { AnswerHeader } from '@/src/components/AnswerHeader'
import { Button } from '@/src/components/Button'
import { ChecklistQuestion } from '@/src/components/ChecklistQuestion'
import { KeyboardCoverPrevent } from '@/src/components/KeyboradCoverPrevent'
import { Loading } from '@/src/components/Loading'
import { QuestionPaginator } from '@/src/components/QuestionPaginator'
import { Toast } from '@/src/components/Toast'
import { storeFile } from '@/src/services/downloadImage'
import { useCamera } from '@/src/store/camera'
import { useChecklist } from '@/src/store/checklist'
import { Checklist } from '@/src/types/Checklist'
import {
  ChecklistPeriod,
  ChecklistPeriodImage,
  ChildType,
} from '@/src/types/ChecklistPeriod'
import { router, useLocalSearchParams } from 'expo-router'
import { useToast } from 'native-base'
import { useEffect, useState } from 'react'
import { Alert, BackHandler, Dimensions } from 'react-native'
import { Buttons, Container } from './styles'

const { height } = Dimensions.get('window')

export default function AnswerPage() {
  const {
    allChecklists,
    answerChecklistPeriod,
    finalizeChecklist,
    updateAnswering,
  } = useChecklist()
  const { currentImages } = useCamera()
  const { checklistId, isEditing, checklistPeriodIndex } =
    useLocalSearchParams()
  const toast = useToast()
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(
    null,
  )
  const [currentChecklistPeriod, setCurrentChecklistPeriod] = useState(
    checklistPeriodIndex ? Number(checklistPeriodIndex) : 0,
  )
  const [alternativeSelected, setAlternativeSelected] = useState(0)
  const [selectedChild, setSelectedChild] = useState(0)
  const [observationText, setObservationText] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [currentShowImages, setCurrentShowImages] = useState<
    ChecklistPeriodImage[]
  >([])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log({
  //       checklistId,
  //       currentChecklist,
  //       allChecklists,
  //     })
  //   }, 6000)
  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    if (allChecklists && checklistId) {
      const found = allChecklists.find(
        (item) => item.id === Number(checklistId),
      )

      if (found) {
        setCurrentChecklist(found)
      }
    }
  }, [checklistId, allChecklists])

  useEffect(() => {
    if (isEditing !== 'true') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleStop,
      )

      return () => backHandler.remove()
    }
  }, [])

  useEffect(() => {
    if (currentChecklist) {
      setAlternativeSelected(
        currentChecklist.checklistPeriods[currentChecklistPeriod].statusId,
      )
      setSelectedChild(
        currentChecklist.checklistPeriods[currentChecklistPeriod].statusNC,
      )
      setCurrentShowImages(
        currentChecklist.checklistPeriods[currentChecklistPeriod].img,
      )
    }
  }, [currentChecklist, currentChecklistPeriod])

  useEffect(() => {
    if (currentChecklist) {
      if (
        currentImages?.checklistPeriodId ===
        currentChecklist.checklistPeriods[currentChecklistPeriod].id
      ) {
        setCurrentShowImages(currentImages?.images || null)
      }
    }
  }, [currentImages])

  function verifyExtraData(checklistPeriod: ChecklistPeriod, statusId: number) {
    const option = checklistPeriod.options.find((opt) => opt.id === statusId)
    if (option?.action && !currentShowImages.length) {
      return true // Se tiver ação e não tiver fotos
    }

    // Verificar se tem e se marcou o filho
    const matchedWithChildren: ChildType[] = []
    if (checklistPeriod.task.children?.length) {
      checklistPeriod.task.children.forEach((item) => {
        if (item.statusId === statusId) matchedWithChildren.push(item)
      })

      if (matchedWithChildren.length && !selectedChild) {
        return false
      }
    }
    return false
  }

  function checkNextDisabled() {
    const checklistPeriod =
      currentChecklist.checklistPeriods[currentChecklistPeriod]
    const storedAnswer = checklistPeriod.statusId
    if (!storedAnswer) return true // Se não tiver resposta salva
    if (currentChecklist.checklistPeriods.length < currentChecklistPeriod + 1) {
      return true // Se for a última pergunta
    }

    return verifyExtraData(checklistPeriod, storedAnswer)
  }

  function checkConfirmDisabled() {
    if (!alternativeSelected) return true
    const checklistPeriod =
      currentChecklist.checklistPeriods[currentChecklistPeriod]
    return verifyExtraData(checklistPeriod, alternativeSelected)
  }

  function handleStop() {
    if (isEditing !== 'true') {
      Alert.alert('Sair', 'Deseja abandonar esse checklist?', [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            updateAnswering(false)
            router.push('/home/checklist')
          },
        },
      ])
      return true
    } else {
      console.log('Editou e saiu')
      updateAnswering(false)
      router.back()
    }
  }

  function handlePrev() {
    setAlternativeSelected(
      currentChecklist.checklistPeriods[currentChecklistPeriod].statusId,
    )
    setSelectedChild(
      currentChecklist.checklistPeriods[currentChecklistPeriod].statusNC,
    )
    if (currentChecklistPeriod > 0) {
      setCurrentChecklistPeriod((prevState) => prevState - 1)
    }
  }

  function handleNext() {
    if (currentChecklistPeriod < currentChecklist.checklistPeriods.length - 1) {
      setCurrentChecklistPeriod((prevState) => prevState + 1)
      setAlternativeSelected(
        currentChecklist.checklistPeriods[currentChecklistPeriod].statusId,
      )
      setSelectedChild(
        currentChecklist.checklistPeriods[currentChecklistPeriod].statusNC,
      )
    } else {
      handleFinish()
    }
  }

  async function handleFinish() {
    try {
      // updateChecklists(currentChecklist.id, currentChecklist, user.login)
      finalizeChecklist(currentChecklist.id)
      toast.show({
        render: () => (
          <Toast.Success>Checklist respondido com sucesso!</Toast.Success>
        ),
      })
      updateAnswering(false)
      router.replace({
        pathname: '/home/checklist',
      })
    } catch (err) {
      updateAnswering(false)
      toast.show({
        render: () => (
          <Toast.Error>Não foi possivel salvar o checklist</Toast.Error>
        ),
      })
      console.log(err)
    }
  }

  async function handleConfirm() {
    setButtonLoading(true)
    const checklistPeriod =
      currentChecklist.checklistPeriods[currentChecklistPeriod]
    const answer = checklistPeriod.options.find(
      (opt) => opt.id === alternativeSelected,
    ).description
    const images =
      currentImages?.checklistPeriodId === checklistPeriod.id
        ? currentImages.images
        : []

    if (images.length) {
      // TALVES PRECISE MUDAR
      for (const img of images) {
        console.log('Lendo imagens')
        img.path = await storeFile(img.path)
      }
    }

    answerChecklistPeriod({
      checklistPeriodId: checklistPeriod.id,
      checklistId: currentChecklist.id,
      statusId: alternativeSelected,
      answer,
      statusNC: selectedChild,
      images,
    })

    setButtonLoading(false)
    if (isEditing === 'true') {
      toast.show({
        render: () => <Toast.Success>Checklist Salvo!</Toast.Success>,
      })
    } else {
      handleNext()
    }
  }

  if (!currentChecklist) {
    // console.log(checklistId)
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <>
      <AnswerHeader />
      <KeyboardCoverPrevent style={{ height: '100%', flex: 1 }}>
        <Container>
          <ChecklistQuestion
            currentChecklistPeriod={
              currentChecklist.checklistPeriods[currentChecklistPeriod]
            }
            alternativeSelected={alternativeSelected}
            setAlternativeSelected={setAlternativeSelected}
            observationText={observationText}
            setObservationText={setObservationText}
            selectedChild={selectedChild}
            setSelectedChild={setSelectedChild}
            images={currentShowImages}
          />

          <Buttons>
            <Button.Trigger
              onPress={handleStop}
              variant="secondary"
              style={{ width: '49%' }}
            >
              <Button.Text>Sair</Button.Text>
            </Button.Trigger>
            <Button.Trigger
              disabled={checkConfirmDisabled()}
              variant="green"
              style={{ width: '49%' }}
              onPress={handleConfirm}
              loading={buttonLoading}
            >
              <Button.Text>Confirmar</Button.Text>
              <Button.Icon.CheckCircle />
            </Button.Trigger>
          </Buttons>

          {isEditing === 'true' ? (
            ''
          ) : (
            <QuestionPaginator
              currentQuestionIndex={currentChecklistPeriod}
              handleNext={handleNext}
              handlePrev={handlePrev}
              nextDisabled={checkNextDisabled()}
              numberOfQuestions={currentChecklist.checklistPeriods.length}
              prevDisabled={!(currentChecklistPeriod > 0)}
            />
          )}
        </Container>
      </KeyboardCoverPrevent>
    </>
  )
}
