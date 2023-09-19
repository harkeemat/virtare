import serviceMethod from '@/services/serviceMethod';
import {API_ENDPOINTS} from "@/config/apiConfig"
import {
  errorSwal,
  errorLogWithDeviceInfo,
  successSwal
} from '@/commonMethods/commonMethod'
import api from '@/services/api';

export const globalCodes = async ({commit}) => {
  await serviceMethod.common("get", "globalCodeCategory?all=all", null, null).then((response) => {
    commit('globalCodes', response.data.data);
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

// export const dateFilter = async ({commit}) => {
//   await serviceMethod.common("get", API_ENDPOINTS['interval'] , null, null).then((response) => {

//     commit('dateFilterTimeline', response.data.data);
//     commit('filterDateDataGet', response.data.data);
//     commit('loadingStatus', false)
// }).catch((error) => {
//    if (error.response) {
// 				errorLogWithDeviceInfo(error.response);
// 			} else {
// 				errorLogWithDeviceInfo(error);
// 			}
//     if (error.response.status == 401) {
//       //AuthService.logout();
//     }
//     commit('failure', error.response.data);
//   })
// }

export const vitalFieldsList = async ({ commit }, deviceId) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['field'], deviceId, null).then((response) => {
    commit('vitalFieldsList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('failure', error);
    commit('loadingStatus', false)
  })
}

export const vitalFieldsByDeviceId = async ({ commit }, deviceId) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['field'], deviceId, null).then((response) => {
    commit('vitalFieldsByDeviceId', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('failure', error);
    commit('loadingStatus', false)
  })
}


export const allStaffList = async ({ commit }) => {
  //commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['staffList'], null, null).then((response) => {
    commit('allStaffList', response.data.data);
    //commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('failure', error);
    commit('loadingStatus', false)
  })
}

export const activeCptCodes = async ({ commit }) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['activeCptCodes'], null, null).then((response) => {
    commit('activeCptCodes', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('failure', error);
    commit('loadingStatus', false)
  })
}

export const getNotifications = async ({ commit}, page) => {
  commit('loadingStatus', true)
  let url = page ? API_ENDPOINTS['notification'] + page : API_ENDPOINTS['notification']
  await serviceMethod.common("get", url, null, null).then((response) => {
    commit('getNotifications', response.data);
    commit('loadingStatus', false)
  }).catch(() => {
    commit('loadingStatus', false)
  })
}

export const notificationList = async ({ commit }) => {
  await serviceMethod.common("get", `notification/isReadList`, null, null).then((response) => {
    commit('getNotificationsList', response.data.data);
    commit('notificationList', response.data.data.length);
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    // errorSwal(error.response.data.message)
  })
}


export const isReadUpdateNotification = async ({
  commit
}, id) => {
try{
  await serviceMethod.common("put", `notification/isRead/${id}`, null, true)
  }catch(error)  {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data.message)
    }
  }
}

export const searchTable = async ({ commit }, search) => {
  commit("searchTable", search ? search :'')
}
export const orderTable = async ({ commit},data) => {
  commit("orderTable",data)
}


export const searchTableData = async ({ commit }, search) => {
if(search.loader){
  commit(search.loader, true)

}else{
  commit('loadingStatus', true)
  commit('loadingTableStatus', true)
}

  let searchUrl = "";
  if(search.endPoint == 'specialists') {
    searchUrl = `staff?type=specialist&active=&search=`
  }
  else if(search.endPoint == 'staff') {
    searchUrl = 'staff?type=staff&active=&search='
  }
  else {
    searchUrl = search.endPoint+'?active=&search='
  }

  await serviceMethod.common("get", searchUrl + search.data+search.field+search.filter, null, null,true).then((response) => {
    if(search.loader){
      commit(search.loader, false)

    }else{
      commit('loadingStatus', false)
      commit('loadingTableStatus', false)
    }
    if(search.commit){
      commit(search.commit, response.data);
    }
    else {
      commit(search.endPoint, response.data);
    }

  }).catch((error) => {
    if(search.loader){
      commit(search.loader, false)

    }else{
      commit('loadingStatus', false)
      commit('loadingTableStatus', false)
    }
    if(!error.__CANCEL__){

     if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
      commit('errorMsg', error);
      // commit('loadingStatus', false)
      // commit('loadingTableStatus', false)
    }

  })
}


export const actionTrack = async ({ commit }, data) => {
  await serviceMethod.common("post", `${data.endPoint}/${data.id}/action`, null, { actionId: data.actionId }).then((response) => {
    commit('actionTrack', response.data.data);
    // successSwal(response.data.message)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    }
  })
}
export const formTitle = async ({ commit }) => {

  await serviceMethod.common("get", "form", null, null).then((response) => {
    commit('formTitle', response.data.data);
    // successSwal(response.data.message)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    }
  })
}
export const tooltip = async ({ commit },data) => {
  let url  = data?.id? "toolTip" +"?refrenceId="+data.id+ "&refrenceType="+data.type : "toolTip"
  await serviceMethod.common("get", url, null, null).then((response) => {
    commit('tooltip', response.data);
    // successSwal(response.data.message)
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    }
  })
}


const API_URL = import.meta.env.VITE_APP_API_URL
export const exportReportRequest = async ( { commit },data) => {
 let response = await serviceMethod.common("post", `export/report/request`+ data.field, null, { reportType: data.data ,timezone:data.timezone})
 .catch(()=>{
  console.log(commit)
 })
  let udid = response.data.data.udid;
  let reportType = response.data.data.reportType;
  let type = reportType.replace('_','/');
  await  window.open(API_URL+`${type}/export/${udid}`+data.field, '_blank')
}



export const passwordReset = async ({commit}, data) => {
  let status = false
  await serviceMethod.common("put", `${data.endPoint}/${data.id}/resetPassword`, null, true).then((response) => {
    // commit('isReadUpdateNotification', response.data.data);
    successSwal(response.data.message)

    status = true
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      // commit('errorMsg', error.response.data)
      errorSwal(error.response.data.password[0])
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data.message)
    }
  })
  return status
}

export const staffPasswordReset = async ({commit}, data) => {
  let status = false
  await serviceMethod.common("put", `${data.endPoint}/${data.id}/resetPassword`, null, data.data).then((response) => {
    // commit('isReadUpdateNotification', response.data.data);
    successSwal(response.data.message)

    status = true
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error.response.status === 422) {
      commit('errorMsg', error.response.data)
      // errorSwal(error.response.data.password[0])
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      commit('errorMsg', error.response.data.message)
    }
  })
  return status
}

export const commonAction = async ({commit}, data) => {
  let status = false
  data?.loader ? commit(data?.loader,true) : ''
  await serviceMethod.common(data?.method, data?.endPoint, data?.id, data?.data).then((response) => {
    if(data?.commit){
     commit(data?.commit, response?.data)
    }
    if(data?.show){
      successSwal(response?.data?.message)
    }
    data?.loader ? commit(data?.loader,false) : ''
    status = true
  }).catch((error) => {
    data?.loader ? commit(data?.loader,false) : ''
   if (error?.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    if (error?.response?.status === 422) {
       commit('errorMsg', error?.response?.data)

    } else if (error?.response?.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error?.response?.status === 401) {
      commit('errorMsg', error?.response?.data?.message)
    }

    return status
  })


}
export const timeZone = async ({ commit }) => {
  let status = false
  await serviceMethod.common("get", API_ENDPOINTS['timeZone'], null, null).then((response) => {
    commit('timeZone', response.data.data);
    status = true
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('failure', error);
  })
  return status
}
export const rolesDropDown = async ({ commit },id) => {
  let status = false
  let url = id ? API_ENDPOINTS['rolesDropDown']+'/'+id : API_ENDPOINTS['rolesDropDown']
  await serviceMethod.common("get", url, null, null).then((response) => {
    commit('rolesDropDown', response.data.data);
    status = true
  }).catch((error) => {
   if (error.response) {
				errorLogWithDeviceInfo(error.response);
			} else {
				errorLogWithDeviceInfo(error);
			}
    commit('failure', error);
  })
  return status
}
//show to which client assign to patient
export const getClientsForPatients = async ({ commit },record) => {

  try{
  const {data} = await api.post(`patientData/assign/${record?.patientId}/client/${record?.data?.clientId}`,record?.data)
    commit('getClientsForPatients', data.data);
    successSwal(data?.message)
  }catch(error) {
    console.log(error)
  }

}