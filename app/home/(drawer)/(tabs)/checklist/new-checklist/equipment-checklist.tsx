import { Button } from '@/src/components/Button'
import { Form } from '@/src/components/Form'
import { KeyboardCoverPrevent } from '@/src/components/KeyboradCoverPrevent'
import { Toast } from '@/src/components/Toast'
import db from '@/src/libs/database'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useEquipments } from '@/src/store/equipments'
import { useSyncStatus } from '@/src/store/syncStatus'
import { Equipment } from '@/src/types/Equipment'
import { Period } from '@/src/types/Period'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router, useFocusEffect } from 'expo-router'
import { useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components/native'
import { z } from 'zod'
import {
  ButtonsContent,
  Container,
  ContainerLoading,
  FormContainer,
  Header,
  LoadingText,
  Title,
  ToastChecklistCreated,
} from './styles'

const newChecklistSchema = z.object({
  equipment: z.string(),
  model: z.coerce.number(),
  equipmentSearch: z.string().optional(),
  period: z.string().optional(),
  mileage: z.string().optional(),
  hourmeter: z.string().optional(),
  initialTime: z.date(),
})

type NewChecklistData = z.infer<typeof newChecklistSchema>

export default function NewChecklist() {
  const newCheckListForm = useForm<NewChecklistData>({
    resolver: zodResolver(newChecklistSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = newCheckListForm
  const { user } = useAuth()
  const { color } = useTheme()
  const { createChecklist, updateAnswering } = useChecklist()
  const { equipments, loadEquipments, equipmentId, updateEquipmentId, updateEquipmentById } =
    useEquipments()
  const { isSyncing } = useSyncStatus()
  const toast = useToast()
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  )
  const periods: Period[] = db.retrieveReceivedData(user.login, '/@periods')
  const models = db.retrieveModels(user.login)
  const equipmentValue = watch('equipment')

  useEffect(() => {
    updateEquipmentId(null)
  }, [])

  useEffect(() => {
    if (equipmentValue) {
      setSelectedEquipment(
        equipments.find((equipment) => equipment.id === Number(equipmentValue)),
      )
      setValue('mileage', String(selectedEquipment?.mileage ?? "0"))
      setValue('hourmeter', String(selectedEquipment?.hourMeter ?? "0"))
    }
  }, [equipmentValue, selectedEquipment])

  useEffect(() => {
    if (equipmentId) {
      setValue('equipment', String(equipmentId))
    }
  }, [equipmentId])

  useFocusEffect(useCallback(() => {
    console.log("Entrou")
    console.log("selectedEquipment =>", selectedEquipment);
    
    //loadEquipments(user.login)
  }, []))

  async function handleNewChecklist(data: NewChecklistData) {
    if (!user) {
      console.log('Sem usuario')
      return
    }

    try {
      const newChecklist = createChecklist({
        period: periods.find((period) => period.id === Number(data?.period)),
        equipment: selectedEquipment,
        location: null,
        user: user.login,
        model: [data.model],
        hourmeter: +data.hourmeter,
        mileage: +data.mileage
      })

      toast.show({
        placement: 'top',
        render: () => (
          <ToastChecklistCreated>
            Checklist criado com sucesso
          </ToastChecklistCreated>
        ),
      })

      updateEquipmentId(equipmentId)

      if(selectedEquipment.hasMileage && selectedEquipment.hasHourMeter){
        updateEquipmentById(
          user.login,
          {...selectedEquipment, mileage: +data.mileage ?? 0, hourMeter: +data.hourmeter ?? 0}
        )
      }

      updateAnswering(true)

      router.replace(`/home/answer/${newChecklist.id}`)
    } catch (err) {
      const error: Error = err
      toast.show({
        render: () => <Toast.Error>{error.message}</Toast.Error>,
      })
    }
  }

  if (!equipments) {
    loadEquipments(user.login)
    return (
      <ContainerLoading>
        <ActivityIndicator size={80} color={color['violet-500']} />
        <LoadingText>
          Carregando equipamentos, isso pode demorar um pouco...
        </LoadingText>
      </ContainerLoading>
    )
  }

  if (!equipments?.length) {
    return (
      <ContainerLoading>
        <ActivityIndicator size={80} color={color['violet-500']} />
        <LoadingText>Não há equipamentos vinculados a essa filial.</LoadingText>
      </ContainerLoading>
    )
  }

  return (
    <KeyboardCoverPrevent>
      <Container>
        <Header>
          <Title>Novo Checklist</Title>

          <Link asChild href="/qrcode-scanner?mode=equipment">
            <Button.Trigger rounded onlyIcon>
              <Button.Icon.QrCode />
            </Button.Trigger>
          </Link>
        </Header>

        <FormProvider {...newCheckListForm}>
          <FormContainer>
            <Form.Field>
              <Form.Label>Equipamento:</Form.Label>
              <Form.SelectFlash
                name="equipment"
                options={equipments.map((equipment) => {
                  return {
                    label: `${equipment.code} - ${equipment.description}`,
                    value: String(equipment.id),
                  }
                })}
                header={<Form.Input name="equipmentSearch" />}
              />
              <Form.ErrorMessage field="equipment" />
            </Form.Field>

            {selectedEquipment?.hasPeriod &&
              periods.filter(
                (item) => item.branchId === selectedEquipment.branchId,
              ).length > 0 && (
                <Form.Field>
                  <Form.Label>Turno:</Form.Label>
                  <Form.Select name="period">
                    {periods &&
                      selectedEquipment &&
                      periods
                        .filter(
                          (item) =>
                            item.branchId === selectedEquipment.branchId,
                        )
                        .map(({ id, period }) => (
                          <Form.SelectItem
                            key={id}
                            label={period}
                            value={String(id)}
                          />
                        ))}
                  </Form.Select>
                  <Form.ErrorMessage field="period" />
                </Form.Field>
              )}

              {
                selectedEquipment?.hasMileage && (
                  <Form.Field>
                    <Form.Label>Quilometragem</Form.Label>
                    <Form.Input
                      name="mileage"
                      inputMode='numeric'
                    />
                  </Form.Field>
                )
              }

              {
                selectedEquipment?.hasHourMeter && (
                  <Form.Field>
                    <Form.Label>Horímetro</Form.Label>
                    <Form.Input
                      name="hourmeter"
                      inputMode='numeric'
                    />
                  </Form.Field>
                )
              }

            <Form.Field>
              <Form.Label>Hora inicial:</Form.Label>
              <Form.DatePicker placehilderFormat="HH:mm" name="initialTime" />
              <Form.ErrorMessage field="initialTime" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Checklist:</Form.Label>
              <Form.Select name="model">
                {selectedEquipment &&
                  models
                    .filter(
                      (item) => item.familyId === selectedEquipment.familyId,
                    )
                    .map(({ id, description }) => (
                      <Form.SelectItem
                        key={id}
                        label={description}
                        value={String(id)}
                      />
                    ))}
              </Form.Select>
              <Form.ErrorMessage field="model" />
            </Form.Field>

            <ButtonsContent>
              <Button.Trigger
                style={{ flex: 1 }}
                onPress={router.back}
                variant="secondary"
              >
                <Button.Icon.X />
                <Button.Text>Cancelar</Button.Text>
              </Button.Trigger>
              <Button.Trigger
                loading={isSubmitting}
                disabled={isSyncing}
                onPress={handleSubmit(handleNewChecklist)}
                style={{ flex: 1 }}
              >
                <Button.Icon.Check />
                <Button.Text>Salvar</Button.Text>
              </Button.Trigger>
            </ButtonsContent>
          </FormContainer>
        </FormProvider>
      </Container>
    </KeyboardCoverPrevent>
  )
}
