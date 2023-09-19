<template>
    <EmptyTable :text="$t('global.billingTab')" v-if="state.billing?.processBillingList?.length === 0" />
    <a-table v-else :dataSource="state.billing?.processBillingList" :columns="columns" class="common-table"
        :pagination="false" @change="tableSorting">
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
                <a class="billing-download-link" v-bind:href="record?.processedData">
                    <DownloadOutlined />
                </a>
            </template>
            <template v-if="column.dataIndex == 'Raw'">
                <a class="billing-download-link" v-bind:href="record?.rawData">
                    <DownloadOutlined />
                </a>
            </template>
            <template v-if="column.dataIndex == 'totalFee'">
                <span>
                    {{ text ?  '$ '+text : '-' }}
                </span>
            </template>
            <template v-if="column.dataIndex == 'Mark'">
                <a-space>
                    <a-popconfirm :title="messages.markBilled" ok-text="Yes" cancel-text="No"
                        @confirm="markedBilled(record.billingProcessedId)">
                        <Button :disabled="record.isBilled == 1 ? true : false" classData="secondary-btn"
                            name=" Mark as billed"></Button>
                    </a-popconfirm>

                    <a-popconfirm v-if="record.isBilled == 0" :title="messages.deleteBilling" ok-text="Yes" cancel-text="No"
                        @confirm="deleteBilled(record.billingProcessedId)">
                        <Button classData="delete-btn" name=" Delete"></Button>
                    </a-popconfirm>


                </a-space>
            </template>
        </template>

    </a-table>
    <Pagination v-if="state.billing.processBillingList.length > 0" :meta="state.billing?.processBillingMeta"
        commit="PROCESS_BILLING_LIST" :endpoint="`process/billing/log`"
        :params="'&fromDate=' + state.billing?.billingFilterDate?.fromDate + '&toDate=' + state.billing?.billingFilterDate?.toDate"
        loader="BILLING_LOADING" />
    <Loader v-if="state.billing.billingLoading" />
</template>
  
<script setup>
import { DownloadOutlined } from '@ant-design/icons-vue';

import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import Pagination from "@/components/pagination/Pagination";
import Loader from "@/components/patients/Loader.vue"
import { tableSortingCommon } from '@/commonMethods/commonMethod';
import Button from "@/components/button/Button.vue";
import { messages } from "@/config/messages";
const { state, dispatch } = useStore();
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
        title: "Process Date",
        dataIndex: "processDate",
        key: "processDate"
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
    {
        title: "Raw Data",
        dataIndex: "Raw",
        key: "raw",
    },
    {

        dataIndex: "Mark",
        key: "mark",
    },


];

const tableSorting = (pagination, filters, sorter) => {
    let filter = '&fromDate=' + state.billing?.billingFilterDate?.fromDate + '&toDate=' + state.billing?.billingFilterDate?.toDate
    if (state.billing?.processBillingMeta?.total > state.billing?.processBillingMeta?.per_page) {
        return tableSortingCommon('PROCESS_BILLING_LIST', `process/billing/log`, sorter, state.billing?.processBillingMeta, filter, 'BILLING_LOADING')
    }
};
onMounted(() => {
    dispatch("processBillingList");
});

// const rowDownload = (id) => {
//     dispatch("processDownloadProcessData", id)
// }
const markedBilled = (id) => {
    dispatch("markedBilled", id)
}
// const onClose = (event) => {
//     billingDetailisVisible.value = event
// }
const deleteBilled = (id) => {
    dispatch("deleteBilled", id)
}
onUnmounted(() => {

});
</script>
<style lang="scss" scoped>
.common-table {
    margin-top: 60px;
}
</style>
  