import api from '@/services/api';
import { timeStamp } from "@/commonMethods/commonMethod";

const patientProgramEndPoint = id => `patientData/${id}/program`
import {
  successSwal,
  errorSwal }
  from '../../../commonMethods/commonMethod';

const showErrorMsg = error => {
  const {status} = error?.response;
  if(typeof status !== 'undefined' && status === 500)
      {
        errorSwal("Something went wrong please try again!")

      }
}

export default {
  async createPatientProgram({ commit,dispatch }, param) {
    const insertParam = {
      programId:param.programId,
      consentedDate: timeStamp(param.consentedDate),
      billingStartDate:
        param.billingStartDate != "" && param.billingStartDate ? timeStamp(param.billingStartDate) : "",
    };
    const url =param?.id ? patientProgramEndPoint(param?.patientId)+'/'+param?.id:patientProgramEndPoint(param.patientId) 
    commit("patientProgramLoading", true);
    commit('patientProgramError',{})
    try {
      const {data} = param?.id ? await api.put(url,insertParam) : await api.post(url,insertParam)
      commit('patientProgramAdded',true)
      successSwal(data.message)
      commit('patientProgramError',{})
      dispatch('fetchPatientProgram',param.patientId)
    } catch (error) {
      const {data,status} = error?.response;
      if(typeof status !== 'undefined' && status === 422)
        commit('patientProgramError',data)
      if(typeof status !== 'undefined' && status === 500)
       showErrorMsg(error);
    }
    commit("patientProgramLoading",false)
  },
  async fetchPatientProgram({commit}, param) {
    commit('patientLoading',true);
    commit('patientsLoaderStatus',true);
    try {
        const {data} = await api.get(patientProgramEndPoint(param));
        commit('patientPrograms',data)
    } catch (error)
    {
      showErrorMsg(error);
    }
    commit('patientLoading',false);
    commit('patientsLoaderStatus',false);
  },
  //get assign prigram to patient
  async detailsPatientsProgram({commit}, param) {
    commit('patientLoading',true);
    commit('patientsLoaderStatus',true);
    try {
      let url = patientProgramEndPoint(param?.patientId)+'/'+param?.id
        const {data} = await api.get(url);
        commit('PATIENTS_PROGRAMS_ASSIGN_DETAIL',data?.data)
    } catch (error)
    {
      console.warn(error)
      ///showErrorMsg(error);
    }
    commit('patientLoading',false);
    commit('patientsLoaderStatus',false);
  },
};
