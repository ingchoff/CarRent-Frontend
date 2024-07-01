<template>
  <header class="h-16">
    <div class="flex items-center justify-between container h-full py-3">
      <div class="grow">
        <router-link class="flex items-center items-center" to="/">
          <img class="w-10 h-auto" src="@/assets/logo.png" alt="" />
          <h1 class="text-xl font-medium">Car Rental</h1>
        </router-link>
      </div>
      <div class="nav-content" :class="{ flex: onShow }">
        <div class="cursor-pointer" v-for="item in menu" :key="item.header">
          <div
            class="flex items-center my-2 px-2 font-medium rounded duration-500 transform hover:bg-primary-lighten hover:text-white"
            :class="{
              'bg-primary text-white hover:bg-primary': $route.path == item.to,
            }"
            @click="$router.push(item.to)"
          >
            <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5" />
            <div class="ml-1 py-1">
              {{ item.header }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="authStore.token" class="ml-4">
        Hello, {{ authStore.user.Email }}
      </div>
      <Button v-if="authStore.token" class="warning ml-4" @click="logout"
        >Logout</Button
      >
      <Button
        class="sm:hidden ml-4 text-black"
        @click="onShow = !onShow"
        icon="MenuIcon"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon, Button } from '@/components'
import { useAuthStore } from '@/stores'
import router from '@/router'

const onShow = ref(false)
const authStore = useAuthStore()

const menu = [
  {
    header: 'จัดการรถ',
    icon: 'PhotographIcon',
    to: '/cars',
  },
  {
    header: 'About',
    icon: 'InformationCircleIcon',
    to: '/about',
  },
]

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: $secondary;
  color: white;
  z-index: 20;
}

.nav-content {
  display: flex;
  gap: 1rem;
}

@media screen and (max-width: 640px) {
  .nav-content {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 4rem;
    left: 0;
    width: 100%;
    background-color: $secondary;
    gap: 0;
  }
}
</style>
