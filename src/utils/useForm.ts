import useVuelidate, { type ValidationArgs } from '@vuelidate/core'
import { type ComputedRef, reactive, type Ref } from 'vue'

const useForm = <
  T extends object,
  Vargs extends
    | ValidationArgs
    | Ref<ValidationArgs>
    | ComputedRef<ValidationArgs>
>(
  data: T,
  rules: Vargs
) => {
  const state = reactive(data)
  const defaultState = JSON.parse(JSON.stringify(state))
  const form = useVuelidate(rules, state)

  const $reset = async () => {
    await Object.assign(state, defaultState)
    form.value.$reset()
  }

  const $validate = () => {
    return form.value.$validate()
  }

  return {
    state,
    defaultState,
    form,
    $reset,
    $validate,
  }
}

export default useForm
