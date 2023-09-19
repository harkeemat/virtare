import { dateFormatClient, timeStampFormate, billingDateFormat } from "@/commonMethods/commonMethod";
//import { secondsToHMS } from "@/commonMethods/commonMethod";

export default {
  /** patient Billing  */
  PATIENTS_BILLING_LOADING(state, loading) {
    state.patientBillingLoading = loading;
  },
  PATIENTS_BILLING_LIST(state, billing) {
    state.patientBillingList = []
    if (typeof billing?.data != "undefined" && billing?.data?.length > 0) {

      state.patientBillingList = billing?.data.map(
        (item) => {

          item.startDate = item?.startDate != "" && item?.startDate ? timeStampFormate(item.startDate, billingDateFormat) : '-'
          item.endDate = item?.endDate != "" && item?.endDate ? timeStampFormate(item.endDate, billingDateFormat) : '-'
          //item.processDate = item?.processDate != "" && item?.processDate ? dateFormatClient(item.processDate) : '-'
          item.isBilledDate = item?.isBilledDate != "" && item?.isBilledDate ? timeStampFormate(item.isBilledDate, billingDateFormat) : '-'
          return item

        })
    }
    state.patientBillingMeta = billing?.meta?.pagination;
  },
  PATIENTS_BILLING_ERROR(state, error) {
    state.patientBilling.error = error;
  },
};
