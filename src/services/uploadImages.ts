import * as FileSystem from 'expo-file-system'
import { ChecklistPeriodImage } from '../types/ChecklistPeriod'

interface UploadSingleImageProps {
  img: ChecklistPeriodImage
  route: string
  id: number
  token: string
}

export async function uploadSingleImage({
  img,
  route,
  id,
  token,
}: UploadSingleImageProps) {
  return new Promise<void>((resolve, reject) => {
    try {
      console.log(
        `Enviando imagem para rota ${process.env.EXPO_PUBLIC_API_URL}/${route}/${id}`,
      )
      FileSystem.uploadAsync(
        `${process.env.EXPO_PUBLIC_API_URL}/${route}/${id}`,
        img.path,
        {
          fieldName: 'file',
          httpMethod: 'POST',
          headers: {
            Authorization: 'bearer ' + token,
          },
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        },
      )
        .then((res) => console.log(res))
        .catch((err) => {
          console.log('Erro ao enviar imagens')
          reject(err)
        })

      resolve()
    } catch (err) {
      console.log('erro sendImages')
      reject(err)
    }
  })
}
