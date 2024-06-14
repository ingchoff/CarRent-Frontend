<template>
  <component :is="icon" />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import * as solid from '@heroicons/vue/solid'
import * as outline from '@heroicons/vue/outline'
import logo from '@/assets/logo.vue'
import loading from '@/assets/loading.vue'
interface IProps {
  name: string
  type?: 'outline' | 'solid' | 'custom'
}
const props = withDefaults(defineProps<IProps>(), {
  type: 'outline',
})

const icons = computed<any>(() => {
  return { solid, outline, custom: { logo, loading } }
})
const icon = computed(() => {
  return icons.value[props.type][props.name]
})
</script>
<style scoped lang="scss">
svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
