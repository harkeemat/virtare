import {computed} from "vue"

export const communicationRecord = (state)=>{
    return computed(()=>{
        return state
    })
  }
  export const communicationsView = (state)=>{
    return computed(()=>{
        return state.communicationsView
    })
  }
  export const latestmessage = (state)=>{
    return computed(()=>{
        return state.latestmessage
    })
  }
  export const messagesMeta = (state)=>{
    return computed(()=>{
        return state.messagesMeta
    })
  }