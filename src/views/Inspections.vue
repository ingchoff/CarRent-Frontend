<template>
  <div class="container mx-auto py-4 lg:py-10 text-center">
    <NewDialog
      title="เพิ่มรายการ"
      :isOpen="isOpen"
      :isEdit="false"
      @onClose="closeDialog"
    />
    <div class="flex justify-end mb-2">
      <Button
        class="bg-success px-4 py-2 rounded"
        :icon="'PlusCircleIcon'"
        @click="openDialog"
      >
        เพิ่ม
      </Button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-4">
      <div class="flex-row gap-4 p-4 bg-secondary rounded">
        <div class="flex-row mb-4">
          <div class="text-white">Services</div>
          <div class="border-t border-gray-200 my-4"></div>
          <ComboBox
            placeholder="เลือก services"
            v-model="state.seletedServices"
            :items="services"
          ></ComboBox>
          <div class="text-white mt-4">Book</div>
          <div class="border-t border-gray-200 my-4"></div>
          <ComboBox
            placeholder="เลือก books"
            v-model="state.seletedBooks"
            :items="books"
          ></ComboBox>
        </div>
        <div class="flex justify-center">
          <Button class="bg-primary text-white px-4 py-2 rounded border-0"
            >กรอง</Button
          >
        </div>
      </div>
      <div class="col-span-3">
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
              <tr v-for="ins in insStore.inspections" :key="ins.ID">
                <td class="text-start">
                  {{ dateTimeFormat(ins.InspectionDate, 'dd/MM/yyyy') }}
                </td>
                <td>{{ ins.Name }}</td>
                <td>{{ ins.Type }}</td>
                <td class="text-start">{{ ins.Mileage }}</td>
                <td class="text-start">{{ ins.Amount }}</td>

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
import { ComboBox, Table, Button, Icon } from '@/components'
import NewDialog from '@/components/inspection/NewDialog.vue'
import { useInspectionStore } from '@/stores'
import type { TInspection } from '@/types'
import { useDateFns, useForm, useLoading } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, onMounted, ref } from 'vue'

const services = ref<{ text: string; value: any }[]>([
  {
    text: 'น้ำมันเครื่อง',
    value: 'oil',
  },
  {
    text: 'น้ำมันเกียร์',
    value: 'gear_oil',
  },
  {
    text: 'น้ำมันเบรก',
    value: 'break_oil',
  },
  {
    text: 'กรองอากาศ',
    value: 'air_filter',
  },
  {
    text: 'กรองแอร์',
    value: 'air_filter2',
  },
  {
    text: 'ปัดน้ำฝน',
    value: 'rain_wiper',
  },
  {
    text: 'แบตเตอรี่',
    value: 'battery',
  },
  {
    text: 'หัวเทียน',
    value: 'spark_plug',
  },
  {
    text: 'ผ้าเบรก',
    value: 'brake',
  },
  {
    text: 'โช๊ค',
    value: 'shock',
  },
  {
    text: 'สายพราน',
    value: 'belt',
  },
])
const books = ref<{ text: string; value: string }[]>([
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
const isOpen = ref(false)

const headers = [
  { title: 'วันที่' },
  { title: 'ชื่อรายการ', class: 'text-center' },
  { title: 'ประเภท', class: 'text-center' },
  { title: 'ไมล์' },
  { title: 'ราคา' },
  { title: 'รายละเอียด', class: 'text-center' },
]

const { loading } = useLoading()
const insStore = useInspectionStore()
const { dateTimeFormat } = useDateFns()
const { state, form, $reset, $validate } = useForm(
  {
    seletedServices: [],
    seletedBooks: [],
    make: '',
    model: '',
  },
  computed(() => {
    return {
      seletedServices: { required },
      seletedBooks: { required },
      make: { required },
      model: { required },
    }
  })
)

const openDialog = () => {
  isOpen.value = true
}

const closeDialog = () => {
  isOpen.value = false
}

const getListInspections = async () => {
  await insStore.getInspections()
}

onMounted(async () => {
  await getListInspections()
})
</script>
