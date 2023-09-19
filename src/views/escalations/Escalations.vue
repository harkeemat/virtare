<template>
  <Escalations :key="componentKey" />
</template>

<script>
import Escalations from "@/components/escalations/StaffEscalation";
import { computed } from "vue-demi";
import { useStore } from "vuex";

export default {
  name: "ViewSpecialists",
  components: {
    Escalations,
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