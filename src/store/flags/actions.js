import serviceMethod from '@/services/serviceMethod';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { errorLogWithDeviceInfo } from '@/commonMethods/commonMethod';

export const flagsList = async ({ commit }) => {
	commit('loadingStatus', true);
	await serviceMethod
		.common('get', API_ENDPOINTS['flag']+'?orderField=priority', null, null)
		.then((response) => {
			commit('flagsList', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			commit('failure', error.response.data);
			commit('loadingStatus', false);
		});
};

export const flagsForPatient = async ({ commit },data) => {
	commit('loadingStatus', true);
	await serviceMethod
		.common('get', API_ENDPOINTS['flag'] + `?type=patient&category=${data}`, null, null)
		.then((response) => {
			commit('flagsForPatients', response.data.data);
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			commit('failure', error.response.data);
			commit('loadingStatus', false);
		});
};

export const addPatientFlag = async ({ commit }, { patientUdid, data }) => {
	commit('loadingStatus', true);
	await serviceMethod
		.common('post', API_ENDPOINTS['patient'] + '/' + patientUdid + '/' + API_ENDPOINTS['flag'], null, data)
		.then(() => {
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			commit('failure', error.response.data);
			commit('loadingStatus', false);
		});
};
export const updatePatientFlag = async ({ commit }, data) => {

	let status = false
	commit('loadingStatus', true);
	await serviceMethod
	.common('post', 'flags', null, data.data)
		.then(() => {
			commit('loadingStatus', false);
			status = true
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			commit('failure', error.response.data);
			commit('loadingStatus', false);
		});

		return status
};
export const patientFlagsList = async ({ commit }, data) => {
	commit('loadingStatus', true);
	let link =null
	if(data.catId){
		link = API_ENDPOINTS['patient'] + '/' + data.patientUdid + '/' + API_ENDPOINTS['flag']+`?category=${data.catId}`
	}else{
		link = API_ENDPOINTS['patient'] + '/' + data.patientUdid + '/' + API_ENDPOINTS['flag']
	}
	await serviceMethod
		.common('get',link, null, null)
		.then((response) => {
			if(data.catId==1){
				commit('patientFlagsList', response.data.data);
			}else{
				commit('patientFlagsListCat2', response.data.data)
			}
			commit('loadingStatus', false);
		})
		.catch((error) => {
			if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
			commit('failure', error.response.data);
			commit('loadingStatus', false);
		});
};



