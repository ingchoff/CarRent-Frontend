export type TAlert = {
  type: string
  message: string
  props?: Record<string, string | number>
}
export type TStateAlert = {
  alert: TAlert[]
  uiVersion: string | null
}

export type TLoading = {
  [key: string]: boolean
}
export type TStateLoading = {
  loading: TLoading
}
export type TProduct = {
  id: number
  name: string
  barcode: string
}
