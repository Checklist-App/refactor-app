import { NoPermissionCamera, NoPermissionText } from '@/app/camera/styles'
import { Button } from '@/src/components/Button'
import { useEquipments } from '@/src/store/equipments'
import { useLocations } from '@/src/store/location'
import { Camera } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { View } from 'native-base'
import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Container, ScanButton } from './styles'

export default function QrCodeScanner() {
  const [scanned, setScanned] = useState(false)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const { mode } = useLocalSearchParams()
  const { updateEquipmentId, equipments } = useEquipments()
  const { updateLocation, locations } = useLocations()
  

  const handleBarCodeScanned = ({ data }) => {
    if (mode === 'equipment') {
      const foundEquipment = equipments.find((eq) => eq.id === Number(data))
      if (!foundEquipment) {
        return alert('Nenhum equipamento encontrado')
      }
      updateEquipmentId(Number(data))
    } else if (mode === 'location') {
      const foundLocation = locations.find((item) => item.id === Number(data))
      if (!foundLocation) {
        return alert('Nenhuma inspeção encontrada')
      }
      updateLocation(Number(data))
    } else {
      return
    }
    router.back()
  }

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    requestPermission()
    return (
      <NoPermissionCamera>
        <NoPermissionText style={{ textAlign: 'center' }}>
          Sem permissão para acessar a câmera!
        </NoPermissionText>
        <Button.Trigger onPress={requestPermission}>
          <Button.Icon.ShieldCheck />
          <Button.Text>Pedir permissão</Button.Text>
        </Button.Trigger>
      </NoPermissionCamera>
    )
  }

  return (
    <Container>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        {scanned && (
          <ScanButton
            onPress={() => setScanned(false)}
            onlyIcon
            rounded
            size="lg"
          >
            <Button.Icon.ArrowsClockwise />
          </ScanButton>
        )}
      </Camera>
    </Container>
  )
}
