import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'

export async function downloadImage(imageUrl: string) {
  console.log('Baixando imagem...')
  return new Promise<string>((resolve, reject) => {
    const date = new Date().toISOString()
    const fileUri = FileSystem.documentDirectory + `${date}.jpg`
    FileSystem.downloadAsync(imageUrl, fileUri)
      .then((res) => res.uri)
      .then((uri) => saveFile(uri))
      .then(() => resolve(fileUri))
      .catch((err) => reject(err))
  })
}

export async function saveFile(fileUri: string) {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync()

    if (permission.status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      const album = await MediaLibrary.getAlbumAsync('Smartlist')
      if (album == null) {
        const newAlbum = await MediaLibrary.createAlbumAsync(
          'Checklist',
          asset,
          true,
        )
        await MediaLibrary.addAssetsToAlbumAsync(asset, newAlbum, false)
      } else {
        await MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
      }

      return asset.uri
    }
  } catch (err) {
    console.log('Save err: ', err)
  }
}

export async function storeFile(fileUri: string) {
  try {
    const date = new Date().toISOString()
    const newUri = FileSystem.documentDirectory + `${date}.jpg`

    // const oldUri = await saveFile(fileUri)
    await FileSystem.copyAsync({ from: fileUri, to: newUri })

    return newUri
  } catch (err) {
    console.log('Store err: ', err)
  }
}
