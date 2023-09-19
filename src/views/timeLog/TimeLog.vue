<template>
  <a-layout-content>
    <TimeLog :key="componentKey" />
  </a-layout-content>
</template>
  
<script setup>
import TimeLog from "@/components/timeLog/TimeLog";
import { computed } from "vue-demi";
import { useStore } from "vuex";
const store = useStore();
const componentKey = computed(() => {
  return store.state.common.componentKey;
});
</script>
  