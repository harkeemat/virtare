<template>
  <div class="vital-inner-tab-content">
    <BloodPressureGraph />
    <div class="tableClass">
      <BloodPressureTable />
    </div>
  </div>
</template>

<script setup>
  import BloodPressureGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/bloodPressure/BloodPressureGraph"
  import BloodPressureTable from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/bloodPressure/BloodPressureTable"
  import { onUnmounted } from "vue"
  import { useStore } from "vuex"

  const store = useStore()

  onUnmounted(() => {
		store.commit("vitals/patientBloodPressureGraph", null)
  })
</script>