
import { API_ENDPOINTS, deviceAdd } from "@/config/apiConfig"
import { successSwal } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const deviceList = async ({
  commit
}, page) => {
  commit('patientTabLoader', true)
  let url = page?.filter ? deviceAdd(page?.id) + page?.filter : deviceAdd(page?.id)
  try {
    let { data } = await api.get(url, null, null)
    commit('deviceList', data)
    commit('patientTabLoader', false)
  } catch (error) {
    console.log(error)
  }
}
export const addPatientInventory = async ({
  commit
}, record) => {
  let status = false
  commit('loading', true)
  commit('patientTabLoader', true)
  let url = deviceAdd(record?.id)
  try {
    let { data } = await api.post(url, record?.data, null)
    successSwal(data?.message)
    commit('patientTabLoader', false)
    commit('loading', false)
    status = true
  } catch (error) {
    commit('deviceEror', error?.response?.data)
    commit('patientTabLoader', false)
  }
  commit('loading', false)
  return status
}
export const serialNo = async ({
  commit
}) => {
  try {
    let { data } = await api.get(API_ENDPOINTS['manufacture'], null, null)
    commit('serialNo', data)
  } catch (error) {
    console.log(error)
  }
}
export const deviceDelete = async ({
  commit
}, record) => {
  let url = deviceAdd(record?.id) + '/' + record?.deleteId
  try {
    let { data } = await api.delete(url, null, null)
    successSwal(data?.message)
  } catch (error) {
    commit('deviceEror', error?.response?.data)
  }
}

