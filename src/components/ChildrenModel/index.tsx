import { ChecklistPeriodImage } from '@/src/types/ChecklistPeriod'
import { ChecklistStatus } from '@/src/types/ChecklistStatus'
import { Text } from 'native-base'

interface ChildrenModelProps {
  hasPhoto: boolean
  hasChildren: boolean
  childrenOptions: ChecklistStatus[]
  periodIndex: number
  images: ChecklistPeriodImage[]
  selectedChild: number
  setSelectedChild: (arg: number) => void
  observationText: string
  setObservationText: (arg: string) => void
}

export function ChildrenModel({
  hasPhoto,
  // hasChildren,
  // childrenOptions,
  // periodIndex,
  // images,
  // selectedChild,
  // setSelectedChild,
  // observationText,
  // setObservationText,
}: ChildrenModelProps) {
  console.log(hasPhoto)
  return <Text>Children Model</Text>
}
//   const { setPictures } = useDataImage()

//   function setCurrentPictures() {
//     const mappedImages: CameraCapturedPicture[] = images.map((img) => ({
//       uri: img.path,
//       width: 100,
//       height: 100,
//     }))
//     setPictures(mappedImages)
//   }

//   return (
//     <Container>
//       {hasChildren && (
//         <CheckboxModel
//           options={childrenOptions}
//           selectedChild={selectedChild}
//           setSelectedChild={setSelectedChild}
//         />
//       )}

//       {hasPhoto && (
//         <>
//           <ObservationField
//             observationText={observationText}
//             setObservationText={setObservationText}
//           />

//           <Link
//             asChild
//             href={{
//               pathname: 'camera',
//               params: {
//                 periodIndex,
//                 mode: 'period',
//               },
//             }}
//           >
//             <Button.Trigger onPress={setCurrentPictures}>
//               <Button.Icon.Camera />
//               <Button.Text>Tirar foto</Button.Text>
//             </Button.Trigger>
//           </Link>
//           {images?.length > 0 && <ListImages images={images} size={100} />}
//         </>
//       )}
//     </Container>
//   )
// }
