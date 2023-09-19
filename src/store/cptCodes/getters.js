import { computed } from "vue"

export const cptRecords = (state) => {
  return computed(() => {
    return state
  })
}
export const cptCodesList = (state) => {
  return computed(() => {
    return state.cptCodesList
  })
}