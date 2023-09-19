<template>
    <EmptyTable :text="$t('global.billingTab')"
        v-if="store.state.billing?.processBillingList?.length === 0 && !store.state.billing?.billingLoading" />
    <a-table :dataSource="store.state.billing?.processBillingList" :columns="columns" class="common-table no-link"
        :pagination="false" v-else @change="tableSorting" />
    <Pagination v-if="store.state.billing.processBillingList.length > 0" :meta="store.state.billing?.processBillingMeta"
        commit="PROCESS_BILLING_LIST" :endpoint="`process/billing/log`"
        :params="'&fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate"
        loader="BILLING_LOADING" />
    <Loader v-if="store.state.billing.billingLoading" />
</template>
  
<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import Pagination from "@/components/pagination/Pagination";
import Loader from "@/components/patients/Loader.vue"
import { tableSortingCommon } from '@/commonMethods/commonMethod';
const store = useStore();
const columns = [
    {
        title: "Name",
        dataIndex: "patientName",
        key: "patientName",
        sorter: (a, b) => a && a?.patientName && b && b?.patientName ? a.patientName.localeCompare(b.patientName) : '',
    },
    {
        title: "Place Of Service",
        dataIndex: "placeOfService",
        key: "placeOfService",
        ellipsis: true,
        //sorter: (a, b) => a  && a?.placeOfService && b && b?.placeOfService ?a.placeOfService.localeCompare(b.placeOfService):'',
    },
    {
        title: "Client",
        dataIndex: "clientName",
        key: "clientName",
        ellipsis: true,
        sorter: (a, b) => a && a?.clientName && b && b?.clientName ? a.clientName.localeCompare(b.clientName) : '',
    },
    {
        title: "Contract Type",
        dataIndex: "contractName",
        key: "contractName",
        ellipsis: true,
        sorter: (a, b) => a && a?.contractName && b && b?.contractName ? a.contractName.localeCompare(b.contractName) : '',
    },
    {
        title: "CPT Code",
        dataIndex: "cptCode",
        key: "cptCode",
        sorter: (a, b) => a && a?.cptCode && b && b?.cptCode ? a.cptCode.localeCompare(b.cptCode) : '',
    },
    {
        title: "Unit",
        dataIndex: "unitsAllowed",
        key: "unitsAllowed",
        sorter: (a, b) => a && a?.unitsAllowed && b && b?.unitsAllowed ? a?.unitsAllowed - b?.unitsAllowed : '',
    },
    {
        title: "Processed Date",
        dataIndex: "activityDate",
        key: "activityDate",
        sorter: (a, b) => a && a?.activityDate && b && b?.activityDate ? a.activityDate.localeCompare(b.activityDate) : '',
    },

];
const tableSorting = (pagination, filters, sorter) => {
    let filter = '&fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate
    if (store.state.billing?.processBillingMeta?.total > store.state.billing?.processBillingMeta?.per_page) {
        return tableSortingCommon('PROCESS_BILLING_LIST', `process/billing/log`, sorter, store.state.billing?.processBillingMeta, filter, 'BILLING_LOADING')
    }
};
onMounted(() => {
    store.dispatch("processBillingList");
});

onUnmounted(() => {

});
</script>
  