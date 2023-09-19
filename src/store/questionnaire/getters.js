import {computed} from "vue"

export const addQuestionnaire = (state)=>{
    return computed(()=>{
        return state.addQuestionnaire
    })
  }
  export const questionnaireList = (state)=>{
    return computed(()=>{
        return state.questionnaireList
    })
  }
  export const detailsQuestionnaire = (state)=>{
    return computed(()=>{
        return state.detailsQuestionnaire
    })
  }
  export const questionMeta = (state)=>{
    return computed(()=>{
        return state.questionMeta
    })
  }
  export const addOptionsDetails = (state)=>{
    return computed(()=>{
        return state.addOptionsDetails
    })
  }
  export const questionnaireErrorMsg = (state)=>{
    return computed(()=>{
        return state.questionnaireErrorMsg
    })
  }
  export const allQuestionnaireListing = (state)=>{
    return computed(()=>{
        return state.allQuestionnaireListing
    })
  }
  export const scoreTypeData = (state)=>{
    return computed(()=>{
        return state.scoreTypeData
    })
  }

