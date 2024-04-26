import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer'
import { router } from 'expo-router'
import { View } from 'native-base'
import { SignOut, User, WarningOctagon } from 'phosphor-react-native'
import { Linking } from 'react-native'
import { useAuth } from '../../store/auth'
import {
  Divider,
  DividerLine,
  Footer,
  FooterText,
  FooterTextLight,
} from './styles'

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.replace('login')
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        height: '100%',
        // alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <DrawerItemList {...props} />
        <Divider>
          <DividerLine />
        </Divider>
        <DrawerItem
          label="Política de Privacidade"
          icon={({ color, size }) => (
            <WarningOctagon color={color} size={size} />
          )}
          onPress={() =>
            Linking.openURL('https://smartnewsystem.com.br/privacidade/')
          }
        />
        <DrawerItem
          label={user.name}
          icon={({ color, size }) => <User color={color} size={size} />}
          onPress={() => {}}
        />
        <DrawerItem
          label="Sair"
          icon={({ color, size }) => <SignOut color={color} size={size} />}
          onPress={handleLogout}
        />
      </View>
      <Footer>
        <FooterTextLight>2.4.0</FooterTextLight>
        <FooterText>Desenvolvido por SmartNew System</FooterText>
        <FooterText>2023 © Todos os direitos reservados</FooterText>
      </Footer>
    </DrawerContentScrollView>
  )
}
