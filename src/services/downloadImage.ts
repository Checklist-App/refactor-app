import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import db from '../libs/database';

export async function downloadImage(imageUrl: string) {
  console.log('Baixando imagem...')

  return new Promise<string>((resolve, reject) => {
    console.log("imageUrl =>", imageUrl);
    
    const parts = imageUrl.split("/")
    const fileUri = FileSystem.documentDirectory + (imageUrl.includes("Z-") ? `${imageUrl.split("Z-")[1]}` : `${parts[parts.length -1 ]}`)
    console.log("fileUri =>", fileUri)
    FileSystem.downloadAsync(imageUrl, fileUri)
      .then((res) => res.uri)
      //.then((uri) => saveFile(uri))
      .then(() => resolve(fileUri))
      .catch((err) => {
        console.log(`Erro ao baixar imagem de ${imageUrl} para ${fileUri}`)
        reject(err)
      })
  })
}

export async function saveFile(fileUri: string) {
  try {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()

    if (mediaLibraryPermission.granted && cameraPermission.granted) {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      db.storeImage(asset)

      return asset.uri
    }
  } catch (err) {
    console.log('Save err: ', err)
  }
}

export async function saveFileToAlbum() {
  try {
    const assets = db.retrieveImages()

    const albumName = "Smartlist"
    let album = await MediaLibrary.getAlbumAsync(albumName)
    if (album === null) {
      album = await MediaLibrary.createAlbumAsync(
        albumName,
        assets ? assets[0] : null,
        true,
      )
    }
    const imagesInAlbum = await MediaLibrary.getAssetsAsync({album: album})
    const assetsToAdd = assets.filter(asset => !imagesInAlbum.assets.includes(asset))
    await MediaLibrary.addAssetsToAlbumAsync(assetsToAdd, album, false)
    db.deleteKey('images')
  } catch (error) {
    console.log("Erro ao salvar imagem: ", error);
  }
}

export async function storeFile(fileUri: string) {
  try {
    console.log("fileUri =>", fileUri);
    
    const newUri = FileSystem.documentDirectory + (fileUri.includes("Camera/") ? `${fileUri.split("Camera/")[1]}` : fileUri)
    
    console.log("copyAsync");
    

    await FileSystem.copyAsync({ from: fileUri, to: newUri })

    console.log("newUri =>", newUri);
    
    return newUri
  } catch (err) {
    console.log('Store err: ', err)
  }
}
