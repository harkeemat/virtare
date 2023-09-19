import ServiceMethodService from '@/services/serviceMethod';
import { API_ENDPOINTS } from "@/config/apiConfig"
import { errorLogWithDeviceInfo} from '@/commonMethods/commonMethod'

export const counterCard = async ({ commit },from) => {
    await ServiceMethodService.common("get", API_ENDPOINTS['counterCard'] +"?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((response) => {
        commit('counterCardSuccess', response.data.data);
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
