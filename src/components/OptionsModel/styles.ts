import { css } from 'styled-components'
import styled from 'styled-components/native'
import { Button } from '../Button'

export const Container = styled.View`
  gap: 16px;
  width: 100%;
  min-height: 100px;
  flex-direction: row;
  flex-wrap: wrap;
`

type OptionType = {
  selected: 'green' | 'red' | 'black'
}

const borderVariants = {
  green: 'green-500',
  red: 'red-500',
  black: 'zinc-500',
}

const selectedVariants = {
  green: css`
    background-color: ${({ theme }) => theme.color['green-500']};
    border-color: ${({ theme }) => theme.color['green-400']};
  `,
  red: css`
    background-color: ${({ theme }) => theme.color['red-500']};
    border-color: ${({ theme }) => theme.color['red-400']};
  `,
  black: css`
    background-color: ${({ theme }) => theme.color['zinc-800']};
    border-color: ${({ theme }) => theme.color['zinc-400']};
  `,
}

export const Option = styled(Button.Trigger)<OptionType>`
  border-radius: 8px;
  border: 4px solid ${({ theme, color }) => theme.color[borderVariants[color]]};
  align-items: center;
  padding: 4px;
  min-height: 110px;
  gap: 8px;
  flex: 1;
  flex-shrink: 0;
  flex-direction: column;
  background-color: transparent;
  ${({ selected, color }) => selected && selectedVariants[color]}
`

interface TextProps {
  color: string
  selected: boolean
}

const textVariantColors = {
  green: 'green-700',
  red: 'red-700',
  black: 'zinc-700',
  white: 'white',
}

export const TextOption = styled.Text<TextProps>`
  text-transform: uppercase;
  color: ${({ theme, color, selected }) =>
    selected ? 'white' : theme.color[textVariantColors[color]]};
  font-size: 24px;
  font-weight: bold;
  justify-content: center;
  text-align: center;
`
