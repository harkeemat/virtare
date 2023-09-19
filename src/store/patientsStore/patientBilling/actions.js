import api from '@/services/api';
//import { timeStamp } from "@/commonMethods/commonMethod";

const patientBillingEndPoint = id => `billing/service/log?patientId=${id}`
// import {
//   errorSwal }
//   from '@/commonMethods/commonMethod';

// const showErrorMsg = error => {
//   const {status} = error.response;
//   if(typeof status !== 'undefined' && status === 500)
//       {
//         errorSwal("Something went wrong please try again!")
//       }
// }

export default {
  async patientBillingList({ commit }, param) {
    commit("PATIENTS_BILLING_LOADING", true);
    commit('PATIENTS_BILLING_ERROR',{})
    try {
      const {data} = await api.get(`list/patient/billingReport?patientId=${param}`)
      commit('PATIENTS_BILLING_LIST',data)
      commit('PATIENTS_BILLING_ERROR',{})
    } catch (error) {
      const {data,status} = error.response;
      if(typeof status !== 'undefined' && status === 422)
        commit('PATIENTS_BILLING_ERROR',data)
    }
    commit("PATIENTS_BILLING_LOADING",false)
  },
};
