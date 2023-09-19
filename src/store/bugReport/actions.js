import serviceMethod from '@/services/serviceMethod';
import {  errorLogWithDeviceInfo,successSwal } from '@/commonMethods/commonMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"

export const reportSubmit = async ({commit},data) => {
commit('loadingTableStatus', true)  

await serviceMethod.common("post", API_ENDPOINTS['bugReport'], null, data).then((response) => {
    commit('addReports', response.data);
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
        commit('loadingTableStatus', false)
			} else {
				errorLogWithDeviceInfo(error);
        commit('loadingTableStatus', false)
			}
  })
}
export const screensWeb = async ({commit},data) => {
  commit('loadingTableStatus', true)  

  await serviceMethod.common("get", 'bugScreen?type=Web', null, data).then((response) => {
      commit('screensWeb', response?.data?.data);
      
    }).catch((error) => {
      if (error.response) {
          errorLogWithDeviceInfo(error.response);
          commit('loadingTableStatus', false)
        } else {
          errorLogWithDeviceInfo(error);
          commit('loadingTableStatus', false)
        }
    })
  }

