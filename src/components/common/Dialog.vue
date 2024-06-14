<template>
  <Teleport to="body">
    <div
      v-if="props.modelValue"
      class="flex items-center fixed inset-0 z-50 bg-gray-500 bg-opacity-75"
      tabindex="0"
    >
      <div
        class="dialog mx-3 sm:m-auto animate-slide-y divide-y"
        :style="{
          'max-width': props.width + 'px',
        }"
      >
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface IProps {
  modelValue: boolean
  width?: number
  height?: number
}
const props = withDefaults(defineProps<IProps>(), {
  width: 360,
})
</script>
