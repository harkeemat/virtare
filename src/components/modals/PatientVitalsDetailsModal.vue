<template>
  <a-modal width="90%" :title="$t('patientSummary.bloodPressureDetails.bloodPressureDetail')" centered>
    <PatientVitalsGrid />
    <Loader />
  </a-modal>
</template>

<script>
import { defineComponent } from "vue";
import PatientVitalsGrid from "@/components/patients/patientSummary/views/PatientVitalsGrid";
import Loader from "@/components/loader/Loader";

export default defineComponent({
  components: {
    PatientVitalsGrid,
    Loader,
  },
  setup() {
    
    return {
      
    };
  },
});
</script>
