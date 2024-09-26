<template>
  <label v-if="label" class="text-left font-medium" :class="$attrs.class">
    {{ label }}
  </label>
  <div class="flex my-2 gap-4">
    <div v-for="(item, index) in items" :key="index" class="flex items-center">
      <input
        :id="`${id}-${index}`"
        v-bind="attrs"
        :value="item.value"
        type="radio"
        :name="id"
        :checked="item.value === modelValue"
        @input="onInput($event)"
        class="focus:ring-transparent h-4 w-4 text-primary checked:border-secondary border-gray-200"
      />
      <label
        :for="`${id}-${index}`"
        class="ml-3 block text-sm font-medium text-gray-700"
        :class="$attrs.class"
        v-html="item.text"
      />
    </div>
  </div>
  <div v-if="!hideDetails" class="input-error">
    <span v-if="errors.length">{{ errors[0].$message }}</span>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  toRefs,
  withDefaults,
  useAttrs,
  watch,
} from 'vue'
import type { ErrorObject } from '@vuelidate/core'

interface IProps {
  label?: string
  modelValue: any
  items: { text: string; value: string }[]
  errors?: ErrorObject[]
  hideDetails?: boolean
  id?: string
}

const props = withDefaults(defineProps<IProps>(), {
  errors: () => [],
  items: () => [],
})

const { modelValue, items, id, label } = toRefs(props)
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

watch(modelValue, (newV) => {
  if (!newV) {
    const el = document.querySelector(
      `input[type="radio"]:checked`
    ) as HTMLInputElement
    if (el) el.checked = false
  }
})
</script>
