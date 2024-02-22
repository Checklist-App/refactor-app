import styled from 'styled-components/native'
import { Button } from '../Button'

export const ChecklistItemView = styled.View`
  flex-direction: row;
  position: relative;
  border: 1px ${({ theme }) => theme.color['zinc-200']};
  background-color: ${({ theme }) => theme.color.white};
  height: 100px;
  margin-bottom: 16px;
  border-radius: 10px;
`

export const Container = styled.View`
  padding: 32px 16px;
  flex: 1;
  gap: 8px;
`

export const TextContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  width: fit-content;
`

export const TextContentUpper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const Text = styled.Text<{ screenWidth: number }>`
  font-size: ${({ screenWidth }) => (screenWidth <= 400 ? '10px' : '14px')};
`

export const TextBold = styled.Text<{ screenWidth: number }>`
  font-size: ${({ screenWidth }) => (screenWidth <= 400 ? '10px' : '14px')};
  font-weight: bold;
`

export const ChecklistButton = styled(Button.Trigger)`
  background-color: ${({ theme }) => theme.color['violet-200']};
  height: 100px;
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
`
export const Dot = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color['zinc-400']};
`

export const ContainerSynced = styled.View<{ status: string }>`
  position: absolute;
  padding: 4px;
  left: 0;
  bottom: 0;
  border-radius: 0 10px 0 10px;
  background-color: ${({ theme, status }) =>
    status === 'synced'
      ? theme.color['green-200']
      : status === 'errored'
      ? theme.color['yellow-200']
      : theme.color['red-200']};
`

// export const Container = styled(YStack, {
//   height: '100%',
//   flex: 1,

//   padding: 16,
//   gap: 8,
// })

// export const TextContent = styled(XStack, {
//   alignItems: 'center',
//   gap: 4,
// })

// export const ChecklistButton = styled(XStack, {
//   bg: '$violet-500',
//   height: '100%',
//   aspectRatio: '1/1',
//   borderRadius: 999,
// })
