<template>
      <a-table rowKey="id" :columns="column" :data-source="data" :scroll="{ y:300 }" :pagination="false">
          <template #patientName="{text, record}" v-if="arrayToObjact(screensPermissions,63)">
              <router-link :to="'/patients-summary/'+record.patient_id">{{ text }}</router-link>
          </template>
           <template #patientName="{text}" v-else>
              <span>{{ text }}</span>
          </template>
          <template #staff="{record}" v-if="arrayToObjact(screensPermissions,38)">
              <router-link :to="'/coordinator-summary/'+record.staff_id">{{record.staff}}</router-link>
          </template>
          <template #staff="{record}" v-else>
              <span>{{record.staff}}</span>
          </template>
      </a-table>
</template>
<script>
import { computed, reactive } from "vue";
import {arrayToObjact} from "@/commonMethods/commonMethod"
import { useStore } from 'vuex';
export default {
props: {
  appointment: {
    type: Array,
  },
  columns: {
    type: Array,
  },
},
setup(props) {
 
  const column = reactive(props.columns);
  const store = useStore()
  const data = computed(()=>{
    return store.state.dashBoard.todayAppointmentState
  })
  return {
    screensPermissions:store.getters.screensPermissions,
    arrayToObjact,
    data,
    column,
  };
},
};
</script>

<style>
.common-card {
min-height: 335px !important;
}
</style>
