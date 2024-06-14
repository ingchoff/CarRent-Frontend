import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: {},
    stocks: {},
  }),
  actions: {
    async getProducts() {
      const data = await fetchWrapper.get(`${API_STOCK}/products`, '')
      if (data) {
        this.products = data
      }
    },
    async getStocks() {
      const data = await fetchWrapper.get(`${API_STOCK}/stocks`, '')
      if (data) {
        this.stocks = data
      }
    },
  },
})
