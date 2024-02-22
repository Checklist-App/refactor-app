// import { requestCameraPermissionsAsync } from 'expo-camera'
// import { usePermissions } from 'expo-media-library'
// import { create } from 'zustand'

// interface PermissionsData {
//   cameraPermission: boolean
//   mediaPermission: boolean

//   requestCameraPermission: () => Promise<void>
//   requestMediaPermission: () => Promise<void>
// }

// export const usePermissionsStore = create<PermissionsData>((set) => {
//   const [expoPermissions, requestExpoPermissions] = usePermissions()
//   return {
//     cameraPermission: false,
//     mediaPermission: false,

//     requestMediaPermission: async () => {
//       await requestExpoPermissions()

//       if (expoPermissions) {
//         set({ mediaPermission: true })
//       }
//     },

//     requestCameraPermission: async () => {
//       const permission = await requestCameraPermissionsAsync()

//       if (permission.granted) {
//         set({ cameraPermission: true })
//       }
//     },
//   }
// })
