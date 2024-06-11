import * as MediaLibrary from 'expo-media-library';
import { create } from 'zustand';
import db from '../libs/database';


interface ImagesData{
    images: MediaLibrary.Asset[] | null
    loadImages: () => void
    setImage: (image: MediaLibrary.Asset) => void
}

export const useImages = create<ImagesData>((set => {

    return {
        images: null,
        loadImages() {
            const images = db.retrieveImages()
            set({images})
        },
        setImage(image) {
            set((oldState) => ({
                images: [...oldState.images, image]
            }))
        },
    }

}))