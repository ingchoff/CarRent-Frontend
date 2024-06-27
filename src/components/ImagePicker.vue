<template>
  <div class="rounded-lg shadow-lg bg-gray-50 lg:w-2/2">
    <div class="p-4">
      <label class="inline-block mb-2 text-gray-500"
        >Upload Image(jpg, png, jpeg)</label
      >
      <div class="flex items-center justify-center w-full">
        <label
          v-if="(!haveImg && !props.prevImg) || !file"
          class="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300"
        >
          <div class="flex flex-col items-center justify-center pt-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 text-gray-400 group-hover:text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              />
            </svg>
            <p
              class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"
            >
              Select a photo
            </p>
          </div>
          <input type="file" class="opacity-0" @change="selectedFile" />
        </label>
        <img v-else class="mt-4 size-72 object-cover" :src="imgUrl" />
      </div>
    </div>
    <div class="flex p-4 space-x-4 justify-center">
      <Button @click="cancel">ยกเลิก</Button>
      <!-- <ConfirmDialog :haveImg="haveImg" :file="file" @fetch="cancel" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components'
import { useAlert } from '@/utils'
import { getApp } from 'firebase/app'
import { deleteObject, getStorage, ref as stRef } from 'firebase/storage'
import { ref } from 'vue'

interface IProps {
  prevImg?: string
  isUpdate: boolean
}
const props = defineProps<IProps>()

const firebaseApp = getApp()
const storage = getStorage(firebaseApp, 'gs://ocrcard-a14f6.appspot.com')
const { updateAlert } = useAlert()
const emit = defineEmits(['selectImage'])

const file = ref()
const imgUrl = ref<string>('')
const haveImg = ref(false)

const selectedFile = (event: any) => {
  const fileSelected = event.target.files[0]
  file.value = event.target.files[0]
  const filetype = fileSelected['type'].split('/')[1]
  if (filetype === 'jpeg' || filetype === 'png') {
    haveImg.value = true
    imgUrl.value = URL.createObjectURL(fileSelected)
    console.log(file.value)
    emit('selectImage', file.value, props.isUpdate)
  } else {
    updateAlert({ type: 'warning', message: 'Not supported file!' })
  }
}

const cancel = async () => {
  if (props.isUpdate) {
    console.log(1)
    file.value = undefined
    haveImg.value = false
    emit('selectImage', undefined, props.isUpdate)
  } else {
    file.value = undefined
    imgUrl.value = ''
    haveImg.value = false
    emit('selectImage', file.value, props.isUpdate)
  }
}
</script>

<style lang="scss" scoped></style>
