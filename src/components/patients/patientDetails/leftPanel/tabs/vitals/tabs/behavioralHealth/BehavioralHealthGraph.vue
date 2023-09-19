<template>
  <div class="bp-detail">
    <!-- <a-typography-text>
      Baseline Min: <span>121/83</span> Normal: <span>134/87</span> Max: <span>147/91</span>
    </a-typography-text>
    <a-typography-text>
      <span class="systolic">Systolic</span><span class="diastolic">Diastolic</span>
    </a-typography-text> -->
    
    <EmptyBehavioralHealthGraph />
  </div>
</template>

<script setup>
  import EmptyBehavioralHealthGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/behavioralHealth/EmptyBehavioralHealthGraph"
</script>
