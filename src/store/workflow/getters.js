import {computed} from "vue"

export const events = (state)=>{
    return computed(()=>{
        return state.workflowEvents
    })
}

export const workflowList = (state)=>{
    return computed(()=>{
        return state.workflowList
    })
}

export const criteriaColumns = (state)=>{
    return computed(()=>{
        return state.workflowColumn
    })
}

export const groupActionList = (state)=>{
    return computed(()=>{
        return state.groupActionList
    })
}

