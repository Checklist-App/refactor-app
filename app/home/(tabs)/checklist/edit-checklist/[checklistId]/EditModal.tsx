import { Button } from '@/src/components/Button'
import { Toast } from '@/src/components/Toast'
import { router } from 'expo-router'
import { Modal, useToast } from 'native-base'
import { Dot } from 'phosphor-react-native'
import { SetStateAction } from 'react'
import { FlatList } from 'react-native'
import { ModalData } from '.'
import { CardImage } from './CardImage'
import {
  ModalButtons,
  ModalText,
  ModalTextDescription,
  ModalTextLine,
} from './styles'

interface EditModalProps {
  showModal: boolean
  setShowModal: (value: SetStateAction<boolean>) => void
  modalData: ModalData | null
}

export function EditModal({
  showModal,
  setShowModal,
  modalData,
}: EditModalProps) {
  // const { setCurrentAction, loadActions, updateAnswering } = useChecklist()
  // const { isSyncing } = useData()
  // const { dispatch } = useNavigation()
  const toast = useToast()

  function handleEditAsk() {
    // updateAnswering(true)
    if (modalData.canEdit) {
      setShowModal(false)
      router.push({
        pathname: `/home/checklist/answer/${modalData.checklistId}`,
        params: {
          checklistPeriodIndex: String(modalData.checklistPeriodIndex),
          isEditing: 'true',
        },
      })
    } else {
      toast.show({
        render: () => (
          <Toast.Error>
            Você não pode editar um checklist que está fechado
          </Toast.Error>
        ),
      })
    }
  }
  if (!modalData) {
    return <></>
  }

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{modalData.task.description}</Modal.Header>
        <Modal.Body style={{ gap: 16 }}>
          <ModalTextLine>
            <ModalText>{modalData.answer || 'NÃO RESPONDIDO'}</ModalText>
            {modalData.statusNC > 0 && (
              <>
                <Dot />
                <ModalTextDescription>
                  {
                    modalData.task.children?.find(
                      (item) => item.id === modalData.statusNC,
                    ).description
                  }
                </ModalTextDescription>
              </>
            )}
          </ModalTextLine>
          <FlatList
            keyExtractor={(i) => i.name}
            data={modalData.images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => <CardImage src={item?.path} size={100} />}
          />
          <ModalButtons>
            {/* {modalData.option?.action ? (
              modalData.actions?.length > 0 ? (
                <Button.Trigger
                  style={{ flex: 1 }}
                  size="sm"
                  variant="green"
                  onPress={() => {
                    setShowModal(false)
                    loadActions(user.login)
                    setCurrentAction(modalData.actions[0].id)
                    dispatch(DrawerActions.jumpTo('actions/index'))
                    router.replace('action')
                  }}
                >
                  <Button.Icon.Plus />
                  <Button.Text>Visualizar ação</Button.Text>
                </Button.Trigger>
              ) : (
                <Link
                  asChild
                  href={{
                    pathname: '/new-action',
                    params: {
                      checklistPeriodId: String(modalData.checklistPeriodId),
                    },
                  }}
                >
                  <Button.Trigger
                    style={{ flex: 1 }}
                    size="sm"
                    variant="green"
                    onPress={() => {
                      updateAnswering(true)
                      setShowModal(false)
                    }}
                    disabled={isSyncing}
                  >
                    <Button.Icon.Plus />
                    <Button.Text>Nova Ação</Button.Text>
                  </Button.Trigger>
                </Link>
              )
            ) : ( */}
            <Button.Trigger
              style={{ flex: 1 }}
              size="sm"
              variant="secondary"
              onPress={() => setShowModal(false)}
            >
              <Button.Icon.X />
              <Button.Text>Cancelar</Button.Text>
            </Button.Trigger>

            <Button.Trigger
              style={{ flex: 1 }}
              size="sm"
              onPress={handleEditAsk}
              // disabled={isSyncing}
            >
              <Button.Icon.Pencil />
              <Button.Text>Editar</Button.Text>
            </Button.Trigger>
          </ModalButtons>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}
