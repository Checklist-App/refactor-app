import { Button } from '@/src/components/Button'
import { SheetModal } from '@/src/components/SheetModal'
import { useChecklist } from '@/src/store/checklist'
import {
  ChecklistPeriod,
  ChecklistPeriodImage,
} from '@/src/types/ChecklistPeriod'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { View, useDisclose } from 'native-base'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import {
  ButtonsContainer,
  Container,
  ContainerPictures,
  Footer,
  Header,
  NoPermissionCamera,
  NoPermissionText,
} from './styles'

export type Pictures = {
  id: string
  image: ChecklistPeriodImage
}

export default function CameraPage() {
  const { findChecklistPeriod, saveCurrentImages } = useChecklist()
  const { checklistId, checklistPeriodId } = useLocalSearchParams()
  const [selectedPeriod, setSelectedPeriod] = useState<ChecklistPeriod | null>(
    null,
  )
  const [type, setType] = useState(CameraType.back)
  const [flashMode, setFlashMode] = useState(FlashMode.off)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [takingPicture, setTakingPicture] = useState(false)
  const camera = useRef<Camera>(null)
  const [pictures, setPictures] = useState<Pictures[]>([])
  const [modalImage, setModalImage] = useState(null)
  const modalControl = useDisclose()

  useEffect(() => {
    const period = findChecklistPeriod(
      Number(checklistPeriodId),
      Number(checklistId),
    )

    if (period) {
      setSelectedPeriod(period)
    }
  }, [checklistId, checklistPeriodId])

  useEffect(() => {
    if (selectedPeriod?.img.length) {
      setPictures(
        selectedPeriod.img.map((pic) => ({
          id: pic.path,
          image: pic,
          // id: pic.uri,
          // image: pic,
        })),
      )
    }
  }, [selectedPeriod])

  if (!permission || !selectedPeriod) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    requestPermission()
    return (
      <NoPermissionCamera>
        <NoPermissionText style={{ textAlign: 'center' }}>
          Sem permissão para acessar a câmera!
        </NoPermissionText>
        <Button.Trigger onPress={requestPermission}>
          <Button.Icon.ShieldCheck />
          <Button.Text>Pedir permissão</Button.Text>
        </Button.Trigger>
      </NoPermissionCamera>
    )
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    )
  }

  function toggleFlashMode() {
    setFlashMode((current) =>
      current === FlashMode.off ? FlashMode.on : FlashMode.off,
    )
  }

  async function takePicture() {
    setTakingPicture(true)
    const picture = await camera.current?.takePictureAsync({
      exif: false,
    })

    setTakingPicture(false)
    if (!picture) return
    const id = new Date().getTime()
    setPictures((oldState) => [
      ...oldState,
      {
        id: id.toString(),
        image: {
          name: new Date().toISOString() + '-' + picture.uri,
          path: picture.uri,
          url: '',
        },
      },
    ])
  }

  function handleDeleteImage(id: string) {
    setPictures((prevState) => prevState.filter((image) => image.id !== id))
    modalControl.onClose()
  }

  function handleSavePictures() {
    const data = pictures.map((picture) => picture.image)

    saveCurrentImages({
      checklistId: Number(checklistId),
      checklistPeriodId: Number(checklistPeriodId),
      images: data,
    })

    router.back()
  }

  return (
    <Container>
      <Camera
        ref={camera}
        style={[styles.camera, StyleSheet.absoluteFillObject]}
        type={type}
        flashMode={flashMode}
      >
        <Header>
          <Button.Trigger size="sm" onPress={router.back} onlyIcon rounded>
            <Button.Icon.CaretLeft />
          </Button.Trigger>

          {pictures.length > 0 && (
            <Button.Trigger
              size="sm"
              variant="green"
              onPress={handleSavePictures}
              rounded
            >
              <Button.Icon.Check />
              <Button.Text>Salvar</Button.Text>
            </Button.Trigger>
          )}
        </Header>

        <Footer>
          <ContainerPictures ai="flex-start" gap="$2">
            {pictures.length > 0 && (
              <Button.Trigger
                variant="secondary"
                size="sm"
                onPress={() => setPictures([])}
              >
                <Button.Icon.Minus />
                <Button.Text>Limpar fotos</Button.Text>
              </Button.Trigger>
            )}
            <FlatList
              keyExtractor={(item) => item.id}
              data={pictures}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item, index }) => (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => {
                    modalControl.onOpen()
                    setModalImage(item)
                  }}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image
                    source={{
                      uri: item.image.path,
                    }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                </TouchableWithoutFeedback>
              )}
            />
          </ContainerPictures>

          <ButtonsContainer>
            <Button.Trigger
              size="lg"
              rounded
              onlyIcon
              onPress={toggleFlashMode}
            >
              {flashMode === FlashMode.on ? (
                <Button.Icon.Lightning />
              ) : (
                <Button.Icon.LightningSlash />
              )}
            </Button.Trigger>
            <Button.Trigger
              size="lg"
              onPress={takePicture}
              onlyIcon
              rounded
              disabled={takingPicture}
            >
              {takingPicture ? (
                <ActivityIndicator size={32} color="white" />
              ) : (
                <Button.Icon.Camera />
              )}
            </Button.Trigger>
            <Button.Trigger
              onlyIcon
              size="lg"
              onPress={toggleCameraType}
              rounded
            >
              <Button.Icon.ArrowsClockwise
                size={20}
                color="#ffffff"
                weight="bold"
              />
            </Button.Trigger>
          </ButtonsContainer>
        </Footer>
      </Camera>
      <SheetModal {...modalControl}>
        <Button.Trigger
          onPress={() => handleDeleteImage(modalImage.id)}
          style={{ position: 'absolute', right: 16, top: 36, zIndex: 999 }}
          onlyIcon
          rounded
          variant="red"
          size="sm"
        >
          <Button.Icon.Trash />
        </Button.Trigger>
        <View style={{ height: '100%', width: '100%' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            source={{
              uri: modalImage?.image?.uri,
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
              flex: 1,
            }}
          />
        </View>
      </SheetModal>
    </Container>
  )
}

const styles = StyleSheet.create({
  camera: {
    // flex: 1,
    justifyContent: 'space-between',
  },
})
