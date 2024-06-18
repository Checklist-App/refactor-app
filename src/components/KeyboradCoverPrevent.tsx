import { ReactNode } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'

interface KeyboardCoverPreventProps extends KeyboardAvoidingViewProps {
  children: ReactNode
}

export function KeyboardCoverPrevent({
  children,
  ...props
}: KeyboardCoverPreventProps) {
  return (
    <KeyboardAvoidingView style={{ flex: 1, height: '100%' }} {...props}>
      <ScrollView style={{ flex: 1, height: '100%' }} contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1, height: '100%' }}
        >
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

// behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}
