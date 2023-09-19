<template>
    <a-table v-if="medicalRecord?.medicalList?.length > 0" :dataSource="medicalRecord?.medicalList" :columns="columns"
        class="common-table" :pagination="false" :customRow="customRow" @change="tableSorting">
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'diagnoseDate'">
                {{ dateFormatClient(record?.diagnoseDate) }}
            </template>
            <template v-if="column.dataIndex == 'cured'">
                {{ record?.cured ? 'Yes' :'No' }}
            </template>
            
        </template>
    </a-table>
    <div v-else>
        <EmptyTable :text="$t('global.medicalHistoryTab')" />
    </div>
    <a-col :span="24" v-if="medicalRecord?.medicalList?.length > 0">
        <Pagination :meta="medicalRecord?.medicalMeta" commit="medicalList"
            :endpoint="medicalAdd(route?.params?.udid)" :params="null"
            loader="patientTabLoader" />
    </a-col>
    <PatientTabsLoader />
    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <AddMedical @onClose="onClose($event)" v-if="visible" :isEdit="true" />
    </a-drawer>
</template>
  
<script>
import { onMounted, onUnmounted, ref } from "vue";
import AddMedical from "@/components/patients/patientDetails/leftPanel/tabs/medical/AddMedical";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { medicalAdd } from "@/config/apiConfig"
import { tableSortingCommon,dateFormatClient , arrayToObjectData } from '@/commonMethods/commonMethod';
import PatientTabsLoader from "@/components/patients/PatientTabsLoader";
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from '@/components/administration/clients/EmptyTable.vue';
export default {
    components: {
        AddMedical,
        Pagination,
        EmptyTable,
        PatientTabsLoader
    },
    setup() {
        const visible = ref(false);
        const route = useRoute()
        const store = useStore()
        const medicalRecord = store.getters.medicalRecord
        const screensPermissions = store.getters.screensPermissions
        onMounted(() => {
            store.dispatch("medicalList", { id: route?.params?.udid })
        })
        function customRow(record) {
            
            return {
                onClick: () => { 
                    store.dispatch("medicalHistoryDetail",{id: route?.params?.udid,medicalId:record?.udid})
                    visible.value = true
                }
            }
        }
        const tableSorting = (pagination, filters, sorter) => {
            let filter = ''
            if (medicalRecord.value?.medicalMeta?.total > medicalRecord.value?.medicalMeta?.per_page) {
                return tableSortingCommon('medicalList', medicalAdd(route?.params?.udid), sorter, medicalRecord.value?.medicalMeta, filter, 'patientTabLoader')
            }
        };
        const onClose = (event) =>{
            visible.value = event;
        }
        onUnmounted(()=>{
            store.state.medical.medicalList = []
        })
        return {
            medicalAdd,
            onClose,
            customRow,
            visible,
            tableSortingCommon,
            route,
            medicalRecord,
            tableSorting,
            dateFormatClient,
            arrayToObjectData,
            screensPermissions,
            columns: [
                {
                    title: "Diagnosis",
                    dataIndex: "diagnosis",
                    key: "device",
                    sorter: (a, b) => a.diagnosis.localeCompare(b.diagnosis)
                },
                {
                    title: "Diagnose Code",
                    dataIndex: "diagnoseCode",
                    key: "diagnoseCode",
                    sorter: (a, b) => a.diagnoseCode.localeCompare(b.diagnoseCode)
                },
                {
                    title: "Diagnose Date",
                    dataIndex: "diagnoseDate",
                    key: "diagnoseDate",
                    sorter: (a, b) => a.diagnoseDate.localeCompare(b.diagnoseDate)
                },
                {
                    title: "Cured",
                    dataIndex: "cured",
                    key: "cured",
                },
            ],
        };
    },
};
</script>
  
