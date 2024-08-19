import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'
import type { TCar } from '@/types'

export const useCarStore = defineStore('cars', {
  state: () => ({
    cars: [] as TCar[],
    car: localStorage.getItem('car')
      ? (JSON.parse(localStorage.getItem('car') || '') as TCar)
      : ({} as TCar),
  }),
  actions: {
    async getCars() {
      const data = await fetchWrapper.get(`${API_STOCK}/cars`, '')
      if (data) {
        this.cars = data.data
      }
    },
    async getCar(id: string) {
      const data = await fetchWrapper.get(`${API_STOCK}/cars/${id}`, '')
      if (data) {
        this.car = data.data
        this.persistToLocalStorage()
      }
    },
    async searchCar(condition: string, value: string) {
      const data = await fetchWrapper.get(
        `${API_STOCK}/cars/search?${condition}=${value}`,
        ''
      )
      if (data) {
        this.cars = data.data
      }
    },
    persistToLocalStorage() {
      localStorage.setItem('car', JSON.stringify(this.car))
    },
    clearCarLocalStorage() {
      this.car = {} as TCar
      localStorage.removeItem('car')
    },
  },
})
