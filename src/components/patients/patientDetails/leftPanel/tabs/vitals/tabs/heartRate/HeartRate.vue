<template>
  <div class="vital-inner-tab-content">
    <HeartRateGraph />
    <div class="tableClass">
      <HeartRateTable />
    </div>
  </div>
</template>

<script setup>
  import HeartRateGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/heartRate/HeartRateGraph"
  import HeartRateTable from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/heartRate/HeartRateTable"
  import { onUnmounted } from "vue"
  import { useStore } from "vuex"

  const store = useStore()

  onUnmounted(() => {
		store.commit("vitals/patientHeartRateGraph", null)
  })
</script>
