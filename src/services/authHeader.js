
import { computed } from "vue"
import store from "../store/index"

const selectedSite = computed(() => {
  return store.state.clients.selectedSite
})

export default function authHeader() {
  let token = JSON.parse(localStorage.getItem('auth'))?.token
  if(token) {
    return {
      Authorization: 'Bearer ' + token,
      siteId: selectedSite.value.id,
    };
  }
  else {
    return {};
  }
}