<template>
    <EmptyTable :text="$t('global.billingTab')"
        v-if="store.state.clients?.clientBillingList?.length === 0 && !store.state.clients?.clientBillingLoading" />
    <a-table :dataSource="store.state.clients?.clientBillingList" :columns="columns" class="common-table"
        :pagination="false" v-else @change="tableSorting">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex == 'title'">
                <span>
                    {{ record.startDate }}—{{ record.endDate }}
                </span>
            </template>
            <template v-if="column.dataIndex == 'billingProcessedId'">
                <span>
                    {{ text }}
                </span>
            </template>
            <template v-if="column.dataIndex == 'Processed'">
                <a class="billing-download-link" v-bind:href="record?.processedData" v-if="record?.processedData">
                    <DownloadOutlined />
                </a>
                <span v-else>-</span>
            </template>
            <template v-if="column.dataIndex == 'totalFee'">
                <span>
                    {{ text ?  '$ '+text : '-' }}
                </span>
            </template>
        </template>
    </a-table>
    <Pagination v-if="store.state.clients.clientBillingList.length > 0" :meta="store.state.clients?.clientBillingMeta"
        commit="CLIENT_BILLING_LIST" :endpoint="`list/patient/billingReport`" :params="`&clientId=${route.params.udid}`"
        loader="CLIENT_BILLING_LOADING" />
    <Loader v-if="store.state.clients.clientBillingLoading" />
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
        key: "title"
    },
    {
        title: "No Of Patients",
        dataIndex: "totalPatient",
        key: "totalPatient"
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
        title: "Billing Data",
        dataIndex: "Processed",
        key: "processed",
    },


];
const tableSorting = (pagination, filters, sorter) => {
    let filter = `&clientId=${route.params.udid}`
    if (store.state.clients?.clientBillingMeta?.total > store.state.clients?.clientBillingMeta?.per_page) {
        return tableSortingCommon('CLIENT_BILLING_LIST', `list/patient/billingReport`, sorter, store.state.clients?.clientBillingMeta, filter, 'CLIENT_BILLING_LOADING')
    }
};
onMounted(() => {
    store.dispatch("clientBillingList", route.params.udid);
});

onUnmounted(() => {

});
</script>
