import { CustomDrawerContent } from '@/src/CustomDrawerContent'
import { Header } from '@/src/components/Header'
import { Drawer } from 'expo-router/drawer'
import { House } from 'phosphor-react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={CustomDrawerContent}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            header: Header,
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => (
              <House color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
