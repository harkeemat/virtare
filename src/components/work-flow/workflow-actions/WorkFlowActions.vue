<template>
  <div>
    <a-layout-content>
      <div class="common-bg">
        <a-row>
          <a-col :span="24">
            <h3 class="pageTittle">
              <router-link to="/admin/work-flow"> Workflow {{ workflowCriteria ? ' ( '+workflowCriteria.title+' ) ' : "" }}</router-link> > Actions
              <div class="commonBtn">
                <a-button type="primary" @click="showActionsModal(null, null)">Create New</a-button>
              </div>
            </h3>
          </a-col>
          <a-col :span="12" class="search">
            <a-select v-model:value="search" :size="size" mode="tags" style="width: 100%" placeholder="Search . . ." :options="searchoptions" @change="handleChange2">
            </a-select>
          </a-col>

          <a-col :span="24" class="mt-25 ">
            <a-table class="sortIconTable" rowKey="id"  :columns="actionsListColumns" :data-source="actionsList" :scroll="{ x: 800 }" :pagination="false">
              <template #executionOffsetDays="{record}">
                <span>{{ record.executionOffsetDays+' '}}{{record.executionOffsetType=='+'?'Days After':'Days Before'}}</span>
              </template>
              <template #configureAction="{record}">
                <!-- <a @click="showActionConfigurationModal(record.id, record.workFlowActionId)">Configure</a> -->
                <router-link :to="{ name: 'WorkFlowActionsDetails', params: { workflowUdid: route.params.workflowUdid, actionUdid: record.id } }">Configure</router-link>
                <a-tooltip placement="bottom" class="tooltip" @click="showActionConfigurationModal(record.id)" >
                  <template #title>
                    <span>Add Criteria</span>
                  </template>
                  <a class="icons">+</a>
                </a-tooltip>
              </template>
              <template #actions="{record}">
                <a-tooltip placement="bottom" @click="showActionsModal(record.id, record.workFlowActionId)" >
                  <template #title>
                    <span>Edit</span>
                  </template>
                  <a class="icons">
                    <EditOutlined />
                  </a>
                </a-tooltip>
                <a-tooltip placement="bottom" @click="deleteData(record.id)">
                  <template #title>
                    <span>Delete</span>
                  </template>
                  <a class="icons">
                    <DeleteOutlined />
                  </a>
                </a-tooltip>
              </template>
            </a-table>
            <Loader />
          </a-col>
        </a-row>
      </div>
    </a-layout-content>

    <!-- modal -->
  <WorkflowActionsModal v-if="workflowActionsModalVisible" v-model:visible="workflowActionsModalVisible" @closeModal="closeModal" :workflowId="workflowId" />
  <WorkflowActionConfigureModal v-if="workflowActionConfigureVisible" v-model:visible="workflowActionConfigureVisible" @closeModal="closeModal" />
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Loader from "@/components/loader/Loader";
import WorkflowActionsModal from "@/components/work-flow/modals/WorkflowActionsModal"
import WorkflowActionConfigureModal from "@/components/work-flow/modals/WorkflowActionConfigureModal"
import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons-vue";
import { warningSwal} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";

export default {
  name: "WorkFlowDetails",
  components: {
    WorkflowActionsModal,
    WorkflowActionConfigureModal,
    Loader,
    DeleteOutlined,
    EditOutlined,
  },
  setup() {
    const store = useStore();
    const route = useRoute()
    const workflowActionsModalVisible = ref(false)
    const workflowActionConfigureVisible = ref(false)
    
    const workflow = computed(() => {
      return store.state.workflow;
    })
    
    const workflowCriteria = computed(() => {
      return store.state.workflow.workflowCriteria;
    })
    
    const actionsList = computed(() => {
      return store.state.workflow.actionsList;
    })

    onMounted(() => {
      store.dispatch("workflowColumn", route.params.workflowUdid);
      store.dispatch("actionsList", {
        workflowId: route.params.workflowUdid,
      })
    });

    const showActionsModal = (workFlowActionUdid, workFlowActionId) => {
      if(workFlowActionUdid != null) {
        store.dispatch("actionsList", {
          workflowId: route.params.workflowUdid,
        })
        store.dispatch("actionsField", {
          workflowId: route.params.workflowUdid,
          actionId: workFlowActionId,
        })
        store.dispatch('editWorkflowAction', {
          workflowId: route.params.workflowUdid,
          actionId: workFlowActionId,
          workFlowActionId: workFlowActionUdid,
        })
      }
      workflowActionsModalVisible.value = true
    }

    function deleteData(id){
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteActions', {
            workflowId: route.params.workflowUdid,
            id:id
          }).then((response) => {
            if (response == true) {
              store.dispatch("actionsList", {
                workflowId: route.params.workflowUdid,
              });
            }
          })
        }
      })
    }

    /* const showActionConfigurationModal = (workFlowActionUdid, workFlowActionId) => {
      store.dispatch("actionsField", {
        workflowId: route.params.workflowUdid,
        actionId: workFlowActionId,
      })
      store.dispatch('workflowColumns', route.params.workflowUdid)
      store.dispatch('editWorkflowAction', {
        workflowId: route.params.workflowUdid,
        actionId: workFlowActionId,
        workFlowActionId: workFlowActionUdid,
      })
    } */

    const closeModal = () => {
      workflowActionsModalVisible.value = false
    }

    const showActionConfigurationModal = (workFlowActionId) => {
      store.dispatch('editWorkflowAction', {
        workflowId: route.params.workflowUdid,
        workFlowActionId: workFlowActionId,
      }).then(() => {
        workflowActionConfigureVisible.value = true
      })
    }

    return {
      showActionConfigurationModal,
      workflowActionConfigureVisible,
      workflow,
      workflowCriteria,
      showActionsModal,
      actionsList,
      workflowActionsModalVisible,
      deleteData,
      // showActionConfigurationModal,
      closeModal,
      route,
      actionsListColumns: [{
        title: "Workflow Action",
        dataIndex: "workflowActionName",
      },
      {
        title: "Action Date",
        dataIndex: "executionOffsetDays",
        sorter: {
          compare: (a, b) => a.template - b.template,
          multiple: 3,
        },
        slots: {
          customRender: "executionOffsetDays",
        },
      },
      {
        title: "From",
        dataIndex: "workFlowEventOffsetFieldName",
      },
      {
        title: "Configuration",
        dataIndex: "configureAction",
        slots: {
          customRender: "configureAction",
        },
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
a.icons.tooltip {
  /* padding: 0px 6px 0px 6px; */
  /* border: 1px solid #1D8FFB; */
  /* border-radius: 50px; */
  position: relative;
  left: 8px;
  font-size: 20px;
  top: 2px;
}
</style>
