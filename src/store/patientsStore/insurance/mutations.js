import {
	dateFormatClient
} from '@/commonMethods/commonMethod';
export const insuranceList = (state, data) => {
  state.insuranceList = data?.data
  state.insuranceMeta = data?.meta ? data?.meta?.pagination : ''
}
export const insuranceDetailFromUdid = (state,data) =>{
  data.data.startDate = dateFormatClient(data?.data?.startDate)
  data.data.endDate = dateFormatClient(data?.data?.endDate)
  state.insuranceDetailFromUdid = data?.data
}
export const errorInsurance = (state,data) =>{
state.errorInsurance = data
}