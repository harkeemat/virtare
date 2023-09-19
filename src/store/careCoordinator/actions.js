
import {
  successSwal,
} from '@/commonMethods/commonMethod'
import { API_ENDPOINTS } from '../../config/apiConfig';
import api from '@/services/api';


export const staffs = async ({ commit }, page) => {
  let link = page ? API_ENDPOINTS['staff'] + page + `&type=staff` : API_ENDPOINTS['staff'] + `?type=staff`
  commit('loadingTableStatus', true)
  try {
    const { data } = await api.get(link)
    commit('staff', data);
  } catch (error) {
    commit('STAFF_ERROR', error)
  }
  commit('loadingTableStatus', false)
}
export const staffDetail = async ({
  commit
}, id) => {
  commit('STAFF_LOADER', true)
  try {
    const { data } = await api.get(API_ENDPOINTS['staff'] + `/${id}`)
    commit('STAFF_DETAIL', data?.data);
  } catch (error) {
    commit('STAFF_ERROR', error)
  }
  commit('STAFF_LOADER', false)
}
//multipale role assign to memebr 
export const addRoleStaff = async ({
  commit
}, record) => {
  try {
    const { data } = await api.post(`staff/${record?.staffId}/role`, record?.data)
    successSwal(data?.message)
  } catch (error) {
    commit('STAFF_ERROR', error)
  }
}

