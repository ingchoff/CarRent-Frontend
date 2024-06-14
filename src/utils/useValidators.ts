import * as validators from '@vuelidate/validators'
// or import { createI18nMessage } from '@vuelidate/validators'
const { createI18nMessage } = validators
// extract the `t` helper, should work for both Vue 2 and Vue 3 versions of vue-i18n
// pass `t` and create your i18n message instance

export const required = validators.required
export const email = validators.email
export const url = validators.url
export const sameAs =
  (validators.sameAs,
  {
    withArguments: true,
  })
export const minLength =
  (validators.minLength,
  {
    withArguments: true,
  })
export const maxLength =
  (validators.maxLength,
  {
    withArguments: true,
  })
export const minValue =
  (validators.minValue,
  {
    withArguments: true,
  })
export const maxValue =
  (validators.maxValue,
  {
    withArguments: true,
  })
export const between =
  (validators.between,
  {
    withArguments: true,
  })
export const numeric = validators.numeric

export const integer = validators.integer

export const decimal = validators.decimal

const twoDecimal = validators.helpers.regex(/^(\d+(\.\d{0,2})?|\.?\d{1,2})$/)
const sixDecimal = validators.helpers.regex(/^(\d+(\.\d{0,6})?|\.?\d{1,6})$/)
export const twoDecimalPlace = twoDecimal
export const sixDecimalPlace = sixDecimal
