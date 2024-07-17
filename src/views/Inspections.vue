<template>
  <div class="container mx-auto py-4 lg:py-10 text-center">
    <NewDialog
      title="เพิ่มรายการ"
      :isOpen="isOpen"
      :isEdit="false"
      @onClose="closeDialog"
    />
    <div class="flex justify-end mb-2">
      <Button
        class="bg-success px-4 py-2 rounded"
        :icon="'PlusCircleIcon'"
        @click="openDialog"
      >
        เพิ่ม
      </Button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-4">
      <div
        class="col-span-1 flex flex-col justify-between gap-2 p-4 bg-secondary rounded lg:h-72"
      >
        <div class="mb-4">
          <div class="text-white">Services</div>
          <div class="border-t border-gray-200 my-4"></div>
          <ComboBox
            placeholder="เลือก services"
            v-model="state.seletedServices"
            :items="services"
          ></ComboBox>
        </div>
        <div class="flex justify-end gap-2">
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
        class="col-span-3 card mb-3 h-24 lg:h-72 content-start overflow-auto"
      >
        <div
          v-if="isSelectdType"
          class="grid grid-rows-3 md:grid-rows-3 grid-cols-3 gap-2 items-center"
        >
          <div
            v-if="insStore.lastestInspections.data[selectedService]"
            class="grid grid-cols-6 text-4xl col-span-3"
          >
            <div class="col-span-2 col-start-3">
              {{ selectedService }}ล่าสุด
            </div>
            <Button
              class="col-start-6 col-span-1 p-0 cursor-auto text-xl"
              :class="classObject"
              >เสื่อม
              {{
                insStore.lastestInspections.data[selectedService].Duration
              }}%</Button
            >
            <div class="col-span-6 border-t border-gray-200 my-4"></div>
          </div>
          <div
            v-if="insStore.inspections.length === 0"
            class="text-2xl row-span-3 col-span-3"
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
              {{ key }}
            </div>
            <div
              class="text-4xl flex items-center flex-wrap justify-center text-success font-semibold"
            >
              <Icon
                type="custom"
                name="loading"
                class="mx-2"
                v-if="loading.getCreditReport"
              ></Icon>
              <span
                v-else-if="key === 'InspectionDate'"
                class="transition animate-slide-y break-all"
                >{{ dateTimeFormat(value, 'dd/MM/yyyy') || 0 }}</span
              >
              <span v-else class="transition animate-slide-y break-all">{{
                currencyFormat(value) || 0
              }}</span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="grid grid-rows-2 md:grid-rows-2 grid-cols-1 md:grid-cols-3 items-center"
        >
          <div
            v-if="Object.keys(insStore.lastestInspections.data).length > 0"
            v-for="(value, key) in insStore.lastestInspections.data"
            :key="key"
            class="text-center m-2"
          >
            <div
              class="grid grid-cols-6 items-center text-md font-semibold mb-2"
            >
              <div class="col-start-3 col-span-2">{{ key }}</div>
              <Button
                class="col-start-6 col-span-1 p-0 cursor-auto"
                :class="classButtonsDuration(value.Duration)"
                >{{ value.Duration }}%</Button
              >
            </div>
            <div class="items-center">
              <Icon
                type="custom"
                name="loading"
                class="mx-2"
                v-if="loading.getCreditReport"
              ></Icon>
              <span v-else class="transition animate-slide-y break-all">
                <div class="card flex justify-between">
                  <div
                    v-for="(v, k, i) in value"
                    :key="i"
                    class="text-center mb-3"
                  >
                    <div v-if="k !== 'Duration'" class="text-md font-semibold">
                      {{ k === 'InspectionDate' ? 'Date' : k }}
                    </div>
                    <div
                      class="flex items-center flex-wrap justify-start text-success"
                    >
                      <Icon
                        type="custom"
                        name="loading"
                        class="mx-2"
                        v-if="loading.getCreditReport"
                      ></Icon>
                      <span
                        v-else-if="k === 'InspectionDate'"
                        class="transition animate-slide-y break-all"
                        >{{ dateTimeFormat(v, 'dd/MM/yyyy') || 0 }}</span
                      >
                      <span
                        v-else-if="k === 'Amount' || k === 'Mileage'"
                        class="transition animate-slide-y break-all"
                        >{{ currencyFormat(v) || 0 }}</span
                      >
                    </div>
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div v-else class="col-start-2 text-xl">ไม่พบข้อมูล</div>
        </div>
      </div>
      <div class="col-span-1 md:col-span-4">
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
              <tr v-for="ins in insStore.inspections" :key="ins.ID">
                <td class="text-start">
                  {{ dateTimeFormat(ins.InspectionDate, 'dd/MM/yyyy') }}
                </td>
                <td>{{ ins.Name }}</td>
                <td>{{ ins.Service }}</td>
                <td class="text-start">
                  {{ currencyFormat(ins.Mileage) }}
                </td>
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
import { useInspectionStore } from '@/stores'
import type { TInspection, TLastest } from '@/types'
import { useCommon, useDateFns, useForm, useLoading } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, onMounted, ref } from 'vue'

const { currencyFormat } = useCommon()
const services = ref<{ text: string; value: any }[]>([
  {
    text: 'น้ำมันเครื่อง',
    value: 'น้ำมันเครื่อง',
  },
  {
    text: 'น้ำมันเกียร์',
    value: 'น้ำมันเกียร์',
  },
  {
    text: 'น้ำมันเบรก',
    value: 'น้ำมันเบรก',
  },
  {
    text: 'กรองอากาศ',
    value: 'กรองอากาศ',
  },
  {
    text: 'กรองแอร์',
    value: 'กรองแอร์',
  },
  {
    text: 'ปัดน้ำฝน',
    value: 'ปัดน้ำฝน',
  },
  {
    text: 'แบตเตอรี่',
    value: 'แบตเตอรี่',
  },
  {
    text: 'หัวเทียน',
    value: 'หัวเทียน',
  },
  {
    text: 'ผ้าเบรก',
    value: 'ผ้าเบรก',
  },
  {
    text: 'โช๊ค',
    value: 'โช๊ค',
  },
  {
    text: 'สายพราน',
    value: 'สายพราน',
  },
  {
    text: 'ประกันชั้น1',
    value: 'ประกันชั้น1',
  },
  {
    text: 'พรบ',
    value: 'พรบ',
  },
  {
    text: 'ต่อภาษี',
    value: 'ต่อภาษี',
  },
])
const isOpen = ref(false)
const isSelectdType = ref(false)
const selectedService = ref('')

const headers = [
  { title: 'วันที่' },
  { title: 'ชื่อรายการ', class: 'text-center' },
  { title: 'ประเภท', class: 'text-center' },
  { title: 'ไมล์' },
  { title: 'ราคา' },
  { title: 'รายละเอียด', class: 'text-center' },
]

const { loading } = useLoading()
const insStore = useInspectionStore()
const { dateTimeFormat } = useDateFns()
const { state, form, $reset, $validate } = useForm(
  {
    seletedServices: { text: '', value: '' },
    make: '',
    model: '',
  },
  computed(() => {
    return {
      seletedServices: { required },
      make: { required },
      model: { required },
    }
  })
)

const filteredInspectionField = (obj: TLastest) => {
  const { Duration, ...filtered } = obj
  return filtered
}

const classObject = computed(() => {
  const duration =
    insStore.lastestInspections.data[selectedService.value].Duration
  return {
    'bg-success': duration <= 70,
    'bg-error': duration > 90,
    'bg-warning': duration > 70 && duration <= 90,
  }
})

const classButtonsDuration = (duration: number) => {
  return {
    'bg-success': duration <= 70,
    'bg-error': duration > 90,
    'bg-warning': duration > 70 && duration <= 90,
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

const getListInspections = async () => {
  await insStore.getInspections()
}

const getLatestInspections = async () => {
  if (insStore.inspections.length > 0) {
    await insStore.getLastest()
  }
}

onMounted(async () => {
  await getListInspections()
  await getLatestInspections()
})
</script>
