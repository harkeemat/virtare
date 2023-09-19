<template>
  <a-layout-content>
    <div class="common-bg">
      <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">
            WorkFlow Setup
            <div class="commonBtn">
              <a-button type="primary" @click="showModal">Create New</a-button>
            </div>
          </h2>
        </a-col>
        <a-col :span="12" class="search">
          <a-select v-model:value="search" :size="size" mode="tags" style="width: 100%" placeholder="Search . . ." :options="searchoptions" @change="handleChange2">
          </a-select>
        </a-col>
        <a-col :span="24" class="mt-25 ">
          <WorkFlowTable :columns="columns" :data="workflowList" @showEditModal="showEditModal($event)"/>
          <Loader />
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
  <!-- Modals -->
  <CreateWorkFlowModal v-model:visible="showWorkFlowModal" @saveModal="handleOk($event)" :update="update"/>
</template>

<script>
import WorkFlowTable from "@/components/work-flow/tables/WorkFlowTable.vue"
import { defineAsyncComponent,ref } from "vue"
import Loader from "@/components/loader/Loader"
import {useStore} from "vuex"
const columns = [
  {
    title: "Workflow Event",
    dataIndex: "eventTitle",
    sorter: {
      compare: (a, b) => a.template - b.template,
      multiple: 3,
    },
  },
  {
    title: "Workflow Name",
    dataIndex: "title",
    sorter: {
      compare: (a, b) => a.template - b.template,
      multiple: 3,
    },
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    sorter: {
      compare: (a, b) => a.template - b.template,
      multiple: 3,
    },
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    sorter: {
      compare: (a, b) => a.template - b.template,
      multiple: 3,
    },
  },
  {
    title: "Configure Workflow",
    dataIndex: "configureWorkflow",
    slots: {
      customRender: "configureWorkflow",
    },
  },
  {
    title: "Manage Actions",
    dataIndex: "workflowActions",
    slots: {
      customRender: "workflowActions",
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    slots: {
      customRender: "actions",
    },
  },
];

export default {
    name:"WorkFlowSetup",
    components: {
    CreateWorkFlowModal :defineAsyncComponent(()=>import("@/components/work-flow/modals/CreateWorkFlowModal")),
    WorkFlowTable,
    Loader
  },

  setup() {
    const search = ref()
    const update = ref(false)
    const store = useStore()
    const showWorkFlowModal = ref(false);
    const showModal = () => {
      update.value = false;
      showWorkFlowModal.value = true;
    };

    const showEditModal = (value) => {
      update.value = true;
      showWorkFlowModal.value = value;
    };

    const handleOk = (value) => {
      showWorkFlowModal.value = value;
    };
    const handleChange2 = (value) => {
      console.log(`selected ${value}`);
    };

    const searchoptions = ref([]);
    return {
      update,
      columns,
      workflowList:store.getters.workflowList,
      search,
      showWorkFlowModal,
      showModal,
      handleOk,
      handleChange2,
      searchoptions,
      size: ref(),
      showEditModal
    };
  },
};
</script>

<style scoped>
.search {
  padding-bottom: 15px;
}
</style>