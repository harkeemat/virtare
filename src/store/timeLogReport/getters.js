import {computed} from "vue"

export const timeLogReports = (state)=>{
    return computed(()=>{
        return state
    })
  }
  export const timeLogView = (state)=>{
    return computed(()=>{
        return state.timeLogView
    })
  }
  export const viuewTimeReportModal = (state)=>{
    return computed(()=>{
        return state.viuewTimeReportModal
    })
  }
  export const auditTimeLogFilterDates = (state)=>{
    return computed(()=>{
        return state.auditTimeLogFilterDates
    })
  }
 
  export const auditMetaLog = (state)=>{
    return computed(()=>{
        return state.auditMetaLog
    })
  }
  export const timelineReport = (state)=>{
    return computed(()=>{
        return state.timelineReport
    })
  }
  export const timeLogReport = (state)=>{
    return computed(()=>{
        return state
    })
  }
