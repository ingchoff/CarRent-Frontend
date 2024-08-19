<template>
  <div class="container mx-auto py-4 lg:py-10">
    <NewDialog
      title="เพิ่มการจอง"
      :isOpen="isOpen"
      :isEdit="false"
      :car="carsStore.car"
      @onClose="closeDialog"
    />
    <div class="grid grid-cols-3 lg:grid-cols-12 mb-2">
      <Icon
        type="custom"
        name="loading"
        class="mx-2"
        v-if="loading.getInspection"
      ></Icon>
      <div v-else class="col-span-3 lg:col-span-6 text-2xl lg:text-4xl">
        {{
          `${carsStore.car.Make} ${carsStore.car.Model} (${carsStore.car.Year}) ${carsStore.car.SubModel}  - ${carsStore.car.License}`
        }}
      </div>
      <div class="lg:col-start-12">
        <Button
          class="bg-success rounded"
          :icon="'PlusCircleIcon'"
          @click="openDialog"
        >
          จองเพิ่ม
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
      <div class="col-span-12 flex flex-col gap-2 p-4 bg-secondary rounded">
        <div class="mb-4">
          <div class="font-medium text-white">ค้นหาการจอง</div>
          <div class="border-t border-gray-200 my-4"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
            <div class="col-span-2">
              <DatePicker
                id="start-date"
                v-model="form.startDate"
                label="วันที่ส่งรถ"
                mode="date"
                :textWhite="true"
              />
            </div>
            <div class="col-span-2">
              <DatePicker
                id="start-date"
                v-model="form.endDate"
                label="วันที่รับรถ"
                mode="date"
                :textWhite="true"
              />
            </div>
            <div class="col-span-2">
              <TextField
                label="เลขบัตรปชช"
                v-model="state.nid"
                :type="'number'"
                class="text-white"
              ></TextField>
            </div>
            <div class="col-span-3">
              <TextField
                label="ชื่อ"
                v-model="state.name"
                class="text-white"
              ></TextField>
            </div>

            <div class="col-span-3">
              <TextField
                label="นามสกุล"
                v-model="state.lastName"
                class="text-white"
              ></TextField>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-2">
          <Button
            class="bg-primary text-white px-4 py-2 rounded border-0"
            @click="search"
            >กรอง</Button
          >
          <Button
            class="bg-error text-white px-4 py-2 rounded border-0"
            @click="resetSearch"
            >รีเซ็ต</Button
          >
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
import { Table, Button, Icon } from '@/components'
import DatePicker from '@/components/Input/DatePicker.vue'
import TextField from '@/components/Input/TextField.vue'
import NewDialog from '@/components/rental/NewDialog.vue'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useCarStore, useInspectionStore, useRentalStore } from '@/stores'
import type { TLastest, TService } from '@/types'
import { useCommon, useDateFns, useForm, useLoading } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { currencyFormat } = useCommon()
const isOpen = ref(false)

const headers = [
  { title: 'สถานะ', class: 'text-center' },
  { title: 'ชื่อลูกค้า' },
  { title: 'เลขบัตรปชช' },
  { title: 'เบอร์โทร' },
  { title: 'เช่า(วัน)' },
  { title: 'ค่าเช่า' },
  { title: 'ค่าส่งรถ' },
  { title: 'ค่ารับรถ' },
  { title: 'วันที่ส่งรถ' },
  { title: 'วันที่รับรถ' },
  { title: 'ไมค์ส่งรถ' },
  { title: 'ไมค์รับรถ' },
  { title: 'ระยะทาง' },
  { title: 'โน๊ตลูกค้า' },
  { title: 'หมายเหตุ' },
]

const carsStore = useCarStore()
const { loading, updateLoading } = useLoading()
const insStore = useInspectionStore()
const rentalStore = useRentalStore()
const { dateTimeFormat } = useDateFns()
const { state, form, $reset, $validate } = useForm(
  {
    name: '',
    lastName: '',
    nid: '',
    startDate: '',
    endDate: '',
  },
  computed(() => {
    return {
      name: {},
      lastName: {},
      nid: {},
      startDate: {},
      endDate: {},
    }
  })
)

const search = () => {}

const resetSearch = () => {}

const openDialog = () => {
  isOpen.value = true
}

const closeDialog = async () => {
  isOpen.value = false
}

const getRentals = async () => {
  updateLoading({ getRental: true })
  await rentalStore.getRentals()
  updateLoading({ getRental: false })
}

const getCarInfo = async () => {
  await carsStore.getCar(rentalStore.cidSeleted || '')
}

onMounted(async () => {
  await getCarInfo()
  await getRentals()
})

onUnmounted(() => {
  rentalStore.clearCidSeleted()
  carsStore.clearCarLocalStorage()
})
</script>
