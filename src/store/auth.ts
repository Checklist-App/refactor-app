import { create } from 'zustand'
import { api } from '../libs/api'
import db from '../libs/database'
import { User } from '../types/User'
import { useCrashlytics } from './crashlytics-report'

type LoginData = {
  login: string
  pass: string
}

type LoginResponse = {
  token: string
  user: {
    login: string
    name: string
    clientId: number
  }
}

interface AuthStore {
  token: string | null
  user: User | null
  getUser: () => User
  authenticateLastUser: () => boolean
  storeAuth: (token: string, user: User) => void
  login: (data: LoginData) => Promise<void>
  offlineLogin: (data: LoginData) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthStore>((set, get) => {

  const { sendLog, reportError, sendStacktrace } = useCrashlytics.getState()

  return {
    token: null,
    user: null,

    getUser() {
      sendStacktrace(get().getUser)
      return db.retrieveLastUser()
    },

    authenticateLastUser: () => {
      sendStacktrace(get().authenticateLastUser)
      const user = db.retrieveLastUser()
      const token = db.retrieveActiveToken()

      if (user && token) {
        if (user.token === token) {
          set({ token, user })
          return true
        }
        return false
      }
      return false
    },

    storeAuth: (token, user) => {
      sendStacktrace(get().storeAuth)
      set({
        token,
        user,
      })

      db.storeToken(token)
      db.storeUser(user)
    },

    login: async (data) => {
      sendStacktrace(get().login)
      const loginEndpoint = '/public/login'
      sendLog(`endpoint ${loginEndpoint} post`)
      await api
        .post(loginEndpoint, data)
        .then((res) => res.data)
        .then(async (response: LoginResponse) => {
          const user = {
            ...response.user,
            password: data.pass,
            token: response.token,
          }
          api.defaults.headers.common.Authorization = `Bearer ${user.token}`

          get().storeAuth(response.token, user)
        })
        .catch((err) => {
          reportError(err)
          throw new Error('Credenciais inválidas')
        })
    },

    offlineLogin: (data) => {
      sendStacktrace(get().offlineLogin)
      return new Promise<void>((resolve, reject) => {
        const users = db.retriveUsers()
        if (!users) {
          const emptyUsersMessage = 'Falha ao buscar credenciais armazenadas, conecte-se a internet e faça login'
          sendLog(emptyUsersMessage)
          reject(
            new Error(
              emptyUsersMessage,
            ),
          )
        }

        for (const user of users) {
          if (user.login === data.login && user.password === data.pass) {
            get().storeAuth(user.token, user)
            resolve()
          }
        }

        reject(new Error('Credenciais inválidas'))
      })
    },

    logout: () => {
      sendStacktrace(get().logout)
      set({ user: null, token: null })
      db.deleteKey('activeToken')
      api.defaults.headers.common.Authorization = ''
    },
  }
})
