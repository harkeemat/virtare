<template>
  <a-layout-content>
  <Clients :key="componentKey" />
</a-layout-content>
</template>

<script>
import Clients from "@/components/administration/clients/Clients";
import { computed } from "vue-demi";
import { useStore } from "vuex";

export default {
  name: "ViewClients",
  components: {
    Clients,
  },
  setup() {
    const store = useStore();
    const componentKey = computed(() => {
      return store.state.common.componentKey;
    });

    return {
      componentKey,
    };
  },
};
</script>
