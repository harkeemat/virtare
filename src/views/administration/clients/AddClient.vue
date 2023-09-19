<template>
  <a-layout-content>
    <AddClient :key="componentKey" />
  </a-layout-content>
</template>
  
  <script>
import AddClient from "@/components/administration/clients/AddClient";
import { computed } from "vue-demi";
import { useStore } from "vuex";

export default {
  name: "ViewAddClient",
  components: {
    AddClient,
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
  