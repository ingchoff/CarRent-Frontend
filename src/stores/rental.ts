import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'
import type { TRental } from '@/types'

export const useRentalStore = defineStore('rentals', {
  state: () => ({
    rentals: [] as TRental[],
    rental: {} as TRental,
    cidSeleted: localStorage.getItem('cidSeleted'),
  }),
  actions: {
    async getRentals() {
      const data = await fetchWrapper.get(
        `${API_STOCK}/rentals/${this.cidSeleted}`,
        ''
      )
      if (data) {
        this.rentals = data.data
      }
    },
    async searchRental(condition: {
      cid: string
      start: string
      end: string
      name: string
      nid: string
    }) {
      const data = await fetchWrapper.get(
        `${API_STOCK}/rental/search?cid=${condition.cid}&name=${condition.name}&start=${condition.start}&end=${condition.end}`,
        ''
      )
      if (data) {
        this.rentals = data.data
      }
    },
    persistCidToLocalStorage(cid: number) {
      this.cidSeleted = cid.toString()
      localStorage.setItem('cidSeleted', this.cidSeleted)
    },
    clearCidSeleted() {
      this.cidSeleted = ''
      localStorage.removeItem('cidSeleted')
    },
  },
})
