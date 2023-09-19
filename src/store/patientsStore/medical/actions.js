
import { medicalAdd } from "@/config/apiConfig"
import { successSwal, timeStamp } from '@/commonMethods/commonMethod'
import api from '@/services/api';

export const medicalList = async ({ commit }, page) => {
  try {
    commit('patientTabLoader', true)
    let url = page?.filter ? medicalAdd(page?.id) + page?.filter : medicalAdd(page?.id)
    const { data } = await api.get(url, null, null)
    commit('medicalList', data)
  } catch (error) {
    console.log(error)
  }
  commit('patientTabLoader', false)

}


//Add medical history 
export const addMedicalHistory = async ({
  commit
}, data) => {
  commit('loading', true)
  let status = false
  commit('patientTabLoader', true)
  let apiData = {
    data: { ...data?.data, diagnoseDate: timeStamp(data?.data?.diagnoseDate) }
  }
  let url = data?.medicalId ? medicalAdd(data?.id) + `/${data?.medicalId}` : medicalAdd(data?.id)
  let method = data?.medicalId ? api.put : api.post
  try {
    let { data } = await method(url, apiData?.data, null)
    successSwal(data?.message)
    status = true
  } catch (error) {
    console.log(error)
  }
  commit('loading', false)
  commit('patientTabLoader', false)
  return status
}
//medical Detail history
export const medicalHistoryDetail = async ({
  commit
}, data) => {
  commit('medicalLoader', true)
  const url = medicalAdd(data?.id) + `/${data?.medicalId}`
  try {
    const { data } = await api.get(url, null, null)
    commit('medicalDetail', data)
  } catch (error) {
    console.log(error)
  }
  commit('medicalLoader', false)
}
//medical Detail history
export const medicalHistoryDelete = async ({
  commit
}, data) => {
  commit('patientTabLoader', true)
  let url = medicalAdd(data?.id) + `/${data?.medicalId}`
  try {
    let { data } = await api.delete(url, null, null)
    successSwal(data?.message)
  } catch (error) {
    console.log(error)
  }
  commit('patientTabLoader', false)
}




