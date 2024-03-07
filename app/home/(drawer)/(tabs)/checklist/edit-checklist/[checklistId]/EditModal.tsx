import { Button } from '@/src/components/Button'
import { Toast } from '@/src/components/Toast'
import { useActions } from '@/src/store/actions'
import { Link, router } from 'expo-router'
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
  const { actions } = useActions()
  // const { setCurrentAction, loadActions, updateAnswering } = useChecklist()
  // const { isSyncing } = useData()
  // const { dispatch } = useNavigation()
  const toast = useToast()

  function handleEditAsk() {
    // updateAnswering(true)
    if (modalData.canEdit) {
      setShowModal(false)
      router.push({
        pathname: `/home/answer/${modalData.checklistId}`,
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
            {modalData.option?.action ? (
              actions.find(
                (item) =>
                  item.checklistPeriodId === modalData.checklistPeriodId,
              ) ? (
                <Link
                  asChild
                  replace
                  href={`/home/actions/${
                    actions.find(
                      (item) =>
                        item.checklistPeriodId === modalData.checklistPeriodId,
                    ).id
                  }`}
                >
                  <Button.Trigger
                    style={{ flex: 1 }}
                    size="sm"
                    variant="green"
                    onPress={() => {
                      setShowModal(false)
                    }}
                  >
                    <Button.Icon.Plus />
                    <Button.Text>Visualizar ação</Button.Text>
                  </Button.Trigger>
                </Link>
              ) : (
                <Link
                  asChild
                  href={{
                    pathname: `/home/checklist/edit-checklist/${modalData.checklistId}/new-action`,
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
                      // updateAnswering(true)
                      setShowModal(false)
                    }}
                    // disabled={isSyncing}
                  >
                    <Button.Icon.Plus />
                    <Button.Text>Nova Ação</Button.Text>
                  </Button.Trigger>
                </Link>
              )
            ) : (
              <Button.Trigger
                style={{ flex: 1 }}
                size="sm"
                variant="secondary"
                onPress={() => setShowModal(false)}
              >
                <Button.Icon.X />
                <Button.Text>Cancelar</Button.Text>
              </Button.Trigger>
            )}

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
