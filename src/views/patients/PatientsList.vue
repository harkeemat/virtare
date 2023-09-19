<template>
    <a-layout-content>
    <PatientsList :key="componentKey" />
  </a-layout-content>
  </template>
  
  <script>
  import PatientsList from "@/components/patients/patientsList/PatientsList";
  import { computed } from "vue-demi";
  import { useStore } from "vuex";
  
  export default {
    name: "ViewPatientsList",
    components: {
      PatientsList,
    },
    setup() {
      const store = useStore();
      const componentKey = computed(() => {
        return store.state.common.componentKey;
      });
  
      return {
        componentKey,
      };
    },
  };
  </script>
  