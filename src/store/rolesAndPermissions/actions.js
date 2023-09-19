 import ServiceMethodService from '@/services/serviceMethod';
 import { API_ENDPOINTS } from "@/config/apiConfig"
 import { successSwal,errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'
export const rolesList = async ({ commit },page) => {
	commit('loadingStatus', true)
	let link = page?API_ENDPOINTS['rolesList']+'?active='+page:API_ENDPOINTS['rolesList']+'?active='
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		commit('roleList', response.data);
		
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}
export const selectRoleRecords = async ({ commit }) => {
	commit('loadingStatus', true)
	let link = API_ENDPOINTS['rolesList']+'?all=all'
	await ServiceMethodService.common("get", link, null, null).then((response) => {
		commit('selectRoleRecords', response.data);
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}
export const rolePermissions = async ({ commit }) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['rolePermissions'], null, null).then((response) => {

		commit('rolesAndPermissions', response.data.modules);
		commit('rolePermissionsSuccess', response.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}

export const addRole = async ({ commit }, data) => {
	let status =  false
	await ServiceMethodService.common("post", API_ENDPOINTS['role'], null, data).then((response) => {
		commit('addRoleSuccess', response.data.data);
		status = true
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
	return status
}
export const addPermissions = async ({ commit }, data) => {
	let status = false
	await ServiceMethodService.common("post", API_ENDPOINTS['addPermissions'], data.id, data.data).then(() => {
		//successSwal(response.data.message)
		status = true
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})

	return status
}
export const editPermissions = async ({ commit }, id) => {
	commit('loadingStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['rolePermissionEdit'], id, null).then((response) => {
		commit('editRoleSuccess', response.data.data);
		commit('loadingStatus', false)
		
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}

export const UpdateRole = async ({ commit }, data) => {
	let status = false
	await ServiceMethodService.common("put", API_ENDPOINTS['role'], data.id, data.data).then((response) => {
		if(data.show){
			successSwal(response.data.message)
		}
		
		commit('UpdateRoleSuccess', response.data.data);
		status = true

	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
	return status
}

export const updatePermission = async ({ commit }, data) => {
	await ServiceMethodService.common("put", API_ENDPOINTS['rolesList'], data.id, data.data).then(() => {
		//successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		
		commit('failure', error.response.data);
	})
}
export const roleDetails = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['rolesList'], id, null).then((response) => {
		commit('roleDetailsSuccess', response.data.data);
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		
		commit('failure', error.response.data);
	})
}

export const deleteRole = async ({ commit }, id) => {
	await ServiceMethodService.common("delete", API_ENDPOINTS['role'], id, null).then((response) => {
		successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		
		commit('failure', error.response.data);
	})
}
//dashboardWidget
export const dashboardWidget = async ({ commit }) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['dashboardWidget'], null, null).then((response) => {
		commit('dashboardWidget', response.data.data);
		
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}
export const addDashboardWidget = async ({ commit },data) => {
	await ServiceMethodService.common("post", API_ENDPOINTS['widgetAccess'], data.id, data.data).then((response) => {
		successSwal(response.data.message)
		
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}
export const editdWidget = async ({ commit },id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['widgetAccess'], id, null).then((response) => {
		commit('editdWidget', response.data.data);
		
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		//errorSwal(error.response.data.message)
		commit('failure', error.response.data);
	})
}