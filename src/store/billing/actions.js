import api from '@/services/api';
import { timeStamp, downloadPdfFromBase64, successSwal } from "@/commonMethods/commonMethod";
import dayjs from 'dayjs';
const billingEndPoint = `billing/service/log`
const proseccBillingEndPoint = `process/billing/log`
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
  async billingList({ commit }) {
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
      const { data } = await api.get(billingEndPoint)
      commit('BILLING_LIST', data)
      commit('BILLING_ERROR', {})
    } catch (error) {
      const { data, status } = error.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  async generateProcessBilling({ commit, dispatch }, param) {
    const time  = dayjs().format('hh:mm A')
    let dates = {
      startDate: param?.fromDate ? timeStamp(param?.fromDate+ ' ' + time) : '',
      endDate: param?.toDate ? timeStamp(param?.toDate + ' 23:59:59') : ''
    }
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
     const {data} =  await api.get(`generate/billing?fromDate=${dates?.startDate}&toDate=${dates?.endDate}`)
      dispatch("getStartDateBilling")
      commit("BILLING_RESPONSE",data)
    } catch (error) {
      const { data, status } = error.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  async processBillingList({ commit }) {
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
      const { data } = await api.get(`list/billingReport`)
      commit('PROCESS_BILLING_LIST', data)
      commit('BILLING_ERROR', {})
    } catch (error) {
      const { data, status } = error.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  //billing details
  async infoBilling({ commit }, param) {
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
      const { data } = await api.get(`list/billingReport/${param}`)
      commit("BILLING_DETAILS", data?.data)
    } catch (error) {
      const { data, status } = error.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  async processDownloadProcessData({ commit }, param) {
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
      const { data } = await api.get(`download/process/report?billingProcessedId=${param}`)
      downloadPdfFromBase64({
        data: data?.data,
        fileName: data?.fileName ? 'rowBilling' : ''
      })
    } catch (error) {
      const { data, status } = error.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  async markedBilled({ commit, dispatch }, param) {
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
      const { data } = await api.put(`update/billingReport/${param}?isBilled=1`)
      successSwal(data?.message)
      dispatch("processBillingList")
      commit('BILLING_ERROR', {})
    } catch (error) {
      const { data, status } = error?.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  //last billing start date get
  async getStartDateBilling({ commit }) {
    try {
      const { data } = await api.get(`get/past/billing/date`)
      commit("GET_DATE_FROM_BILLING", data)
    } catch (error) {
      const { data, status } = error?.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
  async deleteBilled({ commit, dispatch }, param) {
    commit("BILLING_LOADING", true);
    commit('BILLING_ERROR', {})
    try {
      const { data } = await api.delete(`delete/billingReport/${param}`)
      successSwal(data?.message)
      dispatch("processBillingList")
      commit('BILLING_ERROR', {})
    } catch (error) {
      const { data, status } = error.response;
      if (typeof status !== 'undefined' && status === 422)
        commit('BILLING_ERROR', data)
    }
    commit("BILLING_LOADING", false)
  },
};
