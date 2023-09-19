import { dateFormat,timeStampFormate } from "@/commonMethods/commonMethod";
// import dayjs from "dayjs";
export default {
  /** patient Appointments  */
  appointmentsLoading(state, loading) {
    state.appointmentsLoading = loading;
  },
  patientsAppointmentListing(state, Appointments) {
    state.patientAppointments = [];
    /** mapping timestamp fields */
    if (typeof Appointments?.data != "undefined" && Appointments?.data?.length > 0) {
      state.patientAppointments = Appointments?.data.map(
        ((item) => {
          item.startDate = item.date ? dateFormat(item.date) : ''
          return item
        })
      );
    }

    state.patientAppointmentsMeta = Appointments?.meta?.pagination;
  },
  appointmentType(state, data) {
    state.appointmentType = data
  },
  appointmentPriority(state, data) {
    state.appointmentPriority = data
  },
  patientAppointmentError(state, error) {
    state.patientAppointment.error = error;
  },
  patientAppointmentLoading(state, loading) {
    state.patientAppointment.isLoading = loading;
  },
  appointmentPriority(state, data) {
    state.appointmentPriority = data
  },
  patientAppointmentAdded(state, status) {
    state.patientAppointmentAdded = status;
  },
  patientLoading(state, data) {
    state.patientLoading = data
  },
  appointmentDetial(state, data) {
      state.appointmentDetial = data
      state.appointmentDetial.startDate = data?.startDate ? dateFormat(data?.startDate) : ''
      state.appointmentDetial.startTime = data?.startDateTime ? timeStampFormate(data?.startDateTime,'hh:mm A') : ''
      state.appointmentDetial.contactId = data?.staff
      state.appointmentDetial.priority = data?.flagName
 
    state.appointmentDetial = data
  }

};
