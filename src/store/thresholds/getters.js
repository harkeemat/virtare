import { computed } from "vue";
  export const vitalDataGetters = (state)=>{
      return computed(()=>{
          return state
      })
    }