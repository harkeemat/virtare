import api from "@/services/api";
import { errorSwal, successSwal } from "../../commonMethods/commonMethod";

const showErrorMsg = (error) => {
  const { status } = error.response;
  if (typeof status !== "undefined" && status === 500) {
    errorSwal("Something went wrong please try again!");
    console.log(error.Message);
  }
};

export default {
  async create({ commit, dispatch }, param) {
    try {
      param.phoneNumber = param.phoneNumber.replace(/-/g, '')
      const { data } = await api.post(`careTeam/create-specialist`, param);
      commit("isComplete", true);
      // dispatch("specialists", null, { root: true });
      dispatch("fetchList");
      successSwal(data.message);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async edit({ commit, dispatch }, param) {
    try {
      param.phoneNumber = param.phoneNumber.replace(/-/g, '')
      const { data } = await api.put(
        `/patientData/${param.editId}/update-specialist`,
        param
      );
      commit("isComplete", true);
      // dispatch("specialists", null, { root: true });
      dispatch("fetchList");
      commit("isComplete", true);
      successSwal(data.message);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async delete({ state, commit, dispatch }) {
    try {
      const { data } = await api.delete(
        `/careTeam/delete-specialist/${state.specialistId}`
      );
      commit("isComplete", true);
      dispatch("fetchList");
      successSwal(data.message);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async fetchList({ commit }) {
    commit("loadingTableStatus", true, { root: true });
    commit("membersLoading", true);
    try {
      const { data } = await api.get(`staffData/list-staff-specialists`);
      commit("members", data);
    } catch (error) {
      showErrorMsg(error);
    }
    commit("loadingTableStatus", false, { root: true });
  },
  async fetchSpecialist({ commit }) {
    try {
      const { data } = await api.get(`/careTeam/getSpecializationByCat/2`);
      commit("specialists", data.data);
    } catch (error) {
      console.log(error);
      showErrorMsg(error);
    }
  },
  async fetchSpecialistById({ commit }, id) {
    try {
      const { data } = await api.get(`staffData/list-staff-specialists/${id}`);
      commit("member", data.data);
    } catch (error) {
      showErrorMsg(error);
    }
  },
};
