import serviceMethod from '@/services/serviceMethod'
import { API_ENDPOINTS } from "@/config/apiConfig"
import {  successSwal,errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'
import api from '@/services/api';

export const getVital = async ({
  commit
}, data) => {
 
    await  serviceMethod.common("get", API_ENDPOINTS['getVital'] + "/" + data, null, null).then((response) => {

        commit('getVitals', response.data.data);
        
      }).catch((error) => {
        if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
        if (error.response.status === 422) {
          // errorSwal(error.response.data)
        } else if (error.response.status === 500) {
          // errorSwal(error.response.data.message)
        } else if (error.response.status === 401) {
          // errorSwal(error.response.data.message)
        }
        
    });


  }
  

export const addGeneralParameterGroup = async ({
  commit
}, data) => {
  await serviceMethod.common("post", API_ENDPOINTS['generalParameter'], null, data).then((response) => {
    commit('vitalSuccessMsg', response.data.message)
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      // errorSwal(error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
    }
  })


}
export const generalParameterList = async ({
  commit
},page) => {
  commit('loadingTableStatus', true)
  let link=page? API_ENDPOINTS['generalParameter']+page:API_ENDPOINTS['generalParameter']
  await serviceMethod.common("get", link, null, null).then((response) => {
    commit('generalParameterGroup', response.data)
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      // errorSwal(error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })


}
export const generalParameterEdit = async ({
  commit
},id) => {
  await serviceMethod.common("get", API_ENDPOINTS['generalParameter'], id, null).then((response) => {
    
    commit('vitalEdit', response.data.data)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      // errorSwal(error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
    }
  })


}
export const updateGeneralParameterGroup = async ({
  commit
},data) => {
  await serviceMethod.common("put", API_ENDPOINTS['generalParameter'], data.id, data.data).then((response) => {
    commit('vitalSuccessMsg', response.data.message)
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      // errorSwal(error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
    }
  })


}
export const generalParameterDelete = async ({
  commit
},id) => {
  await serviceMethod.common("delete", API_ENDPOINTS['deleteParameter'], id, null).then((response) => {
    successSwal(response.data.message)
    commit('vitalSuccessMsg', '')
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      // errorSwal(error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
    }
  })


}

export const downloadFile = async ({
  commit
}) => {
  let response  = await api.get(`sample/report/download`, null, null)
    commit('billingReportTable', response.data)
}