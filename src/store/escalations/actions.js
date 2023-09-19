import serviceMethod from '@/services/serviceMethod';
import api from '@/services/api';
import {
  errorLogWithDeviceInfo,
  successSwal,
  errorSwal
} from '@/commonMethods/commonMethod'
import {
  API_ENDPOINTS
} from "@/config/apiConfig"


export const escalation = async ({
  commit
}, data) => {
  try{  
    commit('loadingTableStatus', true)
    let link = null
    if (data) {
      if (data.entityType) {
        link = data.entityType ? `escalation?referenceId=${data.referenceId}&entityType=${data.entityType}&fromDate=${data?.date?.fromDate}&toDate=${data?.date?.toDate}` : `escalation?referenceId=${data.referenceId}&entityType=${data.entityType}&fromDate=${data?.date?.fromDate}&toDate=${data?.date?.toDate}`
      } else {
        link = data ? `escalation` + data : `escalation`
      }
    } else {
      link = 'escalation'
    }
    
    let response = await api.get(link, null, null)
      commit('escalation', response.data)
      commit('loadingTableStatus', false)
      return response
  }catch{
    commit('loadingTableStatus', false)
  }
}

export const escalationHistory = async ({
  commit
}, data) => {
  commit('loadingTableStatus', true)
  let link  =`escalationAudit?referenceId=${data.referenceId}&fromDate=${data?.date?.fromDate}&toDate=${data?.date?.toDate}` 
  await serviceMethod.common("get", link, null, null).then((response) => {
    commit('escalationHistory', response.data)
    commit('loadingTableStatus', false)

  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingTableStatus', false)
  })
}


export const escalationAudit = async ({
  commit
}, from) => {
  let link = from ? 'escalationAudit'+from : 'escalationAudit'
  
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", link, null, null).then((response) => {
    commit('escalationAudit', response.data)
    commit('loadingTableStatus', false)

  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingTableStatus', false)
  })
}

export const addBasicEscalation = async ({
  commit
}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("post", `escalation`, null, data).then((response) => {
    commit('addBasicEscalation', response.data.data)
    // successSwal(response.data.message)
    commit('escalationCounterPlus',data.value)
    commit('loadingStatus', false)
    status = true
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  })
  return status
}



export const addAssignTo = async ({
  commit
}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("post", `escalation/${data.escalationId}/assign`, null, data).then((response) => {
    commit('addAssignTo', response.data.data)
    // successSwal(response.data.message)
    commit('escalationCounterPlus',data.value)
    commit('loadingStatus', false)
    status = true
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  })
  return status
}


export const updateBasicEscalation = async ({
  commit
}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("put", `escalation/${data.escalationId}`, null, data).then((response) => {
    commit('updateBasicEscalation', response.data.data)
    // successSwal(response.data.message)
    commit('escalationCounterPlus',data.value)
    commit('loadingStatus', false)
    status = true
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  })
  return status
}


export const esacalationFlagList = async ({
  commit
}, data) => {
  try {
    commit('loadingStatus', true)
    if (data.date) {
      let response = await serviceMethod.common("get", `patient/${data.id}/flag?fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('esacalationFlagList', response.data.data)
      commit('loadingStatus', false)
    } else {
      let response = await serviceMethod.common("get", `patient/${data.id}/flag`, null, null)
      commit('esacalationFlagList', response.data.data)
      commit('loadingStatus', false)
    }
  } catch (error) {
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }
}

export const escalationNotesList = async ({
  commit
}, data) => {
  try {

    commit('loadingStatus', true)
    if (data.date) {
      let response1 = await serviceMethod.common("get", `patient/${data.id}/notes?fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('escalationNotesList', response1.data.data)
      let response2 = await serviceMethod.common("get", `patient/${data.id}/notes?type=patientVital&fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('patientVital', response2.data.data)
      let response3 = await serviceMethod.common("get", `patient/${data.id}/notes?type=appointment&fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('appointment', response3.data.data)
      let response4 = await serviceMethod.common("get", `patient/${data.id}/notes?type=auditlog&fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('auditlog', response4.data.data)
      let response5 = await serviceMethod.common("get", `patient/${data.id}/notes?type=patientFlag&fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('patientFlag', response5.data.data)
      commit('loadingStatus', false)
    } else {
      let response = await serviceMethod.common("get", `patient/${data.id}/notes`, null, null)
      commit('escalationNotesList', response.data.data)
      commit('loadingStatus', false)
    }
  } catch (error) {
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }
}

export const esacalationCarePlansList = async ({
  commit
}, data) => {
  try {
    commit('loadingStatus', true)
    if (data.date) {
      let response = await serviceMethod.common("get", `patient/${data.id}/goal?fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null)
      commit('esacalationCarePlansList', response.data.data)
      commit('loadingStatus', false)
    } else {
      let response = await serviceMethod.common("get", `patient/${data.id}/goal`, null, null)
      commit('esacalationCarePlansList', response.data.data)
      commit('loadingStatus', false)
    }
  } catch (error) {
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }
}



export const escalationVitalList = async ({
  commit
}, data) => {
  try {
    commit('loadingStatus', true)
    if (data.date) {
      
      let response = await serviceMethod.common("get", `patient/${data.id}/vital?fromDate=${data.date.fromDate}&toDate=${data.date.toDate}`, null, null) //await serviceMethod.common("get", `patient/${data.id}/vital`, null, null)
      commit('escalationVitalList', response.data.data)
      // await serviceMethod.common("get", `patient/${data.id}/vital?fromDate=${data.date.fromDate}&toDate=${data.date.toDate}&deviceType=100`, null, null)
      // await serviceMethod.common("get", `patient/${data.id}/vital?fromDate=${data.date.fromDate}&toDate=${data.date.toDate}&deviceType=101`, null, null)
      commit('loadingStatus', false)
    } else {
      let response = await serviceMethod.common("get", `patient/${data.id}/vital`, null, null)
      commit('escalationVitalList', response.data.data)
      commit('loadingStatus', false)
    }
  } catch (error) {
   
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }
}








export const singleEscalationRecord = async ({
  commit
}, id) => {
  let status = false
  try {
    commit('loadingStatus', true)
    let response = await serviceMethod.common("get", `escalation/${id}`, null, null)
    commit('singleEscalationRecord', response.data.data)
    commit('loadingStatus', false)
    status = true
  } catch (error) {
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }
  return status
}



export const addEscalationDetails = async ({
  commit
}, data) => {
  let status = false
  try {
    commit('loadingStatus', true)
    await serviceMethod.common("post", `escalation/${data.escalationId}/detail`, null, data)
    // response ? status = true : status = false
    status = true
    commit('loadingStatus', false)
  } catch (error) {
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }

  return status
}



export const escalationDelete = async ({
  commit
}, id) => {
  let status = false
  try {
    commit('loadingStatus', true)
    await serviceMethod.common("delete", `escalation/${id}`, null, null)
    status = true
    commit('loadingStatus', false)
  } catch (error) {
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  }
  return status
}




export const escalationAction = async ({
  commit
}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("post", `escalation/${data.id}/action`, null, data).then((response) => {
    commit('escalationAction', response.data.data)
    successSwal(response.data.message)
    // commit('escalationCounterPlus')
    commit('loadingStatus', false)
    status = true
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
      // errorSwal(error.response.data.message)
    }
    commit('loadingStatus', false)
  })
  return status
}

export const escalationStaffs = async ({
  commit
}) => {
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", `staff`, null, null).then((response) => {
    commit('escalationStaffs', response.data.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
}

export const careCoordinator = async ({
  commit
}, id) => {
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", `patient/${id}/staff?isPrimary=1`, null, null).then((response) => {
    commit('careCoordinator', response.data.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
}


export const careCircle = async ({
  commit
}, id) => {
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", `patient/${id}/staff?isPrimary=1`, null, null).then((response) => {
    commit('careCircle', response.data.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
}

export const escReferral = async ({
  commit
}, id) => {
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", `patient/${id}/referral`, null, null).then((response) => {
    commit('escReferral', response.data.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
}



// export const specialist = async ({
//   commit
// }, data) => {
//   commit('loadingTableStatus', true)
//   await serviceMethod.common("get", `patient/${data.patientUdid}/staff?type=${data.type}`, null, null).then((response) => {
//     commit('specialist', response.data.data);
//     commit('loadingTableStatus', false)
//   }).catch((error) => {
//     if (error.response) {
//       errorLogWithDeviceInfo(error.response);
//     } else {
//       errorLogWithDeviceInfo(error);
//     }
//     commit('errorMsg', error);
//     if (error.response.status === 500) {
//       // errorSwal(error.response.data.message)
//     }
//     commit('loadingTableStatus', false)
//   })
// }


export const escalationSpecialist = async ({
  commit
}, data) => {
  let status = false
  commit('loadingTableStatus', true)
  try {
    let resp = await serviceMethod.common("post", `staff`, null, data.data)
    commit('escalationSpecialist', resp.data.data)
    status = true
    commit('loadingTableStatus', false)
  }
  catch (error) {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error)
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  }
  return status
}



export const assignSpecialistToPatient = async ({
  commit
}, data) => {
  let status = false
  commit('loadingTableStatus', true)
  await serviceMethod.common("post", `patient/${data.id}/staff`, null, data.data).then((response) => {
    commit('assignSpecialistToPatient', response.data.data);
    commit('loadingTableStatus', false)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
  return status
}


export const submitActionForm = async ({
  commit
}, data) => {
  let status = false
  commit('loadingTableStatus', true)
  await serviceMethod.common("post", `escalation/${data.escalationId}/action`, null, data.data).then((response) => {
    commit('submitActionForm', response.data.data);
    successSwal(response.data.message)
    commit('loadingTableStatus', false)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
  return status
}


// Escalation details for notifications 
export const getEscalationId = async ({
  commit
}, id) => {
  let status = false
  commit('loadingTableStatus', true)
  try {
    let resp = await serviceMethod.common("get", `escalationList/${id}`, null, null)
    // commit('getEscalationId', resp.data.data)
    if(resp.data.data){
    let id = resp.data.data.id
    let patientId = resp.data.data.patientId
    let response = await serviceMethod.common("get", `escalation/${id}`, null, null)
    commit('singleEscalationRecord', response.data.data)
    let ptresp = await serviceMethod.common("get", API_ENDPOINTS['patient'], patientId, null)
      commit('patientDetails', ptresp.data.data);
      status = true
    }
    commit('loadingTableStatus', false)
  }
  //  commit('loadingTableStatus', false)
  catch (error) {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error)
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }if (error.response.status === 404) {
      errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  }
  return status
}


export const getAuditData = async ({
  commit
}, id) => {
  let status = false
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", `escalation/${id}/audit`, null, null).then((response) => {
    commit('getAuditData', response.data.data);
    commit('loadingTableStatus', false)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
  return status
}


export const closeEscalation = async ({
  commit
}, data) => {
  let status = false
  commit('loadingTableStatus', true)
  await serviceMethod.common("post", `escalation/${data.escalationId}/close`, null, data).then((response) => {
    commit('closeEscalation', response.data.data);
    successSwal(response.data.message)
    commit('loadingTableStatus', false)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
  return status
}



export const escalationComment = async ({
  commit
}, data) => {
  let status = false
  commit('loadingTableStatus', true)
  await serviceMethod.common("post", `escalationAudit/${data.escalationId}/comment`, null, data).then((response) => {
    commit('escalationComment', response.data.data);
    successSwal(response.data.message)
    commit('loadingTableStatus', false)
    status = true
  }).catch((error) => {
    status = false
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('errorMsg', error);
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    }
    commit('loadingTableStatus', false)
  })
  return status
}