import { defineStore } from 'pinia'
import { API_AUTH_TEST, API_STOCK } from '@/config'
import router from '@/router'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import type { TUser } from '@/types'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: null as any,
    user: localStorage.getItem('user')
      ? (JSON.parse(localStorage.getItem('user') || '') as TUser)
      : ({} as any),
    refreshTokenTimeout: null,
  }),
  actions: {
    async login(username: string, password: string) {
      const token = await fetchWrapper.post(`${API_AUTH_TEST}/login`, {
        email: username,
        password,
      })
      if (token) {
        localStorage.setItem('token', JSON.stringify(token.token))
        this.token = JSON.parse(localStorage.getItem('token') as string)
        const userData = await fetchWrapper.get(`${API_STOCK}/user/token`, '')
        this.user = userData.user
        this.persistToLocalStorage()
      }
    },
    async logout() {
      const requestPosts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.token,
        },
        body: JSON.stringify({
          refreshToken: this.token,
        }),
      }
      fetch(`${API_AUTH_TEST}/revorktoken`, requestPosts)
      this.clearPersistLocalStorage()
      this.user = {}
      this.token = null
    },
    async refreshToken() {
      const newToken = await fetchWrapper.post(
        `${API_AUTH_TEST}/refreshToken`,
        { refreshToken: this.token.refreshToken }
      )
      if (newToken) {
        localStorage.setItem('token', JSON.stringify(newToken))
        this.token = JSON.parse(localStorage.getItem('token') as string)
        router.go(0)
      } else {
        // refreshToken > 4h must be re-login
        this.clearPersistLocalStorage()
        router.push('/login')
      }
    },
    persistToLocalStorage() {
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    clearPersistLocalStorage() {
      localStorage.clear()
    },
  },
})
