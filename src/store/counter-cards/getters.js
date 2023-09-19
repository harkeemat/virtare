
import { computed } from "vue"

export const totalPatientcount = (state) => {
    return computed(() => {
      return state.totalPatientcount
    })
  }
  export const grid = (state) => {
    return computed(() => {
      return state.grid
    })
  }
  export const patientsCondition = (state) => {
    return computed(() => {
      return state.patientsCondition
    })
  }