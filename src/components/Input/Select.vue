<template>
  <div>
    <label
      v-if="label"
      class="text-left font-medium"
      :class="`text-${props.labelColor ? props.labelColor : 'black'}`"
    >
      {{ label }}
    </label>
    <div class="relative flex-grow">
      <Icon
        v-if="prependIcon"
        :name="prependIcon"
        class="absolute w-5 h-full top-0 left-2 pointer-events-none"
        :class="{ 'opacity-50': attrs.disabled }"
        :type="prependIconType"
      />
      <select
        :value="modelValue"
        v-bind="attrs"
        class="cursor-pointer flex-grow pr-8"
        :class="{ error: errors.length, 'pl-8': prependIcon }"
        @keypress.enter="emit('keypressEnter')"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      >
        <option
          v-for="(item, index) in items"
          :key="index"
          :value="item.value"
          v-html="item.text"
        />
      </select>
    </div>
    <div v-if="!hideDetails" class="input-error">
      <span v-if="errors.length">{{ errors[0].$message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import type { ErrorObject } from '@vuelidate/core'
import { toRefs, useAttrs } from 'vue'
interface IProps {
  label?: string
  labelColor?: string
  modelValue: any
  items: { text: string; value: any }[]
  errors?: ErrorObject[]
  prependIcon?: string
  prependIconType?: 'outline' | 'solid' | 'custom'
  hideDetails?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  errors: () => [],
  prependIconType: 'outline',
})
const { modelValue, items, errors, prependIcon, hideDetails, label } =
  toRefs(props)
const emit = defineEmits(['update:modelValue', 'keypressEnter'])
const attrs = useAttrs()
</script>
