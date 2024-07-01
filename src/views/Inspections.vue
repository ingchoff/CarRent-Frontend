<template>
  <div class="container mx-auto py-4 lg:py-10 text-center">
    <NewDialog
      :title="'เพิ่มรถให้เช่า'"
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
            label="services"
            v-model="state.seletedServices"
            :items="services"
          ></ComboBox>
          <div class="text-white">Book</div>
          <div class="border-t border-gray-200 my-4"></div>
          <ComboBox
            label="books"
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
            <tr v-else-if="inspections.length === 0">
              <td colspan="100%" class="text-center">No Inspections Found.</td>
            </tr>
            <template v-else>
              <tr v-for="ins in inspections" :key="ins.id">
                <td>{{ ins.inspectionDate }}</td>
                <td>{{ ins.name }}</td>
                <td class="text-center">{{ ins.type }}</td>
                <td class="text-center">{{ ins.amount }}</td>
                <td class="text-center">{{ ins.note }}%</td>
              </tr>
            </template>
          </tbody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComboBox, Table } from '@/components'
import NewDialog from '@/components/car/NewDialog.vue'
import type { TInspection } from '@/types'
import { useForm, useLoading } from '@/utils'
import { required } from '@/utils/useValidators'
import { computed, ref } from 'vue'

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
const inspections = ref<TInspection[]>([])
const isOpen = ref(false)

const headers = [
  { title: 'Date' },
  { title: 'Name', class: 'text-center' },
  { title: 'Type', class: 'text-center' },
  { title: 'Mileage' },
  { title: 'Amount' },
  { title: 'Note', class: 'text-center' },
]

const { loading } = useLoading()
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
</script>
