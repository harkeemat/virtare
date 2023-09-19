<template>
  <a-layout-content>
    <ClientDetails :key="componentKey" />
  </a-layout-content>
</template>
  
<script>
  import ClientDetails from "@/components/administration/clients/ClientDetails"
  import { computed } from 'vue-demi';
  import { useStore } from 'vuex';
  
  export default {
    name: 'ViewClientDetails',
    components: {
      ClientDetails,
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
  