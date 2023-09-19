<template>
  <EmptyTable :text="$t('global.billingTab')"
    v-if="store.state.patientBilling?.patientBillingList?.length === 0 && !store.state.patientBilling?.patientBillingLoading" />
  <a-table :dataSource="store.state.patientBilling?.patientBillingList" :columns="columns" class="common-table no-link"
    :pagination="false" v-else @change="tableSorting">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex == 'title'">
        <span>
          {{ record.startDate }}—{{ record.endDate }}
        </span>
      </template>
      <template v-if="column.dataIndex == 'totalFee'">
        <span>
          {{ text ?  '$ '+text : '-' }}
        </span>
      </template>
      <template v-if="column.dataIndex == 'process'">
        <a class="billing-download-link" v-bind:href="record?.processedData">
          <DownloadOutlined />
        </a>
      </template>

    </template>
  </a-table>
  <Pagination v-if="store.state.patientBilling.patientBillingList.length > 0"
    :meta="store.state.patientBilling?.patientBillingMeta" commit="PATIENTS_BILLING_LIST"
    endpoint="list/patient/billingReport" :params="`&patientId=${route.params.udid}`" loader="PATIENTS_BILLING_LOADING" />
  <Loader v-if="store.state.patientBilling.patientBillingLoading" />
</template>

<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Pagination from "@/components/pagination/Pagination";
import Loader from "@/components/patients/Loader.vue"
import { tableSortingCommon } from '@/commonMethods/commonMethod';
import { DownloadOutlined } from '@ant-design/icons-vue';
const store = useStore();
const route = useRoute();

const columns = [
  {
    title: "Ref",
    dataIndex: "billingProcessedId",
    key: "billingProcessedId"
  },
  {
    title: "Period",
    dataIndex: "title",
    key: "title",
    ellipsis: true,
    //sorter: (a, b) => a && a?.durations && a?.durations && b && b?.durations ? a?.durations.localeCompare(b?.durations) : '',
  },
  {
    title: "Total Amount",
    dataIndex: "totalFee",
    key: "totalFee"
  },

  {
    title: "Billed Date",
    dataIndex: "isBilledDate",
    key: "isBilledDate"
  },
  {
    title: "Process Billing",
    dataIndex: "process",
    key: "process",
  },

];
const tableSorting = (pagination, filters, sorter) => {
  let filter = `&patientId=${route.params.udid}`
  if (store.state.patientBilling.patientBillingMeta?.total > store.state.patientBilling.patientBillingMeta?.per_page) {
    return tableSortingCommon('PATIENTS_BILLING_LIST', `list/patient/billingReport`, sorter, store.state.patientBilling.patientBillingMeta, filter, 'PATIENTS_BILLING_LOADING')
  }
};
onMounted(() => {
  store.dispatch("patientBillingList", route.params.udid);
});

onUnmounted(() => {

});
</script>
