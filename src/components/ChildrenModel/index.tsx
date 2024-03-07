import { ListImages } from '@/app/home/(drawer)/(tabs)/checklist/edit-checklist/[checklistId]/CardImage'
import {
  ChecklistPeriod,
  ChecklistPeriodImage,
} from '@/src/types/ChecklistPeriod'
import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { Link } from 'expo-router'
import { Button } from '../Button'
import { CheckboxModel } from '../CheckboxModel'
import { ObservationField } from '../ObservationField'
import { Container } from './styles'

interface ChildrenModelProps {
  hasPhoto: boolean
  hasChildren: boolean
  checklistPeriod: ChecklistPeriod
  childrenOptions: ChecklistStatus[]
  images: ChecklistPeriodImage[]

  selectedChild: number
  setSelectedChild: (arg: number) => void
  observationText: string
  setObservationText: (arg: string) => void
}

export function ChildrenModel({
  hasPhoto,
  hasChildren,
  childrenOptions,
  checklistPeriod,
  images,
  selectedChild,
  setSelectedChild,
  observationText,
  setObservationText,
}: ChildrenModelProps) {
  // function setCurrentPictures() {
  //   const mappedImages: CameraCapturedPicture[] = images.map((img) => ({
  //     uri: img.path,
  //     width: 100,
  //     height: 100,
  //   }))
  //   setPictures(mappedImages)
  // }

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
                checklistId: checklistPeriod.productionRegisterId,
                checklistPeriodId: checklistPeriod.id,
              },
            }}
          >
            <Button.Trigger>
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
