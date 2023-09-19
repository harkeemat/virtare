<template>
  <div class="vital-inner-tab-content">
    <BehavioralHealthGraph />
    <div class="tableClass">
      <BehavioralHealthTable />
    </div>
  </div>
</template>

<script setup>
  import BehavioralHealthGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/behavioralHealth/BehavioralHealthGraph"
  import BehavioralHealthTable from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/behavioralHealth/BehavioralHealthTable"
</script>

