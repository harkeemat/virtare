import { dateTimeFormat } from "@/commonMethods/commonMethod";
// import { secondsToHMS } from "@/commonMethods/commonMethod";

export default {
  /** patient Timeline  Loader*/
  PATIENTS_TIMELINE_LOADING(state, loading) {
    state.patientsTimeLineLoading = loading;
  },
   /** patient Timeline  Listing and pagination*/
  PATIENTS_TIMELINE_LIST(state, timeLine) {
    state.patientsTimeLineList =timeLine?.data?.map((item)=>{
      item.createdAt = item?.createdAt != "" && item?.createdAt ? dateTimeFormat(item.createdAt) : '-'
      return item
    })
    state.patientsTimeLineMeta = timeLine?.meta?.pagination;
  },
  /** patient Timeline  Error*/
  PATIENTS_TIMELINE_ERROR(state, error) {
    state.patientsTimeLine.error = error;
  },
  /**Patients Timeline filters  */
  PATIENTS_TIMELINE_FILTER(state, filter){
    state.patientsTimeLineFilter = filter
  }
};
