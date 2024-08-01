<template>
  <Dialog v-model="props.isOpen" :width="480">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div></div>
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
import { useCarStore, useInspectionStore } from '@/stores'
import type { TCar } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'
import TextArea from '../Input/TextArea.vue'

interface IProps {
  title: string
  isEdit: boolean
  isOpen: boolean
  car?: TCar
}
const props = defineProps<IProps>()
const emit = defineEmits(['onClose'])

const { loading, updateLoading } = useLoading()
const { updateAlert } = useAlert()
const insStore = useInspectionStore()
const { state, form, $reset, $validate } = useForm(
  {
    inspectionDate: '',
    mileage: '',
    name: '',
    type: {} as { text: string; value: string },
    description: '',
    amount: '',
    // duration: '',
  },
  computed(() => {
    return {
      inspectionDate: { required },
      mileage: { required },
      name: { required },
      type: { required },
      description: { required },
      amount: { required },
      // duration: { required },
    }
  })
)

const isNewColor = ref(false)
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

const save = async (isEdit: boolean) => {
  if ((await $validate()) && !isEdit) {
    updateLoading({ save: true })
    const addIns = await fetchWrapper.post(`${API_STOCK}/inspection/new`, {
      InspectionDate: state.inspectionDate,
      Mileage: parseInt(state.mileage),
      Amount: parseFloat(state.amount),
      Service: state.type.value,
      Description: state.description,
      Name: state.name,
      CarID: parseInt(insStore.cidSeleted || ''),
      // Duration: parseInt(state.duration),
    })
    if (addIns) {
      updateLoading({ save: false })
      updateAlert({ type: 'success', message: 'เพิ่มสำเร็จ!' })
      await close()
    } else {
      updateLoading({ save: false })
      updateAlert({ type: 'error', message: 'เพิ่มไม่สำเร็จ!' })
    }
  } else if ((await $validate()) && isEdit) {
    updateLoading({ save: true })
    const updateIns = await fetchWrapper.put(`${API_STOCK}/inspection/`, {
      InspectionDate: state.inspectionDate,
      Mileage: state.mileage,
      Amount: state.amount,
      Service: state.type,
      Description: state.description,
      Name: state.name,
      CarID: props.car?.ID,
    })
    if (updateIns) {
      updateLoading({ save: false })
      updateAlert({ type: 'success', message: 'เพิ่มสำเร็จ!' })
      await close()
    } else {
      updateLoading({ save: false })
      updateAlert({ type: 'error', message: 'เพิ่มไม่สำเร็จ!' })
    }
  }
}

const close = async () => {
  isNewColor.value = false
  await $reset()
  emit('onClose', props.isEdit)
}

// watch(
//   () => state.color,
//   (newColor) => {
//     if (newColor === 'new') {
//       isNewColor.value = true
//       state.color = ''
//     }
//   }
// )

watch(
  () => props.car,
  (newCar) => {
    if (newCar) {
      // state.model = newCar.Model
      // state.make = newCar.Make
      // state.year = newCar.Year.toString()
      // state.color = newCar.Color
      // state.gear = newCar.Gear
      // state.dailyRate = newCar.DailyRate.toString()
      // state.subModel = newCar.SubModel
      // state.fuel = newCar.Fuel
      // state.door = newCar.Door.toString()
      // state.license = newCar.License
      // state.engine = newCar.Engine
      // state.image = newCar.Image
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
