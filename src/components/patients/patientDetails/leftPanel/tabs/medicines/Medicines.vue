<template>
    <a-table v-if="medicinesRecord?.medicalList?.length > 0" :dataSource="medicinesRecord?.medicalList" :columns="columns"
        class="common-table" :pagination="false" :customRow="customRow" @change="tableSorting">
    </a-table>
    <div v-else>
        <EmptyTable :text="$t('global.medicinesTab')" />
    </div>
    <a-col :span="24" v-if="medicinesRecord?.medicalList?.length > 0">
        <Pagination :meta="medicinesRecord?.medicalMeta" commit="medicalList"
            :endpoint="medicalListing(route?.params?.udid)" :params="null"
            loader="patientTabLoader" />
    </a-col>
    <PatientTabsLoader />
    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <AddMedical @onClose="onClose($event)"/>
    </a-drawer>
</template>
<script>
import { onMounted, onUnmounted, ref } from "vue";
import AddMedical from "@/components/patients/patientDetails/leftPanel/tabs/medicines/AddMedicines";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { medicalListing } from "@/config/apiConfig"
import { tableSortingCommon } from '@/commonMethods/commonMethod';
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
        const medicinesRecord = store.getters.medicinesRecord
        const deletedId = ref()
        onMounted(() => {
            store.dispatch("medicalList", { id: route?.params?.udid })
        })
        function customRow(record) {
            return {
                onClick: () => { 
                    //Remove device data 
                    deletedId.value = record?.id
                    var tableContent = document.querySelector(".delete-btn");
                    tableContent?.click()
                }
            }
        }
        const tableSorting = (pagination, filters, sorter) => {
            let filter = ''
            if (medicinesRecord.value?.medicinesMeta?.total > medicinesRecord.value?.medicinesMeta?.per_page) {
                return tableSortingCommon('medicalList', medicalListing(route?.params?.udid), sorter, medicinesRecord.value?.medicinesMeta, filter, 'patientTabLoader')
            }
        };
        const onClose = (event) =>{
            visible.value = event;
        }
        onUnmounted(()=>{
            store.state.medical.medicalList = []
        })
        return {
            onClose,
            customRow,
            visible,
            tableSortingCommon,
            medicalListing,
            route,
            medicinesRecord,
            tableSorting,
            columns: [
                {
                    title: "Device",
                    dataIndex: "deviceType",
                    key: "device",
                    sorter: (a, b) => a.deviceType.localeCompare(b.deviceType)
                },
                {
                    title: "Manufacturer",
                    dataIndex: "manufacture",
                    key: "manufacture",
                    sorter: (a, b) => a.manufacture.localeCompare(b.manufacture)
                },
                {
                    title: "Serial No .",
                    dataIndex: "serialNumber",
                    key: "serialNumber",
                    sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber)
                },
            ],
        };
    },
};
</script>
  
