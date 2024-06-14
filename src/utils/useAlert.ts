import type { TAlert } from '@/types'
import { useAlertStore } from '@/stores'
import { computed } from 'vue'
export default function () {
  const store = useAlertStore()

  const updateAlert = (state: TAlert) => {
    store.updateAlert(state)
  }
  const removeAlert = (state: TAlert) => {
    store.removeAlert(state)
  }

  return {
    alert: computed(() => store.alert),
    updateAlert,
    removeAlert,
  }
}
