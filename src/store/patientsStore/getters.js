import { computed } from "vue"

export const allPatientsList = (state) => {
  return computed(() => {
    return state.allPatientsList
  })
}
export const patientsStore = (state) => {
  return computed(() => {
    return state
  })
}

export const createPatientStatus = ({createPatient}) => createPatient.isCompleted
