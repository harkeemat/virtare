<template>
    <a-layout-content>
    <Billing :key="componentKey" />
  </a-layout-content>
  </template>
  
  <script setup>
  import Billing from "@/components/billing/NewBilling";
  import { computed } from "vue-demi";
  import { useStore } from "vuex";
      const store = useStore();
      const componentKey = computed(() => {
        return store.state.common.componentKey;
      });
  </script>
  