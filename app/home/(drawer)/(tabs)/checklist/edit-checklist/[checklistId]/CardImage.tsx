import { ChecklistPeriodImage } from '@/src/types/ChecklistPeriod'
import { View } from 'native-base'
import { Image } from 'react-native'
import { CardImages, MoreImagesContainer, MoreImagesText } from './styles'

interface CardImageProps {
  src: string
  size: number
}

interface MoreImagesProps {
  src: string
  size: number
  quantity: number
}

interface ListImageProps {
  images: ChecklistPeriodImage[]
  size: number
}

export function CardImage({ src, size }: CardImageProps) {
  return (
    <Image
      source={{
        uri: src,
        width: size,
        height: size,
      }}
      alt="image"
      style={{ borderRadius: 8 }}
    />
  )
}

export function MoreImages({ src, size, quantity }: MoreImagesProps) {
  return (
    <MoreImagesContainer size={`${size}px`}>
      <Image
        source={{
          uri: src,
          width: size,
          height: size,
        }}
        alt="image"
        style={{ borderRadius: 8, opacity: 0.2 }}
      />
      <MoreImagesText left={`${size / 2 - 8}px`} top={`${size / 2 - 8}px`}>
        +{quantity}
      </MoreImagesText>
    </MoreImagesContainer>
  )
}

export function ListImages({ images, size }: ListImageProps) {
  if (!images?.length) return <View></View>
  return (
    <CardImages>
      {images.slice(0, 3).map((img, index) => (
        <CardImage
          size={size}
          src={img?.url.length > 0 ? img?.url : img?.path}
          key={img.name + '-' + index}
        />
      ))}
      {images.length > 3 && (
        <MoreImages
          src={images[3].path}
          size={size}
          quantity={images.length - 3}
        />
      )}
    </CardImages>
  )
}
