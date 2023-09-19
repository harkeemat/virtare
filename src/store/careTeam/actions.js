import serviceMethod from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig";
import {
	successSwal,
	// errorSwal,
	errorLogWithDeviceInfo
} from '@/commonMethods/commonMethod'

export const addPatientCareCoordinator = async ({ commit }, {patientUdid, data}) => {
	commit('loadingStatus', true)
	await serviceMethod.common("post", API_ENDPOINTS['patient']+'/'+patientUdid+'/staff', null, data).then((response) => {
    successSwal(response.data.message)
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
			errorLogWithDeviceInfo(error.response);
		} else {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		}
		commit('loadingStatus', false)
		if (error.response.status == 401) {
    //   errorSwal(error.response.data.message)
		}
		commit('failure', error.response.data);
	})
}
export const staffArray = async ({ commit }, {patientUdid, type}) => {
	commit('loadingStatus', true)
	await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientUdid}/staff?type=${type}`, null, null).then((response) => {
		commit('staffArray', response.data.data);
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('loadingStatus', false)
	})
}
export const patientCareCoordinatorsList = async ({ commit }, {patientUdid, type}) => {
	commit('loadingStatus', true)
	await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientUdid}/staff?type=${type}`, null, null).then((response) => {
		if(type == 1) {
			commit('patientCareCoordinatorsList',response.data.data);
			commit('careTeamList', null);
		}if(type==0) {
			commit('careTeamList', response.data.data);
		}if(type=='Staff'){
			commit('physiciansList', response.data.data);
		}if(type=='Specialist'){
			commit('specialist', response.data.data);
		}
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('loadingStatus', false)
	})
}

export const deletePatientCareCoordinator = async ({ commit }, {patientUdid, patientStaffUdid}) => {
	commit('loadingStatus', true)
	await serviceMethod.common("delete", API_ENDPOINTS['patient']+'/'+patientUdid+'/staff/'+patientStaffUdid, null, null).then((response) => {
		commit('deletePatientCareCoordinator', response.data.data);
    successSwal(response.data.message)
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
			errorLogWithDeviceInfo(error.response);
		} else {
			errorLogWithDeviceInfo(error);
		}
		if (error.response.status == 401) {
    //   errorSwal(error.response.data.message)
		}
		commit('failure', error.response.data);
		commit('loadingStatus', false)
	})
}

export const patientCareCoordinatorDetails = async ({commit}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${data.patientUdid}/staff/${data.patientStaffUdid}`, null, null).then((response) => {
    commit('patientCareCoordinatorDetails', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
	if (error.response) {
		errorLogWithDeviceInfo(error.response);
	} else {
		errorLogWithDeviceInfo(error);
	}
    if (error.response.status === 500) {
    //   errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  })
}

export const updatePatientCareCoordinator = async ({commit}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient']+`/${data.patientUdid}/staff/${data.patientStaffUdid}`, null, data.data).then((response) => {
    commit('updatePatientCareCoordinator', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
	if (error.response) {
		errorLogWithDeviceInfo(error.response);
	} else {
		errorLogWithDeviceInfo(error);
	}
    if (error.response.status === 500) {
    //   errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  })
}