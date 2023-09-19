import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal,errorLogWithDeviceInfo} from '@/commonMethods/commonMethod'

export const cptCodesList = async ({ commit },page) => {
	commit('loadingStatus', true)
	let link = page? API_ENDPOINTS['activeCptCodes']+"?active=1"+page: API_ENDPOINTS['activeCptCodes']+"?active=1"
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		
		commit('cptCodeActivities', response.data);
		commit('loadingStatus', false)
		
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('loadingStatus', false)
		commit('errorMsg', error.response.data)

	})
}

export const activitiesList = async ({ commit }) => {
	commit('timeLogLoaderStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['activitiesList'], null, null).then((response) => {
		commit('activitiesList', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
			errorLogWithDeviceInfo(error.response);
		} else {
			errorLogWithDeviceInfo(error);
		}
		commit('errorMsg', error.response.data)
	})
	commit('timeLogLoaderStatus', false)
}

export const addCptCode = async ({ commit }, data) => {

	await ServiceMethodService.common("post", API_ENDPOINTS['cptCodes'], null, data).then((response) => {
		successSwal(response.data.message)
		commit('addCptCode', response.data.data);

	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		// errorSwal(error.response.data.message)
		commit('errorMsg', error.response.data)
	})
}

export const deleteCptCode = async ({ commit }, id) => {
	await ServiceMethodService.common("delete", API_ENDPOINTS['cptCodes'], id, null).then((response) => {
		
		successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('errorMsg', error.response.data)
	})
}

export const cptCodeDetails = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['cptCodes'], id, null).then((response) => {
		commit('cptCodeDetails', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('errorMsg', error.response.data)
	})
}

export const updateCptCode = async ({ commit }, data) => {

	await ServiceMethodService.common("put", API_ENDPOINTS['cptCodes'], data.id, data.data).then((response) => {
		
		successSwal(response.data.message)
		commit('updateCptCode', response.data.data);

	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('errorMsg', error.response.data)
	})
}
export const serviceList = async ({ commit } ) => {
	
	await ServiceMethodService.common("get", API_ENDPOINTS['service'], null, null).then((response) => {
		commit('service', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('errorMsg', error.response.data)
	})
}
