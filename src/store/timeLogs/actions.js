import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { successSwal,errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'

export const addTimeLog = async ({ commit }, {id, data}) => {
	let status = false
	if(data.isAutomatic == false) {
		commit('loadingStatus', true)
	}
	await ServiceMethodService.common("post", API_ENDPOINTS['patient']+"/"+id+"/timeLog", null, data).then((response) => {
		commit('addTimeLogSuccess', response.data.data);
		status = true
		if(data.isAutomatic == true) {
			localStorage.setItem('timeLogId', response.data.data.id)
		}
		else {
			successSwal(response.data.message)
			commit('loadingStatus', false)
		}
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
		commit('errorMsg', error?.response?.data)
		commit('failure', error.response.data);
		commit('loadingStatus', false)
	})
	return status
}

export const timeLogsList = async ({ commit }, {id}) => {
  commit('loadingStatus', true)
	await ServiceMethodService.common("get", API_ENDPOINTS['patient']+"/"+id+"/timeLog", null, null).then((response) => {
		commit('timeLogsListSuccess', response.data.data);
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

export const deleteTimeLog = async ({ commit }, {id, timeLogId}) => {
  commit('loadingStatus', true)
	await ServiceMethodService.common("delete", API_ENDPOINTS['patient']+"/"+id+"/timeLog", timeLogId, null).then((response) => {
		commit('deleteTimeLogSuccess', response.data.data);
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

export const latestTimeLog = async ({ commit }, id) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['patient']+"/"+id+"/timeLog?latest=latest", null, null).then((response) => {
    if(response.data.data.length > 0) {
      commit('latestTimeLogSuccess', response.data.data);
    }
    else {
      commit('latestTimeLogSuccess', null)
    }
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

export const timeLogDetails = async ({ commit }, udid) => {
	await ServiceMethodService.common("get", API_ENDPOINTS['timeLog'], udid, null).then((response) => {
		commit('timeLogDetailsSuccess', response.data.data);
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

export const updateTimeLog = async ({ commit }, {udid, data}) => {
	await ServiceMethodService.common("put", API_ENDPOINTS['timeLog'], udid, data).then((response) => {
		commit('updateTimeLogSuccess', response.data.data);
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

export const updatePatientTimeLog = async ({ commit }, {patientUdid, timeLogId, data}) => {
	if(data.isAutomatic == false) {
		commit('loadingStatus', true)
	}
	await ServiceMethodService.common("put", API_ENDPOINTS['patient']+`/${patientUdid}/timeLog`, timeLogId, data).then((response) => {
		commit('updatePatientTimeLog', response.data.data);
		if(data.isAutomatic == true) {
			localStorage.setItem('timeLogId', response.data.data.id)
		}
		else {
			localStorage.removeItem('timeLogId')
			successSwal(response.data.message)
			commit('loadingStatus', false)
		}
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