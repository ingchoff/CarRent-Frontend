<template>
  <div class="relative" :class="{ 'flex self-center': isSelfCenter }">
    <label v-if="label" class="text-left font-medium" :class="$attrs.class">
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
      <span
        v-else-if="prependText"
        class="absolute h-full top-0 flex items-center left-2 pointer-events-none"
      >
        {{ prependText }}
      </span>
      <input
        :value="modelValue"
        class="flex-grow"
        :class="[
          filteredClasses,
          {
            error: errors.length,
            'pl-8': prependIcon,
            'pr-8': appendIcon,
          },
        ]"
        :type="type"
        aria-autocomplete="none"
        autocomplete="off"
        step="any"
        @blur="blur"
        @focus="focus"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @keypress="keypressAction($event)"
        @keypress.enter="emit('keypressEnter')"
      />
      <Icon
        v-if="appendIcon"
        :name="appendIcon"
        class="absolute w-5 h-full top-0 flex items-center right-2"
        :class="{
          'opacity-50': attrs.disabled,
          'pointer-events-none': !['EyeIcon', 'EyeOffIcon'].includes(
            appendIcon
          ),
          'cursor-pointer': ['EyeIcon', 'EyeOffIcon'].includes(appendIcon),
        }"
        :type="appendIconType"
        @click="emit('appendAction')"
      />
      <div
        v-else-if="appendText"
        class="absolute h-full top-0 flex items-center right-2 pointer-events-none"
      >
        {{ appendText }}
      </div>
    </div>
    <div v-if="!hideDetails" class="input-error">
      <span v-if="errors.length">{{ errors[0].$message }}</span>
    </div>
    <section
      v-if="autocomplete && autocomplete.length > 0 && isOpen"
      class="autocomplete divide-y"
    >
      <div
        v-for="(item, index) in autocomplete"
        :key="index"
        :class="{ active: item.value === modelValue }"
        class="px-4 py-2 flex items-center justify-between"
        @click="update(item.value)"
      >
        {{ item.text }}
        <Icon
          v-if="item.value === modelValue"
          name="CheckCircleIcon"
          :solid="true"
          class="w-5 h-5"
        />
      </div>
    </section>
  </div>
  <div class="sr-only"></div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useAttrs, type Ref } from 'vue'
import Icon from '@/components/common/Icon.vue'
import { useCommon } from '@/utils'
interface ErrorObject {
  $propertyPath?: string
  $property?: string
  $validator?: string
  $message: string | Ref<string>
  $params?: object
  $pending?: boolean
  $response?: any
  $uid?: string
}
interface IProps {
  modelValue: any
  prependText?: string
  prependIcon?: string
  prependIconType?: 'outline' | 'solid' | 'custom'
  appendText?: string
  appendIcon?: string
  appendIconType?: 'outline' | 'solid' | 'custom'
  hideDetails?: boolean
  autocomplete?: { text: string; value: any }[]
  type?: string
  errors?: ErrorObject[]
  label?: string
  isSelfCenter?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  maxlength: 524288,
  type: 'text',
  errors: () => [],
  prependIconType: 'outline',
  appendIconType: 'outline',
})

const {
  modelValue,
  prependText,
  prependIcon,
  appendText,
  appendIcon,
  hideDetails,
  autocomplete,
  type,
  label,
  isSelfCenter,
} = toRefs(props)

const emit = defineEmits(['update:modelValue', 'appendAction', 'keypressEnter'])
const attrs = useAttrs()
const { sleep, verifyNumber, verifyDigit } = useCommon()
const isOpen = ref(false)

const focus = () => {
  isOpen.value = true
}
const blur = async () => {
  await sleep(200)
  isOpen.value = false
}
const update = async (value: any) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
const keypressAction = (event: {
  keyCode?: number
  which: number
  preventDefault: () => void
}) => {}
const filteredClasses = computed(() => {
  const classList =
    typeof attrs.class === 'string' ? attrs.class.split(' ') : []
  return classList.filter((cls: string) => cls !== 'text-white').join(' ')
})
</script>
