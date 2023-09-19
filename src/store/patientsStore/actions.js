import {
  API_ENDPOINTS_V3,
} from "@/config/apiConfig"
import api from '@/services/api';
import { message } from 'ant-design-vue';
import {
	timeStamp
} from '@/commonMethods/commonMethod';
import { successSwal } from "../../commonMethods/commonMethod";
import dayjs from 'dayjs';

import router from "../../router";

const API_ENDPOINTS = API_ENDPOINTS_V3

const showErrorMsg = error => {
  const {status} = error.response;
  if(typeof status !== 'undefined' && status === 500)
      {
        message.error('Internal server error, please wait some time!!')

      }
}
export const patientActionFilter = async ({ commit }, filter) => {
  try {
    commit('patientsLoaderStatus', true)
  let url = filter ? API_ENDPOINTS['patient']+`?filter=${filter}` : API_ENDPOINTS['patient']
  let response = await api.get(url, null, null)
  commit('patientActionFilter', {
    filter: filter,
    data: response.data.data,
    meta: response.data.meta
  })
} catch (error) {
  const {data,status} = error.response;
  if(typeof status !== 'undefined' && status === 422)
    commit('CREATE_PATIENTS_ERROR',data)
    showErrorMsg(error)
}
  commit('patientsLoaderStatus', false)
}
export const allPatientsList = async ({ commit }, filter) => {
  commit('patientsLoaderStatus', true)
  let url = filter?.filter ? API_ENDPOINTS['patient']+`${filter?.filter}` : API_ENDPOINTS['patient']
  let response = await api.get(url, null, null)
  commit('allPatientsList', response.data)
  commit('patientsLoaderStatus', false)
}

export const patientInformation = async ({ commit,state }, patientId) => {
  let url = API_ENDPOINTS['patient']+`/${patientId}`
  try{
    const {data} = await api.get(url, null, null)
    commit('patientInformation', data?.data)
    if(state.patientsTab=='info'){
      commit("patientsTab", 'info');
    }
    else if(!data?.data?.isProgram){
    commit("patientsTab", 'programs');
    commit("patientDevicesEnabled", false);
    commit("patientVitalsEnabled", false);
    commit("patientTabsEnabled", false);

    }else if(!data?.data?.isDevice){
      commit("patientsTab", 'devices');
      commit("patientDevicesEnabled", true)
      commit("patientVitalsEnabled", false);
    }else{
      commit("patientsTab", 'vitals');
      commit("patientTabsEnabled", true);
      commit("patientVitalsEnabled", true);
      commit("patientDevicesEnabled", true);
    }
    commit('patientInfoSuccess', true)
  }catch(error){
    console.warn(error)
  }
  commit('patientsLoaderStatus', false)
}

/** edit or crate patient  */
export const createUpdatePatient  = async ({commit,dispatch},param) => {
  commit('CREATE_PATIENTS_LOADING',true);
  commit('CREATE_PATIENTS_ERROR',null)

  let apiData = {
    ...param,
    contact:{...param.contact,dob:dayjs(param.contact.dob).format("YYYY-M-D")},
    insurance:{...param.insurance,startDate:timeStamp(param.insurance.startDate),endDate:timeStamp(param.insurance.endDate)}
  }


  try {
    const {data} = typeof param.udid !== "undefined" ?  await api.put(`patientData/update/${param.udid}`,apiData) : await api.post('patientData/create',apiData);
    successSwal(data.message)

    if(typeof param.udid !== "undefined" )
     await dispatch('patientInformation',param.udid);
    else{
      commit("patientsTab", 'programs');
      await router.push({
        name: "PatientDetails",
        params: {udid:data.data.udid}
      })
    }

    commit('CREATE_PATIENTS_COMPLETED',true)
    commit('CREATE_PATIENTS_ERROR',null)
  } catch (error) {
     const {data,status} = error.response;
      if(typeof status !== 'undefined' && status === 422)
          commit('CREATE_PATIENTS_ERROR',data)

      showErrorMsg(error)
  }
  commit('CREATE_PATIENTS_LOADING',false)
}

export const logBilling = async ({ commit }, data) => {
  let status = false
  let url = `billing/service/log`
  await api.post(url, data, null).then((response) => {
    status = true
    if(!data.isManual) {
      commit('logBillingStatus', true)
      commit('isBillingLogged', true)
    }
    successSwal(response?.data?.message)
  }).catch((error) => {
    commit('errorLog', error?.response?.data)
  })
  return status
}




/** referral api */
export const referrals = async ({commit}) => {
    try {
      const {data} = await api.get('/patientData/referral');
      commit('referrals',data.data)
    } catch (error) {
      showErrorMsg(error)
    }
}
export const watchList = async ({ commit }, {id, data}) => {
  let url = `patientData/${id}/watch-list`
  await api.post(url, data, null).then((res) => {
    successSwal(res?.data?.message)
  }).catch((error) => {
    commit('errorLog', error?.response?.data)
    message.error('Internal server error, please wait some time!!')
  })
}

export const patientVitalAttributes = async ({commit}, patientId) => {
  try {
    let url = `patientData/${patientId}/vitalAttribites`
    const {data} = await api.get(url);
    commit('patientVitalAttributes',data.data)
  } catch (error) {
    showErrorMsg(error)
  }
}

export const accessPatient = async ({ commit }, data) => {
  let status = false
  let url = `patientData/${data.patientId}/accessPatient`
  await api.post(url, data.data, null).then(() => {
    status = true
  }).catch((error) => {
    commit('errorLog', error?.response?.data)
    message.error('Internal server error, please wait some time!!')
  })
  return status
}