import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal, errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'
import api from '@/services/api';
export const addInventory = async ({ commit }, record) => {
	commit('loadingStatus', true)
	commit('loading', true)
	let status = false
	try {
		const { data } = await api.post(API_ENDPOINTS['inventory'], record)
		commit('addInventorySuccess', data.data);
		successSwal(data.message)
		status = true
		commit('loading', false)
	} catch (error) {
		commit('inventoryError', error.response.data);

	}
	commit('loadingStatus', false)
	commit('loading', false)
	return status
}
export const assignInventoryToPatients = async ({ commit }, {id,record}) => {
	commit('loadingStatus', true)
	let status = false
	try {
		const { data } = await api.post(`inventory/${id}/patient`, record)
		successSwal(data.message)
		status = true
	} catch (error) {
		commit('inventoryError', error.response.data);
	}
	commit('loadingStatus', false)
	return status
}

export const inventoriesList = async ({ commit }, page) => {
	let link = page ? API_ENDPOINTS['inventory'] + "?active=1" + page : API_ENDPOINTS['inventory'] + "?active=1"
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		commit('inventory', response.data);
		commit('loadingStatus', false)
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
			commit('loadingStatus', false)
		})
}

export const inventoryDetails = async ({ commit }, id) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['inventory'], id, null).then((response) => {
		commit('inventoryDetailsSuccess', response.data.data);
		commit('loadingStatus', false)
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
			commit('loadingStatus', false)
		})
}
export const allPatientsNames = async ({ commit }) => {

	try {
		const { data } = await ServiceMethodService.common("get", 'patientData/listAll', null, null)
		commit('allPatientsNames', data.data);

	} catch (error) {
		if (error.response) {
			errorLogWithDeviceInfo(error.response);
		} else {
			errorLogWithDeviceInfo(error);
		}

		commit('failure', error.response.data);
	}
}
export const updateInventory = async ({ commit }, { id, record }) => {
	commit('loadingStatus', true)
	commit('loading', true)
	let status = false
	try{
	const {data } = await api.put(API_ENDPOINTS['inventory']+'/'+id, record,null)
		commit('updateInventorySuccess', data.data);
		successSwal(data.message)
		status = true
	}catch(error){
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}

			commit('failure', error.response.data);
		}
	commit('loadingStatus', false)
	commit('loading', false)
	return status
}

export const deleteInventory = async ({ commit }, id) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("delete", API_ENDPOINTS['inventory'], id, null).then((response) => {
		commit('deleteInventorySuccess', response.data.data);
		commit('loadingStatus', false)
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
			commit('loadingStatus', false)
		})
}

export const deviceModalsList = async ({ commit }, id) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['model'] + '?deviceType=' + id, null, null).then((response) => {
		commit('deviceModalsListSuccess', response.data.data);
		commit('loadingStatus', false)
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
			commit('loadingStatus', false)
		})
}