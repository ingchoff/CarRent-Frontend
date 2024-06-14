<template>
  <Teleport to="body">
    <TransitionGroup name="list" tag="div">
      <div
        v-for="(item, index) in alert"
        :key="index"
        :class="className(item.type)"
        :style="`top:${index * 54 + 4}px`"
      >
        <div class="flex items-center">
          <Icon
            v-if="iconName(item.type)"
            :name="iconName(item.type)"
            type="solid"
            class="w-5 h-5 mx-2"
            :class="`text-white`"
          />
          {{ item.message }}
        </div>
        <Icon
          name="XIcon"
          class="w-3 h-3 ml-2 cursor-pointer"
          @click="removeAlert(item)"
        ></Icon>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import Icon from '@/components/common/Icon.vue'
import { useAlert } from '@/utils'

const { alert, removeAlert } = useAlert()

const iconName = (type: string) => {
  switch (type) {
    case 'error':
      return 'XCircleIcon'
    case 'warning':
      return 'ExclamationIcon'
    case 'success':
      return 'CheckCircleIcon'
    default:
      return 'InformationCircleIcon'
  }
}

const className = (type: String) => {
  switch (type) {
    case 'error':
      return 'alert alert-error fixed right-1'
    case 'warning':
      return 'alert alert-warning fixed right-1'
    case 'success':
      return 'alert alert-success fixed right-1'
    default:
      return 'alert fixed right-1'
  }
}
</script>
<style scoped></style>
