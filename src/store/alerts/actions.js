import api from "@/services/api";
import { errorSwal, successSwal } from "../../commonMethods/commonMethod";
import axios from "axios";
import router from "../../router/index";

/** creating an axios for unauth API. */
const unAuthApi = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

const showErrorMsg = (error) => {
  const { status } = error?.response;
  if (typeof status !== "undefined" && status === 500) {
    errorSwal("Something went wrong please try again!");
    //console.log(error.Message);
  }
};

export default {
  async patientAlert({ commit }, referenceId) {
    commit("patientAlertLoading", true);
    try {
      const { data } = await api.get(`/escalation-list/${referenceId}`);
      commit("patientAlerts", data);
    } catch (error) {
      console.log(error);
    }
    commit("patientAlertLoading", false);
  },
  async fetchalert({ commit }, udid) {
    commit("escLoading", true);
    try {
      const { data } = await api.get(`/escalation-show/${udid}`);
      commit("escalation", data.data);
      commit("histories", data.logs);
      commit("pdfLink", data.links);
    } catch (error) {
      showErrorMsg(error);
    }
    commit("escLoading", false);
  },
  async fetchalerts({ commit }, params = {}) {
    commit("alertLoading", true);
    try {
      const { data } = await api.get("/escalation-list", { params });
      commit("alerts", data);
    } catch (error) {
      showErrorMsg(error);
    }
    commit("alertLoading", false);
  },
  async fetchType({ commit }) {
    try {
      const { data } = await unAuthApi.get("/escalation-type");
      commit("type", data.data);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async fetchPeople({ commit }, udid) {
    try {
      const { data } = await api.get(`/get-care-team/${udid}`);
      commit("people", data.data);
    } catch (error) {
      console.log(error);
    }
  },
  async fetchActionStatus({ commit }) {
    try {
      const { data } = await unAuthApi.get("/escalation-action-status");
      commit("actions", data.data);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async create({ commit, dispatch }, param) {
    commit("isCreating", true);
    commit("createError", {});
    try {
      const { data } = await api.post("/store-escalation", param);
      if (data.status) {
        dispatch("patientAlert", param.patientId);
        dispatch("checkActiveAlert");
        dispatch("patientActiveAlert", param.patientId);
      } else errorSwal(data.message);
      commit("isCreated", true);
      dispatch("pinNotes", { id: param.patientId }, { root: true });
    } catch (error) {
      param;
      const { data, status } = error.response;
      if (typeof status !== "undefined" && status === 422)
        commit("createError", data);
      showErrorMsg(error);
    }
    commit("isCreating", false);
  },
  async takeAction({ commit, state, dispatch }, param) {
    commit("isCreating", true);
    try {
      await api.put(`/update-escalation-action/${state.escaltionId}`, param);
      commit("isCreated", true);
      if (param.patientId) dispatch("patientAlert", param.patientId);
      else dispatch("fetchalerts");
      successSwal("Action is taken successfully.");
    } catch (error) {
      showErrorMsg(error);
    }
    commit("isCreating", false);
  },
  /** showing escalation for external non auth user */
  async showEsalation({ commit }, id) {
    try {
      const { data } = await unAuthApi.get(`/show-escalation/${id}`);
      commit("escalation", data.data);
      commit("histories", data.logs);
      commit("isIdCorrect", data.isIdCorrect);
    } catch (error) {
      // const {status } = error.response;
      console.log(error?.response?.data?.error);
      // showErrorMsg(error);
    }
  },
  async carePeopleList({ commit }, id) {
    try {
      const { data } = await unAuthApi.get(`/get-care-team-internal/${id}`);
      commit("contacts", data.data);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async externalActionPlan({ commit }, param) {
    commit("genratingAction", true);
    try {
      const { data } = await unAuthApi.put(
        `/update-internal-escalation/${param.id}`,
        param
      );
      commit("actionTaken", true);
      successSwal(data.message);
    } catch (error) {
      showErrorMsg(error);
    }
    commit("genratingAction", false);
  },
  async closeAlert({ commit, dispatch }, param) {
    let routeName = router.currentRoute.value?.name;
    try {
      const { data } = await api.put(`close-escalation-action/${param.id}`);
      commit("closeAlert", true);
      commit("isCreated", true);
      successSwal(data.message);
      if (routeName === "PatientDetails")
      {
        dispatch("pinNotes", { id: param.patientId }, { root: true });
        dispatch("patientAlert", router.currentRoute.value?.params.udid);
      }
      else dispatch("fetchalerts");
      dispatch("patientActiveAlert", router.currentRoute.value?.params.udid);
      dispatch("checkActiveAlert");
      dispatch("patientActiveAlert", param.patientId);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async checkRefId({ commit }, param) {
    commit("checkingRef", true);
    commit("refError", "");
    try {
      const { data } = await api.post(`verify-reference`, { ...param });
      if (data.status) {
        commit('reff_id',param.reference_no)
        commit("isIdCorrect", true)
        commit("refError", "");
      } else commit("refError", data.message);
      commit("isIdCorrect", data.status)
    } catch (error) {
      console.log(error);
      commit("refError", "");
    }
    commit("checkingRef", false);
  },
  async checkUrlReff({ commit }, param) {
    try {
      const { data } = await api.post(`verify-reference`, { ...param });
      commit("reff_id", param.reference_no);
      commit("isIdCorrect", data.status);
    } catch (error) {
      console.log(error);
      commit("isIdCorrect", true);
    }
  },
  async patientActiveAlert({ commit }, id) {
    try {
      const { data } = await api.get(`escalation-status/${id}`);
      commit("patientDot", data.status);
    } catch (error) {
      showErrorMsg(error);
    }
  },
  async checkActiveAlert({ commit }) {
    try {
      const { data } = await api.get(`escalation-status`);
      commit("alertDot", data.status);
    } catch (error) {
      // showErrorMsg(error);
    }
  },
};
