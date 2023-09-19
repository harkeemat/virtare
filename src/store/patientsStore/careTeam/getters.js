import { computed } from "vue";
export const patientCareTeamRecord = (state) => {
  return computed({
    get(){
      return state
    },
    set(value){
      return value
    }
  })
}