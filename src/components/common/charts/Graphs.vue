<template>
  <div>
    <apexchart
      :height="height"
      :options="props.graphOptions"
      :series="props.graphSeries"
    />
  </div>
</template>

<script setup>
  // import {
  //   defineProps
  // } from "vue";

  const props = defineProps({
    height: String,
    graphOptions: Object,
    graphSeries: Array,
  })
</script>
