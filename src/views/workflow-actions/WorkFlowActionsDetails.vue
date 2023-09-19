<template>
  <WorkFlowActionsDetails :key="componentKey" />
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import WorkFlowActionsDetails from "@/components/work-flow/workflow-actions/WorkFlowActionsDetails"

export default {
  name: "WorkFlowDetails",
  components: {
    WorkFlowActionsDetails,
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
