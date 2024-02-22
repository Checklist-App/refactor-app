import { IconContext } from 'phosphor-react-native'
import React, { ReactNode, createContext, useContext } from 'react'
import { ActivityIndicator, TouchableOpacityProps } from 'react-native'
import { useTheme } from 'styled-components'
import {
  ButtonContainer,
  variantsColorButton,
  variantsSizeButton,
} from './styles'

export interface TriggerProps extends TouchableOpacityProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'red' | 'green' | 'transparent'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  onlyIcon?: boolean
  loading?: boolean
}

const ButtonContext = createContext<Omit<TriggerProps, 'children'>>({
  variant: 'primary',
  size: 'md',
  rounded: false,
})

export function useButtonTheme() {
  return useContext(ButtonContext)
}

// eslint-disable-next-line react/display-name
export const Trigger = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      rounded = false,
      onlyIcon = false,
      loading = false,
      ...props
    }: TriggerProps,
    ref,
  ) => {
    const { color } = useTheme()

    return (
      <IconContext.Provider
        value={{
          color: color[variantsColorButton[variant]],
          size: +variantsSizeButton[size],
          weight: 'bold',
        }}
      >
        <ButtonContext.Provider value={{ variant, size, rounded }}>
          <ButtonContainer
            onlyIcon={onlyIcon}
            variant={variant}
            size={size}
            rounded={rounded}
            ref={ref}
            {...props}
            activeOpacity={0.8}
            disabled={loading || props.disabled}
          >
            {loading ? (
              <ActivityIndicator
                color={color[variantsColorButton[variant]]}
                size={24}
              />
            ) : (
              children
            )}
          </ButtonContainer>
        </ButtonContext.Provider>
      </IconContext.Provider>
    )
  },
)
