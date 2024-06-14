import type { TAlert } from '@/types/store'
import { defineStore } from 'pinia'

type TAlertState = {
  alert: TAlert[]
}
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export const useAlertStore = defineStore('alert', {
  state: (): TAlertState => ({
    alert: [],
  }),
  actions: {
    async updateAlert(payload: TAlert) {
      this.alert.push(payload)
      await sleep(3000)
      const search = this.alert.findIndex(
        (i) => i.message === payload.message && i.type === payload.type
      )
      if (search > -1) {
        this.alert.splice(search, 1)
      }
    },
    removeAlert(payload: TAlert) {
      const search = this.alert.findIndex(
        (i) => i.message === payload.message && i.type === payload.type
      )
      if (search > -1) {
        this.alert.splice(search, 1)
      }
    },
  },
})
