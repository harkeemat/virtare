import { computed } from "vue"

export const commonRecords = (state) => {
  return computed(() => {
    return state
  })
}

export const loadingStatus = (state)=>{
    return computed(()=>{
        return state.loadingStatus
    })
  }
export const providerLocationsLoadingStatus = (state)=>{
    return computed(()=>{
        return state.providerLocationsLoadingStatus
    })
  }
  export const dropdownLoadingStatus = (state)=>{
    return computed(()=>{
        return state.dropdownLoadingStatus
    })
  }


  export const timeline = (state)=>{
    return computed(()=>{
        return state.timeline
    })
  }
  export const timeLogCategories = (state)=>{
    return computed(()=>{
        return state.timeLogCategories
    })
  }
  export const activeCptCodes = (state)=>{
    return computed(()=>{
        return state.activeCptCodes
    })
  }
  export const searchTable = (state)=>{
    return computed(()=>{
        return state.searchTable
    })
  }
  export const orderTable = (state)=>{
    return computed(()=>{
        return state.orderTable
    })
  }

  export const notificationCount = (state)=>{
    return computed(()=>{
        return state.notificationList
    })
  }
  export const questionnaireTemplateType = (state)=>{
    return computed(()=>{
        return state.questionnaireTemplateType
    })
  }
  export const questionDataType = (state)=>{
    return computed(()=>{
        return state.questionDataType
    })
  }
  export const staffLevels = (state)=>{
    return computed(()=>{
      return state.staffLevels
    })
  }
  export const filter = (state)=>{
    return computed(()=>{
        return state.filter
    })
  }
  export const dateFilter = (state)=>{
    return computed(()=>{
        return state.dateFilter
    })
  }
  export const bugCategory = (state)=>{
    return computed(()=>{
        return state.bugCategory
    })
  }
  export const otherFilters = (state)=>{
    return computed(()=>{
        return state.otherFilters
    })
  }
  export const escalationType = (state)=>{
    return computed(()=>{
        return state.escalationType
    })
  }
  export const removalReason = (state)=>{
    return computed(()=>{
        return state.removalReason
    })
  }
  export const apiCounter = (state)=>{
    return computed(()=>{
        return state.apiCounter
    })
  }
  export const successMsg = (state)=>{
    return computed(()=>{
        return state.successMsg
    })
  }
export const singleGlobalCode = (state) =>{
  return computed(()=>{
    return state.singleGlobalCode
  })
}
export const tabGlobalCode = (state) =>{
  return computed(()=>{
    return state.tabGlobalCode
  })
}
export const notificationsRecords = (state) => {
    return computed(()=>{
        return state
    })
}
export const screenTooltip = (state) => {
  return computed(()=>{
    return state.screenTooltip
  })
}
export const tooltip = (state) => {
  return computed(()=>{
    return state.tooltip
  })
}
export const formTitle = (state) => {
  return computed(()=>{
    return state.formTitle
  })
}
export const filterDateDataGet = (state) => {
  return computed(()=>{
    return state.filterDateDataGet
  })
}
