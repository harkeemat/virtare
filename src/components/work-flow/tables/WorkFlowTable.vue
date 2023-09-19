<template>
  <a-table class="sortIconTable" rowKey="id"  :columns="columns" :data-source="data" :scroll="{ x: 900 }" :pagination="false">
    <template #workflowDescription="record">
      <span>{{ record.text }}</span>
    </template>
    <template #configureWorkflow="{record}">
      <a @click="showWorkflowConfigurationModal(record.id, record.eventId, record.title)">{{ record.configureWorkflow }}</a>
    </template>
    <template #workflowActions="{record}">
      <!-- <a @click="showWorkflowActionsModal(record.id, record.title)">Actions</a> -->
      <router-link :to="{ name: 'WorkFlowActions', params: { workflowUdid: record.id } }">Actions</router-link>
      <a-tooltip placement="bottom" class="tooltip" @click="showActionsModal(record.id)" >
        <template #title>
          <span>Add Action</span>
        </template>
        <a class="icons">+</a>
      </a-tooltip>
    </template>
    <template #actions="{record}">
      <a-tooltip placement="bottom" @click="showModal(record.id)" >
        <template #title>
          <span>Edit</span>
        </template>
        <a class="icons">
          <EditOutlined />
        </a>
      </a-tooltip>
      <!-- <a-tooltip placement="bottom" @click="cloneData(record.id)">
        <template #title>
          <span>Clone</span>
        </template>
        <a class="icons">
          <CopyOutlined />
        </a>
      </a-tooltip> -->
      <!-- <a-tooltip placement="bottom" @click="deleteData(record.id)">
        <template #title>
          <span>Delete</span>
        </template>
        <a class="icons">
          <DeleteOutlined />
        </a>
      </a-tooltip> -->
    </template>
  </a-table>
  <WorkflowConfigurationModal v-if="workflowConfigurationModalVisible" v-model:visible="workflowConfigurationModalVisible" @closeModal="closeModal" :workflowId="workflowId" :workflowTitle="workflowTitle" />
  <WorkflowActionsModal v-if="workflowActionsModalVisible" v-model:visible="workflowActionsModalVisible" @closeModal="closeModal" :workflowId="workflowId" :workflowTitle="workflowTitle" />
</template>

<script>
import {  defineComponent, ref, } from "vue";
import {
  // DeleteOutlined,
  EditOutlined,
  // CopyOutlined
} from "@ant-design/icons-vue";
import { warningSwal} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import {useStore} from "vuex"
import WorkflowConfigurationModal from "@/components/work-flow/modals/WorkflowConfigurationModal"
import WorkflowActionsModal from "@/components/work-flow/modals/WorkflowActionsModal"

export default defineComponent({
  name:"WorkFlowTable",
  components: {
    // DeleteOutlined,
    EditOutlined,
    // CopyOutlined,
    WorkflowConfigurationModal,
    WorkflowActionsModal,
  },
  props: {
    columns:Array,
    data:Array
  },
  setup(props, { emit }) {
    const store = useStore()
    const workflowId = ref(null)
    const workflowTitle = ref("")
    const workflowConfigurationModalVisible = ref(false)
    const workflowActionsModalVisible = ref(false)
    const showModal = (id) => {
      emit("showEditModal",true)
      store.dispatch('editWorkflow',id)
    }
     const handleOk = () => {
      // 
    }

    function cloneData(id){
      let cloneData = [];
      warningSwal("Clone the data!").then((response) => {
        if (response == true) {
         cloneData = id;
        }
      })
    }

    function deleteData(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteWorkflow', id).then(() => {
            store.dispatch("workflowList")
          })
        }
      })
    }
    
    const showWorkflowConfigurationModal = (id, eventId, title) => {
      store.state.workflow.workflowCriteriaDetails = []
      workflowTitle.value = title
      workflowId.value = id
      setTimeout(() => {
        store.dispatch('workflowCriteriaDetails', id)
        store.dispatch('workflowColumns', eventId).then(() => {
          workflowConfigurationModalVisible.value = true
        })
      }, 500);
    }
    
    const showWorkflowActionsModal = (id, title) => {
      workflowId.value = id
      workflowTitle.value = title
      store.dispatch("actionsList", {
        workflowId: id,
      }).then(() => {
        workflowActionsModalVisible.value = true
      })
    }
    
    const closeModal = () => {
      workflowConfigurationModalVisible.value = false
      workflowActionsModalVisible.value = false
    }

    const showActionsModal = (workFlowUdid) => {
      store.dispatch("actionsList", {
        workflowId: workFlowUdid,
      })
      workflowActionsModalVisible.value = true
    }

    return {
      showActionsModal,
      showWorkflowConfigurationModal,
      showWorkflowActionsModal,
      workflowConfigurationModalVisible,
      workflowActionsModalVisible,
      cloneData,
      deleteData,
      showModal,
      handleOk,
      workflowId,
      workflowTitle,
      closeModal,
    };
  },
});
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
