<template>
  <Dialog v-model="props.isOpen" :width="480">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div>
        <div class="grid grid-cols-6 gap-2">
          <div class="col-span-3">
            <DatePicker
              id="inspection-date"
              v-model="form.inspectionDate"
              label="วันที่"
              placeholder="dd/mm/yyyy"
              mode="date"
              :errors="form.inspectionDate.$errors"
            ></DatePicker>
          </div>
          <div class="col-span-3">
            <TextField
              label="ชื่อรายการ"
              v-model="state.name"
              :errors="form.name.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <TextField
              label="ไมล์"
              v-model="state.mileage"
              type="number"
              :errors="form.mileage.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <TextField
              label="ราคา"
              v-model="state.amount"
              type="number"
              :errors="form.amount.$errors"
            ></TextField>
          </div>
          <div class="col-span-3 text-center">
            <ComboBox
              label="ประเภท"
              placeholder="เลือกประเภท"
              v-model="state.type"
              :items="services"
              :errors="form.type.$errors"
            ></ComboBox>
          </div>
          <!-- <div class="col-span-3">
            <TextField
              label="ระยะเวลาที่ต้องเปลี่ยน(ปี)"
              v-model="state.duration"
              type="number"
              :errors="form.amount.$errors"
            ></TextField>
          </div> -->
          <div class="col-span-6">
            <TextArea
              label="รายละเอียด"
              v-model="state.description"
              :errors="form.description.$errors"
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
import { useCarStore, useInspectionStore } from '@/stores'
import type { TCar, TService } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'
import TextArea from '../Input/TextArea.vue'

interface IProps {
  title: string
  isEdit: boolean
  isOpen: boolean
  car?: TCar
  services: TService[]
}
const props = defineProps<IProps>()
const emit = defineEmits(['onClose'])

const { loading, updateLoading } = useLoading()
const { updateAlert } = useAlert()
const insStore = useInspectionStore()
const { state, form, $reset, $validate } = useForm(
  {
    inspectionDate: new Date(),
    mileage: '',
    name: '',
    type: {} as { text: string; value: string },
    description: '',
    amount: '',
  },
  computed(() => {
    return {
      inspectionDate: { required },
      mileage: { required },
      name: { required },
      type: { required },
      description: {},
      amount: { required },
    }
  })
)

const isNewColor = ref(false)
const services = ref<{ text: string; value: any }[]>([])

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

watch(
  () => props.services,
  (newServices) => {
    if (newServices) {
      newServices.map((s) => {
        services.value.push({ text: s.Name, value: s.Name })
      })
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
