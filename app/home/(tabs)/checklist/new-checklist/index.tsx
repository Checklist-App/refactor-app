import { Button } from '@/src/components/Button'
import { Form } from '@/src/components/Form'
import { KeyboardCoverPrevent } from '@/src/components/KeyboradCoverPrevent'
import { Toast } from '@/src/components/Toast'
import db from '@/src/libs/database'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useEquipments } from '@/src/store/equipments'
import { Equipment } from '@/src/types/Equipment'
import { Period } from '@/src/types/Period'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, router } from 'expo-router'
import { useToast } from 'native-base'
import { useEffect, useState } from 'react'
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
  equipment: z.string().nonempty({ message: 'Equipamento e obrigatório!' }),
  equipmentSearch: z.string().optional(),
  period: z.string().optional(),
  initialTime: z.date(),
  initialHourMeter: z
    .string()
    .nonempty({ message: 'Hórimetro inicial e obrigatorio!' }),
  mileage: z.string().nonempty({ message: 'Quilometragem e obrigatório!' }),
})

type NewChecklistData = z.infer<typeof newChecklistSchema>

export default function NewChecklist() {
  const newCheckListForm = useForm<NewChecklistData>({
    resolver: zodResolver(newChecklistSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = newCheckListForm
  const { user } = useAuth()
  const { color } = useTheme()
  // const { isSyncing } = useData()
  const { createChecklist } = useChecklist()
  const { equipments } = useEquipments()
  const toast = useToast()
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  )

  const periods: Period[] = db.retrieveReceivedData(user.login, '/@periods')

  async function handleNewChecklist(data: NewChecklistData) {
    if (
      selectedEquipment.hasHourMeter &&
      selectedEquipment.hourMeter > Number(data.initialHourMeter)
    ) {
      setValue('initialHourMeter', data.initialHourMeter)
      toast.show({
        render: () => (
          <Toast.Error>
            O horimetro inicial não pode ser menor que{' '}
            {selectedEquipment.hourMeter}
          </Toast.Error>
        ),
      })

      return
    }

    if (!user) {
      console.log('Sem usuario')
      return
    }

    try {
      const newChecklist = createChecklist({
        period: periods.find((period) => period.id === Number(data?.period)),
        mileage: Number(data.mileage) || 0,
        equipment: selectedEquipment,
        user: user.login,
      })

      toast.show({
        placement: 'top',
        render: () => (
          <ToastChecklistCreated>
            Checklist criado com sucesso
          </ToastChecklistCreated>
        ),
      })

      router.replace({
        pathname: `/home/checklist/answer/${newChecklist.id}`,
      })
    } catch (err) {
      const error: Error = err
      toast.show({
        render: () => <Toast.Error>{error.message}</Toast.Error>,
      })
    }
  }

  const equipmentValue = watch('equipment')

  useEffect(() => {
    if (equipmentValue) {
      setSelectedEquipment(
        equipments.find((equipment) => equipment.id === Number(equipmentValue)),
      )
    }
  }, [equipmentValue])

  useEffect(() => {
    if (!selectedEquipment) return

    if (selectedEquipment.hourMeter !== undefined) {
      setValue('initialHourMeter', String(selectedEquipment.hourMeter))
    }
    if (selectedEquipment.mileage !== undefined) {
      setValue('mileage', String(selectedEquipment.mileage))
    }
  }, [selectedEquipment])

  if (!equipments || !equipments?.length) {
    return (
      <ContainerLoading>
        <ActivityIndicator size={80} color={color['violet-500']} />
        <LoadingText>
          Carregando equipamentos, isso pode demorar um pouco...
        </LoadingText>
      </ContainerLoading>
    )
  }

  return (
    <KeyboardCoverPrevent>
      <Container>
        <Header>
          <Title>Novo Checklist</Title>

          <Link asChild href="/qrcode-scanner">
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

            <Form.Field
              style={!selectedEquipment?.hasPeriod && { display: 'none' }}
            >
              <Form.Label>Turno:</Form.Label>
              <Form.Select name="period">
                {periods &&
                  selectedEquipment &&
                  periods
                    .filter(
                      (item) => item.branchId === selectedEquipment.branchId,
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

            <Form.Field>
              <Form.Label>Hora inicial:</Form.Label>
              <Form.DatePicker placehilderFormat="HH:mm" name="initialTime" />
              <Form.ErrorMessage field="initialTime" />
            </Form.Field>
            <Form.Field
              style={!selectedEquipment?.hasHourMeter && { display: 'none' }}
            >
              <Form.Label>Horímetro inicial:</Form.Label>
              <Form.Input keyboardType="numeric" name="initialHourMeter" />
              <Form.ErrorMessage field="initialHourMeter" />
            </Form.Field>
            <Form.Field
              style={!selectedEquipment?.hasMileage && { display: 'none' }}
            >
              <Form.Label>Quilometragem:</Form.Label>
              <Form.Input keyboardType="numeric" name="mileage" />
              <Form.ErrorMessage field="mileage" />
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
                // disabled={isSyncing}
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
