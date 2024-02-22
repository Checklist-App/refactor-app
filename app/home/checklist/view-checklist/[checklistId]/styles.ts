import styled from 'styled-components/native'

type MoreImagesProps = {
  size?: string
  top?: string
  left?: string
}

export const Container = styled.View`
  background-color: #fff;
  padding: 24px;
  gap: 24px;
  flex: 1;
`

export const TitleView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled.Text`
  color: ${({ theme }) => theme.color['zinc-600']};
  font-size: 24px;
  font-weight: bold;
`

export const Card = styled.TouchableOpacity`
  border: 1px solid ${({ theme }) => theme.color['zinc-200']};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  margin-bottom: 16px;
`
export const CardQuestion = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const CardAnswer = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.color['zinc-600']};
  text-transform: uppercase;
`

export const CardAnswerDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.color['zinc-500']};
  text-transform: uppercase;
`

export const CardAnswerLine = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`

export const CardImages = styled.View`
  flex-direction: row;
  gap: 10px;
`

export const MoreImagesContainer = styled.View<MoreImagesProps>`
  position: relative;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color['violet-200']};
`
export const MoreImagesText = styled.Text<MoreImagesProps>`
  position: absolute;
  color: ${({ theme }) => theme.color['violet-600']};
  font-size: 18px;
  font-weight: bold;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
`
export const ModalText = styled.Text`
  color: ${({ theme }) => theme.color['zinc-600']};
`

export const ModalTextDescription = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.color['zinc-500']};
`

export const ModalTextLine = styled.View`
  flex-direction: row;
  gap: 4px;
  align-items: center;
`

export const ModalButtons = styled.View`
  flex-direction: row;
  gap: 8px;
`

export const ContainerCurrentAnswer = styled.View`
  align-items: center;
  padding: 8px;
`

export const ContainerStatus = styled.View<{ status: string }>`
  position: absolute;
  padding: 4px;
  right: 0;
  top: 0;
  border-radius: 0 10px 0 10px;
  background-color: ${({ theme, status }) =>
    status === 'errored' ? theme.color['yellow-200'] : theme.color['red-200']};
`
