import { computed } from "vue"

export const addClient = (state) => {
  return computed(() => {
    return state.addClient
  })
}
export const errorClients = (state) => {
  return computed(() => {
    return state.errorClients
  })
}
export const people = (state) => {
  return computed(() => {
    return state
  })
}
export const clients = (state) => {
  return computed(() => {
    return state
  })
}