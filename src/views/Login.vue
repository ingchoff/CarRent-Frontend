<template>
  <div
    class="h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 -mt-20"
  >
    <div class="max-w-md w-full text-center">
      <div class="px-0">
        <p class="text-2xl mb-6">เข้าสู่ระบบ</p>
      </div>
      <div>
        <form @submit.prevent="submitSignInForm">
          <TextField
            v-model="state.username"
            label="Username"
            placeholder="username"
            prependIcon="UserIcon"
            :errors="form.username.$errors"
            @keypress="validateNoThaiChar"
          ></TextField>
          <TextField
            id="input-password"
            :type="passwordType ? 'text' : 'password'"
            v-model="state.password"
            label="Password"
            placeholder="password"
            prependIcon="LockClosedIcon"
            :appendIcon="passwordType ? 'EyeIcon' : 'EyeOffIcon'"
            :appendAction="showPass"
            :errors="form.password.$errors"
            @appendAction="showPass"
            @keypress="validateNoThaiChar"
          >
          </TextField>

          <Button
            id="submit"
            type="submit"
            :loading="loading.login"
            class="bg-primary text-white w-full"
          >
            Login
          </Button>
          <Button
            class="bg-secondary text-white w-full mt-2"
            @click="$router.push('/register')"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { TextField, Button } from '@/components'
import { required } from '@/utils/useValidators'
import { useRouter } from 'vue-router'
import { useCommon, useForm, useLoading } from '@/utils'
import { useAuthStore } from '@/stores'

const passwordType = ref(false)
const { loading, updateLoading } = useLoading()
const { validateNoThaiChar } = useCommon()
const authStore = useAuthStore()

const { state, form } = useForm(
  { username: '', password: '' },
  { username: { required }, password: { required } }
)

const router = useRouter()
const submitSignInForm = async () => {
  if (!(await form.value.$validate())) return
  updateLoading({ login: true })
  await authStore.login(state.username, state.password)
  updateLoading({ login: false })
  router.push('/amazon')
}

const showPass = () => {
  passwordType.value = !passwordType.value
}
</script>
