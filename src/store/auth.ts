import { create } from 'zustand'
import { api } from '../libs/api'
import db from '../libs/database'
import { User } from '../types/User'

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
  authenticateLastUser: () => boolean
  storeAuth: (token: string, user: User) => void
  login: (data: LoginData) => Promise<void>
  offlineLogin: (data: LoginData) => Promise<void>
}

export const useAuth = create<AuthStore>((set, get) => {
  return {
    token: null,
    user: null,

    authenticateLastUser: () => {
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
      set({
        token,
        user,
      })
      db.storeToken(token)
      db.storeUser(user)
      api.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`
          return config
        },
        (error) => {
          return Promise.reject(error)
        },
      )
    },

    login: async (data) => {
      await api
        .post('/public/login', data)
        .then((res) => res.data)
        .then((response: LoginResponse) => {
          get().storeAuth(response.token, {
            ...response.user,
            password: data.pass,
            token: response.token,
          })
        })
        .catch(() => {
          throw new Error('Credenciais inválidas')
        })
    },

    offlineLogin: (data) => {
      return new Promise<void>((resolve, reject) => {
        const users = db.retriveUsers()
        if (!users) {
          reject(
            new Error(
              'Falha ao buscar credenciais armazenadas, conecte-se a internet e faça login',
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
  }
})
