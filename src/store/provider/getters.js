import { computed } from "vue"
export const providersRecords = (state)=>{
    return computed(()=>{
        return state
    })
}
export const providersListAll = (state)=>{
    return computed(()=>{
        return state.providersListAll
    })
}
export const providerMeta = (state)=>{
    return computed(()=>{
        return state.providerMeta
    })
}