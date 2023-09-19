import {computed} from "vue"
export const singleEscalationDataArray = (state)=>{
    return computed(()=>{
        return state.singleEscalationDataArray
    })
  }

  export const escalationMeta = (state)=>{
    return computed(()=>{
        return state.escalationMeta
    })
  }

  export const escalationAuditMeta = (state)=>{
    return computed(()=>{
        return state.escalationAuditMeta
    })
  }

  
  export const escalation = (state)=>{
    return computed(()=>{
        return state.escalation
    })
  }

  export const escalationAudit = (state)=>{
    return computed(()=>{
        return state.escalationAudit
    })
  }
  export const escalations = (state)=>{
    return computed(()=>{
        return state
    })
  }

  