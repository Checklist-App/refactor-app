/* eslint-disable camelcase */
import { FlashList } from '@shopify/flash-list'
import { Link } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'

import { Button } from '@/src/components/Button'
import { ChecklistItem } from '@/src/components/ChecklistItem'
import { useAuth } from '@/src/store/auth'
import { useChecklist } from '@/src/store/checklist'
import { useConnection } from '@/src/store/connection'
import { useSyncStatus } from '@/src/store/syncStatus'
import { Ionicons } from '@expo/vector-icons'
import { Box, HStack, Button as NBButton, Spinner, VStack } from 'native-base'
import { useEffect, useState } from 'react'
import {
  Container,
  ErrorText,
  HomeHeader,
  Loading,
  LoadingText,
  Title,
} from './styles'

import { Form } from '@/src/components/Form'
import { useEquipments } from '@/src/store/equipments'
import { Checklist } from '@/src/types/Checklist'
import dayjs from 'dayjs'

const searchChecklistSchema = zod.object({
  query: zod.string({ required_error: 'Digite algo.' }),
  initialDate: zod.date().default(new Date()),
  finishedDate: zod.date().default(new Date()),
})

type SearchChecklistSchema = zod.infer<typeof searchChecklistSchema>

export default function Page() {
  const { color } = useTheme()
  const { isConnected } = useConnection()
  const { isSyncing } = useSyncStatus()
  const { user } = useAuth()
  const { allChecklists } = useChecklist()
  const { equipments } = useEquipments()

  const [isSearching, setIsSearching] = useState<boolean>(false)

  const [checklists, setChecklists] = useState<Checklist[]>([])

  const searchChecklistForm = useForm<SearchChecklistSchema>({
    resolver: zodResolver(searchChecklistSchema),
  })

  const { handleSubmit } = searchChecklistForm

  const [openSearchInput, setOpenSearchInput] = useState<boolean>()

  function handleSearch(data: SearchChecklistSchema) {
    setIsSearching(true)

    const filteredEquipments = equipments.filter((eq) =>
      eq.code.includes(data.query),
    )

    const filteredChecklists = allChecklists.filter(
      (value) =>
        dayjs(data.initialDate).isSame(value.initialTime, 'day') &&
        (value.finalTime
          ? dayjs(data.finishedDate).isSame(value.finalTime, 'day')
          : true) &&
        (data.query
          ? filteredEquipments.find((eq) => eq.id === value.equipmentId)
          : true),
    )

    setIsSearching(false)
    setChecklists(sortByDate(filteredChecklists))
  }

  function sortByDate(data: Checklist[]) {
    return data.sort(
      (a, b) => dayjs(b.initialTime).valueOf() - dayjs(a.initialTime).valueOf(),
    )
  }

  useEffect(() => {
    setChecklists(sortByDate(allChecklists))
  }, [allChecklists])

  if (!user && isConnected) {
    return (
      <Loading>
        <LoadingText>Carregando requisições...</LoadingText>
        <ActivityIndicator color={color['violet-500']} size={28} />
      </Loading>
    )
  }

  return (
    <Container>
      <VStack space={4}>
        <HomeHeader>
          <Title>Checklists Criados</Title>
          <Link href="/home/checklist/new-checklist" asChild>
            {/* <Link href="/home/answer/2784696" asChild> */}
            <Button.Trigger rounded onlyIcon size="md" disabled={isSyncing}>
              <Button.Icon.Plus />
            </Button.Trigger>
          </Link>
        </HomeHeader>
        <VStack>
          <HStack space={2} w={'full'}>
            {!openSearchInput && (
              <Box
                flex={1}
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
              >
                <NBButton
                  bgColor={'transparent'}
                  _pressed={{
                    bgColor: color['violet-200'],
                  }}
                  onPress={() => setOpenSearchInput(true)}
                >
                  <Ionicons
                    name="search"
                    size={24}
                    color={color['violet-500']}
                  />
                </NBButton>
              </Box>
            )}
            {openSearchInput && (
              <VStack flex={1}>
                <FormProvider {...searchChecklistForm}>
                  <HStack space={2}>
                    <Form.Field style={{ flex: 1 }}>
                      <Form.Input name="query" placeholder="Digite a código" />
                      <Form.ErrorMessage field="query" />
                    </Form.Field>
                    <Button.Trigger
                      onPress={handleSubmit(handleSearch)}
                      loading={isSearching}
                    >
                      <Button.Icon.MagnifyingGlass />
                    </Button.Trigger>
                    <Button.Trigger
                      variant="transparent"
                      onPress={() => setOpenSearchInput(false)}
                    >
                      <Button.Icon.X color={'red'} />
                    </Button.Trigger>
                  </HStack>

                  <HStack
                    mt={4}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Form.Field>
                      <Form.Label>Início</Form.Label>
                      <Form.DatePicker
                        name="initialDate"
                        placehilderFormat="DD/MM/YYYY"
                        mode="date"
                      />
                      <Form.ErrorMessage field="initialDate" />
                    </Form.Field>
                    <Form.Field>
                      <Form.Label>Finalização</Form.Label>
                      <Form.DatePicker
                        name="finishedDate"
                        placehilderFormat="DD/MM/YYYY"
                        mode="date"
                      />
                      <Form.ErrorMessage field="finishedDate" />
                    </Form.Field>
                  </HStack>
                </FormProvider>
              </VStack>
            )}
          </HStack>
        </VStack>
      </VStack>
      {isSearching ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size={32} color={'violet-400'} />
        </Box>
      ) : (
        <FlashList
          estimatedItemSize={40}
          data={checklists}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <ChecklistItem
              key={Math.random() * 100000 + '-' + index}
              checklist={item}
            />
          )}
          ListEmptyComponent={() => (
            <Loading>
              <ErrorText>
                Não há checklists registrados para esta data
              </ErrorText>
            </Loading>
          )}
        />
      )}
    </Container>
  )
}
