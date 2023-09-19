import serviceMethod from '@/services/serviceMethod';
import {
  successSwal,
  // errorSwal,
  errorLogWithDeviceInfo,
} from '@/commonMethods/commonMethod';
import {
  API_ENDPOINTS
} from "@/config/apiConfig"
import Swal from 'sweetalert2';
import router from '../../router/index'
const errorMessage = []

export const addDemographic = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", "patient", null, data.demographics).then((response) => {
    
    commit('addDemographic', response.data.data);
    commit('status', true)

    if (data.responsiblePerson.self ||
      data.responsiblePerson.relation ||
      data.responsiblePerson.firstName ||
      data.responsiblePerson.middleName ||
      data.responsiblePerson.lastName ||
      data.responsiblePerson.email ||
      data.responsiblePerson.phoneNumber ||
      data.responsiblePerson.contactType.length > 0 ||
      data.responsiblePerson.contactTime.length > 0 ||
      data.responsiblePerson.gender) {
      serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${response.data.data.id}/responsible`, null, data.responsiblePerson).then((response) => {
        commit("responsiblePerson", response.data.data)
      })
    }

    if (data.emergencyContactForm.sameAsPrimary ||
      data.emergencyContactForm.firstName ||
      data.emergencyContactForm.middleName ||
      data.emergencyContactForm.lastName ||
      data.emergencyContactForm.emergencyEmail ||
      data.emergencyContactForm.phoneNumber ||
      data.emergencyContactForm.contactType.length > 0 ||
      data.emergencyContactForm.contactTime.length > 0 ||
      data.emergencyContactForm.gender) {
      serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${response.data.data.id}/emergency`, null, data.emergencyContactForm).then((response) => {
        commit('emergencyContact', response.data.data);
      }).catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
          if (error.response.status === 422) {
            commit('emergencyErrorMsg', error.response.data)
            commit('loadingStatus', false)
          }
        } else {
          errorLogWithDeviceInfo(error);
        }
        commit('loadingStatus', false)
        //commit('counterMinus')
      })
    }

    if ((data.referal.referral != null || data.referal.referralDesignation != null || data.referal.referralEmail != null || data.referal.referralFax != null || data.referal.firstName ||
        data.referal.middleName ||
        data.referal.lastName || data.referal.referralPhoneNumber != null) && (data.referal.middleName || data.referal.lastName || data.referal.firstName || data.referal.referral != "" || data.referal.referralDesignation != "" || data.referal.referralEmail != "" || data.referal.referralFax != "" || data.referal.referralName != "" || data.referal.referralPhoneNumber != "")) {
      serviceMethod.common("post", `patient/${response.data.data.id}/referral`, null, data.referal).then(response => {
        commit('addPatientReferals', response.data.data);
        commit('patientReferralSource', response.data.data);
        errorMessage.push(false)
      }).catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
          if (error.response.status === 422) {
            commit('errorMsg', error.response.data)
            commit('loadingStatus', false)
          }
        } else {
          errorLogWithDeviceInfo(error);
        }
        commit('loadingStatus', false)
        //commit('counterMinus')
      })
    }
    commit('loadingStatus', false)
    commit('counterPlus')
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
   
      if (error.response.status === 422) {
        commit('errorMsg', error.response.data)
        commit('loadingStatus', false)
        commit("resetCounter")
        
      }
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
   //commit('counterMinus')
  })
 
}



/**
 * Update Demographics
 */

export const updateDemographic = async ({
  commit
}, request) => {
  const data = request.data
  const patientUdid = request.patientUdid
  const responsiblePersonId = request.responsiblePersonId
  const emergencyContactId = request.emergencyContactId
  const referalId = request.referalId
  commit('loadingStatus', true)

  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${patientUdid}`, null, data.demographics).then((response) => {
    commit('status', true)
    commit('loadingStatus', false)
    commit('addDemographic', response.data.data);
    if (responsiblePersonId) {
      serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${patientUdid}/responsible/${responsiblePersonId}`, null, data.responsiblePerson).then((response) => {
        commit("responsiblePerson", response.data.data)
      })
    } else if (!responsiblePersonId && (data.responsiblePerson.self ||
        data.responsiblePerson.relation ||
        data.responsiblePerson.firstName ||
        data.responsiblePerson.middleName ||
        data.responsiblePerson.lastName ||
        data.responsiblePerson.email ||
        data.responsiblePerson.phoneNumber ||
        data.responsiblePerson.contactType.length > 0 ||
        data.responsiblePerson.contactTime.length > 0 ||
        data.responsiblePerson.gender)) {
      serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${patientUdid}/responsible`, null, data.responsiblePerson).then((response) => {
        commit("responsiblePerson", response.data.data)
      }).catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
          if (error.response.status === 422) {
            commit('errorMsg', error.response.data)
            commit('loadingStatus', false)
          }
          else if (error.response.status === 500) {
            commit('loadingStatus', false)
          }
          else if (error.response.status === 401) {
            // commit('errorMsg', error.response.data.message)
            commit('loadingStatus', false)
          }
        }
        else {
          errorLogWithDeviceInfo(error);
        }
      })
    }
    if (emergencyContactId) {


      serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${patientUdid}/emergency/${emergencyContactId}`, null, data.emergencyContactForm).then((response) => {
        commit('emergencyContact', response.data.data);
      }).catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
        } else {
          errorLogWithDeviceInfo(error);
        }
        // if (error.response.status === 422) {
        //   commit('errorMsg', error.response.data)
        //   commit('loadingStatus', false)
        // } else if (error.response.status === 500) {
        //   errorSwal(error.response.data.message)
        //   commit('loadingStatus', false)
        // } else if (error.response.status === 401) {
        // commit('errorMsg', error.response.data.message)
        commit('loadingStatus', false)
        // }
      })
    } else if (!emergencyContactId && (data.emergencyContactForm.firstName ||
        data.emergencyContactForm.middleName ||
        data.emergencyContactForm.lastName ||
        data.emergencyContactForm.emergencyEmail ||
        data.emergencyContactForm.phoneNumber ||
        data.emergencyContactForm.contactType.length > 0 ||
        data.emergencyContactForm.contactTime.length > 0 ||
        data.emergencyContactForm.gender)) {


      serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${patientUdid}/emergency`, null, data.emergencyContactForm).then((response) => {
        commit('emergencyContact', response.data.data);
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
    if (referalId) {

      serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${patientUdid}/referral/${referalId}`, null, data.referal).then(response => {
        commit('addPatientReferals', response.data.data);
        commit('patientReferralSource', response.data.data);
        errorMessage.push(false)
      })
    } else if (!referalId && (data.referal.middleName != null || data.referal.lastName != null || data.referal.firstName != null || data.referal.referral != null || data.referal.referralDesignation != null || data.referal.referralEmail != null || data.referal.referralFax != null ||
        data.referal.referralPhoneNumber != null) && (data.referal.middleName != "" || data.referal.lastName != "" || data.referal.firstName != "" || data.referal.referral != "" || data.referal.referralDesignation != "" || data.referal.referralEmail != "" || data.referal.referralFax != "" || data.referal.referralName != "" || data.referal.referralPhoneNumber != "")) {
      serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${patientUdid}/referral`, null, data.referal).then(response => {
        commit('addPatientReferals', response.data.data);
        commit('patientReferralSource', response.data.data);
        errorMessage.push(false)
      }).catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
        } else {
          errorLogWithDeviceInfo(error);
        }
        // if (error.response.status === 422) {
        //   commit('errorMsg', error.response.data)
        //   commit('loadingStatus', false)
        // } else if (error.response.status === 500) {
        //   errorSwal(error.response.data.message)
        //   commit('loadingStatus', false)
        // } else if (error.response.status === 401) {
        //   // commit('errorMsg', error.response.data.message)
        commit('loadingStatus', false)
        // }
      })
    }
    commit('counterPlus')
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







export const patients = async ({
  commit
}, page) => {
  commit('loadingTableStatus', true)
  let link = page ? "patient" + page : "patient"
  await serviceMethod.common("get", link, null, null).then((response) => {

    commit('patient', response.data)
    commit('loadingTableStatus', false)

  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingTableStatus', false)
  })

}

export const patientsDelete = async ({
  commit
}, id) => {
let status = false
  await serviceMethod.common("delete", "patient", id, null).then((response) => {
    successSwal(response.data.message)
    status = true
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingTableStatus', false)
  })
  return status
}
export const addCondition = async ({ commit }, request) => {
  const data = request.data;
  const patientId = request.id;
  commit('loadingStatus', true)
  await serviceMethod.common("post", `patient/${patientId}/condition`, null, data).then(response => {
    commit('patients.value', response.data.data);
    commit('addCondition', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response.status == 422) {
      commit('errorMsg', error.response.data)
      errorMessage.push(true)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
  commit('errorMessage', errorMessage)
}

export const updateCondition = async ({ commit }, request) => {
  const data = request.data;
  const patientId = request.patientUdid;
  const conditionUdid = request.conditionUdid;
  commit('loadingStatus', true)
  await serviceMethod.common("put", `patient/${patientId}/condition/${conditionUdid}`, null, data).then(response => {
    commit('patients.value', response.data.data);
    commit('addCondition', response.data.data);
    commit('loadingStatus', false)
    errorMessage.push(true)
  }).catch((error) => {
    if (error.response.status == 422) {
      commit('errorMsg', error.response.data)
      errorMessage.push(true)
      commit('loadingStatus', false)
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}

export const patientConditions = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + id + '/condition', null, null).then((condition) => {
    commit('patientConditions', condition.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const conditionDetails = async ({ commit }, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${data.patientUdid}/condition/${data.conditionUdid}`, null, null).then((response) => {
    commit('conditionDetails', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const deletePatientCondition = async ({ commit }, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", API_ENDPOINTS['patient']+`/${data.patientUdid}/condition/${data.conditionUdid}`, null, null).then((response) => {
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const programList = async ({
  commit
}) => {
  //commit('loadingStatus', true)
  await serviceMethod.common("get", `program?all=all`, null, null).then((response) => {
    commit('programList', response.data.data);
    // commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    //commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const programDetails = async ({
  commit
}, data) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/program/${data.programId}`, null, null).then((response) => {
    commit('programDetails', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })
}


export const addPatientProgram = async ({
  commit
}, data) => {
  await serviceMethod.common("post", `patient/${data.id}/program`, null, data.data).then((response) => {
    commit('addPatientProgram', response.data.data);
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
      commit('errorMsg', {
        program: [error.response.data.message]
      })
      // errorSwal(error.response.data.message)
    }
  })

}

export const updatePatientProgram = async ({
  commit
}, data) => {
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/program`, null, data.data).then((response) => {
    commit('addPatientProgram', response.data.data);
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
  })

}
export const updatePatientStatus = async ({
  commit
}, data) => {
  await serviceMethod.common("put", 'patientStatus/' + data.id, null, data.data).then((response) => {
    successSwal(response.data.message)
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
  })

}

export const deleteProgram = async ({
  commit
}, data) => {
  await serviceMethod.common("delete", `patient/${data.id}/program/${data.programID}`, null, null).then((response) => {
    commit('programDetails', null);
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })

}



export const program = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `patient/${id}/program`, null, null).then((response) => {
    commit('programPatients', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })

}

export const addDevice = async ({
  commit
}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("post", `patient/${data.id}/inventory`, null, data.data).then((response) => {
    commit('addDevice', response.data.data);
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('errorMsg', null) 
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
      // commit('errorMsg', error.response.data.message)
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 409) {
      let deviceType = ""
      if(data.data.deviceType == 99) {
        deviceType = 'Blood Pressure '
      }
      else if(data.data.deviceType == 100) {
        deviceType = 'Oximeter '
      }
      else if(data.data.deviceType == 101) {
        deviceType = 'Glucose '
      }
      commit('errorMsg', {
        message: deviceType+error.response.data.message
      })
    }
    commit('loadingStatus', false)
    
  })
  return status
}



export const changeStatus = async ({
  commit
}, data) => {
  const status = {
    status: data.status
  }
  await serviceMethod.common("put", `patient/${data.id}/inventory/${data.inventoryId}`, null, status).then((response) => {
    commit('changeStatus', response.data.data);
    successSwal(response.data.message)
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
      commit('errorMsg', error.response.data.message)
    }
  })
}

export const deleteDevice = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", `patient/${data.id}/inventory/${data.deviceId}`, null, data.data).then((response) => {
    commit('deleteDevice', response.data.data);
    successSwal(response.data.message)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const devices = async ({
  commit
}, id) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("get", `patient/${id}/inventory`, null, null).then((response) => {
    commit('devices', response.data.data);
    status =  response.data.data?.length>0?true:false
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
  return status
}


export const inventoryList = async ({
  commit
}, data) => {
  var url = data.active ?
    `inventory?isAvailable=${data.isAvailable}&deviceType=${data.deviceType}&active=1` :
    `inventory?isAvailable=${data.isAvailable}&deviceType=${data.deviceType}`
  await serviceMethod.common("get", url, null, null).then((response) => {
    commit('inventoryList', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 404) {
      commit('inventoryList', [])
      commit('errorMsg', error.response.data)
    } else {
      // errorSwal(error.response.data.message)
    }
  })
}


let temp = []
export const parameterFields = async ({
  commit
}, id) => {
  await serviceMethod.common("get", `field/${id}`, null, null).then((response) => {
    temp[id] = response.data.data ? response.data.data :
      commit('parameterFields', temp)
  }).catch(() => {})
}


export const parameter = async ({
  commit
}, data) => {
  await serviceMethod.common("post", `patient/${data.id}/vital`, null, {
    vital: data.vital
  }).then((response) => {
    commit('parameter', response.data.data);
    commit('counterPlus')
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
    }
  })

}


export const addClinicalHistory = async ({
  commit
}, data) => {
  await serviceMethod.common("post", `patient/${data.id}/medicalHistory`, null, data.data).then((response) => {
    commit('addClinicalHistory', response.data.data);
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
    }
  })
}

export const deleteClinicalData = async ({
  commit
}, data) => {
  await serviceMethod.common("delete", `patient/${data.id}/medicalHistory/${data.clinicalId}`, null, null).then((response) => {
    commit('deleteClinicalData', response.data.data);
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })
}


export const clinicalHistoryList = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `patient/${id}/medicalHistory`, null, null).then((response) => {
    commit('clinicalHistoryList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })

}



export const addClinicalMedicat = async ({
  commit
}, data) => {
  await serviceMethod.common("post", `patient/${data.id}/medicalRoutine`, null, data.data).then((response) => {
    commit('addClinicalMedicat', response.data.data);
    successSwal(response.data.message)
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
    }
  })
}

export const deleteClinicalMedicat = async ({
  commit
}, data) => {
  await serviceMethod.common("delete", `patient/${data.id}/medicalRoutine/${data.clinicalId}`, null, null).then((response) => {
    commit('deleteClinicalMedicat', response.data.data);
    successSwal(response.data.message)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })
}

export const clinicalMedicatList = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `patient/${id}/medicalRoutine`, null, null).then((response) => {
    commit('clinicalMedicatList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}

export const patientVitalList = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `patient/${id}/vital`, null, null).then((response) => {
    commit('patientVitalList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingStatus', false)
    // errorSwal(error.response.data.message)
  })
}




export const addInsurance = async ({
  commit
}, data) => {
  let insurance = [];
  let insuranceData = data.data.insurance[0];
  insurance = insuranceData.insuranceNumber.map((item, i) => {
    let finalInsurance = {
      "expirationDate": "",
      "insuranceName": "",
      "insuranceNumber": "",
      "insuranceType": "",
    };
    if (insuranceData.insuranceName[i] != undefined && insuranceData.insuranceNumber[i] != "") {
      finalInsurance.expirationDate = insuranceData.expirationDate[i];
      finalInsurance.insuranceName = insuranceData.insuranceName[i];
      finalInsurance.insuranceNumber = insuranceData.insuranceNumber[i];
      finalInsurance.insuranceType = insuranceData.insuranceType[i];
      return finalInsurance;
    }
  })
  let record = {
    insurance: insurance.filter(item=> {return item}),
    betrix:data?.data?.betrix
  }
  
  commit('loadingStatus', true)
  await serviceMethod.common("post", `patient/${data.id}/insurance`, null, record).then((response) => {
    commit('addInsurance', response.data.data);
    commit('counterPlus')
    // successSwal(response.data.message)
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
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}


export const updateInsurance = async ({
  commit
}, data) => {
  let insurance = [];
  let insuranceData = data.data.insurance[0];
  insurance = insuranceData.insuranceNumber.map((item, i) => {
    let finalInsurance = {
      "expirationDate": "",
      "insuranceName": "",
      "insuranceNumber": "",
      "insuranceType": "",
    };
    if (insuranceData.insuranceName[i] != undefined) {
      finalInsurance.expirationDate = insuranceData.expirationDate[i];
      finalInsurance.insuranceName = insuranceData.insuranceName[i];
      finalInsurance.insuranceNumber = insuranceData.insuranceNumber[i];
      finalInsurance.insuranceType = insuranceData.insuranceType[i];
      return finalInsurance;
    }
  })
  commit('loadingStatus', true)
  await serviceMethod.common("put", `patient/${data.id}/insurance/${data.insuranceID}`, null, {
    insurance: insurance
  }).then((response) => {
    commit('updateInsurance', response.data.data);
    commit('counterPlus')
    // successSwal(response.data.message)
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
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}

export const patientInsurance = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `patient/${id}/insurance`, null, null).then((response) => {
    commit('patientInsurance', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const addDocument = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", `patient/${data.id}/document`, null, data.data).then((response) => {
    commit('addDocument', response.data.data);
    successSwal(response.data.message)
    commit('loadingStatus', false)
    // commit('counterPlus')
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
    }
    commit('loadingStatus', false)
  })
}


export const deleteDocument = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", `patient/${data.id}/document/${data.documentId}`, null, null).then((response) => {
    commit('deleteDocument', response.data.data);
    successSwal(response.data.message)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}



export const documents = async ({
  commit
}, id) => {
  commit('loadingTableStatus', true)
  await serviceMethod.common("get", `patient/${id}/document`, null, null).then((response) => {
    commit('documents', response.data.data);
    commit('loadingTableStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('loadingTableStatus', false)
    // errorSwal(error.response.data.message)
  })
}



export const uploadFile = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", `file`, null, data).then((response) => {
    commit('uploadFile', response.data.data.path);
    commit('loadingStatus', false)
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
    }
    commit('loadingStatus', false)
  })
}

export const patientDetails = async ({ commit }, id) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'], id, null).then((response) => {
    commit('patientDetails', response.data.data);
    //commit('addDemographic', null);
    commit('startOn', false)
  }).catch((error) => {
   
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
      if (error.response.status === 500) {
        // errorSwal('User Deleted/Deactivated')
        Swal.fire({
          text: 'User Deleted/Deactivated',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then(() => {
          commit('startOn', true)
          router.push('/manage-patients')
        })
        commit('loadingStatus', false)
      }
    } else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const responsiblePerson = async ({
  commit
}, id) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${id}/responsible`, null, null).then((response) => {
    commit("responsiblePerson", response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}

export const emergencyContact = async ({
  commit
}, id) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${id}/emergency`, null, null).then((response) => {
    commit('emergencyContact', response.data.data)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}

export const patientTimeline = async ({ commit }, data) => {
  let page = null
  if(data.search){
    page = data.page? '?type=' + data.type + '&page='+data.page + '&search='+data.search :'?type=' + data.type + '&search='+data.search
  }else{
    page = data.page? '?type=' + data.type + '&page='+data.page  :'?type=' + data.type 
  }
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + data.id + '/timeLine' + page, null, null).then((response) => {
    commit('patientTimelineSuccess', response.data);
    commit('loadingTimelineStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })
}

export const patientDocuments = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + id + '/document', null, null).then((response) => {
    commit('patientDocumentsSuccess', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const latestDocument = async ({
  commit
}, id) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + id + '/document?latest=latest', null, null).then((response) => {
      if (response.data.data.length > 0) {
        commit('latestDocumentSuccess', response.data.data);
      } else {
        commit('latestDocumentSuccess', null)
      }
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      /* if (error.response.status == 401) {
      	//AuthService.logout();
      } */
      commit('failure', error);
    })
}

export const latestDevice = async ({
  commit
}, id) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + id + '/inventory?latest=latest', null, null).then((response) => {
      if (response.data.data.length > 0) {
        commit('latestDeviceSuccess', response.data.data);
      } else {
        commit('latestDeviceSuccess', null)
      }
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      /* if (error.response.status == 401) {
      	//AuthService.logout();
      } */
      commit('failure', error);
    })
}

export const latestVital = async ({
  commit
}, id) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + id + '/vital/latest', null, null).then((response) => {
      if (response.data.data.length > 0) {
        commit('latestVital', response.data.data);
      } else {
        commit('latestVital', null)
      }
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      /* if (error.response.status == 401) {
      	//AuthService.logout();
      } */
      commit('failure', error);
    })
}



export const patientSearchWithBitrix = async ({
  commit
}, data) => {
  await serviceMethod.common("get", `bitrix/deal?title=${data.search}`, null, null).then((response) => {
      commit('patientSearchWithBitrix', response.data.result);
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      // errorSwal(error.response.data.message)
      commit('failure', error.response.data);
    })
}


export const getBitrixFieldsName = async ({
  commit
}) => {
  await serviceMethod.common("get", `bitrix/fields`, null, null).then((response) => {
      commit('getBitrixFieldsName', response.data.data);
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      // errorSwal(error.response.data.message)
      commit('failure', error.response.data);
    })
}



export const fetchFromBitrix = async ({
  commit
}, id) => {
  await serviceMethod.common("get", `bitrix/deal/${id}`, null, null).then((response) => {
      commit('fetchFromBitrix', response.data.result);
      commit('bitrixFormCheck', true)
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      // errorSwal(error.response.data.message)
      commit('failure', error.response.data);
    })
}

export const patientVitals = async ({ commit }, { patientId, deviceType, filter }) => {
  // commit('loadingTableStatus', true)
  if(deviceType==99){
    await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientId}/vital?deviceType=${deviceType+filter}`, null, null).then((response) => {
        commit('patientVitals99', response.data.data)
      })
      .catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
        } else {
          errorLogWithDeviceInfo(error);
        }
        commit('failure', error);
      })
  }
  if(deviceType==100){
    await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientId}/vital?deviceType=${deviceType+filter}`, null, null).then((response) => {
        commit('patientVitals100', response.data.data)
      })
      .catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
        } else {
          errorLogWithDeviceInfo(error);
        }
        commit('failure', error);
      })
  }
  if(deviceType==101){
    await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientId}/vital?deviceType=${deviceType+filter}`, null, null).then((response) => {
        commit('patientVitals101', response.data.data)
      })
      .catch((error) => {
        if (error.response) {
          errorLogWithDeviceInfo(error.response);
        } else {
          errorLogWithDeviceInfo(error);
        }
        commit('failure', error);
      })
  }
 
}

export const addVital = async ({
  commit
}, data) => {
  let status = false
  commit('loadingStatus', true)
  await serviceMethod.common("post", API_ENDPOINTS['patient'] + '/' + data.patientId + '/vital', null, data.data).then(() => {
      commit('loadingStatus', false)
      status = true
    })
    .catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      commit('failure', error);
      commit('loadingStatus', false)
    })

    return status
}

export const addCriticalNote = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", `${API_ENDPOINTS['patient']}/${data.udid}/criticalNote`, null, data.criticalNote).then((response) => {
    commit('addCriticalNote', response.data.data);
    commit('closeModal', true)
    successSwal(response.data.message)
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

export const updateCriticalNote = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", `${API_ENDPOINTS['patient']}/${data.patientId}/criticalNote/${data.criticalNoteId}`, null, data.criticalNote).then((response) => {
    commit('closeModal', true)
    successSwal(response.data.message)
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

export const patientCriticalNotes = async ({
  commit
}, patientUdid) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + '/' + patientUdid + '/' + API_ENDPOINTS['criticalNote'] + "?isRead=0", null).then((response) => {
    commit('patientCriticalNotes', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const readUnreadCriticalNote = async ({
  commit
}, data) => {
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + '/' + data.patientUdid + '/' + API_ENDPOINTS['criticalNote'] + '/' + data.criticalNoteId, null, {
    isRead: data.isRead
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
    commit('loadingStatus', false)
  })
}

export const patientFlags = async ({ commit }, from) => {
  await serviceMethod.common("get", API_ENDPOINTS['flag']+`?type=patient` , null, null).then((response) => {
      serviceMethod.common("get", API_ENDPOINTS['patientsFlag']+ "?fromDate=" + from.fromDate + "&toDate=" + from.toDate, null, null).then((flags) => {
          commit('patientFlags', {
            flags: response.data.data,
            data: flags.data
          });
          
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

export const criticalNotesList = async ({
  commit
}, id) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `${API_ENDPOINTS['patient']}/${id}/criticalNote`, null, null).then((response) => {
    commit('criticalNotesList', response.data.data);
    commit('latestCriticalNote', response.data.data);
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
export const criticalNoteDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", `${API_ENDPOINTS['patient']}/${data.patientUdid}/criticalNote/${data.criticalNoteId}`, null, null).then((response) => {
    commit('criticalNoteDetails', response.data.data);
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


export const criticalNotesDelete = async ({
  commit
}, data) => {
  await serviceMethod.common("delete", `${API_ENDPOINTS['patient']}/${data.id}/criticalNote/${data.documentId}`, null, null).then((response) => {
    commit('criticalNotesDelete', response.data.data);
    successSwal(response.data.message)
    commit('closeModal', true)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)
  })
}

/**
 * Patient Family Members
 */

export const familyMembersList = async ({
  commit
}, patientUdid) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${patientUdid}/family`, null, null).then((response) => {
    commit('familyMembersList', response.data.data);
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

// export const addFamilyMember = async ({
//   commit
// }, data) => {
//   commit('loadingStatus', true)
//   await serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${data.patientUdid}/familyAdd`, null, data.data).then((response) => {
//     successSwal(response.data.message)
//     commit('loadingStatus', false)
//     commit('closeModal', true)
//   }).catch((error) => {
//     if (error.response) {
//       errorLogWithDeviceInfo(error.response);
//     } else {
//       errorLogWithDeviceInfo(error);
//     }
//     if (error.response.status === 422) {
//       commit('errorMsg', error.response.data)
//     } else if (error.response.status === 500) {
//       // errorSwal(error.response.data.message)
//     }
//     commit('closeModal', false)
//     commit('loadingStatus', false)
//   })
// }

export const updateFamilyMember = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/familyUpdate/${data.familyUdid}`, null, data.data).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('closeModal', true)
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
    }
    commit('loadingStatus', false)
    commit('closeModal', false)
  })
}

export const deleteFamilyMember = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", API_ENDPOINTS['patient'] + `/${data.patientUdid}/family/${data.familyUdid}`, null, data.data).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('closeModal', true)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

export const familyMemberDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/family/${data.familyUdid}`, null, data.data).then((response) => {
    commit('familyMemberDetails', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
  })
}

/**
 * Patient Physicians
 */

export const addPhysician = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${data.patientUdid}/physician`, null, data.data).then((response) => {
    commit('loadingStatus', false)
    successSwal(response.data.message)
    commit('closeModal', true)
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
    }
    commit('loadingStatus', false)
    commit('closeModal', false)
  })
}

export const updatePhysician = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/physician/${data.familyUdid}`, null, data.data).then((response) => {
    commit('loadingStatus', false)
    successSwal(response.data.message)
    commit('closeModal', true)
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
    }
    commit('loadingStatus', false)
    commit('closeModal', false)
  })
}

export const physiciansList = async ({
  commit
}, patientUdid) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${patientUdid}/physician`, null, null).then((response) => {
    commit('physiciansList', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

export const deletePhysician = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", API_ENDPOINTS['patient'] + `/${data.patientUdid}/physician/${data.physicianUdid}`, null, null).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('closeModal', true)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

export const physicianDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/physician/${data.physicianUdid}`, null, null).then((response) => {
    commit('physicianDetails', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

/**
 * Patient Emergency Contacts
 */

export const emergencyContactsList = async ({
  commit
}, patientUdid) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${patientUdid}/emergency`, null, null).then((response) => {
    commit('emergencyContactsList', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

export const emergencyContactDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/emergency/${data.contactUdid}`, null, null).then((response) => {
    commit('emergencyContactDetails', response.data.data)
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}

export const addEmergencyContact = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("post", API_ENDPOINTS['patient'] + `/${data.patientUdid}/emergency`, null, data.data).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('closeModal', true)
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
    }
    commit('loadingStatus', false)
    commit('closeModal', false)
  })
}

export const updateEmergencyContact = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/emergency/${data.contactUdid}`, null, data.data).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('closeModal', true)
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
    }
    commit('loadingStatus', false)
    commit('closeModal', false)
  })
}

export const deleteEmergencyContact = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("delete", API_ENDPOINTS['patient'] + `/${data.patientUdid}/emergency/${data.contactUdid}`, null, null).then((response) => {
    successSwal(response.data.message)
    commit('loadingStatus', false)
    commit('closeModal', true)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
}
export const timeLineType = async ({
  commit
}) => {

  await serviceMethod.common("get", API_ENDPOINTS['timeLineType'], null, null).then((response) => {
    commit('timeLineType', response.data.data);

  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)

  })
}

export const updateProfileImage = async ({
  commit
}, data) => {
  commit('isPicuteLoading', true)
  await serviceMethod.common("post", `file`, null, data.formData).then((response) => {
    const imagepath = {
      profilePhoto: response.data.data.path
    }
    serviceMethod.common("put", API_ENDPOINTS['patientProfile'], data.patientUdid, imagepath).then((result) => {
      successSwal(result.data.message)
    }).catch((error) => {
      if (error.response) {
        errorLogWithDeviceInfo(error.response);
      } else {
        errorLogWithDeviceInfo(error);
      }
      if (error.response.status === 422) {
        // errorSwal(error.response.data.file[0])
      } else if (error.response.status === 500) {
        // errorSwal(error.response.data.message)
      } else if (error.response.status === 401) {
        // errorSwal(error.response.data.message)
      }
      commit('isPicuteLoading', false)
    })
  }).catch((error) => {
    if (error.response.status == 422) {
      // errorSwal(error.response.data.file[0])
    } else if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
    } else if (error.response.status === 401) {
      // errorSwal(error.response.data.message)
    }
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    commit('isPicuteLoading', false)
  })
}

export const medicalHistoryDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/medicalHistory/${data.medicalHistoryUdid}`, null, null).then((response) => {
    commit('medicalHistoryDetails', response.data.data)
    commit('loadingStatus', false)
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
}

export const updateClinicalHistory = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/medicalHistory/${data.medicalHistoryUdid}`, null, data.data).then((result) => {
    successSwal(result.data.message)
    commit('loadingStatus', false)
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
}

export const medicationDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/medicalRoutine/${data.medicalHistoryUdid}`, null, null).then((response) => {
    commit('medicationDetails', response.data.data)
    commit('loadingStatus', false)
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
}

export const updateMedicalRoutine = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/medicalRoutine/${data.medicalRoutineUdid}`, null, data.data).then((result) => {
    successSwal(result.data.message)
    commit('loadingStatus', false)
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
}

export const documentDetails = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("get", API_ENDPOINTS['patient'] + `/${data.patientUdid}/document/${data.documentUdid}`, null, null).then((response) => {
    commit('documentDetails', response.data.data)
    commit('loadingStatus', false)
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
}

export const updateDocument = async ({
  commit
}, data) => {
  commit('loadingStatus', true)
  await serviceMethod.common("put", API_ENDPOINTS['patient'] + `/${data.patientUdid}/document/${data.documentUdid}`, null, data.data).then((result) => {
    successSwal(result.data.message)
    commit('loadingStatus', false)
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
}



export const referralList = async ({
  commit
}) => {
  await serviceMethod.common("get", 'referral?referral=referral', null, null).then((response) => {
    commit('referralList', response.data.data);

  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)

  })

}
export const referralDetail = async ({
  commit
}, id) => {
  await serviceMethod.common("get", 'patient/' + id + '/referral', null, null).then((response) => {
    commit('referralDetail', response.data.data);

  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    // errorSwal(error.response.data.message)

  })

}

export const healthConditions = async ({ commit }) => {
  await serviceMethod.common("get", API_ENDPOINTS['condition'], null, null).then((response) => {
    commit('healthConditions', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const nonComplianceDetails = async ({ commit }, patientId) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientId}/nonCompliance`, null, null).then((response) => {
    commit('nonComplianceDetails', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}

export const addPatientGroup = async ({ commit }, data) => {
  let status = false
  await serviceMethod.common("post", API_ENDPOINTS['patient']+`/${data.patientId}/group`, null, data.data).then((response) => {
    commit('addPatientGroup', response.data.data);
    successSwal(response.data.message)
    status = true
  }).catch((error) => {
    if (error.response) {
      if (error.response.status == 422) {
        
        commit('errorMsg', error.response.data)
      }
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
  return status
}

export const getPatientGroup = async ({ commit }, patientId) => {
  await serviceMethod.common("get", API_ENDPOINTS['patient']+`/${patientId}/group`, null, null).then((response) => {
    commit('getPatientGroup', response.data.data);
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    }
    else {
      errorLogWithDeviceInfo(error);
    }
  })
}



export const deleteFlag = async ({
  commit
}, data) => {
  let status = false
  let url = data?.flagId ? `patient/${data.id}/flag/${data?.flagId}` : `patient/${data.id}/flag`
  commit('loadingStatus', true)
  await serviceMethod.common("post", url, null,data).then((response) => {
    successSwal(response.data.message)
    status = true
    commit('loadingStatus', false)
  }).catch((error) => {
    if (error.response) {
      errorLogWithDeviceInfo(error.response);
    } else {
      errorLogWithDeviceInfo(error);
    }
    if (error.response.status === 500) {
      // errorSwal(error.response.data.message)
      commit('loadingStatus', false)
    }
    commit('loadingStatus', false)
  })
  return status
}
