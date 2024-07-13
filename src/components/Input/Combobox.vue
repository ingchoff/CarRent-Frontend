<template>
  <Combobox v-model="selected" nullable>
    <ComboboxLabel v-if="label">{{ label }}</ComboboxLabel>
    <!-- <ul v-if="selected.length > 0">
      <li v-for="person in selected" :key="person.text" class="text-white">
        {{ person.text }}
      </li>
    </ul> -->
    <div class="relative">
      <ComboboxInput
        :placeholder="props.placeholder"
        v-bind="attrs"
        class="w-full h-auto pr-10 leading-6 text-gray-900"
        :class="{ error: errors.length }"
        :displayValue="(person:any) => person?.text"
        @change="query = $event.target.value"
      />
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center pr-2 border-0"
      >
        <Icon name="ChevronDownIcon" class="w-4 h-4" />
      </ComboboxButton>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div
            v-if="filteredData.length === 0 && query !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
          >
            Nothing found.
          </div>

          <ComboboxOption
            v-for="item in filteredData"
            as="template"
            :key="item.value"
            :value="item"
            v-slot="{ selected, active }"
          >
            <li
              class="relative cursor-default select-none py-2 pr-4"
              :class="{
                'bg-primary text-white': active,
                'text-gray-900': !active,
              }"
            >
              <span
                class="truncate"
                :class="{
                  'font-medium': selected,
                  'font-normal': !selected,
                }"
              >
                {{ item.text }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active }"
              >
                <Icon name="CheckIcon" class="h-5 w-5 text-primary" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
  <div v-if="!hideDetails" class="input-error">
    <span v-if="errors.length">{{ errors[0].$message }}</span>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, toRefs, useAttrs, watch } from 'vue'
import {
  Combobox,
  ComboboxLabel,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { Icon } from '@/components'
import type { ErrorObject } from '@vuelidate/core'
interface IProps {
  label?: string
  placeholder?: string
  modelValue: any
  items: { text: string; value: any }[]
  hideDetails?: boolean
  errors?: ErrorObject[]
}
const props = withDefaults(defineProps<IProps>(), {
  errors: () => [],
  hideDetails: false,
})
const { modelValue, items } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'keypressEnter'])
const attrs = useAttrs()

const selected = ref(modelValue.value)

let query = ref('')

let filteredData = computed(() =>
  query.value === ''
    ? items.value
    : items.value.filter((person: { text: string; value: any }) =>
        person.text
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)

watch(
  () => selected.value,
  (newV) => {
    if (newV) {
      emit('update:modelValue', newV)
    }
  }
)
watch(modelValue, (newV) => {
  selected.value = newV
})
</script>
