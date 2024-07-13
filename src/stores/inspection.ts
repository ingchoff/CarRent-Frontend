import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'
import type { TInspection, TInspectionSummary } from '@/types'

export const useInspectionStore = defineStore('inspections', {
  state: () => ({
    inspections: [] as TInspection[],
    inspection: {} as TInspection,
    lastestInspections: {} as TInspectionSummary,
    cidSeleted: '',
  }),
  actions: {
    async getInspections() {
      const data = await fetchWrapper.get(
        `${API_STOCK}/inspections/${this.cidSeleted}`,
        ''
      )
      if (data) {
        this.inspections = data.data
      }
    },
    async searchByType(service: string) {
      const search = await fetchWrapper.get(
        `${API_STOCK}/inspection/search?carid=${this.cidSeleted}&service=${service}`,
        ''
      )
      if (search) {
        this.inspections = search.data
      }
    },
    async getLastest() {
      const data = await fetchWrapper.get(
        `${API_STOCK}/inspection/summary?carid=${this.cidSeleted}`,
        ''
      )
      if (data) {
        this.lastestInspections = data
      }
    },
  },
})
