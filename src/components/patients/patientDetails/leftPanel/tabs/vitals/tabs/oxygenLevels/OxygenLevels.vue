<template>
  <div class="vital-inner-tab-content">
    <OxygenGraph />
    <div class="tableClass">
      <OxygenTable />
    </div>
  </div>
</template>

<script setup>
  import OxygenGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/oxygenLevels/OxygenGraph"
  import OxygenTable from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/oxygenLevels/OxygenTable"
  import { onUnmounted } from "vue"
  import { useStore } from "vuex"

  const store = useStore()

  onUnmounted(() => {
		store.commit("vitals/patientOxygenSaturationGraph", null)
  })
</script>
