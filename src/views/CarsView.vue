<template>
  <div class="container mx-auto py-4 lg:py-10 text-center">
    <NewDialog
      :title="'เพิ่มรถให้เช่า'"
      :isOpen="isOpen"
      :isEdit="false"
      :carMakes="carNames"
      :carModels="carModels"
      @onClose="closeDialog"
    />
    <NewDialog
      :title="'แก้ไขข้อมูล'"
      :isOpen="isShowEdit"
      :isEdit="true"
      :car="carInfo"
      :carMakes="carNames"
      :carModels="carModels"
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
    <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-4">
      <div class="lg:flex-row gap-2 p-4 bg-secondary rounded lg:h-72">
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
        <div class="flex justify-center">
          <Button class="bg-primary text-white px-4 py-2 rounded border-0"
            >กรอง</Button
          >
        </div>
      </div>
      <div class="col-span-3">
        <div
          v-for="car in cars"
          :key="car.ID.toString()"
          class="tw-card rounded-md border flex flex-col p-0 lg:flex-row lg:p-3 relative mb-4 z-[5]"
        >
          <div class="relative">
            <img
              :src="car.Image"
              alt="Car Image"
              class="h-64 w-96 object-cover p-4 lg:p-0 rounded-md"
            />
          </div>
          <div class="flex flex-col justify-around lg:ml-3 w-full">
            <div class="px-3 lg:px-0">
              <div class="mb-3 md:flex-row md:justify-between mt-6 lg:mt-0">
                <div class="flex flex-row justify-between">
                  <h3 class="text-lg font-semibold uppercase">
                    {{ car.Make }} {{ car.Model }} ({{ car.Year }})
                    {{ car.SubModel }}
                  </h3>
                  <h3 class="text-lg font-semibold uppercase text-gray-500">
                    {{ car.License }}
                  </h3>
                </div>
              </div>
              <div
                class="space-y-6 bg-white p-4 lg:space-y-4 rounded-md lg:w-1/2"
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
                  <div class="flex gap-1 justify-center">
                    <p class="text-gray-500 tw-subtile tw-subtile-5 font-bold">
                      เครื่อง
                    </p>
                    <p class="tw-subtile tw-subtile-4">{{ car.Engine }} cc</p>
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

                  <div class="flex gap-2 justify-center">
                    <p class="text-gray-500 tw-subtile tw-subtile-5 font-bold">
                      ประตู
                    </p>
                    <p class="tw-subtile tw-subtile-4">{{ car.Door }}</p>
                  </div>
                  <div class="flex gap-2 justify-center">
                    <p class="text-gray-500 tw-subtile tw-subtile-5 font-bold">
                      เชื้อเพลิง
                    </p>
                    <p class="tw-subtile tw-subtile-4">
                      {{ car.Fuel }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-200 my-4"></div>
              <div class="py-3 lg:py-0">
                <h3 class="flex justify-end font-bold">
                  {{ car.DailyRate }} / วัน
                </h3>
              </div>
            </div>
            <div
              class="flex justify-center lg:justify-end gap-2 pb-3 lg:pb-0 lg:pt-2"
            >
              <Button
                class="bg-primary text-white px-4 py-2 rounded"
                @click="openInspection(car)"
              >
                ตรวจสอบรถ
              </Button>
              <Button
                class="bg-primary text-white px-4 py-2 rounded"
                @click="openEdit(car)"
              >
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
import { computed, onMounted, ref, watch } from 'vue'
import type { TCar } from '@/types'
import { Button, Select, Icon } from '@/components'
import { required } from '@/utils/useValidators'
import { useForm } from '@/utils'
import { useCarStore, useInspectionStore } from '@/stores'
import NewDialog from '@/components/car/NewDialog.vue'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_STOCK } from '@/config'
import { useRouter } from 'vue-router'

const carsStore = useCarStore()
const insStore = useInspectionStore()
const router = useRouter()
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
const isShowEdit = ref(false)
const cars = ref<TCar[]>([])
const carInfo = ref<TCar>()
const carNames = ref<{ text: string; value: string }[]>([])
const carModels = ref<{ text: string; value: string }[]>([])
const masterModelsData = ref<{ Make: { [key: string]: string[] } }>({
  Make: {},
})

const getListCars = async () => {
  isLoading.value = true
  await carsStore.getCars()
  cars.value = carsStore.cars
  isLoading.value = false
}

const getModelNames = async () => {
  const modelsData = await fetchWrapper.get(`${API_STOCK}/cars/models-data`, '')
  if (modelsData) {
    masterModelsData.value = modelsData.data
    Object.keys(masterModelsData.value.Make).map((k) => {
      carNames.value.push({ text: k, value: k })
    })
  }
}

const openEdit = async (c: TCar) => {
  carNames.value = []
  carModels.value = []
  carInfo.value = c
  Object.keys(masterModelsData.value.Make).map((make) => {
    carNames.value.push({ text: make, value: make })
    masterModelsData.value.Make[make].map((model) => {
      carModels.value.push({ text: model, value: model })
    })
  })
  isShowEdit.value = true
}

const openDialog = async () => {
  Object.keys(masterModelsData.value.Make).map((make) => {
    masterModelsData.value.Make[make].map((model) => {
      carModels.value.push({ text: model, value: model })
    })
  })
  isOpen.value = true
}

const closeDialog = async (isUpdated: boolean) => {
  isOpen.value = false
  carInfo.value = undefined
  isShowEdit.value = false
  carModels.value = []
  if (isUpdated) {
    await getListCars()
  } else {
    await getListCars()
  }
}

const openInspection = (car: TCar) => {
  insStore.cidSeleted = car.ID.toString()
  router.push(`/inspections/${car.License}`)
}

onMounted(async () => {
  await getListCars()
  await getModelNames()
})

watch(
  () => state.make,
  (newMake, prevMake) => {
    if (newMake !== prevMake) {
      carModels.value = []
      masterModelsData.value.Make[newMake].map((model) => {
        carModels.value.push({ text: model, value: model })
      })
    }
  }
)
</script>
<style lang="scss" scoped></style>
