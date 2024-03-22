import { Stack } from 'expo-router'

export default function ChecklistLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new-checklist/index" />
      <Stack.Screen name="new-checklist/equipment-checklist" />
      <Stack.Screen name="new-checklist/location-checklist" />
      <Stack.Screen name="edit-checklist/[checklistId]/index" />
      <Stack.Screen
        name="edit-checklist/[checklistId]/new-action/index"
        options={{ presentation: 'modal' }}
      />
      {/* <Stack.Screen name="signature/index" /> */}
      {/* <Stack.Screen name="new-checklist/qr-code-scanner/index" /> */}
    </Stack>
  )
}
