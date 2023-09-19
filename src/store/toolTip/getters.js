import {computed} from "vue"

export const addtoolTip = (state)=>{
    return computed(()=>{
        return state.addtoolTip
    })
  }
  export const getObject = (state)=>{
    return computed(()=>{
        return state.getObject
    })
  }
  export const formRecords = (state)=>{
    return computed(()=>{
        return state.formRecords
    })
  }
 