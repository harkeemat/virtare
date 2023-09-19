import router from "../../../router";
import api from "@/services/api";
import {
  globalDateFormatFromDate,
  errorSwal,
  successSwal,
} from "../../../commonMethods/commonMethod";

const showErrorMsg = (error) => {
  if (typeof error.response != "undefined") {
    const { status } = error.response;
    if (typeof status !== "undefined" && status === 500) {
      errorSwal("Something went wrong please try again!");
    }
  }
  console.warn(error);
};

export default {
  async search({ commit }, { formModel, emit }) {
    commit("isSearching", true);
    const { title } = formModel;
    commit("bitrixPatients", []);
    commit("bitrixFields", []);
    try {
      const [bitrix, fields] = await Promise.all([
        api.get("/bitrix/deal", {
          params: { title },
        }),
        api.get("/bitrix/fields"),
      ]);

      if (typeof fields.data.data !== "undefined")
        commit("bitrixFields", fields.data.data);

      if (bitrix.data.result.length === 0) successSwal("Patient not found.");

      if (
        typeof bitrix.data.result !== "undefined" &&
        bitrix.data.result.length > 0
      ) {
        commit(
          "bitrixPatients",
          bitrix.data.result.map(({ BIRTHDATE, NAME, LAST_NAME, ID }) => ({
            id: ID,
            dob: BIRTHDATE != "" ? globalDateFormatFromDate(BIRTHDATE) : "-",
            name: LAST_NAME != '' ? `${LAST_NAME},${NAME}`: NAME,
          }))
        );

        router.push({ name: "bitrixpatients" });
        emit("hideDrawer");
      }
    } catch (error) {
      showErrorMsg(error);
    }
    commit("isSearching", false);
  },
  async fillForm({ commit }, id) {
    commit("isFetching", true);
    try {
      const { data } = await api.get(`/patientData/bitrix-detail/${id}`);
      commit("visible", true);
      commit("bitrixPatient", data.data);
    } catch (error) {
      showErrorMsg(error);
    }
    commit("isFetching", false);
  },
};
