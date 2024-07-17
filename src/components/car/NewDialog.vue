<template>
  <Dialog v-model="props.isOpen" :width="480">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div>
        <ImagePicker
          :isUpdate="props.isEdit"
          :prevImg="props.car?.Image"
          @selectImage="getImgUrl"
        ></ImagePicker>
        <div class="grid grid-cols-6 gap-2 mt-4">
          <div class="col-span-3">
            <TextField
              label="เลขทะเบียน"
              v-model="state.license"
              :errors="form.license.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <Select
              v-if="!isNewMake"
              :items="[
                { text: '---โปรดเลือก---', value: '' },
                ...props.carMakes,
                { text: '---ยี่ห้ออื่น---', value: 'new' },
              ]"
              label="ชื่อยี่ห้อ"
              v-model="state.make"
              :errors="form.make.$errors"
            ></Select>
            <TextField
              v-else
              label="ชื่อยี่ห้อ"
              v-model="state.make"
              :errors="form.make.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <Select
              v-if="!isNewModel"
              :items="[
                { text: '---โปรดเลือก---', value: '' },
                ...props.carModels,
                { text: '---รุ่นอื่น---', value: 'new' },
              ]"
              label="ชื่อรุ่น"
              v-model="state.model"
              :errors="form.model.$errors"
            ></Select>
            <TextField
              v-else
              label="ชื่อรุ่น"
              v-model="state.model"
              :errors="form.model.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <TextField
              label="รุ่นย่อย"
              v-model="state.subModel"
              placeholder="1.5G"
              :errors="form.subModel.$errors"
            ></TextField>
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
            <TextField
              label="ขนาดเครื่อง"
              v-model="state.engine"
              type="number"
              placeholder="1xxx"
              :errors="form.engine.$errors"
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
                { text: 'manual', value: 'manual' },
                { text: 'auto', value: 'auto' },
              ]"
              :errors="form.gear.$errors"
            ></Radio>
          </div>
          <div class="col-span-3">
            <TextField
              label="ประตู"
              v-model="state.door"
              type="Number"
              :errors="form.door.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
            <TextField
              label="เชื้อเพลง"
              v-model="state.fuel"
              :errors="form.fuel.$errors"
            ></TextField>
          </div>
          <div class="col-span-3">
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
        @click="save(props.isEdit)"
        >บันทึก</Button
      >
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog, TextField, Select, Radio } from '@/components'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useCarStore } from '@/stores'
import type { TCar } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'
import ImagePicker from '../ImagePicker.vue'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as stRef,
  uploadBytes,
} from 'firebase/storage'
import { getApp } from 'firebase/app'

interface IProps {
  title: string
  isEdit: boolean
  isOpen: boolean
  car?: TCar
  carMakes?: { text: string; value: string }[]
  carModels?: { text: string; value: string }[]
}
const props = defineProps<IProps>()
const emit = defineEmits(['onClose'])

const firebaseApp = getApp()
const storage = getStorage(firebaseApp, 'gs://ocrcard-a14f6.appspot.com')
const { loading, updateLoading } = useLoading()
const { updateAlert } = useAlert()
const carsStore = useCarStore()
const { state, form, $reset, $validate } = useForm(
  {
    make: '',
    model: '',
    subModel: '',
    year: '',
    color: '',
    dailyRate: '',
    gear: '',
    door: '',
    fuel: '',
    license: '',
    engine: '',
    image: '',
    createdAt: '',
  },
  computed(() => {
    return {
      make: { required },
      model: { required },
      subModel: { required },
      year: { required },
      color: { required },
      dailyRate: { required },
      gear: { required },
      door: { required },
      fuel: { required },
      license: { required },
      engine: { required },
      image: { required },
    }
  })
)

const isNewColor = ref(false)
const isNewMake = ref(false)
const isNewModel = ref(false)
const fileImg = ref()
const carColors = ref<{ text: string; value: string }[]>([
  { text: 'Red', value: 'red' },
  { text: 'Blue', value: 'blue' },
  { text: 'Green', value: 'green' },
  { text: 'Black', value: 'black' },
  { text: 'White', value: 'white' },
])

const uploadImage = async () => {
  const metadata = {
    contentType: 'image/jpeg',
  }
  if (fileImg.value) {
    const storageRef = stRef(storage, `CarRent/${fileImg.value.name}`)
    const uploadTask = await uploadBytes(storageRef, fileImg.value, metadata)
    if (uploadTask) {
      try {
        const downloadUrl = await getDownloadURL(storageRef)
        state.image = downloadUrl
        updateAlert({ type: 'success', message: 'อัพโหลดรูปสำเร็จ!' })
      } catch (error: any) {
        updateAlert({ type: 'error', message: error.code })
      }
    } else {
      updateAlert({ type: 'error', message: 'อัพโหลดรูปไม่สำเร็จ!' })
    }
  }
}

const deleteImage = async () => {
  if (!fileImg.value) {
    return
  } else {
    const url = new URL(state.image)
    const pathname = decodeURIComponent(url.pathname)
    const prevFileName = pathname.substring(pathname.lastIndexOf('/') + 1)
    const storageRef = stRef(storage, `CarRent/${prevFileName}`)
    try {
      await deleteObject(storageRef)
    } catch (error: any) {
      updateAlert({ type: 'error', message: error })
    }
  }
}

const save = async (isEdit: boolean) => {
  if ((await $validate()) && !isEdit) {
    updateLoading({ save: true })
    await uploadImage()
    const addCar = await fetchWrapper.post(`${API_STOCK}/car/new`, {
      Model: state.model,
      SubModel: state.subModel,
      Make: state.make,
      Color: state.color,
      Year: parseInt(state.year),
      DailyRate: parseFloat(state.dailyRate),
      Image: state.image,
      Gear: state.gear,
      Fuel: state.fuel,
      Engine: state.engine,
      Door: parseInt(state.door),
      License: state.license,
    })
    if (addCar) {
      updateLoading({ save: false })
      updateAlert({ type: 'success', message: 'เพิ่มรถสำเร็จ!' })
      await close()
    } else {
      updateLoading({ save: false })
      updateAlert({ type: 'error', message: 'เพิ่มรถไม่สำเร็จ!' })
    }
  } else if ((await $validate()) && isEdit) {
    updateLoading({ save: true })
    await deleteImage()
    await uploadImage()
    const updateCar = await fetchWrapper.put(
      `${API_STOCK}/car/${props.car?.ID}`,
      {
        Model: state.model,
        SubModel: state.subModel,
        Make: state.make,
        Color: state.color,
        Year: parseInt(state.year),
        DailyRate: parseFloat(state.dailyRate),
        Image: state.image,
        Gear: state.gear,
        Fuel: state.fuel,
        Engine: state.engine,
        Door: parseInt(state.door),
        License: state.license,
        CreatedAt: state.createdAt,
      }
    )
    if (updateCar) {
      updateLoading({ save: false })
      updateAlert({ type: 'success', message: 'เพิ่มรถสำเร็จ!' })
      await close()
    } else {
      updateLoading({ save: false })
      updateAlert({ type: 'error', message: 'เพิ่มรถไม่สำเร็จ!' })
    }
  }
}

const close = async () => {
  isNewColor.value = false
  isNewMake.value = false
  isNewModel.value = false
  await $reset()
  emit('onClose', props.isEdit)
}

const getImgUrl = async (file: any, isUpdated: boolean) => {
  if (!isUpdated) {
    state.image = file.name
    fileImg.value = file
  } else {
    fileImg.value = file
  }
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

watch(
  () => state.make,
  (newMake) => {
    if (newMake === 'new') {
      isNewMake.value = true
      state.make = ''
    }
  }
)

watch(
  () => state.model,
  (newModel) => {
    if (newModel === 'new') {
      isNewModel.value = true
      state.model = ''
    }
  }
)

watch(
  () => props.car,
  (newCar) => {
    if (newCar) {
      state.model = newCar.Model
      state.make = newCar.Make
      state.year = newCar.Year.toString()
      state.color = newCar.Color
      state.gear = newCar.Gear
      state.dailyRate = newCar.DailyRate.toString()
      state.subModel = newCar.SubModel
      state.fuel = newCar.Fuel
      state.door = newCar.Door.toString()
      state.license = newCar.License
      state.engine = newCar.Engine
      state.image = newCar.Image
      state.createdAt = newCar.CreatedAt
    }
  }
)
</script>
