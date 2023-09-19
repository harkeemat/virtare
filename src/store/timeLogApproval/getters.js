import {computed} from "vue"

export const timeLogApproval = (state)=>{
    return computed(()=>{
        return state
    })
  }
  export const timeLogeMeta = (state)=>{
    return computed(()=>{
        return state.timeLogeMeta
    })
    
  }
  


