<template>
  <Dialog v-model="props.isOpen" :width="480">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div>
        <div class="grid grid-cols-6 gap-2 mt-4">
          <div class="col-span-3">
            <!-- <TextField
              label="ยี่ห้อ"
              v-model="state.make"
              :errors="form.make.$errors"
            ></TextField> -->
            <Select
              :items="[{ text: '---โปรดเลือก---', value: '' }, ...carNames]"
              label="ชื่อยี่ห้อ"
              v-model="state.make"
              :errors="form.make.$errors"
            ></Select>
          </div>
          <div class="col-span-3">
            <!-- <TextField
              label="ชื่อรุ่น"
              v-model="state.make"
              :errors="form.make.$errors"
            ></TextField> -->
            <Select
              :items="[{ text: '---โปรดเลือก---', value: '' }, ...carModels]"
              label="ชื่อยี่ห้อ"
              v-model="state.model"
              :errors="form.model.$errors"
            ></Select>
          </div>
          <div class="col-span-3">
            <TextField
              label="ปี"
              v-model="state.year"
              type="Number"
              placeholder="ปีค.ศ. (yyyy)"
              :prependIcon="'CalendarIcon'"
              :errors="form.year.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <Select
              v-if="!isNewColor"
              :items="[
                { text: '---โปรดเลือก---', value: '' },
                ...carColors,
                { text: '---สีอื่น---', value: 'new' },
              ]"
              label="สีรถ"
              v-model="state.color"
              :errors="form.color.$errors"
            ></Select>
            <TextField
              v-else
              label="สีรถ"
              v-model="state.color"
              :errors="form.color.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <Radio
              id="gear"
              v-model="state.gear"
              label="เกียร์"
              :items="[
                { text: 'Manual', value: 'manual' },
                { text: 'Auto', value: 'auto' },
              ]"
              :errors="form.gear.$errors"
            ></Radio>
          </div>
          <!-- <div class="col-span-3">
            <span class="text-left font-medium">เกียร์</span>
            <div class="flex justify-around">
              <div>
                <input
                  type="radio"
                  id="auto"
                  value="auto"
                  v-model="state.gear"
                />
                <label for="auto">auto</label>
              </div>
              <div class="flex-col">
                <div>
                  <input
                    type="radio"
                    id="manual"
                    value="manual"
                    v-model="state.gear"
                  />
                </div>
                <div><label for="manual">manual</label></div>
              </div>
            </div>
          </div> -->
          <div class="col-span-3 mt-4">
            <TextField
              label="ค่าเช่า/วัน"
              v-model="state.dailyRate"
              type="Number"
              :errors="form.dailyRate.$errors"
            ></TextField>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-actions flex justify-end gap-3">
      <Button @click="close">ยกเลิก</Button>
      <Button
        class="bg-primary text-white"
        :loading="loading.save"
        @click="save"
        >บันทึก</Button
      >
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog, TextField, Select, Radio } from '@/components'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import type { TCar } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'

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
const { state, form, $reset, $validate } = useForm(
  {
    make: '',
    model: '',
    year: '',
    color: '',
    dailyRate: '',
    gear: '',
  },
  computed(() => {
    return {
      make: { required },
      model: { required },
      year: { required },
      color: { required },
      dailyRate: { required },
      gear: { required },
    }
  })
)

const isNewColor = ref(false)
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
const carColors = ref<{ text: string; value: string }[]>([
  { text: 'Red', value: 'red' },
  { text: 'Blue', value: 'blue' },
  { text: 'Green', value: 'green' },
  { text: 'Black', value: 'black' },
  { text: 'White', value: 'white' },
])

const save = async () => {
  if (await $validate()) {
    updateLoading({ save: true })
    const addCar = await fetchWrapper.post(`${API_STOCK}/car/new`, {
      Model: state.model,
      Make: state.make,
      Color: state.color,
      Year: parseInt(state.year),
      DailyRate: parseFloat(state.dailyRate),
      Image: '',
      Gear: state.gear,
    })
    if (addCar) {
      updateLoading({ save: false })
      updateAlert({ type: 'success', message: 'เพิ่มรถสำเร็จ!' })
      await close()
    } else {
      console.log(addCar)
      updateLoading({ save: false })
      updateAlert({ type: 'error', message: 'เพิ่มรถไม่สำเร็จ!' })
    }
  }
}
const close = async () => {
  isNewColor.value = false
  await $reset()
  emit('onClose')
}

watch(
  () => state.color,
  (newColor) => {
    if (newColor === 'new') {
      isNewColor.value = true
      state.color = ''
    }
  }
)
</script>
