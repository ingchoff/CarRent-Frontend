export type TInspection = {
  ID: number
  InspectionDate: string
  Mileage: number
  Name: string
  Service: string
  Description: string
  Amount: number
}

export type TLastest = {
  InspectionDate: string
  Mileage: number
  PercentDuration: number
  PercentMileage: number
}

export type TInspectionSummary = {
  [key: string]: TLastest
}

export type TResultInspectionSummary = {
  data: TInspectionSummary
}
