import {
  dateFormatClient
} from '@/commonMethods/commonMethod';
export const medicalList = (state, data) => {
  state.medicalList = data?.data
  state.medicalMeta = data?.meta ? data?.meta?.pagination : ''
}
export const medicalDetail = (state, data) => {
  data.data.diagnoseDate = dateFormatClient(data?.data?.diagnoseDate)
  state.medicalDetail = data?.data
}
export const medicalLoader = (state, data) => {
  state.medicalLoader = data
}
