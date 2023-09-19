<template>
    <a-table v-if="insuranceRecord?.insuranceList?.length > 0" :dataSource="insuranceRecord?.insuranceList"
        :columns="columns" class="common-table" :pagination="false" :customRow="customRow" @change="tableSorting">
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'startDate'">
                {{ dateFormatClient(record?.startDate) }}
            </template>
            <template v-if="column.dataIndex == 'endDate'">
                {{ dateFormatClient(record?.endDate) }}
            </template>

        </template>
    </a-table>
    <div v-else>
        <EmptyTable :text="$t('global.insuranceTab')" />
    </div>
    <a-col :span="24" v-if="insuranceRecord?.insuranceList?.length > 0">
        <Pagination :meta="insuranceRecord?.insuranceMeta" commit="insuranceList"
            :endpoint="patientsInsurance(route?.params?.udid)" :params="null" loader="patientTabLoader" />
    </a-col>
    <PatientTabsLoader />
    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <AddInsurance @onClose="onClose($event)" :isEdit="true"/>
    </a-drawer>
</template>
<script>
import { onMounted, onUnmounted, ref } from "vue";
import AddInsurance from "@/components/patients/patientDetails/leftPanel/tabs/insurance/AddInsurance";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { patientsInsurance } from "@/config/apiConfig"
import { tableSortingCommon, dateFormatClient } from '@/commonMethods/commonMethod';
import PatientTabsLoader from "@/components/patients/PatientTabsLoader";
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from '@/components/administration/clients/EmptyTable.vue';
export default {
    components: {
        AddInsurance,
        Pagination,
        EmptyTable,
        PatientTabsLoader
    },
    setup() {
        const visible = ref(false);
        const route = useRoute()
        const store = useStore()
        const insuranceRecord = store.getters.insuranceRecord
        onMounted(() => {
            store.dispatch("insuranceList", { id: route?.params?.udid })
        })
        function customRow(record) {
            return {
                onClick: () => {
                    visible.value = true
                    store.dispatch("insuranceDetailFromUdid",{id: route?.params?.udid,insuranceId:record?.id})
                }
            }
        }
        const tableSorting = (pagination, filters, sorter) => {
            let filter = ''
            if (insuranceRecord.value?.insuranceMeta?.total > insuranceRecord.value?.insuranceMeta?.per_page) {
                return tableSortingCommon('insuranceList', patientsInsurance(route?.params?.udid), sorter, insuranceRecord.value?.insuranceMeta, filter, 'patientTabLoader')
            }
        };
        const onClose = (event) => {
            visible.value = event;
        }
        onUnmounted(() => {
            store.state.insurance.insuranceList = []
        })
        return {
            onClose,
            customRow,
            visible,
            tableSortingCommon,
            patientsInsurance,
            route,
            insuranceRecord,
            tableSorting,
            dateFormatClient,
            columns: [
                {
                    title: "Insurance Name",
                    dataIndex: "insuranceName",
                    sorter: (a, b) => a.insuranceName.localeCompare(b.insuranceName)
                },
                {
                    title: "Insurance Number",
                    dataIndex: "insuranceNumber",
                    sorter: (a, b) => a.insuranceNumber.localeCompare(b.insuranceNumber)
                },
                {
                    title: "Start Date",
                    dataIndex: "startDate",
                    sorter: (a, b) => a.startDate.localeCompare(b.startDate)
                },
                {
                    title: "End Date",
                    dataIndex: "endDate",
                    sorter: (a, b) => a.endDate.localeCompare(b.endDate)
                },
            ],
        };
    },
};
</script>
  
