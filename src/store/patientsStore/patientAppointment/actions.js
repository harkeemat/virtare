import api from '@/services/api';
import { timeStamp } from "@/commonMethods/commonMethod";
import dayjs from 'dayjs';
const patientAppointmentEndPoint = id => `appointment-list`
import {
  successSwal,
  errorSwal
}
  from '../../../commonMethods/commonMethod';

const showErrorMsg = error => {
  const { status } = error?.response;
  if (typeof status !== 'undefined' && status === 500) {
    errorSwal("Something went wrong please try again!")

  }
}

export default {
  async patientsAppointmentListing({ commit }, param) {
    commit("patientAppointmentLoading", true);
    try {
      const { data } = await api.get(`appointment-list/${param}`)
      commit("patientsAppointmentListing", data)

    } catch (error) {
      commit('patientAppointmentError', error)
    }
    commit("patientAppointmentLoading", false);
  },
  async createPatientAppointment({ commit, dispatch }, param) {

    commit("patientLoading", true)
    commit('patientAppointmentAdded', false)
    const timeFormat = (dayjs(param.startTime)).format('HH:mm')
    const insertParam = {
      ...param,
      startDate: param.startDate ? timeStamp(param.startDate + " " + timeFormat) : "",
      startTime:
        param.startTime != "" ? param.startDate ? timeStamp(param.startDate + " " + timeFormat) : "" : "",

    };
    commit('patientAppointmentError', {})
    try {
      const { data } = await api.post("appointment-store", insertParam)
      commit('patientAppointmentAdded', true)

      successSwal(data.message)
      commit('patientAppointmentError', {})
      dispatch('patientsAppointmentListing', param?.patientId)
    } catch (error) {
      //const {data,status} = error?.response;
      commit('patientAppointmentError', error?.response?.data)

    }
    commit("patientLoading", false)
  },

  //get appointment type
  async appointmentType({ commit }) {
    try {
      const { data } = await api.get("appointment-type");
      commit('appointmentType', data?.data)
    } catch (error) {
      commit('patientAppointmentError', error)
    }
  },
  async appointmentPriority({ commit }) {
    try {
      const { data } = await api.get("appointment-priority");
      commit('appointmentPriority', data?.data)
    } catch (error) {
      commit('patientAppointmentError', error)
    }
  },
  async appointmentDetial({ commit },id) {
    try {
      const { data } = await api.get(`appointment/detail/${id}`);
      commit('appointmentDetial', data?.data)
    } catch (error) {
      commit('patientAppointmentError', error)
    }
  },
  async appointmentStatusUpdate({ commit,dispatch },record) {
    commit("patientLoading", true)
    commit('patientAppointmentAdded', false)
    try {
      const { data } = await api.put('appointment/'+record?.id+'/statusUpdate',record?.data);
      successSwal(data?.message)
      record?.patientId ? dispatch('patientsAppointmentListing', record?.patientId) :''
      commit('patientAppointmentAdded', true)
    } catch (error) {
      commit('patientAppointmentError', error)
    }
    commit("patientLoading", false)
  },

};
