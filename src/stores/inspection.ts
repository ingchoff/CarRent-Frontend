import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'
import type { TInspection } from '@/types'

export const useInspectionStore = defineStore('inspections', {
  state: () => ({
    inspections: [] as TInspection[],
    inspection: {} as TInspection,
    cidSeleted: '',
  }),
  actions: {
    async getInspections() {
      console.log(this.cidSeleted)
      const data = await fetchWrapper.get(
        `${API_STOCK}/inspections/${this.cidSeleted}`,
        ''
      )
      if (data) {
        this.inspections = data.data
      }
    },
  },
})
