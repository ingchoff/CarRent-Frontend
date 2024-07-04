<template>
  <label v-if="label" class="text-left font-medium">
    {{ label }}
  </label>
  <textarea
    v-bind="attrs"
    :value="modelValue"
    :class="{ error: errors.length }"
    :rows="rows"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  ></textarea>
  <div v-if="!hideDetails" class="input-error">
    <span v-if="errors.length">{{ errors[0].$message }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import { toRefs, useAttrs } from 'vue'

interface IProps {
  label?: string
  modelValue: any
  rows?: number
  errors?: ErrorObject[]
  hideDetails?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  rows: 4,
  errors: () => [],
  hideDetails: false,
})

const { modelValue, rows, label } = toRefs(props)

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
</script>
