<template>
  <Table>
    <thead class="text-center">
      <tr>
        <th :class="item.class" v-for="item in headers" :key="item.title">
          {{ item.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading.getRentals">
        <td colspan="100%">
          <Icon type="custom" name="loading" class="mx-auto"></Icon>
        </td>
      </tr>
      <tr v-else-if="rentalStore.rentals.length === 0">
        <td colspan="100%" class="text-center">ไม่พบรายการ</td>
      </tr>
      <template v-else>
        <tr
          v-for="rental in rentalStore.rentals"
          :key="rental.ID"
          class="hover:bg-gray-100"
        >
          <td>
            <div class="tooltip">
              <Icon
                v-if="rental.Status === 'pending'"
                class="text-warning"
                name="ClockIcon"
                type="solid"
              ></Icon>
              <Icon
                v-else
                class="text-success"
                name="CheckCircleIcon"
                type="solid"
              ></Icon>
              <span class="tooltip-content center">{{ rental.Status }}</span>
            </div>
          </td>
          <td class="text-center">{{ rental.Name }}</td>
          <td class="text-center">
            {{ rental.Nid }}
          </td>
          <td class="text-center">{{ rental.Phone }}</td>
          <td class="text-end">
            {{ currencyFormat(numDays(rental)) }}
          </td>
          <td class="text-end">
            {{ currencyFormat(rental.TotalAmount) }}
          </td>
          <td class="text-end">
            {{ currencyFormat(rental.CarDelivery1) }}
          </td>
          <td class="text-end">
            {{ currencyFormat(rental.CarDelivery2) }}
          </td>
          <td class="text-center">
            {{ dateTimeFormat(rental.StartDate, 'dd/MM/yyyy') }}
          </td>
          <td class="text-center">
            {{ dateTimeFormat(rental.EndDate, 'dd/MM/yyyy') }}
          </td>
          <td class="text-end">
            {{ currencyFormat(rental.StartMile) }}
          </td>
          <td class="text-end">
            {{ currencyFormat(rental.EndMile) }}
          </td>
          <td class="text-end">
            {{ currencyFormat(rental.EndMile - rental.StartMile) }}
          </td>
          <td>
            <Button
              :icon="'InformationCircleIcon'"
              :solid="true"
              @click="
                emit('onShowInfo', {
                  title: 'โน๊ตลูกค้า',
                  content: rental.CustomerNote,
                })
              "
            ></Button>
          </td>
          <td>
            <Button
              :icon="'InformationCircleIcon'"
              :solid="true"
              @click="
                emit('onShowInfo', {
                  title: 'หมายเหตุ',
                  content: rental.Detail,
                })
              "
            ></Button>
          </td>
          <td>
            <Button
              :icon="'PencilAltIcon'"
              :solid="true"
              @click="emit('openEdit', { data: rental, action: 'edit' })"
            ></Button>
          </td>
        </tr>
      </template>
    </tbody>
  </Table>
</template>
<script lang="ts" setup>
import { useRentalStore } from '@/stores'
import { useCommon, useDateFns, useLoading } from '@/utils'
import { Table, Icon, Button } from '@/components'
import type { TRental } from '@/types/rental'

const emit = defineEmits()
const { currencyFormat } = useCommon()
const { dateTimeFormat } = useDateFns()
const { loading, updateLoading } = useLoading()
const rentalStore = useRentalStore()
const headers = [
  { title: 'สถานะ' },
  { title: 'ชื่อลูกค้า', class: 'text-center' },
  { title: 'เลขบัตรปชช', class: 'text-center' },
  { title: 'เบอร์โทร', class: 'text-center' },
  { title: 'เช่า(วัน)', class: 'text-end' },
  { title: 'ค่าเช่า', class: 'text-end' },
  { title: 'ค่าส่งรถ', class: 'text-end' },
  { title: 'ค่ารับรถ', class: 'text-end' },
  { title: 'วันที่ส่งรถ', class: 'text-center' },
  { title: 'วันที่รับรถ', class: 'text-center' },
  { title: 'ไมค์ส่งรถ', class: 'text-end' },
  { title: 'ไมค์รับรถ', class: 'text-end' },
  { title: 'ระยะทาง', class: 'text-end' },
  { title: 'โน๊ตลูกค้า' },
  { title: 'หมายเหตุ' },
  { title: '' },
]

const numDays = (rental: TRental) => {
  const timeDiff =
    new Date(rental.EndDate).getTime() - new Date(rental.StartDate).getTime()
  let daysCount = Math.round(timeDiff / (1000 * 60 * 60 * 24))
  return daysCount
}
</script>
