import {
  // API_ENDPOINTS_V3,
  emergencyContactsList,
  emergencyContactInfo,
} from "@/config/apiConfig"
import api from '@/services/api';
import { 
  successSwal,
} from '@/commonMethods/commonMethod'

// const API_ENDPOINTS = API_ENDPOINTS_V3

export const addEmergencyContact = async ({ commit }, data) => {
  let status = false
  commit('loading',true)
  commit('patientTabLoader', true)
  let url = `patient/${data.patientUdid}/emergency`
  await api.post(url, data?.data, null).then((response) => {
    commit('addEmergencyContact', response?.data?.data)
    successSwal(response?.data?.message)
    status = true
  }).catch((error) => {
    commit('errorEmergencyContact', error?.response?.data)
  })
  commit('loading',false)
  commit('patientTabLoader', false)
  return status
}

export const emergencyContacts = async ({ commit }, patientUdid) => {
  let status = false
  commit('patientTabLoader', true)
  let url = emergencyContactsList(patientUdid)
  await api.get(url, null, null).then((response) => {
    commit('emergencyContacts', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorEmergencyContact', error?.response?.data)
  })
  commit('patientTabLoader', false)
  return status
}

export const emergencyContactDetails = async ({ commit }, data) => {
  let status = false
  commit('patientTabLoader', true)
  let url = emergencyContactInfo(data.patientUdid, data.emergencyContactId)
  await api.get(url, null, null).then((response) => {
    commit('emergencyContactDetails', response?.data?.data)
    status = true
  }).catch((error) => {
    commit('errorEmergencyContact', error?.response?.data)
  })
  commit('patientTabLoader', false)
  return status
}

export const removeEmergencyContact = async ({ commit }, data) => {
  let status = false
  commit('patientTabLoader', true)
  let url = `patient/${data.patientUdid}/emergency/${data.contactUdid}`
  await api.delete(url, null, null).then((response) => {
    commit('emergencyContactDetails', response?.data?.data)
    successSwal(response?.data?.message)
    status = true
  }).catch((error) => {
    commit('errorEmergencyContact', error?.response?.data)
  })
  commit('patientTabLoader', false)
  return status
}

export const updateEmergencyContact = async ({ commit }, data) => {
  let status = false
  commit('loading',true)
  commit('patientTabLoader', true)
  let url = `patient/${data.patientUdid}/emergency/${data.emergencyContactId}`
  await api.put(url, data?.data, null).then((response) => {
    commit('updateEmergencyContact', response?.data?.data)
    successSwal(response?.data?.message)
    status = true
  }).catch((error) => {
    commit('errorEmergencyContact', error?.response?.data)
  })
  commit('loading',false)
  commit('patientTabLoader', false)
  return status
}
