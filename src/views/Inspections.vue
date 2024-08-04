<template>
  <div class="container mx-auto py-4 lg:py-10">
    <NewDialog
      title="เพิ่มรายการ"
      :isOpen="isOpen"
      :isEdit="false"
      :services="services"
      @onClose="closeDialog"
    />
    <SettingDialog
      title="ตั้งค่า"
      :isOpen="isOpenSetting"
      :isEdit="false"
      :services="services"
      @onClose="closeSetting"
    />
    <div class="grid grid-cols-12 mb-2">
      <Icon
        type="custom"
        name="loading"
        class="mx-2"
        v-if="loading.getInspection"
      ></Icon>
      <div v-else class="col-start-3 col-span-6 text-4xl">
        {{
          `${carsStore.car?.Make} ${carsStore.car?.Model} (${carsStore.car?.Year}) ${carsStore.car?.SubModel}  - ${carsStore.car?.License}`
        }}
      </div>
      <div class="grid grid-cols-2 col-start-11 col-span-2 gap-2">
        <Button
          class="bg-warning px-4 py-2 rounded justify-self-end"
          :icon="'CogIcon'"
          @click="openSetting"
        >
        </Button>
        <Button
          class="bg-success px-4 py-2 rounded"
          :icon="'PlusCircleIcon'"
          @click="openDialog"
        >
          เพิ่ม
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
      <div
        class="col-span-2 flex flex-col justify-between gap-2 p-4 bg-secondary rounded lg:h-80"
      >
        <div class="mb-4 text-center">
          <div class="text-white">Services</div>
          <div class="border-t border-gray-200 my-4"></div>
          <ComboBox
            placeholder="เลือก services"
            v-model="state.seletedServices"
            :items="servicesSelect"
          ></ComboBox>
        </div>
        <div class="flex justify-center gap-2">
          <Button
            class="bg-primary text-white px-4 py-2 rounded border-0"
            @click="searchBytype"
            >กรอง</Button
          >
          <Button
            class="bg-error text-white px-4 py-2 rounded border-0"
            @click="resetSelectType"
            >รีเซ็ต</Button
          >
        </div>
      </div>
      <div
        class="col-span-10 card mb-3 h-24 lg:h-80 content-start overflow-auto"
      >
        <div
          v-if="isSelectdType"
          class="grid grid-rows-3 md:grid-rows-3 grid-cols-4 gap-2 items-center"
        >
          <div
            v-if="insStore.lastestInspections.data[selectedService]"
            class="grid grid-cols-6 text-4xl col-span-4"
          >
            <div class="col-span-2 col-start-3">
              {{ selectedService }}ล่าสุด
            </div>
            <div class="col-span-6 border-t border-gray-200 my-4"></div>
          </div>
          <div
            v-if="insStore.inspections.length === 0"
            class="text-2xl row-span-3 col-span-4"
          >
            ไม่มีข้อมูล
          </div>
          <div
            v-if="insStore.lastestInspections.data[selectedService]"
            v-for="(value, key) in filteredInspectionField(
              insStore.lastestInspections.data[selectedService]
            )"
            :key="key"
            class="row-span-2 text-center mb-3"
          >
            <div class="text-md font-semibold">
              {{
                key === 'InspectionDate'
                  ? 'วันที่เปลี่ยน'
                  : key === 'Mileage'
                  ? 'ไมล์'
                  : key === 'PercentDuration'
                  ? 'เสื่อม(ระยะเวลา)'
                  : key === 'PercentMileage'
                  ? 'เสื่อม(ไมล์)'
                  : key
              }}
            </div>
            <div class="text-4xl flex justify-center">
              <Icon
                type="custom"
                name="loading"
                class="mx-2"
                v-if="loading.getInspection"
              ></Icon>
              <span
                v-else-if="key === 'InspectionDate'"
                class="transition animate-slide-y break-all"
                >{{ dateTimeFormat(value, 'dd/MM/yyyy') }}</span
              >
              <Button
                v-else-if="key === 'PercentDuration'"
                class="cursor-auto text-xl text-black transition animate-slide-y"
                :class="classButtonsDuration(value as number)"
              >
                {{ Math.round(value as number) }}%</Button
              >
              <Button
                v-else-if="key === 'PercentMileage'"
                class="cursor-auto text-xl text-black transition animate-slide-y"
                :class="classButtonsMileage(value as number)"
              >
                {{ Math.round(value as number) }}%</Button
              >
              <span v-else class="transition animate-slide-y break-all">{{
                currencyFormat(value) || 0
              }}</span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="grid grid-rows-2 md:grid-rows-2 grid-cols-1 md:grid-cols-3 items-center gap-2"
        >
          <div v-if="loading.getLastest" class="justify-self-center col-span-3">
            <Icon type="custom" name="loading" class="mx-auto"></Icon>
          </div>
          <div
            v-else-if="notFound"
            class="justify-self-center col-span-3 text-2xl"
          >
            ไม่พบรายการ
          </div>
          <div
            v-else
            v-for="(value, key) in insStore.lastestInspections.data"
            :key="key"
            class="text-start"
          >
            <div class="grid grid-cols-6 items-center font-semibold mb-2">
              <div
                class="col-start-1 col-span-2 p-0 border-none bg-white hover:bg-white cursor-pointer"
                @click="clickSelectService(key as string)"
              >
                {{ key }}
              </div>
            </div>
            <div class="items-center">
              <Icon
                type="custom"
                name="loading"
                class="mx-2"
                v-if="loading.getInspections"
              ></Icon>
              <span v-else class="transition animate-slide-y break-all">
                <div
                  class="card flex gap-2 justify-center items-center px-0 py-2"
                >
                  <div
                    v-for="(v, k, i) in filteredLatestField(value)"
                    :key="i"
                    class="text-start"
                  >
                    <div class="text-md font-semibold">
                      {{
                        k === 'InspectionDate'
                          ? 'Date'
                          : k === 'PercentDuration'
                          ? ''
                          : k === 'PercentMileage'
                          ? ''
                          : k
                      }}
                    </div>
                    <div
                      class="items-center justify-center text-center text-success"
                    >
                      <Icon
                        type="custom"
                        name="loading"
                        class="mx-2"
                        v-if="loading.getInspections"
                      ></Icon>
                      <span
                        v-if="k === 'InspectionDate'"
                        class="transition animate-slide-y break-all"
                        >{{ dateTimeFormat(v, 'dd/MM/yyyy') || 0 }}</span
                      >
                      <Button
                        v-else-if="k === 'PercentDuration'"
                        class="cursor-auto text-black"
                        :class="classButtonsDuration(v as number)"
                        >{{ Math.round(v as number) }}%</Button
                      >
                      <span
                        v-if="k === 'Mileage'"
                        class="transition animate-slide-y break-all"
                        >{{ currencyFormat(v) }}</span
                      >
                      <Button
                        v-else-if="k === 'PercentMileage'"
                        class="cursor-auto text-black"
                        :class="classButtonsMileage(v as number)"
                        >{{ Math.round(v as number) }}%</Button
                      >
                    </div>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-1 md:col-span-12">
        <Table>
          <thead class="text-center">
            <tr>
              <th :class="item.class" v-for="item in headers" :key="item.title">
                {{ item.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading.getInspections">
              <td colspan="100%">
                <Icon type="custom" name="loading" class="mx-auto"></Icon>
              </td>
            </tr>
            <tr v-else-if="insStore.inspections.length === 0">
              <td colspan="100%" class="text-center">ไม่พบรายการ</td>
            </tr>
            <template v-else>
              <tr
                v-for="ins in insStore.inspections"
                :key="ins.ID"
                class="hover:bg-gray-100"
              >
                <td class="text-start">
                  {{ dateTimeFormat(ins.InspectionDate, 'dd/MM/yyyy') }}
                </td>
                <td class="text-center">{{ ins.Service }}</td>
                <td class="text-start">
                  {{ currencyFormat(ins.Mileage) }}
                </td>
                <td class="text-center">{{ ins.Name }}</td>
                <td class="text-start">{{ currencyFormat(ins.Amount) }}</td>

                <td class="text-wrap">
                  {{ ins.Description }}
                </td>
              </tr>
            </template>
          </tbody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComboBox, Table, Button, Icon } from '@/components'
import NewDialog from '@/components/inspection/NewDialog.vue'
import SettingDialog from '@/components/inspection/SettingDialog.vue'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useCarStore, useInspectionStore } from '@/stores'
import type { TLastest, TService } from '@/types'
import { useCommon, useDateFns, useForm, useLoading } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { currencyFormat } = useCommon()
const servicesSelect = ref<{ text: string; value: any }[]>([])
const services = ref<TService[]>([])
const isOpen = ref(false)
const isOpenSetting = ref(false)
const isSelectdType = ref(false)
const selectedService = ref('')
const notFound = ref(false)

const headers = [
  { title: 'วันที่' },
  { title: 'ประเภท', class: 'text-center' },
  { title: 'ไมล์' },
  { title: 'ชื่อรายการ', class: 'text-center' },
  { title: 'ราคา' },
  { title: 'รายละเอียด/ร้าน', class: 'text-center' },
]

const carsStore = useCarStore()
const { loading, updateLoading } = useLoading()
const insStore = useInspectionStore()
const { dateTimeFormat } = useDateFns()
const { state, form, $reset, $validate } = useForm(
  {
    seletedServices: { text: '', value: '' },
  },
  computed(() => {
    return {
      seletedServices: { required },
    }
  })
)

const filteredInspectionField = (obj: TLastest) => {
  const { ...filtered } = obj
  return filtered
}

const filteredLatestField = (obj: TLastest) => {
  const { ...filtered } = obj
  return filtered
}

const classButtonsDuration = (duration: number) => {
  return {
    'bg-success': duration <= 70,
    'bg-error': duration > 90,
    'bg-warning': duration > 70 && duration <= 90,
  }
}

const classButtonsMileage = (mileage: number) => {
  return {
    'bg-success': mileage <= 70,
    'bg-error': mileage > 90,
    'bg-warning': mileage > 70 && mileage <= 90,
  }
}

const searchBytype = async () => {
  if (state.seletedServices.value) {
    await insStore.searchByType(state.seletedServices.value)
    selectedService.value = state.seletedServices.value
    isSelectdType.value = true
  }
}

const resetSelectType = async () => {
  if (state.seletedServices.value) {
    await getListInspections()
    await getLatestInspections()
    state.seletedServices = { text: '', value: '' }
    selectedService.value = ''
    isSelectdType.value = false
  }
}

const openDialog = () => {
  isOpen.value = true
}

const closeDialog = async () => {
  state.seletedServices = { text: '', value: '' }
  selectedService.value = ''
  isSelectdType.value = false
  isOpen.value = false
  await getListInspections()
  await getLatestInspections()
}

const openSetting = () => {
  isOpenSetting.value = true
}

const closeSetting = async () => {
  isOpenSetting.value = false
  await getLatestInspections()
  await getServices()
}

const getListInspections = async () => {
  updateLoading({ getInspections: true })
  await insStore.getInspections()
  updateLoading({ getInspections: false })
}

const getLatestInspections = async () => {
  if (insStore.inspections.length > 0) {
    notFound.value = false
    updateLoading({ getLastest: true })
    await insStore.getLastest()
    updateLoading({ getLastest: false })
  } else {
    notFound.value = true
  }
}

const getCarInfo = async () => {
  await carsStore.getCar(insStore.cidSeleted || '')
}

const getServices = async () => {
  const servicesResponse: { [key: string]: TService[] } =
    await fetchWrapper.get(`${API_STOCK}/services/${insStore.cidSeleted}`, '')
  if (servicesResponse) {
    services.value = servicesResponse.data
    servicesResponse.data.map((service) => {
      servicesSelect.value.push({ text: service.Name, value: service.Name })
    })
  }
}

const clickSelectService = async (service: string) => {
  updateLoading({ getInspections: true })
  state.seletedServices = { text: service, value: service }
  isSelectdType.value = true
  selectedService.value = service
  await insStore.searchByType(state.seletedServices.value)
  updateLoading({ getInspections: false })
}

onMounted(async () => {
  await getCarInfo()
  await getListInspections()
  await getLatestInspections()
  await getServices()
})

onUnmounted(() => {
  insStore.clearCidSeleted()
  insStore.lastestInspections = { data: {} }
})
</script>
