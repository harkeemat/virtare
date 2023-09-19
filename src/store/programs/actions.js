import serviceMethod from '@/services/serviceMethod'
import { API_ENDPOINTS } from "@/config/apiConfig"
import {  successSwal,errorLogWithDeviceInfo } from '@/commonMethods/commonMethod'

export const manageProgramList = async ({
  commit
}, page) => {
  let link = page ? API_ENDPOINTS['programsList']+`?active=1` + page : API_ENDPOINTS['programsList']
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", link, null, null).then((response) => {

    commit('program', response.data);
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
  });


}

export const activeProgramsList = async ({ commit }) => {
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['programsList'], null, null).then((response) => {
    commit('activeProgramsList', response.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 422) {
        // errorSwal(error.response.data)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
    }
    else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingTableStatus', false)
  });


}

export const addManageProgram = async ({
  commit
}, data) => {
  await serviceMethod.common("post", API_ENDPOINTS['programsList'], null, data.data).then((response) => {

    commit('programMsg', response.data.message);
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
  });


}
export const editManageProgram = async ({
  commit
}, id) => {


  await serviceMethod.common("get", API_ENDPOINTS['programsList'], id, null).then((response) => {

    commit('editProgram', response.data.data)

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
export const updateManageProgram = async ({
  commit
}, data) => {
  await serviceMethod.common("put", API_ENDPOINTS['programsList'], data.id, data.data).then((response) => {
    commit('programMsg', response.data.message);
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
  });


}
export const deleteManageProgram = async ({
  commit
}, id) => {
  await serviceMethod.common("delete", API_ENDPOINTS['programsList'], id, null).then((response) => {
    commit('programMsg', response.data.message);
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
  });


}
