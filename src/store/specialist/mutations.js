export default {
  isEdit(state, data) {
    state.isEdit = data;
  },
  isComplete(state, data) {
    state.isComplete = data;
  },
  specialistId(state, data) {
    state.specialistId = data;
  },
  specialists(state, data) {
    
    state.specialists = data;
  },
  members(state, data) {
    
    state.members = data;
  },
  membersLoading(state, data) {
    state.loading = data;
  },
  member(state,data)
  {
    data.phoneNumber = data?.phoneNumber ? data.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") : "";
    state.member = data;
  },
  isStaff(state,data)
  {
    state.isStaff = data;
  }
};
