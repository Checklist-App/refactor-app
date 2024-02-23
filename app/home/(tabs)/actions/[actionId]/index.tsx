import { Text } from '../styles'

export default function ActionIdPage() {
  return <Text>Action Id Page</Text>
}

// import { zodResolver } from '@hookform/resolvers/zod'
// import dayjs from 'dayjs'
// import { CameraCapturedPicture } from 'expo-camera'
// import { Link, router } from 'expo-router'
// import { ScrollView, useToast } from 'native-base'
// import { XCircle } from 'phosphor-react-native'
// import { useEffect, useState } from 'react'
// import { FormProvider, useForm } from 'react-hook-form'
// import { Alert, BackHandler, Dimensions } from 'react-native'
// import { z } from 'zod'
// import { Button } from '@/src/components/Button'
// import { EmptyDateInput } from '@/src/components/EmptyDateInput'
// import { Form } from '@/src/components/Form'
// import { KeyboardCoverPrevent } from '@/src/components/KeyboradCoverPrevent'
// import { Loading } from '@/src/components/Loading'
// import { ObservationField } from '@/src/components/ObservationField'
// import { Toast } from '@/src/components/Toast'
// import { useAuth } from '@/src/hooks/useAuth'
// import { useData } from '@/src/hooks/useData'
// import { useDataImage } from '@/src/hooks/useDataImage'
// import { IChecklistPeriod } from '@/src/libs/database/@types/IChecklistPeriod'
// import { IChecklistPeriodImage } from '@/src/libs/database/@types/IChecklistPeriodImage'
// import { useChecklist } from '@/src/store/checklist'
// import { useResponsibles } from '@/src/store/responsibles'
// import { ListImages } from '../../[checklistId]/CardImage'
// import { Equipment } from '../../src/libs/realm/schemas/Equipment'
// import {
//     Buttons,
//     Container,
//     ContainerHeader,
//     FormInput,
//     FormInputs,
//     HeaderUpper,
//     IconContainer,
//     InfoCard,
//     InfoCardBody,
//     InfoCardLabel,
//     InfoCardRow,
//     InfoCardText,
//     InfoCardValue,
//     InfoField,
//     StatusContainer,
//     StatusText,
//     SubTitleRow,
//     Title,
//     TitleText,
// } from './styles'

// const editActionSchema = z.object({
//   responsible: z.string(),
//   title: z.string(),
//   endDate: z.date().nullable(),
// })

// type EditActionData = z.infer<typeof editActionSchema>

// export default function ActionScreen() {
//   const editActionForm = useForm<EditActionData>({
//     resolver: zodResolver(editActionSchema),
//   })
//   const { handleSubmit, setValue } = editActionForm
//   const { user, token } = useAuth()
//   const { isSyncing } = useData()
//   const {
//     currentAction,
//     equipments,
//     allChecklists,
//     updateAction,
//     isAnswering,
//     updateAnswering,
//     load,
//     loadActions,
//   } = useChecklist()
//   const { responsibles, fetchResponsibles } = useResponsibles()
//   const toast = useToast()
//   const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(
//     null,
//   )
//   const [currentPeriod, setCurrentPeriod] = useState<IChecklistPeriod | null>(
//     null,
//   )
//   const [observationText, setObservationText] = useState('')
//   const { setPictures } = useDataImage()
//   const [images, setImages] = useState<IChecklistPeriodImage[]>([])

//   const deviceWidth = Dimensions.get('window').width
//   const isSmallDevice = deviceWidth < 400

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
//       handleStopEditing(isAnswering),
//     )

//     return () => backHandler.remove()
//   }, [isAnswering])

//   useEffect(() => {
//     if (equipments) {
//       setCurrentEquipment(
//         equipments.find((eq) => eq.id === currentAction?.equipmentId) || null,
//       )
//     }
//   }, [equipments, currentAction])

//   useEffect(() => {
//     if (allChecklists && currentAction) {
//       const found = allChecklists.find(
//         (item) => item.id === currentAction.checklistId,
//       )

//       if (!found) {
//         load(user.login)
//         loadActions(user.login)
//         const newFound = allChecklists.find(
//           (item) => item.id === currentAction.checklistId,
//         )
//         if (!newFound) {
//           return router.push('/')
//         } else {
//           const period = newFound.checklistPeriods.find(
//             (item) => item.id === currentAction.checklistPeriodId,
//           )
//           return setCurrentPeriod(period)
//         }
//       } else {
//         const period = found.checklistPeriods.find(
//           (item) => item.id === currentAction.checklistPeriodId,
//         )

//         setCurrentPeriod(period)
//       }
//     }
//   }, [allChecklists, currentAction])

//   useEffect(() => {
//     if (currentAction) {
//       setValue('responsible', currentAction.responsible)
//       setValue('title', currentAction.title)
//       setObservationText(currentAction.description)
//       setImages(currentAction.img)
//       console.log(currentAction)
//       if (currentAction?.endDate) {
//         setValue('endDate', new Date(currentAction.endDate))
//       }
//     }
//   }, [currentAction])

//   function setCurrentPictures() {
//     const mappedImages: CameraCapturedPicture[] = images.map((img) => ({
//       uri: img.path,
//       width: 100,
//       height: 100,
//     }))
//     setPictures(mappedImages)
//   }

//   function handleEdit(data: EditActionData) {
//     try {
//       if (!observationText) {
//         return toast.show({
//           render: () => <Toast.Error>Adicione uma descrição</Toast.Error>,
//         })
//       }
//       if (!images.length) {
//         return toast.show({
//           render: () => <Toast.Error>Adicione uma ou mais imagens</Toast.Error>,
//         })
//       }
//       updateAction({
//         actionProps: {
//           id: currentAction.id,
//           title: data.title,
//           description: observationText,
//           endDate:
//             new Date(data.endDate).toISOString() || currentAction.endDate,
//           responsible: data.responsible || currentAction.responsible,
//           img: images,
//         },
//         checklistId: currentAction.checklistId,
//         checklistPeriodId: currentAction.checklistPeriodId,
//         user: user.login,
//       })
//       updateAnswering(false)
//       toast.show({
//         render: () => <Toast.Success>Ação Salva!</Toast.Success>,
//       })
//     } catch (err) {
//       updateAnswering(false)
//       // console.log('Caiu no catch')
//       console.log(err)
//       toast.show({
//         render: () => <Toast.Error>Erro ao salvar ação!</Toast.Error>,
//       })
//     }
//   }

//   function handleStopEditing(isEditing: boolean) {
//     if (isEditing) {
//       Alert.alert('Cancelar', 'Deseja cancelar a edição dessa ação?', [
//         {
//           text: 'Não',
//           style: 'cancel',
//         },
//         {
//           text: 'Sim',
//           style: 'destructive',
//           onPress: () => {
//             updateAnswering(false)
//           },
//         },
//       ])
//       return true
//     } else {
//       router.back()
//       return true
//     }
//   }

//   if (!currentEquipment || !responsibles || !currentPeriod) {
//     if (user && token && !responsibles) {
//       fetchResponsibles(user.login, token)
//     }
//     return (
//       <Container>
//         <Loading />
//       </Container>
//     )
//   }

//   return (
//     <Container>
//       <ContainerHeader>
//         <HeaderUpper>
//           <Title>
//             <IconContainer>
//               <XCircle color="white" />
//             </IconContainer>
//             <TitleText isSmallDevice={isSmallDevice}>
//               {currentEquipment.code} - {currentEquipment.description}
//             </TitleText>
//           </Title>
//           <Button.Trigger
//             rounded
//             size="sm"
//             disabled={isAnswering || isSyncing}
//             onPress={() => updateAnswering(true)}
//           >
//             <Button.Icon.Pencil />
//           </Button.Trigger>
//         </HeaderUpper>
//         <SubTitleRow>
//           <InfoCardText>
//             <InfoCardLabel>Id Checklist:</InfoCardLabel>
//             <InfoCardValue> {currentPeriod.productionRegisterId}</InfoCardValue>
//           </InfoCardText>
//           <StatusContainer>
//             <StatusText>
//               {currentAction.endDate
//                 ? dayjs(currentAction.endDate).isBefore(currentAction.dueDate)
//                   ? 'CONCLUÍDO'
//                   : 'VENCIDO'
//                 : 'EM ANDAMENTO'}
//             </StatusText>
//           </StatusContainer>
//         </SubTitleRow>
//       </ContainerHeader>
//       <KeyboardCoverPrevent>
//         <ScrollView
//           contentContainerStyle={{
//             rowGap: 16,
//           }}
//         >
//           <InfoField>
//             <InfoCard>
//               {/* <InfoCardTitle>Informações</InfoCardTitle> */}
//               <InfoCardBody>
//                 <InfoCardRow>
//                   <InfoCardText>
//                     <InfoCardLabel>
//                       {currentPeriod.task.description}:
//                     </InfoCardLabel>
//                     <InfoCardValue>{currentPeriod.task.answer}</InfoCardValue>
//                   </InfoCardText>
//                 </InfoCardRow>
//                 <InfoCardRow>
//                   <InfoCardText>
//                     <InfoCardLabel>Data Início:</InfoCardLabel>
//                     <InfoCardValue>
//                       {dayjs(currentAction.startDate).format('DD/MM/YY HH:mm')}
//                     </InfoCardValue>
//                   </InfoCardText>
//                   <InfoCardText>
//                     <InfoCardLabel>Prazo:</InfoCardLabel>
//                     <InfoCardValue>
//                       {dayjs(currentAction.dueDate).format('DD/MM/YY HH:mm')}
//                     </InfoCardValue>
//                   </InfoCardText>
//                 </InfoCardRow>
//               </InfoCardBody>
//             </InfoCard>
//           </InfoField>
//           <FormProvider {...editActionForm}>
//             <Form.Field>
//               <Form.Label>Ação:</Form.Label>
//               <Form.Input name="title" editable={false} />
//             </Form.Field>
//             <FormInputs>
//               <FormInput>
//                 <Form.Field>
//                   <Form.Label>Responsável: </Form.Label>
//                   <Form.SelectFlash
//                     name="responsible"
//                     disabled={!isAnswering}
//                     options={responsibles.map((responsible) => ({
//                       label: responsible.name,
//                       value: responsible.login,
//                     }))}
//                   />
//                 </Form.Field>
//               </FormInput>
//               <FormInput>
//                 <Form.Field>
//                   <Form.Label>Data Conclusão: </Form.Label>
//                   {isAnswering ? (
//                     <Form.DatePicker
//                       name="endDate"
//                       placehilderFormat="DD/MM/YYYY HH:mm"
//                       mode="datetime"
//                       disabled={!isAnswering}
//                     />
//                   ) : currentAction.endDate ? (
//                     <Form.DatePicker
//                       name="endDate"
//                       placehilderFormat="DD/MM/YYYY HH:mm"
//                       mode="datetime"
//                       disabled={!isAnswering}
//                     />
//                   ) : (
//                     <EmptyDateInput placeholder="DD/MM/YYYY HH:mm" />
//                   )}
//                 </Form.Field>
//               </FormInput>
//             </FormInputs>

//             <Form.Field>
//               <Form.Label>Descrição:</Form.Label>
//               <ObservationField
//                 observationText={observationText}
//                 setObservationText={setObservationText}
//                 disabled={!isAnswering}
//               />
//             </Form.Field>

//             {images?.length > 0 && <ListImages images={images} size={100} />}
//             {isAnswering && (
//               <>
//                 <Link
//                   asChild
//                   href={{
//                     pathname: 'camera',
//                     params: {
//                       mode: 'action',
//                     },
//                   }}
//                 >
//                   <Button.Trigger onPress={setCurrentPictures}>
//                     <Button.Icon.Camera />
//                     <Button.Text>Tirar foto</Button.Text>
//                   </Button.Trigger>
//                 </Link>
//                 <Buttons>
//                   <Button.Trigger
//                     onPress={() => handleStopEditing(isAnswering)}
//                     variant="secondary"
//                     style={{ width: '49%' }}
//                   >
//                     <Button.Text>Cancelar</Button.Text>
//                   </Button.Trigger>
//                   <Button.Trigger
//                     variant="green"
//                     style={{ width: '49%' }}
//                     disabled={isSyncing}
//                     onPress={handleSubmit(handleEdit)}
//                   >
//                     <Button.Text>Confirmar</Button.Text>
//                     <Button.Icon.CheckCircle />
//                   </Button.Trigger>
//                 </Buttons>
//               </>
//             )}
//           </FormProvider>
//         </ScrollView>
//       </KeyboardCoverPrevent>
//     </Container>
//   )
// }
