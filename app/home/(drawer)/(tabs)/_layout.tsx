import { Tabs } from 'expo-router'
import { ClipboardText, XCircle } from 'phosphor-react-native'

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="checklist">
      <Tabs.Screen
        name="checklist"
        options={{
          headerShown: false,
          tabBarLabel: 'Checklist',
          tabBarIcon: ({ color, size }) => (
            <ClipboardText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="actions"
        options={{
          headerShown: false,
          tabBarLabel: 'Ações Geradas',
          tabBarIcon: ({ color, size }) => (
            <XCircle color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
