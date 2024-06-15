<template>
  <div
    class="h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 -mt-20"
  >
    <div class="max-w-md w-full text-center">
      <div class="px-0">
        <div class="grid grid-cols-12 mb-6">
          <div class="col-span-1">
            <Button
              class="bg-secondary text-white"
              @click="$router.go(-1)"
              icon="ArrowNarrowLeftIcon"
            >
            </Button>
          </div>
          <div class="col-span-11">
            <div class="text-2xl content-center">สมัครเข้าใช้งานระบบ</div>
          </div>
        </div>
      </div>
      <div>
        <form @submit.prevent="submitSignInForm">
          <TextField
            v-model="state.email"
            label="Email"
            placeholder="Email"
            prependIcon="MailIcon"
            :errors="form.email.$errors"
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
          <div class="grid grid-cols-6 gap-2">
            <div class="col-span-3">
              <TextField
                v-model="state.firstname"
                label="Firstname"
                placeholder="Firstname"
                prependIcon="UserIcon"
                :errors="form.firstname?.$errors"
              ></TextField>
            </div>
            <div class="col-span-3">
              <TextField
                v-model="state.lastname"
                label="Lastname"
                placeholder="Lastname"
                prependIcon="UserIcon"
                :errors="form.lastname?.$errors"
              ></TextField>
            </div>
          </div>
          <div class="grid grid-cols-6 gap-2">
            <div class="col-span-3">
              <TextField
                v-model="state.phone"
                label="Phone"
                placeholder="Phone"
                prependIcon="PhoneIcon"
                :errors="form.phone.$errors"
                @keypress="verifyDigit"
              ></TextField>
            </div>
            <div class="col-span-3">
              <Select
                :items="[{ text: '---Select---', value: '' }, ...roleList]"
                label="role"
                v-model="state.role"
                :errors="form.role.$errors"
              ></Select>
            </div>
          </div>
          <Button
            id="submit"
            type="submit"
            :loading="loading.register"
            class="bg-primary text-white w-full"
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
import { TextField, Button, Select } from '@/components'
import { required } from '@/utils/useValidators'
import { useRouter } from 'vue-router'
import { useAlert, useCommon, useForm, useLoading } from '@/utils'
import { fetchWrapper } from '@/helpers/fetchWrapper'
import { API_AUTH_TEST, API_STOCK } from '@/config'

const passwordType = ref(false)
const roleList = ref<{ text: string; value: string }[]>([
  { text: 'admin', value: 'admin' },
  { text: 'customer', value: 'customer' },
])
const { loading, updateLoading } = useLoading()
const { validateNoThaiChar, verifyDigit } = useCommon()
const { updateAlert } = useAlert()

const { state, form } = useForm(
  {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
    role: '',
  },
  {
    email: { required },
    password: { required },
    firstname: { required },
    lastname: { required },
    phone: { required },
    role: { required },
  }
)

const router = useRouter()
const submitSignInForm = async () => {
  if (!(await form.value.$validate())) return
  updateLoading({ register: true })
  await fetchWrapper.post(`${API_AUTH_TEST}/signup`, {
    email: state.email,
    password: state.password,
    firstname: state.firstname,
    lastname: state.lastname,
    phone: state.phone,
    role: state.role,
  })
  updateLoading({ register: false })
  updateAlert({ type: 'success', message: 'สมัครสำเร็จ' })
  router.push('/login')
}

const showPass = () => {
  passwordType.value = !passwordType.value
}
</script>
