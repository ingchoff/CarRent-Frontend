<template>
  <div class="flex justify-center pt-4">
    <Loading
      v-model:active="isLoading"
      :can-cancel="false"
      :color="'#9590df'"
    />
  </div>
  <div class="container mx-auto py-10 text-center">
    <DatePicker
      id="start-date"
      v-model="form.startDate"
      label="Start Date"
      placeholder="dd/mm/yyyy"
      mode="date"
      :min="new Date()"
      :hideDetails="true"
      :errors="form.startDate.$errors"
    ></DatePicker>
  </div>
</template>

<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useAuthStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import type { TCar } from '@/types'
import DatePicker from '@/components/Input/DatePicker.vue'
import { required } from '@/utils/useValidators'
import { useForm } from '@/utils'

const { user } = useAuthStore()
const { state, form, $reset, $validate } = useForm(
  {
    startDate: '',
  },
  computed(() => {
    return {
      startDate: { required },
    }
  })
)

const isLoading = ref(false)
const cars = ref<TCar[]>([])

const getCars = async () => {
  isLoading.value = true
  const data = await fetchWrapper.get(`${API_STOCK}/cars`, '')
  cars.value = data.data
  isLoading.value = false
  console.log(cars.value)
}

onMounted(async () => {
  await getCars()
})
</script>
<style lang="scss" scoped></style>
