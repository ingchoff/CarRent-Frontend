<template>
  <label
    v-if="label"
    class="text-left font-medium"
    :class="{ 'text-white': textWhite }"
  >
    {{ label }}
  </label>
  <v-date-picker
    v-model="modelValue.$model"
    color="indigo"
    :mode="mode"
    locale="th"
    :is-range="isRange"
    :min-date="min"
    :max-date="max"
  >
    <template v-slot="{ inputValue, togglePopover, inputEvents }">
      <div v-if="isRange" class="flex justify-center items-center">
        <div class="relative flex-grow">
          <Icon
            name="CalendarIcon"
            class="absolute w-5 h-full left-2 pointer-events-none"
            :class="{ 'opacity-50': attrs.disabled !== undefined }"
          />
          <input
            autocomplete="false"
            :placeholder="placeholder"
            :id="`${id}-start`"
            :value="inputValue.start"
            v-on="inputEvents.start"
            class="flex-grow pl-8"
            :class="{ error: errors.length }"
            v-bind="attrs"
          />
        </div>
        <Icon name="ArrowRightIcon" class="w-6 h-6 mx-2" />
        <div class="relative flex-grow">
          <Icon
            name="CalendarIcon"
            class="absolute w-5 h-full left-2 pointer-events-none"
            :class="{ 'opacity-50': attrs.disabled !== undefined }"
          />
          <input
            autocomplete="false"
            :placeholder="placeholder"
            :id="`${id}-end`"
            :value="inputValue.end"
            v-on="inputEvents.end"
            :class="{ error: errors.length }"
            class="flex-grow pl-8"
            v-bind="attrs"
          />
        </div>
      </div>
      <div v-else class="relative flex-grow">
        <Icon
          :name="mode === 'time' ? 'ClockIcon' : 'CalendarIcon'"
          class="absolute w-5 h-full left-2 pointer-events-none"
          :class="{ 'opacity-50': attrs.disabled !== undefined }"
        />
        <input
          autocomplete="false"
          :placeholder="placeholder"
          :id="id"
          :value="inputValue"
          v-on="inputEvents"
          :class="{ error: errors.length }"
          class="flex-grow pl-8"
          v-bind="attrs"
        />
      </div>
    </template>
  </v-date-picker>
  <div v-if="!hideDetails" class="input-error">
    <span v-if="errors.length">{{ errors[0].$message }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import Icon from '@/components/common/Icon.vue'
import { onBeforeMount, ref, toRefs, useAttrs, watch } from 'vue'
interface IProps {
  id?: string
  label?: string
  placeholder?: string
  modelValue: any
  min?: string | Date | number
  max?: string | Date | number
  isRange?: boolean
  mode?: 'date' | 'dateTime' | 'time'
  hideDetails?: boolean
  errors?: ErrorObject[]
  textWhite?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  id: 'date-picker',
  mode: 'date',
  isRange: false,
  errors: () => [],
})
const {
  id,
  modelValue,
  min,
  max,
  isRange,
  mode,
  hideDetails,
  label,
  placeholder,
  textWhite,
} = toRefs(props)
const emit = defineEmits(['update:modelValue', 'keypressEnter'])
const attrs = useAttrs()
const dateValue = ref()
onBeforeMount(() => {
  dateValue.value = modelValue.value
})
watch(modelValue, (newV) => {
  dateValue.value = newV
})
watch(dateValue, (newV) => {
  emit('update:modelValue', newV)
})
</script>
