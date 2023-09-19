import serviceMethod from '@/services/serviceMethod';
import {  errorLogWithDeviceInfo } from '@/commonMethods/commonMethod';


export const getVideoDetails = async ({commit},id) => {
  commit('loadingStatus', true)
  if(id){
    await serviceMethod.common("get", `appointment/conference/${id}`, null, null).then((response) => {
      commit('getVideoDetails', response.data.data);
      commit('loadingStatus', false)
    }).catch((error) => {
      if (error.response) {
          errorLogWithDeviceInfo(error.response);
        } else {
          errorLogWithDeviceInfo(error);
        }
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
        commit('loadingStatus', false)
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
        commit('loadingStatus', false)
      } else if (error.response.status === 401) {
        // commit('errorMsg', error.response.data.message)
        commit('loadingStatus', false)
      }
      commit('loadingStatus', false)
    })
  }
}

export const appointmentCalls = async ({commit},data) => {
  commit('loadingStatus', true)
  let check = false
  try{
    await serviceMethod.common("post", `appointment/calls`, null, data).then((response) => {
      commit('conferenceId', response.data.data.conferenceId);
      commit('loadingStatus', false)
      check=true
    })
  }
 catch(error) {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  }
  return check
}


export const acceptVideoCallDetails = async ({commit},id) => {
  let status =false
  commit('loadingStatus', true)
  await serviceMethod.common("get", `user/${id}`, null, null).then((response) => {
    commit('acceptVideoCallDetails', response.data.data);
    commit('loadingStatus', false)
    status =true
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      commit('loadingStatus', false)
    }
  })
  return status
}


export const callNotification = async ({commit},data) => {
  commit('loadingStatus', true)
  await serviceMethod.common('patch', `communicationCallRecord/${data.id}?status=${data.status}`, null, true).then((response) => {
    commit('callNotification', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}


export const guestUser = async ({commit},data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", `guest`, null, data).then((response) => {
    commit('guestUser', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    errorLogWithDeviceInfo(error.response)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}

export const startCall = async ({commit},data) => {
  commit('loadingStatus', true)
  try{
    await serviceMethod.common("patch", `callRecordCommunication/${data.id}?status=${data.status}`, null, true)
      commit('loadingStatus', false)
    }
  catch(error) {
    errorLogWithDeviceInfo(error.response)
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      commit('loadingStatus', false)
    }
  }
}

