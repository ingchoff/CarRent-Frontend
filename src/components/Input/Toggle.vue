<template>
  <label :for="id" class="flex items-center cursor-pointer mb-4">
    <div class="relative">
      <input
        :value="modelValue"
        type="checkbox"
        @input="emit('update:modelValue', !modelValue)"
        :id="id"
        class="sr-only"
      />
      <div
        class="block w-11 h-6 rounded-full border transition ease-in-out"
        :class="modelValue ? 'bg-primary' : 'bg-gray-50'"
      ></div>
      <div
        class="absolute top-0.5 left-0.5 bg-white border w-5 h-5 rounded-full transform transition ease-in-out"
        :class="{ 'translate-x-full': modelValue }"
      ></div>
    </div>
    <div v-if="label" class="text-left font-medium ml-3">
      {{ label }}
    </div>
  </label>
</template>

<script setup lang="ts">
import { toRefs, useAttrs, watch } from 'vue'
interface IProps {
  label?: string
  id?: string
  modelValue: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  id: 'toggle',
  modelValue: false,
})
const { modelValue, label } = toRefs(props)
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
watch(modelValue, (newV) => {
  if (!newV) {
    const el = document.querySelector(
      `input[type="checkbox"]:checked`,
    ) as HTMLInputElement
    if (el) el.checked = false
  }
})
</script>
