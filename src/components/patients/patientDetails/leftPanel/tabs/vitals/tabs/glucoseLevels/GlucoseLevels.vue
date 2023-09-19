<template>
  <div class="vital-inner-tab-content">
    <GlucoseGraph />
    <div class="tableClass">
      <GlucoseTable />
    </div>
  </div>
</template>

<script setup>
  import GlucoseGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/glucoseLevels/GlucoseGraph"
  import GlucoseTable from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/glucoseLevels/GlucoseTable"
  import { onUnmounted } from "vue"
  import { useStore } from "vuex"

  const store = useStore()

  onUnmounted(() => {
		store.commit("vitals/patientGlucoseGraph", null)
  })
</script>

