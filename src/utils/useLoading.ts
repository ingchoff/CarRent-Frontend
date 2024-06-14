import { computed } from 'vue'
import type { TLoading } from '@/types'
import { useLoadingStore } from '@/stores'
export default function () {
  const store = useLoadingStore()

  const updateLoading = (state: TLoading) => {
    store.updateLoading(state)
  }

  return {
    loading: computed(() => store.loading),
    updateLoading,
  }
}
