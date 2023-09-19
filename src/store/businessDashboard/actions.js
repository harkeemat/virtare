import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'
export const callStatus = async ({ commit }, from) => {
    await ServiceMethodService.common("get", API_ENDPOINTS['callStatus'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
        commit('callStatusSuccess', response.data.data)

    }).catch((error) => {
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
export const cptCode = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['cptCodeGraph'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
       
      ServiceMethodService.common("get", API_ENDPOINTS['cptCodes']+"?active=1", null, null).then((cptCodes) => {
         
            commit('cptCodeSuccess', {cpt:response.data.data,data:cptCodes.data.data})
        })
       

    }).catch((error) => {
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
export const financial = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['financial'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
        commit('financialSuccess', response.data.data);

    }).catch((error) => {
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
export const referalCount = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['referalCount'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
        commit('referalCount', response.data);

    }).catch((error) => {
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


