import { computed } from "vue";
export const unprocessedCommunicationsMeta = (state) => {
  return computed(() => {
    return state.unprocessedCommunicationsMeta
  })
}