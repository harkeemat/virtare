export default {
  isSearching(state,loading)
  {
    state.isSearching = loading
  },
  bitrixPatients(state,patients)
  {
    state.patients = patients
  },
  bitrixFields(state,fields)
  {
     state.bitrixFields = fields;
  },
  /** fetching specific bitrix from id */
  isFetching(state,loading)
  {
    state.isFetching = loading
  },
  /** drawer open/hide */
  visible(state,status)
  {
    state.visible = status;
  },
  bitrixPatient(state,patient)
  {
    state.patient = patient
  }
}
