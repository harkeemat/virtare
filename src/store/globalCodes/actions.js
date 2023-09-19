import ServiceMethodService from '../../services/serviceMethod';
import { API_ENDPOINTS } from "../../config/apiConfig"
import { successSwal, errorLogWithDeviceInfo } from '@/commonMethods/commonMethod';

export const globalCodesList = async ({ commit },page) => {
	commit('loadingTableStatus', true)
	let link = page? API_ENDPOINTS['globalCode']+"?active="+page : API_ENDPOINTS['globalCode']+"?active="
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		commit('globalCode', response.data);
		commit('loadingTableStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('loadingTableStatus', false)
		commit('failure', error.response.data);
	})
}

export const searchGlobalCodes = async ({ commit }, params) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['globalCodesList']+'?search='+params, null, null).then((response) => {
		commit('searchGlobalCodesSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
		// errorSwal(error.response.data.message)
	})
}

export const addGlobalCode = async ({ commit }, data) => {
	await ServiceMethodService.common("post", API_ENDPOINTS['globalCode'], null, data).then((response) => {
		commit('addGlobalCodeSuccess', response.data.data);
		successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
		// errorSwal(error.response.data.message)
	})
}

export const deleteGlobalCode = async ({ commit }, id) => {
	await ServiceMethodService.common("delete", API_ENDPOINTS['globalCode'], id, null).then((response) => {
		commit('deleteGlobalCodeSuccess', response.data.data);
		successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
		// errorSwal(error.response.data.message)
	})
}

export const globalCodeDetails = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['globalCode'], id, null).then((response) => {
		commit('globalCodeDetailsSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
	})
}

export const updateGlobalCode = async ({ commit }, {id, data}) => {
	await ServiceMethodService.common("patch", API_ENDPOINTS['globalCode'], id, data).then((response) => {
		commit('updateGlobalCodeSuccess', response.data.data);
		successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		if (error.response.status == 401) {
			//AuthService.logout();
		}
		commit('failure', error.response.data);
		// errorSwal(error.response.data.message)
	})
}
