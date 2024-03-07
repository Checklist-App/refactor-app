import { Stack } from 'expo-router'

export default function ActionsLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[actionId]/index" />
    </Stack>
  )
}
