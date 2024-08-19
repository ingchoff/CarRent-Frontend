<template>
  <Dialog v-model="props.isOpen" :width="960">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div>
        <div class="grid grid-cols-12 gap-2">
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
              class="text-error disabled"
              v-model="calExpense"
              label="ค่าใช้จ่ายทั้งหมด"
              :type="'number'"
              disabled
            ></TextField>
          </div>
          <div class="col-span-2">
            <TextField
              class="text-warning disabled"
              v-model="calNet"
              label="รายได้สุทธิ"
              :type="'number'"
              disabled
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
import { Button, Dialog, TextField, ComboBox, DatePicker } from '@/components'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useAuthStore, useCarStore, useInspectionStore } from '@/stores'
import type { TCar, TRental, TService } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'
import TextArea from '../Input/TextArea.vue'

interface IProps {
  title: string
  isEdit: boolean
  isOpen: boolean
  car: TCar
}
const props = defineProps<IProps>()
const emit = defineEmits(['onClose'])

const { loading, updateLoading } = useLoading()
const { updateAlert } = useAlert()
const authStore = useAuthStore()
const { state, form, $reset, $validate } = useForm(
  {
    rentalDate: {} as { start: ''; end: '' },
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
    status: false,
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
    }
  })
)
const daysCount = ref(0)

const numDays = computed(() => {
  if (state.rentalDate) {
    const timeDiff =
      new Date(state.rentalDate.end).getTime() -
      new Date(state.rentalDate.start).getTime()
    daysCount.value = Math.round(timeDiff / (1000 * 60 * 60 * 24))
    return Math.round(timeDiff / (1000 * 60 * 60 * 24)) || 0
  }
})
const numMiles = computed(() => {
  return state.endMile - state.startMile
})
const calExpense = computed(() => {
  state.expense =
    parseInt(state.carDelivery1 as unknown as string) +
    parseInt(state.carDelivery2 as unknown as string)
  return state.expense
})
const calAmount = computed(() => {
  state.totalAmount = state.dailyRate * daysCount.value || 0
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
      Status: 'undone',
      StartDate: state.rentalDate.start,
      StartMile: parseInt(state.startMile as unknown as string),
      EndDate: state.rentalDate.end,
      EndMile: parseInt(state.endMile as unknown as string),
      Expense: state.expense,
      TotalNet: state.totalNet,
      TotalAmount: state.totalAmount,
    } as TRental)
    updateLoading({ save: false })
    if (newRental) {
      updateAlert({ message: 'เพิ่มรายการสำเร็จ', type: 'success' })
      await close()
    } else {
      updateAlert({ message: 'เพิ่มรายการไม่สำเร็จ', type: 'error' })
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
