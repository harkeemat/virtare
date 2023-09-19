import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { errorLogWithDeviceInfo,arrayToObjectData } from '@/commonMethods/commonMethod'
import store from '@/store/index'
//date filters 
export const timeLine = async ( { commit },id) => {
        let status = false
        if(store.state.common?.filterDateDataGet?.length>0){
            let object = arrayToObjectData(store.state.common?.filterDateDataGet,id?.id,'globalCodeId') 
            commit(id?.commit,object);  
            
            status = true
            return status
        }else{
            return status
        }
        
  
}
export const filterDateDataGet = async ({ commit }) => {
    commit('loadingStatus', true)
    await ServiceMethodService.common("get", API_ENDPOINTS['interval']+'?orderField=priority&orderBy=ASC' , null, null).then((response) => {
        commit('filterDateDataGet', response.data.data);
       // commit('dateFilterTimeline', response.data.data);
        commit('loadingStatus', false)
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


export const specialization = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['specialization'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
        commit('specializationSuccess', response.data.data);
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


export const network = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['network'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

        commit('networkSuccess', response.data.data);

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

// export const cptCode = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['cptCodeGraph'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

//         commit('cptCodeSuccess', response.data.data);

//         //commit('cptCodeSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }
// export const financial = async ({ commit }, from) => {

//     await ServiceMethodService.common("get", API_ENDPOINTS['financial'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
//         commit('financialSuccess', response.data.data);


//         //commit('cptCodeSuccess', response.data.data);

//     }).catch((error) => {
//         errorLogWithDeviceInfo(error.response)
//         if (error.response.status == 401) {
//             //AuthService.logout();
//         }
//         commit('failure', error.response.data);
//     })
// }

export const totalPatientsChart = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['totalPatientsChart'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

        commit('totalPatientsChartSuccess', response.data.data);

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
export const appointmentChart = async ({ commit }, from) => {

    await ServiceMethodService.common("get", API_ENDPOINTS['appointmentChart'] + "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {

        commit('appointmentChartSuccess', response.data.data);

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