import {computed} from "vue"

export const patientsRecord = (state)=>{
    return computed(()=>{
        return state
    })
  }
  export const timeLineType = (state)=>{
    return computed(()=>{
        return state.timeLineType
    })
  }
  export const errorMsg = (state)=>{
    return computed(()=>{
        return state.errorMsg
    })
  }
  export const programList = (state)=>{
    return computed(()=>{
        return state.programList
    })
  }
  export const referralList = (state)=>{
    return computed(()=>{
        return state.referralList
    })
  }
  export const addPatientReferals = (state)=>{
    return computed(()=>{
        return state.addPatientReferals
    })
  }
  export const emergencyContact = (state)=>{
    return computed(()=>{
        return state.emergencyContact
    })
  }
  export const referralDetail = (state)=>{
    return computed(()=>{
        return state.referralDetail
    })
  }
  export const patientFlags = (state) => {
    return computed(() => {
      return state.patientFlags
    })
  }
  export const grids = (state) => {
    return computed(() => {
      return state.grids
    })
  }

  export const patientVitalsTimeline = (state) => {
    return computed(() => {
      return state.patientVitalsTimeline
    })
  }

  export const patientTimelineMeta = (state) => {
    return computed(() => {
      return state.patientTimelineMeta
    })
  }

  export const bloodOxygenTimeline = (state) => {
    return computed(() => {
      return state.bloodOxygenTimeline
    })
  }

  export const bloodGlucoseTimeline = (state) => {
    return computed(() => {
      return state.bloodGlucoseTimeline
    })
  }

  export const bloodPressureTimeline = (state) => {
    return computed(() => {
      return state.bloodPressureTimeline
    })
  }
  export const getBitrixFieldsName = (state) => {
    return computed(() => {
      return state.getBitrixFieldsName
    })
  }
  
 

  
  
  
