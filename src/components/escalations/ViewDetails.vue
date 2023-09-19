<template>
  <a-modal max-width="1140px" width="50%" :title="arrayData?.length>0?'Send To Details':'Audit Details'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
      <a-row :gutter="24" class="row">
          <a-col :sm="24" :xs="24" v-if="arrayData?.length>0">
    
              <a-table class="sortIconTable" rowKey="staffId" :scroll="{ x:'',y:'calc(100vh - 490px)' }" :columns="escalationData.staffColumns" :data-source="arrayData" :pagination="false">
                  <template #name="{record}" >
                      <!-- <span>{{ record?.staff?.fullName }}</span> -->
                      <router-link :to="{ name: 'CoordinatorSummary', params: { udid:  record?.staff?.id } }">{{ record?.staff?.fullName>12?record?.staff?.fullName.substring(0,10)+'...':record?.staff?.fullName }}</router-link>
                      <a v-if="record?.staff?.fullName" @click="showStaffModal( record?.staff?.id)" class="nameInfoIcon">
                          <InfoCircleOutlined />
                      </a>
                  </template>
                  <template #designation="{record}">
                      <span>{{ record.staff?.designation }}</span>
                  </template>
                  <template #specialization="{record}">
                      <span>{{ record.staff?.specialization }}</span>
                  </template>
              </a-table>
          </a-col>
          <a-col :sm="24" :xs="24" v-if="escalationData?.getAuditData?.length>0">
              <a-table class="sortIconTable" rowKey="staffId" :scroll="{ x:'',y:'calc(100vh - 490px)' }" :columns="auditColumn" :data-source="escalationData?.getAuditData" :pagination="false">
                  <template #name="{record}" >
                      <!-- <span>{{ record?.staff?.fullName }}</span> -->
                      <router-link :to="{ name: 'CoordinatorSummary', params: { udid:  record?.createdBy?.id } }">{{ record?.createdBy?.fullName>12?record?.createdBy?.fullName.substring(0,10)+'...':record?.createdBy?.fullName }}</router-link>
                      <a v-if="record?.createdBy?.fullName" @click="showStaffModal( record?.createdBy?.id)" class="nameInfoIcon">
                          <InfoCircleOutlined />
                      </a>
                  </template>
                  <template #entityType="{record}">
                      <span>{{ record?.entityType }}</span>
                  </template>
                  <template #createdAt="{record}">
                      <span>{{ record?.createdAt }}</span>
                  </template>
              </a-table>
          </a-col>
          <a-col :sm="24" :xs="24" v-if="!escalationData?.getAuditData?.length>0 && !arrayData?.length>0">
              <div class="text-align">
                  <h3>No Data!</h3>
              </div>
          </a-col>
      </a-row>
      <TableLoader/>
  </a-modal>
  
  </template>
<script>
import { defineComponent, computed } from "vue";
import { showStaffModal } from "@/commonMethods/commonMethod";
import { useStore } from "vuex";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import TableLoader from "@/components/loader/TableLoader.vue";
let auditColumn = [
    {
      title: 'User',
      dataIndex: 'name',
      slots: {
        customRender: 'name'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },

    {
      title: 'Action',
      dataIndex: 'entityType',
      slots: {
        customRender: 'entityType'
      },
      filterMultiple: false,
      onFilter: (value, record) => record.entityType.indexOf(value) === 0,
      sorter: (a, b) => a.entityType.localeCompare(b.entityType),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Action Time',
      dataIndex: 'createdAt',
      slots: {
        customRender: 'createdAt'
      },
    },

]
export default defineComponent({
  props: {
    arrayData: Array,
  },
  components: {
    InfoCircleOutlined,
    TableLoader
},
  setup() {
    const store = useStore();
    const closeModal = () => {
      //
    };
    const escalationData = computed(() => {
      return store.state.escalations;
    });
    return {
      auditColumn,
      escalationData,
      showStaffModal,
      closeModal,
    };
  },
});
</script>
    
    
<style lang="css">
.text-align {
  text-align: center;
}
</style>
