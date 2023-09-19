import ServiceMethod from '@/services/serviceMethod'
import { API_ENDPOINTS } from "@/config/apiConfig"
import api from '@/services/api';
import { successSwal, errorSwal,errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'


export const validatehash = async ({ commit }, data) => {
	let response = await api.get(`validatehash/${data.id}/${data.token}`, null, data)
    commit('validatehash',response.data)
	return response
}

export const resetPassword = async ({ commit }, data) => {
	let status = false
	await ServiceMethod.common("post", API_ENDPOINTS['changePassword'], null, data).then((response) => {
    successSwal(response.data.message)
	status = true
    commit('errorMsg', null)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if(error.response.status == 422) {
      commit('errorMsg', error.response.data)
		}
		else if(error.response.status == 500) {
      errorSwal(error.response.data.message)
		}
		else if (error.response.status == 401) {
			//AuthService.logout()
		}
		commit('failure', error.response.data)
	})
	return status
}

export const forgotPassword = async ({ commit }, data) => {
	await ServiceMethod.common("post", API_ENDPOINTS['forgotPassword'], null, {email:data.email}).then((response) => {
    successSwal(response.data.message)
    commit('errorMsg', null)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if(error.response.status == 422) {
      commit('errorMsg', error.response.data)
		}
		else if(error.response.status == 500) {
      errorSwal(error.response.data.message)
		}
		else if (error.response.status == 401) {
			//AuthService.logout()
		}
		commit('failure', error.response.data)
	})
}

export const validateCode = async ({ commit }, data) => {
  commit('loadingStatus', true)
	await ServiceMethod.common("get", API_ENDPOINTS['validateCode']+`/${data}`, null, null).then((response) => {
    commit('validateCode', response.data.data)
    commit('errorMsg', null)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if(error.response.status == 404) {
      commit('validateCode', false)
      errorSwal('Invalid Code')
		}
		else if(error.response.status == 500) {
      commit('validateCode', false)
      errorSwal(error.response.data.message)
		}
		else if (error.response.status == 401) {
			//AuthService.logout()
		}
		commit('failure', error.response.data)
	})
	commit('loadingStatus', false)
}

export const setupPassword = async ({ commit }, data) => {
	let status = false
  commit('loadingStatus', true)
	await ServiceMethod.common("post", API_ENDPOINTS['setupPassword'], null, data).then((response) => {
    commit('errorMsg', null)
    successSwal(response.data.message)
    commit('loadingStatus', false)
		status = true
	})
	.catch((error) => {
		status = false
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if(error.response.status == 500) {
      errorSwal(error.response.data.message)
      commit('loadingStatus', false)
		}
		else if (error.response.status == 401) {
      commit('loadingStatus', false)
		}
		commit('failure', error.response.data)
    commit('loadingStatus', false)
	})
	return status
}