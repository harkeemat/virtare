import { computed } from "vue";
export const groupsMeta = (state) => {
  return computed(() => {
    return state.groupsMeta
  })
}