
import { patientsInsurance } from "@/config/apiConfig"
import { successSwal, timeStamp } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const insuranceList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
  let url = page?.filter ? patientsInsurance(page?.id) + page?.filter : patientsInsurance(page?.id)
  try {
    const { data } = await api.get(url)
    commit('insuranceList', data)
  } catch (error) {
    commit('errorInsurance', error)
  }
  commit('patientTabLoader', false)
}
export const patientsAddInsurance = async ({
  commit
}, record) => {
  let apiData = {
    data: { ...record?.data, startDate: timeStamp(record?.data?.startDate), endDate: timeStamp(record?.data?.endDate) }
  }
  let status = false
  commit('loading', true)
  commit('patientTabLoader', true)
  let url = record?.insuranceId ? patientsInsurance(record?.id) + `/${record?.insuranceId}` : patientsInsurance(record?.id)
  try {
    const { data } =  record?.insuranceId ? await api.put(url, apiData?.data) :await api.post(url, apiData?.data)
    successSwal(data?.message)
    status = true
  } catch (error) {
    commit('errorInsurance', error)
  }
  commit('loading', false)
  commit('patientTabLoader', false)
  return status
}
//Get insurance detail
export const insuranceDetailFromUdid = async ({
  commit
}, record) => {
  commit('patientTabLoader', true)
  let url = patientsInsurance(record?.id) + `/${record?.insuranceId}`
  try {
    const { data } = await api.get(url)
    commit('insuranceDetailFromUdid', data)
  } catch (error) {
    commit('errorInsurance', error)
  }
  commit('patientTabLoader', false)

}
//Delete insurance from patient
export const insuranceDeleteFromPatient = async ({
  commit
}, record) => {
  commit('patientTabLoader', true)
  let url = patientsInsurance(record?.id) + `/${record?.insuranceId}`
  try {
    const { data } = await api.delete(url)
    successSwal(data?.message)
  } catch (error) {
    commit('errorInsurance', error)
  }
  commit('patientTabLoader', false)

}




