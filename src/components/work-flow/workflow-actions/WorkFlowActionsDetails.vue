<template>
  <div>
    <a-layout-content>
      <div class="common-bg">
        <a-row>
          <a-col :span="24">
            <h3 class="pageTittle">
              <router-link to="/admin/work-flow"> Workflow {{ workflowCriteria ? "("+workflowCriteria.title+")" : "" }}</router-link> > <router-link :to="{ name: 'WorkFlowActions', params: { workflowUdid: route.params.workflowUdid, actionUdid: route.params.actionUdid  }}"> Action {{ editWorkflowAction ? "("+editWorkflowAction.workflowActionName+")" : "" }} </router-link > > Criteria
              <div class="commonBtn">
                <a-button type="primary" @click="showActionConfigurationModal">Create New</a-button>
              </div>
            </h3>
          </a-col>
          <a-col :span="12" class="search">
            <a-select v-model:value="search" :size="size" mode="tags" style="width: 100%" placeholder="Search . . ." :options="searchoptions" @change="handleChange2">
            </a-select>
          </a-col>

          <a-col :span="24" class="mt-25 ">
            <a-table class="sortIconTable" rowKey="id"  :columns="actionCriteriaColumns" :data-source="actionCriteria" :scroll="{ x: 800 }" :pagination="false">
              
            </a-table>
            <Loader />
          </a-col>
        </a-row>
      </div>
    </a-layout-content>

    <!-- modal -->
  <WorkflowActionConfigureModal v-if="workflowActionConfigureVisible" v-model:visible="workflowActionConfigureVisible" @closeModal="closeModal" />
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Loader from "@/components/loader/Loader";
import WorkflowActionConfigureModal from "@/components/work-flow/modals/WorkflowActionConfigureModal"

export default {
  name: "WorkFlowDetails",
  components: {
    Loader,
    WorkflowActionConfigureModal,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const workflowActionConfigureVisible = ref(false)
    
    const workflow = computed(() => {
      return store.state.workflow;
    })
    
    const editWorkflowAction = computed(() => {
      return store.state.workflow.editWorkflowAction;
    })
    
    const actionCriteria = computed(() => {
      return store.state.workflow.actionCriteria;
    })
    
    const workflowCriteria = computed(() => {
      return store.state.workflow.workflowCriteria;
    })

    onMounted(() => {
      store.dispatch('workflowColumn', route.params.workflowUdid)
      store.dispatch('editWorkflowAction', {
        workflowId: route.params.workflowUdid,
        workFlowActionId: route.params.actionUdid,
      })
      store.dispatch('actionCriteria', {
        workflowUdid: route.params.workflowUdid,
        actionUdid: route.params.actionUdid,
      });
    })

    const showActionConfigurationModal = () => {
      store.dispatch('editWorkflowAction', {
        workflowId: route.params.workflowUdid,
        workFlowActionId: route.params.actionUdid,
      })
      workflowActionConfigureVisible.value = true
    }

    return {
      showActionConfigurationModal,
      workflow,
      editWorkflowAction,
      actionCriteria,
      workflowCriteria,
      route,
      workflowActionConfigureVisible,
      actionCriteriaColumns: [{
        title: "Criteria Name",
        dataIndex: "criteriaName",
      },
      {
        title: "Actions",
        dataIndex: "actions",
        slots: {
          customRender: "actions",
        },
      }],
    };
  },
};
</script>

<style scoped>
.search {
  padding-bottom: 15px;
}
</style>
