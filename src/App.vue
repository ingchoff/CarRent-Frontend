<template>
  <Header></Header>
  <RouterView />
  <Alert></Alert>
</template>

<script setup lang="ts">
import { Header, Alert } from '@/components'
import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
body,
#app {
  font-family: 'Inter', 'Noto Sans Thai', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 64px;
  background-color: #f3f4f6;
}
</style>
