import { CameraCapturedPicture } from 'expo-camera'
import { Link } from 'expo-router'
import { ListImages } from '../../../app/edit-checklist/CardImage'
import { useDataImage } from '../../hooks/useDataImage'
import ChecklistStatus from '../../libs/database/@types/ChecklistStatus'
import { IChecklistPeriodImage } from '../../libs/database/@types/IChecklistPeriodImage'
import { Button } from '../Button'
import { CheckboxModel } from '../CheckboxModel'
import { ObservationField } from '../ObservationField'
import { Container } from './styles'

interface ChildrenModelProps {
  hasPhoto: boolean
  hasChildren: boolean
  childrenOptions: ChecklistStatus[]
  periodIndex: number
  images: IChecklistPeriodImage[]
  selectedChild: number
  setSelectedChild: (arg: number) => void
  observationText: string
  setObservationText: (arg: string) => void
}

export function ChildrenModel({
  hasPhoto,
  hasChildren,
  childrenOptions,
  periodIndex,
  images,
  selectedChild,
  setSelectedChild,
  observationText,
  setObservationText,
}: ChildrenModelProps) {
  const { setPictures } = useDataImage()

  function setCurrentPictures() {
    const mappedImages: CameraCapturedPicture[] = images.map((img) => ({
      uri: img.path,
      width: 100,
      height: 100,
    }))
    setPictures(mappedImages)
  }

  return (
    <Container>
      {hasChildren && (
        <CheckboxModel
          options={childrenOptions}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
        />
      )}

      {hasPhoto && (
        <>
          <ObservationField
            observationText={observationText}
            setObservationText={setObservationText}
          />

          <Link
            asChild
            href={{
              pathname: 'camera',
              params: {
                periodIndex,
                mode: 'period',
              },
            }}
          >
            <Button.Trigger onPress={setCurrentPictures}>
              <Button.Icon.Camera />
              <Button.Text>Tirar foto</Button.Text>
            </Button.Trigger>
          </Link>
          {images?.length > 0 && <ListImages images={images} size={100} />}
        </>
      )}
    </Container>
  )
}
