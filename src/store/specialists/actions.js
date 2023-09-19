
import { API_ENDPOINTS } from '../../config/apiConfig';
import api from '@/services/api';
export const specialists = async ({ commit }, page) => {
  let link = page ? API_ENDPOINTS['specialists'] + page : API_ENDPOINTS['specialists']
  commit('loadingTableStatus', true)
  try {
    const { data } = await api.get(link, null, null)
    commit('SPECIALISTS', data);
  } catch (error) {
    commit('SPECIALISTS_ERROR', error);
  }
  commit('loadingTableStatus', false)
}


export const specialistSummary = async ({ commit }, id) => {
  commit('loadingTableStatus', true)
  commit('loadingDetails',true);
  try {
    const { data } = await api.get(`${API_ENDPOINTS['specialists']}/${id}`)
    commit('SPECIALIST_SUMMARY', data?.data);
  } catch (error) {
    commit('SPECIALISTS_ERROR', error);
  }
  commit('loadingTableStatus', false)
  commit('loadingDetails',false);
}
