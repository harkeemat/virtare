import { computed } from "vue"

export const dashboardTimeLineButton = (state) => {
  return computed(() => {
    return state.timeLineButton
  })
}
export const dashBoard = (state) => {
  return computed(() => {
    return state
  })
}

 
  export const specialization = (state) => {
    return computed(() => {
      return state.specialization
    })
  }
  export const network = (state) => {
    return computed(() => {
      return state.network
    })
  }
  // export const cptCodeValue = (state) => {
  //   return computed(() => {
  //     return state.cptCodeValue
  //   })
  // }
  // export const financialValue = (state) => {
  //   return computed(() => {
  //     return state.financialValue
  //   })
  // }
  export const totalPatientsChartValue = (state) => {
    return computed(() => {
      return state.totalPatientsChartValue
    })
  }
  export const appointmentChartValue = (state) => {
    return computed(() => {
      return state.appointmentChartValue
    })
  }
  export const todayAppointmentState = (state) => {
    return computed(() => {
      return state.todayAppointmentState
    })
  }