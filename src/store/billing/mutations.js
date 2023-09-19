import { billingDateFormat, timeStampFormate, dateFormat, globalDateFormat } from "@/commonMethods/commonMethod";
import { secondsToHMS } from "@/commonMethods/commonMethod";
import dayjs from 'dayjs';

export default {
  /** Billing  */
  BILLING_LOADING(state, loading) {
    state.billingLoading = loading;
  },
  BILLING_LIST(state, billing) {
    state.billingList = []
    if (typeof billing?.data != "undefined" && billing?.data?.length > 0) {

      state.billingList = billing?.data.map(
        (item) => {
          item.durations = item?.durations != "" && item?.durations ? secondsToHMS(item.durations) : '-'
          item.activityDate = item?.activityDate != "" && item?.activityDate ? dateFormat(item.activityDate) : '-'
          item.patientDOB = item?.patientDOB != "" && item?.patientDOB ? dayjs(item.patientDOB).format(globalDateFormat) : '-'

          //item.durations = item?.durations != "" ? dateFormatClient(item?.durations) : '-'
          return item

        })
    }
    state.billingMeta = billing?.meta?.pagination;
  },
  PROCESS_BILLING_LIST(state, billing) {
    state.processBillingList = []
    if (typeof billing?.data != "undefined" && billing?.data?.length > 0) {

      state.processBillingList = billing?.data.map(
        (item) => {

          item.startDate = item?.startDate != "" && item?.startDate ? timeStampFormate(item.startDate, billingDateFormat) : '-'
          item.endDate = item?.endDate != "" && item?.endDate ? timeStampFormate(item.endDate, billingDateFormat) : '-'
          item.processDate = item?.processDate != "" && item?.processDate ? timeStampFormate(item.processDate, billingDateFormat) : '-'
          item.isBilledDate = item?.isBilledDate != "" && item?.isBilledDate ? timeStampFormate(item.isBilledDate, billingDateFormat) : '-'
          return item

        })
    }
    state.processBillingMeta = billing?.meta?.pagination;
  },
  BILLING_ERROR(state, error) {
    state.billing.error = error;
  },
  billingFilterDate(state, data) {
    state.billingFilterDate = data
  },
  BILLING_DETAILS(state, data) {
    state.billingDetail = data
  },
  GET_DATE_FROM_BILLING(state, data) {
    state.getDate = data?.data?.endDate ? dayjs(dateFormat(data?.data?.endDate)).format(globalDateFormat) : ''
  },
  BILLING_RESPONSE(state, data) {
    state.billingResponse = data?.message
  }
};
