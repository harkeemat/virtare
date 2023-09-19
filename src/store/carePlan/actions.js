import serviceMethod from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { 
	successSwal,
	//  errorSwal,
	errorLogWithDeviceInfo 
} from '@/commonMethods/commonMethod';

export const addCarePlan = async ({ commit }, data) => {
	commit('loadingStatus', true)
	await serviceMethod.common("post", API_ENDPOINTS['patient']+'/'+data.patientId+'/goal', null, data.data).then((response) => {
		commit('loadingStatus', false)
    successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('failure', error);
		commit('loadingStatus', false)
		// errorSwal(error.response.data.message)
	})
}

export const carePlansList = async ({ commit }, patientId) => {
	commit('loadingStatus', true)
	await serviceMethod.common("get", API_ENDPOINTS['patient']+'/'+patientId+'/goal', null, null).then((response) => {
		commit('carePlansList', response.data.data);
		commit('loadingStatus', false)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('failure', error);
		commit('loadingStatus', false)
		// errorSwal(error.response.data.message)
	})
}

export const deleteCarePlan = async ({ commit }, {patientId, carePlanId}) => {
	commit('loadingStatus', true)
	await serviceMethod.common("delete", API_ENDPOINTS['patient']+'/'+patientId+'/goal', carePlanId, null).then((response) => {
		commit('loadingStatus', false)
    successSwal(response.data.message)
	})
	.catch((error) => {
		if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
		commit('failure', error);
		commit('loadingStatus', false)
		// errorSwal(error.response.data.message)
	})
}