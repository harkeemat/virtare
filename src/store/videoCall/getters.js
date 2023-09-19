import {computed} from "vue"

export const conferenceId = (state)=>{
    return computed(()=>{
        return state.conferenceId
    })
  }