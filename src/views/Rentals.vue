<template>
  <div class="container mx-auto py-4 lg:py-10">
    <NewDialog
      title="เพิ่มการจอง"
      :isOpen="isOpen"
      :isEdit="isEdit"
      :rentalData="rental"
      :car="carsStore.car"
      @onClose="closeDialog"
    />
    <Dialog v-model="isOpenInfo" :width="640">
      <div class="dialog-title divide-y">
        {{ moreInfo?.title }}
      </div>
      <div class="dialog-text">{{ moreInfo.content }}</div>
      <div class="dialog-actions flex justify-end gap-3">
        <Button @click="closeInfo">ปิด</Button>
      </div>
    </Dialog>
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
                id="end-date"
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
            <div class="col-span-2">
              <Radio
                id="status"
                class="text-white"
                v-model="state.status"
                label="สถานะ"
                :items="[
                  { text: 'Done', value: 'done' },
                  { text: 'Pending', value: 'pending' },
                ]"
                :errors="form.status.$errors"
              ></Radio>
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
        <TableRentals @onShowInfo="showInfo" @openEdit="openDialog" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Button,
  Icon,
  DatePicker,
  TextField,
  Dialog,
  Radio,
} from '@/components'
import NewDialog from '@/components/rental/NewDialog.vue'
import TableRentals from '@/components/rental/TableRentals.vue'
import { useCarStore, useRentalStore } from '@/stores'
import type { TRental } from '@/types'
import { useCommon, useDateFns, useForm, useLoading } from '@/utils'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const isOpen = ref(false)
const isOpenInfo = ref(false)
const isEdit = ref(false)
const rental = ref<TRental>({
  ID: 0,
  Name: '',
  Nid: '',
  Phone: '',
  StartDate: '',
  EndDate: '',
  StartMile: 0,
  EndMile: 0,
  CustomerNote: '',
  Detail: '',
  Expense: 0,
  TotalAmount: 0,
  TotalNet: 0,
  DailyRate: 0,
  CarDelivery1: 0,
  CarDelivery2: 0,
  Status: '',
  UserID: 0,
  CarID: 0,
})
const moreInfo = ref<{ title: string; content: string }>({
  content: '',
  title: '',
})

const carsStore = useCarStore()
const { loading, updateLoading } = useLoading()
const rentalStore = useRentalStore()
const { state, form, $reset, $validate } = useForm(
  {
    name: '',
    nid: '',
    startDate: '',
    endDate: '',
    status: '',
  },
  computed(() => {
    return {
      name: {},
      nid: {},
      startDate: {},
      endDate: {},
      status: {},
    }
  })
)

const search = async () => {
  if (
    state.name ||
    state.nid ||
    state.startDate ||
    state.endDate ||
    state.status
  ) {
    await rentalStore.searchRental({
      cid: rentalStore.cidSeleted ? rentalStore.cidSeleted : '',
      start: state.startDate
        ? new Date(state.startDate).getTime().toString()
        : '0',
      end: state.endDate ? new Date(state.endDate).getTime().toString() : '0',
      name: state.name,
      nid: state.nid,
    })
  }
}

const resetSearch = async () => {
  if (
    state.name ||
    state.nid ||
    state.startDate ||
    state.endDate ||
    state.status
  ) {
    await $reset()
    await getRentals()
  }
}

const closeInfo = () => {
  moreInfo.value = { content: '', title: '' }
  isOpenInfo.value = false
}

const showInfo = (info: { title: string; content: string }) => {
  moreInfo.value.title = info.title
  moreInfo.value.content = info.content
  isOpenInfo.value = true
}

const openDialog = (data: { data: TRental; action: string }) => {
  if (data.action === 'edit') {
    rental.value = data.data
    isEdit.value = true
    isOpen.value = true
  } else {
    isOpen.value = true
  }
}

const closeDialog = async (edit: boolean) => {
  if (edit) {
    rental.value = {
      ID: 0,
      Name: '',
      Nid: '',
      Phone: '',
      StartDate: '',
      EndDate: '',
      StartMile: 0,
      EndMile: 0,
      CustomerNote: '',
      Detail: '',
      Expense: 0,
      TotalAmount: 0,
      TotalNet: 0,
      DailyRate: 0,
      CarDelivery1: 0,
      CarDelivery2: 0,
      Status: '',
      UserID: 0,
      CarID: 0,
    }
    isEdit.value = false
    isOpen.value = false
    await getRentals()
    await getCarInfo()
  } else {
    isOpen.value = false
    await getCarInfo()
  }
}

const getRentals = async () => {
  updateLoading({ getRentals: true })
  await rentalStore.getRentals()
  updateLoading({ getRentals: false })
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
