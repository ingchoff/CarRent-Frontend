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
    <div class="grid grid-cols-3 lg:grid-cols-4 gap-4">
      <aside
        class="hidden sm:hidden md:hidden lg:block p-4 bg-secondary rounded h-64"
      >
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
          class="tw-card rounded-md border flex flex-col p-0 lg:flex-row lg:p-3 relative mb-4 z-[5]"
        >
          <div class="car-img-comp relative">
            <img
              :src="car.Image"
              alt="Car Image"
              class="w- h-48 object-cover mr-4 rounded-md"
            />
          </div>
          <div class="flex flex-col justify-between lg:ml-3 w-full">
            <div class="px-3 lg:px-0">
              <div class="mb-3 md:flex-row md:justify-between mt-6 lg:mt-0">
                <div class="flex flex-row justify-between">
                  <h3 class="text-lg font-semibold uppercase">
                    {{ car.Make }} {{ car.Model }} ({{ car.Year }})
                  </h3>
                </div>
              </div>
              <div
                class="space-y-6 bg-white p-4 lg:space-y-4 lg:px-0 rounded-md lg:w-80"
              >
                <div
                  class="grid grid-cols-2 gap-4 md:gap-4 sm:gap-6 grid-cols-2"
                >
                  <div class="col-span-2">
                    <div class="flex justify-center gap-2">
                      <div class="content-center">
                        <Icon name="InformationCircleIcon"></Icon>
                      </div>
                      <p>รายละเอียด</p>
                    </div>
                  </div>
                  <div class="flex gap-2 justify-center">
                    <p class="text-gray-500 tw-subtile tw-subtile-5 font-bold">
                      เกียร์
                    </p>
                    <p class="tw-subtile tw-subtile-4">
                      {{ car.Gear }}
                    </p>
                  </div>

                  <div class="flex gap-2 justify-center">
                    <p class="text-gray-500 tw-subtile tw-subtile-5 font-bold">
                      สี
                    </p>
                    <p class="tw-subtile tw-subtile-4">
                      {{ car.Color }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-200 mt-4"></div>
              <div class="py-3">
                <h3 class="mb-3 !mb-0 flex justify-end font-bold">
                  {{ car.DailyRate }} / วัน
                </h3>
              </div>
            </div>
            <div class="flex justify-center lg:justify-end gap-2 pb-3">
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
  </div>
</template>

<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useAuthStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import type { TCar } from '@/types'
import { DatePicker, Button, Select, Icon } from '@/components'
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
const carDetails = ref<{ Gear: string; Color: string }[]>([])
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
