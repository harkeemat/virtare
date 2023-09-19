<template>
    <a-layout-content>
      <PatientDetails :key="componentKey" />
    </a-layout-content>
</template>
    
<script>
import PatientDetails from "@/components/patients/patientDetails/PatientDetails"
import { computed } from 'vue-demi';
import { useStore } from 'vuex';

export default {
    name: 'ViewPatientDetails',
    components: {
    PatientDetails,
    // Header,
    // Sidebar,
    },
    setup() {
    const store = useStore()
    const componentKey = computed(() => {
        return store.state.common.componentKey
    })

    return {
        componentKey,
    }
    }
}
</script>
