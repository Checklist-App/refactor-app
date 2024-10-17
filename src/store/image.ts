import * as MediaLibrary from 'expo-media-library';
import { create } from 'zustand';
import db from '../libs/database';
import { useCrashlytics } from './crashlytics-report';


interface ImagesData{
    images: MediaLibrary.Asset[] | null
    loadImages: () => void
    setImage: (image: MediaLibrary.Asset) => void
}

export const useImages = create<ImagesData>((set, get) => {

    const {sendLog, reportError, sendStacktrace} = useCrashlytics.getState()

    return {
        images: null,
        loadImages() {
            sendStacktrace(get().loadImages)
            const images = db.retrieveImages()
            set({images})
        },
        setImage(image) {
            sendStacktrace(get().setImage)
            set((oldState) => ({
                images: [...oldState.images, image]
            }))
        },
    }

})