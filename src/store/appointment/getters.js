import { computed } from "vue"

export const appointmentRecords = (state) => {
  return computed(() => {
    return state
  })
}
export const searchAppointmentRecords = (state) => {
  return computed(() => {
    return state.searchAppointmentRecords
  })
}

export const appointmentDetails = (state) => {
  return computed(() => {
    return state.appointmentDetails
  })
}