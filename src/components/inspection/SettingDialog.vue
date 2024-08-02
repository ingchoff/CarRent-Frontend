<template>
  <Dialog v-model="props.isOpen" :width="480">
    <div class="dialog-title divide-y">
      {{ title }}
    </div>
    <div class="dialog-text">
      <div>
        <div class="grid grid-cols-3 gap-4">
          <div class="col-start-2 font-bold">ระยะเวลา(ปี)</div>
          <div class="col-start-3 font-bold">ไมล์(กิโลเมตร)</div>
          <div
            v-for="service in props.services"
            class="grid grid-cols-3 col-span-3 gap-4"
          >
            <div class="text-end font-bold">{{ service.Name }}:</div>
            <div class="col-start-2">
              <TextField
                v-model="state.duration[service.Name]"
                type="number"
                :errors="form.duration.$errors"
              ></TextField>
            </div>
            <div class="col-start-3">
              <TextField
                v-model="state.mileage[service.Name]"
                type="number"
              ></TextField>
            </div>
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
import { Button, Dialog, TextField, ComboBox, DatePicker } from '@/components'
import { API_STOCK } from '@/config'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { useInspectionStore } from '@/stores'
import type { TService, TServiceSetting } from '@/types'
import { useForm, useLoading, useAlert } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref, watch } from 'vue'

interface IProps {
  title: string
  isEdit: boolean
  isOpen: boolean
  services: TService[]
}
const props = defineProps<IProps>()
const emit = defineEmits(['onClose'])

const { loading, updateLoading } = useLoading()
const { updateAlert } = useAlert()
const insStore = useInspectionStore()
const { state, form, $reset, $validate } = useForm(
  {
    duration: {} as TServiceSetting,
    mileage: {} as TServiceSetting,
  },
  computed(() => {
    return {
      duration: { required },
      mileage: { required },
    }
  })
)

const save = async () => {
  if (await $validate()) {
    updateLoading({ save: true })
    let dataUpdated: { [key: string]: TService[] } = {}
    let servicesUpdated: TService[] = props.services
    for (let i in props.services) {
      servicesUpdated[i].Duration = parseInt(
        state.duration[props.services[i].Name] as any
      )
      servicesUpdated[i].Mileage = parseInt(
        state.mileage[props.services[i].Name] as any
      )
    }
    dataUpdated['data'] = servicesUpdated
    await fetchWrapper.put(`${API_STOCK}/services/edit`, dataUpdated)
    updateLoading({ save: false })
    await close()
  }
}

const close = async () => {
  await $reset()
  emit('onClose')
}

watch(
  () => props.services,
  (newServices) => {
    if (newServices) {
      newServices.map((s) => {
        state.duration[s.Name] = s.Duration
        state.mileage[s.Name] = s.Mileage
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
