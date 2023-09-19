import serviceMethod from '@/services/serviceMethod';
import {  errorLogWithDeviceInfo,successSwal } from '@/commonMethods/commonMethod';
//import { API_ENDPOINTS } from "@/config/apiConfig"

export const toolTipSubmit = async ({commit},data) => {
commit('loadingTableStatus', true)  

await serviceMethod.common("put", "toolTip/"+data.id, null, data.data).then((response) => {
    
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

export const formRecords = async ({ commit },data) => {
  
  await serviceMethod.common("get", "form?screenId="+data.id, null, null).then((response) => {
    commit('formRecords', response.data.data);
    // successSwal(response.data.message)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    }
  })
}
export const getObject = async ({ commit },data) => {
  
  await serviceMethod.common("get", "toolTip" +"?refrenceId="+data.id+ "&refrenceType="+data.type, null, null).then((response) => {
    commit('getObject', response.data.data);
    // successSwal(response.data.message)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    }
  })
}
