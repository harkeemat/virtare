<template>
  <WorkFlowActions :key="componentKey" />
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import WorkFlowActions from "@/components/work-flow/workflow-actions/WorkFlowActions"

export default {
  name: "WorkFlowDetails",
  components: {
    WorkFlowActions,
  },
  setup() {
    const store = useStore();
    const componentKey = computed(() => {
      return store.state.common.componentKey
    })

    return {
      componentKey,
    };
  },
};
</script>

<style lang="scss" scoped>
.steps-content {
  margin: 20px 0 0;
}
</style>
