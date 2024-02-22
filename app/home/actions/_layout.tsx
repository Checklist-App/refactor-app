import { Stack } from 'expo-router'

export default function ActionsLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="[actionId]" />
    </Stack>
  )
}
