import { computed } from "vue"
export const inventoriesList = (state)=>{
    return computed(()=>{
        return state.inventoriesList
    })
}
export const inventoryMeta = (state)=>{
    return computed(()=>{
        return state.inventoryMeta
    })
}