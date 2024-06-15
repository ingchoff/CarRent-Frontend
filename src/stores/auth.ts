import { defineStore } from 'pinia'
import { API_AUTH_TEST } from '@/config'
import router from '@/router'
import { fetchWrapper } from '@/helpers/fetchWrapper'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: null as any,
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
      }
    },
    async logout() {
      const requestPosts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.token.refreshToken,
        }),
      }
      fetch(`${API_AUTH_TEST}/revokeRefreshTokens`, requestPosts)
      localStorage.removeItem('token')
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
        router.push('/login')
      }
    },
  },
})
