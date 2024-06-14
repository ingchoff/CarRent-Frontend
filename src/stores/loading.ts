import type { TLoading } from '@/types/store'
import { defineStore } from 'pinia'
type TLoadingState = {
  loading: TLoading
}
export const useLoadingStore = defineStore('loading', {
  state: (): TLoadingState => ({
    loading: {},
  }),
  actions: {
    updateLoading(loading: TLoading) {
      this.loading = { ...this.loading, ...loading }
    },
  },
})
