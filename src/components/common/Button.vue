<template>
  <button
    type="button"
    @click="push"
    :disabled="props.loading"
    class="items-center justify-center relative"
    :class="{
      'cursor-not-allowed': props.loading,
      plain: props.plain,
    }"
  >
    <svg
      v-if="props.loading"
      class="animate-spin h-5 w-5 absolute top-50 left-50"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <div
      :class="{ 'opacity-0': props.loading }"
      class="flex items-center justify-center"
    >
      <Icon
        v-if="props.icon"
        :name="props.icon"
        class="w-5 h-5"
        :class="{ 'mr-1': isSlot }"
      />
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/common/Icon.vue'
import type * as solid from '@heroicons/vue/solid'
import type * as outline from '@heroicons/vue/outline'
interface IProps {
  icon?: keyof typeof solid | keyof typeof outline
  solid?: boolean
  to?: object | string
  loading?: boolean
  plain?: boolean
}
const props = defineProps<IProps>()
const slots = useSlots()
const isSlot = !!slots.default

const router = useRouter()
const push = () => {
  if (props.to) {
    router.push(props.to)
  }
}
</script>
