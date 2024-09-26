<template>
  <Dialog v-model="props.isOpen" :width="960">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div>
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-5">
            <TextField
              v-model="state.name"
              label="ชื่อ-นามสกุลผู้เช่า"
              :errors="form.name.$errors"
            ></TextField>
          </div>
          <div class="col-span-4">
            <TextField
              v-model="state.nid"
              label="เลขบัตรปชช"
              type="number"
              :errors="form.nid.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <TextField
              v-model="state.phone"
              label="เบอร์โทรผู้เช่า"
              type="tel"
              :errors="form.phone.$errors"
            ></TextField>
          </div>
          <div class="col-span-5">
            <DatePicker
              id="start-date"
              v-model="form.rentalDate"
              label="วันที่ส่ง-รับรถ"
              placeholder="dd/mm/yyyy"
              mode="dateTime"
              :isRange="true"
              :errors="form.rentalDate.$errors"
            ></DatePicker>
          </div>
          <TextField
            class="disabled"
            v-model="numDays"
            label="จำนวนวัน"
            :type="'number'"
          ></TextField>
          <div class="col-span-2">
            <TextField
              v-model="state.startMile"
              label="ไมล์(ส่งรถ)"
              :type="'number'"
              :errors="form.startMile.$errors"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              v-model="state.endMile"
              label="ไมล์(รับรถ)"
              :type="'number'"
              :errors="form.endMile.$errors"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              class="disabled"
              v-model="numMiles"
              label="จำนวนไมล์"
              :type="'number'"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              v-model="state.dailyRate"
              label="ค่าเช่า/วัน"
              :type="'number'"
              :errors="form.dailyRate.$errors"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              v-model="state.carDelivery1"
              label="ค่าส่งรถ"
              :type="'number'"
              :errors="form.carDelivery1.$errors"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              v-model="state.carDelivery2"
              label="ค่ารับรถ"
              :type="'number'"
              :errors="form.carDelivery2.$errors"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              class="text-success disabled"
              v-model="calAmount"
              label="รายได้"
              :type="'number'"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              class="text-error"
              v-model="state.expense"
              label="ค่าใช้จ่ายเพิ่มเติม"
              :type="'number'"
              :errors="form.expense.$errors"
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              class="text-warning disabled"
              v-model="calNet"
              label="รายได้สุทธิ"
              :type="'number'"
            ></TextField>
          </div>
          <div class="col-span-6">
            <TextArea
              v-model="state.detail"
              label="รายละเอียด"
              :errors="form.detail.$errors"
            ></TextArea>
          </div>
          <div class="col-span-6">
            <TextArea
              v-model="state.customerNote"
              label="โน๊ตลูกค้า"
              :errors="form.customerNote.$errors"
            ></TextArea>
          </div>
          <div class="col-span-2">
            <Radio
              id="status"
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
    </div>
    <div class="dialog-actions flex justify-end gap-3">
      <Button @click="close">ยกเลิก</Button>
      <Button
        class="bg-primary text-white"
        :loading="loading.save"
        @click="save(props.isEdit)"
        >บันทึก</Button
      >
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog, TextField, DatePicker, Radio } from '@/components'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useAuthStore } from '@/stores'
import type { TCar, TRental } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'
import TextArea from '../Input/TextArea.vue'

interface IProps {
  title: string
  isEdit: boolean
  isOpen: boolean
  car: TCar
  rentalData: TRental
}
const props = defineProps<IProps>()
const emit = defineEmits(['onClose'])
const { loading, updateLoading } = useLoading()
const { updateAlert } = useAlert()
const authStore = useAuthStore()
const { state, form, $reset, $validate } = useForm(
  {
    rentalDate: { start: new Date(), end: new Date() },
    startMile: 0,
    endMile: 0,
    customerNote: '',
    detail: '',
    expense: 0,
    totalAmount: 0,
    totalNet: 0,
    dailyRate: props.car?.DailyRate,
    carDelivery1: 0,
    carDelivery2: 0,
    status: '',
    name: '',
    nid: '',
    phone: '',
  },
  computed(() => {
    return {
      rentalDate: { required },
      startMile: { required },
      endMile: { required },
      customerNote: {},
      detail: {},
      expense: { required },
      totalAmount: { required },
      totalNet: { required },
      dailyRate: { required },
      carDelivery1: { required },
      carDelivery2: { required },
      status: { required },
      name: {},
      nid: {},
      phone: {},
    }
  })
)
const daysCount = ref(0)

const numDays = computed(() => {
  if (state.rentalDate) {
    const timeDiff =
      state.rentalDate.end.getTime() - state.rentalDate.start.getTime()
    daysCount.value = Math.round(timeDiff / (1000 * 60 * 60 * 24))
    return Math.round(timeDiff / (1000 * 60 * 60 * 24)) || 0
  }
})
const numMiles = computed(() => {
  return state.endMile - state.startMile
})
const calAmount = computed(() => {
  state.totalAmount =
    state.dailyRate * daysCount.value +
      (parseInt(state.carDelivery1 as unknown as string) +
        parseInt(state.carDelivery2 as unknown as string)) || 0
  return state.totalAmount
})
const calNet = computed(() => {
  state.totalNet = state.totalAmount - state.expense || 0
  return state.totalNet
})

const save = async (isEdit: boolean) => {
  if ((await $validate()) && !isEdit) {
    updateLoading({ save: true })
    const newRental = await fetchWrapper.post(`${API_STOCK}/rental/new`, {
      CarID: props.car.ID,
      DailyRate: parseInt(state.dailyRate as unknown as string),
      CustomerNote: state.customerNote,
      UserID: authStore.user.ID,
      Detail: state.detail,
      CarDelivery1: parseInt(state.carDelivery1 as unknown as string),
      CarDelivery2: parseInt(state.carDelivery2 as unknown as string),
      Status: state.status,
      StartDate: state.rentalDate.start,
      StartMile: parseInt(state.startMile as unknown as string),
      EndDate: state.rentalDate.end,
      EndMile: parseInt(state.endMile as unknown as string),
      Expense: parseInt(state.expense as unknown as string),
      TotalNet: state.totalNet,
      TotalAmount: state.totalAmount,
      Name: state.name,
      Nid: state.nid,
      Phone: state.phone,
    } as TRental)
    updateLoading({ save: false })
    if (newRental) {
      updateAlert({ message: 'เพิ่มรายการสำเร็จ', type: 'success' })
      await close()
    } else {
      updateAlert({ message: 'เพิ่มรายการไม่สำเร็จ', type: 'error' })
    }
  } else if ((await $validate()) && isEdit) {
    updateLoading({ save: true })
    const updatedRental = await fetchWrapper.put(
      `${API_STOCK}/rental/${props.rentalData.ID}`,
      {
        CarID: props.car.ID,
        DailyRate: parseInt(state.dailyRate as unknown as string),
        CustomerNote: state.customerNote,
        UserID: authStore.user.ID,
        Detail: state.detail,
        CarDelivery1: parseInt(state.carDelivery1 as unknown as string),
        CarDelivery2: parseInt(state.carDelivery2 as unknown as string),
        Status: state.status,
        StartDate: state.rentalDate.start,
        StartMile: parseInt(state.startMile as unknown as string),
        EndDate: state.rentalDate.end,
        EndMile: parseInt(state.endMile as unknown as string),
        Expense: parseInt(state.expense as unknown as string),
        TotalNet: state.totalNet,
        TotalAmount: state.totalAmount,
        Name: state.name,
        Nid: state.nid,
        Phone: state.phone,
        CreatedAt: props.rentalData.CreatedAt,
      } as TRental
    )
    updateLoading({ save: false })
    if (updatedRental) {
      updateAlert({ message: 'แก้ไขรายการสำเร็จ', type: 'success' })
      await close()
    } else {
      updateAlert({ message: 'แก้ไขรายการไม่สำเร็จ', type: 'error' })
    }
  }
}

const close = async () => {
  await $reset()
  emit('onClose', props.isEdit)
}

watch(
  () => props.car.DailyRate,
  (newDailyRate) => {
    state.dailyRate = newDailyRate
  }
)

watch(
  () => props.isOpen,
  (isOpenState) => {
    if (isOpenState && !props.isEdit) {
      state.startMile = props.car.LatestMileage
    }
  }
)

watch(
  () => props.isEdit,
  (stateEdit) => {
    if (stateEdit) {
      state.startMile = props.rentalData.StartMile
      state.endMile = props.rentalData.EndMile
      state.rentalDate = {
        start: props.rentalData.StartDate,
        end: props.rentalData.EndDate,
      }
      state.customerNote = props.rentalData.CustomerNote
      state.detail = props.rentalData.Detail
      state.carDelivery1 = props.rentalData.CarDelivery1
      state.carDelivery2 = props.rentalData.CarDelivery2
      state.expense = props.rentalData.Expense
      state.status = props.rentalData.Status
      state.totalAmount = props.rentalData.TotalAmount
      state.totalNet = props.rentalData.TotalNet
      state.name = props.rentalData.Name
      state.nid = props.rentalData.Nid
      state.phone = props.rentalData.Phone
    }
  }
)
</script>
<style>
.vc-header {
  margin-bottom: 10px;
}
.vc-nav-item {
  display: block !important;
}
button,
.btn {
  display: flex !important;
  align-items: center !important;
}
</style>
