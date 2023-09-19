<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="18">
        <a-typography-title :level="2" class="common-heading">Escalations</a-typography-title>
        <a-typography-text class="common-tag-line caption">Communication with external care
          providers</a-typography-text>
      </a-col>

      <a-col :span="6" class="text-right">
        <a-dropdown-button @click="handleButtonClick" class="primary-dropdown" :trigger="['click']">
          Actions
          <template #overlay>
            <a-menu @click="handleMenuClick" class="actionDropdown">
              <a-menu-item key="1" class="newPatient" @click="showDrawer">
                <PlusOutlined />New Escalation
              </a-menu-item>
            </a-menu>
          </template>
          <template #icon>
            <CaretDownOutlined />
          </template>
        </a-dropdown-button>
      </a-col>
      <a-col :span="24">
        <EmptyTable :text="$t('global.alertTab')" v-if="store.state.alerts.alerts.length ==0 && !loading"/>
        <a-table class="common-table" :dataSource="store.state.alerts.alerts" :columns="columns" :pagination="false" :loading="store.state.alerts.isalertsLoading" v-else>
          <template #bodyCell="{ column }">
            <template v-if="column.dataIndex === 'status'">
              <span class="patient-status" style="background-color:#FE8139">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.842 1.63188e-08L3.052 0L5.88 2.842L5.88 5.068H5.74L3.976 3.304H3.906L3.906 9.8L1.988 9.8L1.988 3.304H1.918L0.14 5.068H2.18929e-07L0 2.842L2.842 1.63188e-08Z"
                    fill="white" />
                </svg>
              </span>
            </template>
          </template>
        </a-table>
        <Pagination
          v-if="store.state.alerts.alerts.length > 0"
          :meta="store.state.alerts.meta.pagination"
          endpoint="/escalation"
          commit="alerts"
          loader="alertLoading"
        />
      </a-col>

    </a-row>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import EmptyTable from '../administration/clients/EmptyTable.vue';
import Pagination from '../pagination/Pagination.vue';

const store = useStore();

const handleButtonClick = e => {
  console.log('click left button', e);
};
const handleMenuClick = e => {
  console.log('click', e);
};

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    align: "center"
  },
  {
    title: 'Patient',
    dataIndex: 'patient',
    key: 'patient',
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'Sent To',
    dataIndex: 'sentTo',
    key: 'sentTo',
  },
  {
    title: 'Current Status',
    dataIndex: 'currentStatus',
    key: 'currentStatus',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
]

onMounted(async() => {
  store.dispatch('fetchalerts')
 })

</script>


<style lang="scss" scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
