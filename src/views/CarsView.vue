<template>
  <div class="container mx-auto py-10 text-center">
    <NewDialog
      :title="'เพิ่มรถให้เช่า'"
      :isOpen="isOpen"
      :isEdit="false"
      @onClose="closeDialog"
    />
    <div class="flex justify-center">
      <Loading
        v-model:active="isLoading"
        :can-cancel="false"
        :color="'#9590df'"
      />
    </div>

    <div class="flex justify-end mb-2">
      <Button
        class="bg-success px-4 py-2 rounded"
        :icon="'PlusCircleIcon'"
        @click="openDialog"
      >
        เพิ่มรถเช่า
      </Button>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <aside class="p-4 bg-secondary rounded h-64">
        <Select
          :items="[{ text: '---Select---', value: '' }, ...carNames]"
          label="ชื่อยี่ห้อ"
          v-model="state.make"
          :labelColor="'white'"
          :errors="form.make.$errors"
        ></Select>
        <Select
          :items="[{ text: '---Select---', value: '' }, ...carModels]"
          label="ชื่อรุ่น"
          v-model="state.model"
          :labelColor="'white'"
          :errors="form.model.$errors"
        ></Select>
      </aside>
      <div class="col-span-3">
        <div
          v-for="car in cars"
          :key="car.ID.toString()"
          class="flex justify-between mb-4 p-4 border rounded"
        >
          <img
            :src="car.Image"
            alt="Car Image"
            class="w-60 h-48 object-cover mr-4"
          />
          <div class="flex flex-col justify-between gap-4">
            <h3 class="text-lg font-semibold uppercase">
              {{ car.Make }} {{ car.Model }} ({{ car.Year }})
            </h3>
            <p>ราคาเช่า/วัน: {{ car.DailyRate }}</p>
          </div>
          <div class="flex items-end gap-2">
            <Button class="bg-primary text-white px-4 py-2 rounded">
              จองเช่า
            </Button>
            <Button class="bg-primary text-white px-4 py-2 rounded">
              แก้ไขข้อมูล
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useAuthStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import type { TCar } from '@/types'
import { DatePicker, Button, Select } from '@/components'
import { required } from '@/utils/useValidators'
import { useForm } from '@/utils'
import NewDialog from '@/components/NewDialog.vue'

const { user } = useAuthStore()
const { state, form, $reset, $validate } = useForm(
  {
    startDate: '',
    make: '',
    model: '',
  },
  computed(() => {
    return {
      startDate: { required },
      make: { required },
      model: { required },
    }
  })
)

const isLoading = ref(false)
const isOpen = ref(false)
const cars = ref<TCar[]>([])
const carNames = ref<{ text: string; value: string }[]>([
  {
    text: 'Toyota',
    value: 'toyota',
  },
])
const carModels = ref<{ text: string; value: string }[]>([
  {
    text: 'yaris cross',
    value: 'yaris cross',
  },
])

const getCars = async () => {
  isLoading.value = true
  const data = await fetchWrapper.get(`${API_STOCK}/cars`, '')
  cars.value = data.data
  cars.value.map((c) => {
    c.Image =
      'https://nexenthailand.com/wp-content/uploads/2023/11/Toyota-Yaris-Cross.jpg'
  })
  isLoading.value = false
  console.log(cars.value)
}

const openDialog = async () => {
  isOpen.value = true
}

const closeDialog = async () => {
  isOpen.value = false
}

onMounted(async () => {
  await getCars()
})
</script>
<style lang="scss" scoped></style>
