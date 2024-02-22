// import { useAuth } from '@/src/store/auth'
// import { useToast } from 'native-base'
// import { useState } from 'react'
import { Button } from '../Button'

export function SyncButton() {
  // const toast = useToast()
  // const { handleSync, requestData, isSyncing, setIsSyncing } = useData()
  // const { allChecklists, load, loadActions } = useChecklist()
  // const { isConnected, testConnection } = useConnection()
  // const { user } = useAuth()
  // const [localLoading, setLocalLoading] = useState(false)

  // async function handleSyncButtonPress() {
  //   setLocalLoading(true)
  //   await testConnection()
  //   if (!isConnected) {
  //     setLocalLoading(false)
  //     return toast.show({
  //       render: () => (
  //         <Toast.Error>Conecte-se à internet para a sincronização</Toast.Error>
  //       ),
  //     })
  //   }
  //   if (user) {
  //     setIsSyncing(true)
  //     router.push('/')
  //     requestData()
  //       .then(async () => {
  //         const [actions, checklists] = await Promise.all([
  //           fillDbs.generateActions(user.login),
  //           fillDbs.generate(user.login),
  //         ])

  //         if (allChecklists.length < checklists.length) {
  //           await handleSync(checklists, actions)
  //             .then(() => fillDbs.loadImages(user?.login))
  //             .then(() => {
  //               load(user.login)
  //               loadActions(user.login)
  //               db.set(
  //                 `${user?.login}/lastUpdated`,
  //                 (Date.now() / 1000).toFixed(0),
  //               )
  //               setIsSyncing(false)
  //             })
  //             .catch((err) => console.log(err))
  //         } else {
  //           await handleSync(checklists, actions)
  //             .then(() => {
  //               load(user?.login)
  //               db.set(
  //                 `${user?.login}/lastUpdated`,
  //                 (Date.now() / 1000).toFixed(0),
  //               )
  //               setIsSyncing(false)
  //             })
  //             .catch((err) => console.log(err))
  //         }
  //         setLocalLoading(false)
  //         setIsSyncing(false)
  //       })
  //       .catch((error: Error) => {
  //         console.log(error)
  //         setLocalLoading(false)
  //         setIsSyncing(false)
  //       })
  //   } else {
  //     setLocalLoading(false)
  //     setIsSyncing(false)
  //     console.log('Sem usuario')
  //   }
  // }
  return (
    <Button.Trigger
      variant="secondary"
      rounded
      onlyIcon
      size="sm"
      // onPress={handleSyncButtonPress}
      // loading={localLoading || isSyncing}
      // disabled={isSyncing}
    >
      <Button.Icon.CloudArrowUp />
    </Button.Trigger>
  )
}
