import serviceMethod from '@/services/serviceMethod';
import { successSwal, errorLogWithDeviceInfo } from '@/commonMethods/commonMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"

export const unprocessedCommunications = async ({commit},page) => {
  let link = page ?API_ENDPOINTS['communicationInbound']+page : API_ENDPOINTS['communicationInbound']
  commit('loadingStatus', true)
  await serviceMethod.common("get", link, null, null).then((response) => {
    commit('unprocessedCommunications', response.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
        if (error.response.status === 422) {
          commit('errorMsg', error.response.data)
          commit('loadingStatus', false)
        }
        else if (error.response.status === 500) {
          commit('loadingStatus', false)
        }
        else if (error.response.status === 401) {
          commit('loadingStatus', false)
        }
			}
      else {
				errorLogWithDeviceInfo(error);
			}
  })
}

export const updateUnprocessedCommunications = async ({commit}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['communicationInbound']+`/${data.recordId}?communicationId=${data.communicationId}`, null, null).then((response) => {
    commit('loadingStatus', false)
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
        if (error.response.status === 422) {
          commit('errorMsg', error.response.data)
          commit('loadingStatus', false)
        }
        else if (error.response.status === 500) {
          commit('loadingStatus', false)
        }
        else if (error.response.status === 401) {
          commit('loadingStatus', false)
        }
			}
      else {
				errorLogWithDeviceInfo(error);
			}
  })
}