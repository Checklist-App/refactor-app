import { useConnection } from '@/src/store/connection'
import { theme } from '@/src/themes'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import dayjs from 'dayjs'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as SplashScreen from 'expo-splash-screen'
import { NativeBaseProvider } from 'native-base'
import { useEffect } from 'react'
import { LogBox } from 'react-native'
import { ThemeProvider } from 'styled-components'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
])

export default function RootLayout() {
  const { establishConnection, testConnection } = useConnection()
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    )
  }

  changeScreenOrientation()

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    dayjs.locale('pt-br')
    establishConnection()
    const interval = setInterval(() => {
      testConnection()
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <ThemeProvider theme={theme}>
      <NativeBaseProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="login/index" options={{ headerShown: false }} />
          <Stack.Screen name="camera/index" options={{ headerShown: false }} />
        </Stack>
      </NativeBaseProvider>
    </ThemeProvider>
  )
}
