// import { create } from 'zustand'
// import { api } from '../libs/api'
// import { db } from '../libs/database-old'

// export type ResponsibleType = {
//   login: string
//   name: string
// }

// interface ResponsibleData {
//   responsibles: ResponsibleType[] | undefined

//   fetchResponsibles: (user: string, token: string) => Promise<void>
// }

// export const useResponsibles = create<ResponsibleData>((set) => {
//   return {
//     responsibles: undefined,

//     fetchResponsibles: async (user, token) => {
//       try {
//         const data = await api
//           .get('/responsibles', {
//             headers: {
//               Authorization: `bearer ${token}`,
//             },
//           })
//           .then((res) => res.data)

//         if (data) {
//           set({
//             responsibles: data,
//           })
//           db.set(`${user}/@responsibles`, JSON.stringify(data))
//         }
//       } catch (err) {
//         console.log('Erro ao fazer requisicao aos responsaveis')
//         const data: ResponsibleType[] = JSON.parse(
//           db.getString(`${user}/@responsibles`),
//         )
//         set({
//           responsibles: data,
//         })
//       }
//     },
//   }
// })
