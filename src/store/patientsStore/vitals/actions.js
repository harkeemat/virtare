import api from '@/services/api';
import { successSwal } from '@/commonMethods/commonMethod'
import {
  getCsvFile,
  // downloadPdfFromBase64,
} from '@/commonMethods/commonMethod';
import {
  // base64Vitals,
  // samplePdf,
} from '@/config/base64.js';

export const deviceTypes = async ({ commit }) => {
  let status = false
  let url = `patientData/deviceType`
  await api.get(url, null, null).then((response) => {
    commit('deviceTypes', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  return status
}

export const reviewStatus = async ({ commit }) => {
  commit('patientVitalsLoader', true)
  let status = false
  await api.get('reviewStatus', null, null).then((response) => {
    commit('reviewStatus', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

/* export const vitalComments = async ({ commit }) => {
  let status = false
  let url = `patientData/comment`
  await api.get(url, null, null).then((response) => {
    commit('vitalComments', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  return status
} */

export const vitalStatus = async ({ commit }) => {
  let status = false
  let url = `patientData/status`
  await api.get(url, null, null).then((response) => {
    commit('vitalStatus', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  return status
}

export const vitalFeelingStatus = async ({ commit }) => {
  let status = false
  let url = `patientData/feelingStatus`
  await api.get(url, null, null).then((response) => {
    commit('vitalFeelingStatus', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  return status
}

export const vitalFields = async ({ commit }, deviceType) => {
  commit('patientVitalsLoader', true)
  let status = false
  let url = `patientData/vitalField?deviceType=${deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('vitalFields', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const glucoseRangeVitalFields = async ({ commit }, deviceType) => {
  commit('patientVitalsLoader', true)
  let status = false
  let url = `patientData/vitalField?deviceType=${deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('glucoseRangeVitalFields', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const glucoseVitalFieldsDropdown = async ({ commit }, deviceType) => {
  commit('patientVitalsLoader', true)
  let status = false
  let url = `patientData/vitalFieldGlucose?deviceType=${deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('glucoseVitalFieldsDropdown', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const addVitals = async ({ commit }, data) => {
  let status = false
  commit('buttonLoader', true)
  let url = `patientData/${data?.patientId}/vital`
  await api.post(url, data?.data, null).then((response) => {
    successSwal(response?.data?.message)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('buttonLoader', false)
  return status
}

export const patientVitalsTable = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let endParams = data?.endParams ? data?.endParams : ''
  let url = `patientData/${data?.patientId}/vital?deviceType=${data?.deviceType}${endParams}`
  await api.get(url, null, null).then((response) => {
    commit('patientVitalsTable', {
      activeTab: data?.activeTab,
      data: response?.data?.data,
      meta: response?.data?.meta,
    })
    status = true
    const leftTabHeight =  document.querySelector(".rightCollapse .ant-tabs-content-holder")
    let setNotesHeight = document.querySelector(".patientNotesInner")
    setNotesHeight ? setNotesHeight.style.height = leftTabHeight?.offsetHeight + "px" :''
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const patientVitalsGraph = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let vitalType = data?.vitalType ? `&vitalType=${data?.vitalType}` : "";
  let url = `patientData/${data?.patientId}/vitalGraph?deviceType=${data?.deviceType}${vitalType}`
  await api.get(url, null, null).then((response) => {
    commit('patientVitalsGraph', {
      activeTab: data?.activeTab,
      data: response?.data?.data
    })
    status = true
    const leftTabHeight =  document.querySelector(".rightCollapse .ant-tabs-content-holder")
    let setNotesHeight = document.querySelector(".patientNotesInner")
    setNotesHeight ? setNotesHeight.style.height = leftTabHeight?.offsetHeight + "px" :''
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const patientLatestVitals = async ({ commit }, patientId) => {
  let url = `patientData/${patientId}/vitalLatest`
  await api.get(url, null, null).then((response) => {
    commit('patientLatestVitals', response.data.data)
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
}

export const reviewVitals = async ({ commit }, data) => {
  let status = false
  commit('buttonLoader', true)
  let url = `patientData/${data?.patientId}/vitalReview`
  await api.put(url, data?.data, null).then((response) => {
    successSwal(response?.data?.message)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('buttonLoader', false)
  return status
}

export const patientsVitalDetails = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let url = `reviewStatusDetail/${data?.vitalId}`
  await api.get(url, null, null).then((response) => {
    commit('patientsVitalDetails', response?.data?.data)
    commit('patientVitalId', data?.vitalId)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

// Patient Vitals Defaults

export const addVitalDefaults = async ({ commit }, data) => {
  commit('patientVitalsLoader', true)
  let status = false
  commit('buttonLoader', true)
  let url = `patientData/${data?.patientId}/default-vital-range`
  await api.post(url, data?.data, null).then((response) => {
    successSwal(response?.data?.message)
    commit('addVitalDefaults', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('buttonLoader', false)
  commit('patientVitalsLoader', false)
  return status
}

export const getBPVitalDefaults = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let url = `patientData/${data?.patientId}/default-vital-range?deviceType=${data?.deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('getBPVitalDefaults', response?.data?.data)
    commit('getBPBaselineValues', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const getOxygenVitalDefaults = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let url = `patientData/${data?.patientId}/default-vital-range?deviceType=${data?.deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('getOxygenVitalDefaults', response?.data?.data)
    commit('getOxygenBaselineValues', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const getHeartRateVitalDefaults = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let url = `patientData/${data?.patientId}/default-vital-range?deviceType=${data?.deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('getHeartRateVitalDefaults', response?.data?.data)
    commit('getHeartRateBaselineValues', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const getGlucoseVitalDefaults = async ({ commit }, data) => {
  let status = false
  commit('patientVitalsLoader', true)
  let url = `patientData/${data?.patientId}/default-vital-range?deviceType=${data?.deviceType}&vitalType=${data.vitalType}`
  await api.get(url, null, null).then((response) => {
    commit('getGlucoseVitalDefaults', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const glucoseVitalDefaultsList = async ({ commit }, patientId) => {
  let status = false
  commit('patientVitalsLoader', true)
  let url = `patientData/GlucoseRange/${patientId}`
  await api.get(url, null, null).then((response) => {
    commit('glucoseVitalDefaultsList', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
  return status
}

export const defaultPatientVitals = async ({ commit }, data) => {
  commit('patientVitalsLoader', true)
  let url = `default-vital-range?deviceType=${data?.deviceType}`
  await api.get(url, null, null).then((response) => {
    commit('defaultPatientVitals', response?.data?.data)
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
}

export const downloadVitals = async ({ commit }, data) => {
  commit('patientVitalsLoader', true)
  let url = `patientData/download-vitals/${data?.patientId}/${data?.deviceType}`
  await api.get(url, null, null).then((response) => {
    getCsvFile({
      data: response?.data?.data,
      fileName: response?.data?.fileName
    })
    /* downloadPdfFromBase64({
      data: base64Vitals,
      fileName: response?.data?.fileName
    }) */
  }).catch((error) => {
    commit('errorPatientVitals', error?.response?.data)
  })
  commit('patientVitalsLoader', false)
}

export const glucoseVitalsRanges = async ({ commit }, data) => {
  commit('patientVitalsLoader', true)
  commit('glucoseVitalsRanges', data)
  commit('patientVitalsLoader', false)
}