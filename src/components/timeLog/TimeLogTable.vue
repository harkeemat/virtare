
<template>
    <EmptyTable :text="$t('global.billingTab')"
        v-if="store.state.billing?.billingList?.length === 0 && !store.state.billing?.billingLoading" />
    <a-table :dataSource="store.state.billing?.billingList" :columns="columns" class="common-table no-link" :scroll="{ x: 1500 }"
        :pagination="false" v-else @change="tableSorting" />
    <Pagination v-if="store.state.billing.billingList.length > 0" :meta="store.state.billing?.billingMeta"
        commit="BILLING_LIST" :endpoint="`billing/service/log`"
        :params="'&fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate+'&processDate=1'"
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
        title: "DOB",
        dataIndex: "patientDOB",
        key: "patientDOB",
        ellipsis: true,
        //sorter: (a, b) =>a  && a?.patientDOB && b && b?.patientDOB ? a.patientDOB.localeCompare(b.patientDOB):'',
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
        title: "Activity Date & Time",
        dataIndex: "activityDate",
        key: "activityDate",
        sorter: (a, b) => a && a?.activityDate && b && b?.activityDate ? a.activityDate.localeCompare(b.activityDate) : '',
    },
    {
        title: "Activity",
        dataIndex: "activityName",
        key: "activityName",
        sorter: (a, b) => a && a?.activityName && b && b?.activityName ? a.activityName.localeCompare(b.activityName) : '',
    },
    {
        title: "Duration(HH:MM:SS)",
        dataIndex: "durations",
        key: "durations",
        //sorter: (a, b) => a && a?.durations && b && b?.durations ? a?.durations.localeCompare(b?.durations) :'',
    },
    {
        title: "Activity Category",
        dataIndex: "activityCategory",
        key: "activityCategory",
        sorter: (a, b) => a && a?.activityCategory && b && b?.activityCategory ? a?.activityCategory.localeCompare(b?.activityCategory) : '',
    },
    {
        title: "Performed By",
        dataIndex: "performedBy",
        key: "performedBy",
        sorter: (a, b) => a && a?.performedBy && b && b?.performedBy ? a.performedBy.localeCompare(b.performedBy) : '',
    },
    {
        title: "Is Billable",
        dataIndex: "isBillable",
        key: "isBillable",
        sorter: (a, b) => a && a?.isBillable && b && b?.isBillable ? a.isBillable.localeCompare(b.isBillable) : '',
    },
];
const tableSorting = (pagination, filters, sorter) => {
    let filter = '&fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate + '&processDate=1'
    if (store.state.billing?.billingMeta?.total > store.state.billing?.billingMeta?.per_page) {
        return tableSortingCommon('BILLING_LIST', `billing/service/log`, sorter, store.state.billing?.billingMeta, filter, 'BILLING_LOADING')
    }
}
onMounted(() => {
    store.dispatch("billingList");
})
onUnmounted(() => {

})
</script>
