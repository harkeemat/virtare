import {computed} from "vue"

export const addReports = (state)=>{
    return computed(()=>{
        return state.addReports
    })
  }
  export const screensWeb = (state)=>{
    return computed(()=>{
        return state.screensWeb
    })
  }
  
 