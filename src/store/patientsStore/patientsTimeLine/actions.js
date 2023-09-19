import api from '@/services/api';
//import { timeStamp } from "@/commonMethods/commonMethod";

const patientsTimeLineEndPoint = id => `patientData/list/patient/${id}/timeLine`
const filterUrl = 'patientData/list/patient/timeLineType'

export default {
  async patientsTimeLineList({ commit }, param) {
    commit("PATIENTS_TIMELINE_LOADING", true);
    commit('PATIENTS_TIMELINE_ERROR',{})
    try {
      const {data} = await api.get(patientsTimeLineEndPoint(param?.id)+param?.filter)
      commit('PATIENTS_TIMELINE_LIST',data)
      commit('PATIENTS_TIMELINE_ERROR',{})
    } catch (error) {
      const {data,status} = error.response;
      if(typeof status !== 'undefined' && status === 422)
        commit('PATIENTS_TIMELINE_ERROR',data)
    }
    commit("PATIENTS_TIMELINE_LOADING",false)
  },
  async patientsTimeLineFilter({ commit }) {
    commit('PATIENTS_TIMELINE_ERROR',{})
    try {
      const {data} = await api.get(filterUrl)
      commit('PATIENTS_TIMELINE_FILTER',data)
      commit('PATIENTS_TIMELINE_ERROR',{})
    } catch (error) {
      const {data,status} = error.response;
      if(typeof status !== 'undefined' && status === 422)
        commit('PATIENTS_TIMELINE_ERROR',data)
    }
    commit("PATIENTS_TIMELINE_LOADING",false)
  },
};
