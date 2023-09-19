<template>
  <div>
    <div class="patientsVitals">
      <PatientVitalsGrid :patientId="patientUdid"/>
      <TableLoader/>
    </div>
  </div>
</template>

<script>
import PatientVitalsGrid from "@/components/patients/patientSummary/views/PatientVitalsGrid";
import { computed,ref } from 'vue-demi';
import { useStore } from 'vuex';
import TableLoader from "../../../loader/TableLoader.vue";
import { useRoute } from 'vue-router'
export default {
  components: {
    PatientVitalsGrid,
    TableLoader
  },
  setup() {
    const store = useStore();
    const route = useRoute()
    const patientUdid =  ref(route.params.udid)
    const patientDetails = computed(() => {
      return store.state.patients.patientDetails;
    })
    return {
      patientUdid,
      patientDetails,
    }
  }
}
</script>

<style lang="scss">
/* .dangerValue {
  padding: 5px;
  background-color: #f03131f3;
  color: #fff;
} */
</style>