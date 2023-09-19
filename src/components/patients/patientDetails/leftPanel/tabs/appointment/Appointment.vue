<template>
     <Loader v-if="state.patientsAppointment.patientAppointment.isLoading" />
    <div v-if="state?.patientsAppointment?.patientAppointments?.length == 0">
        <EmptyTable :text="$t('global.notFound')" />
    </div>
    <a-table
    class="common-table"
    :dataSource="state?.patientsAppointment?.patientAppointments"
    :columns="columns"
    :pagination="false"
    v-else
    @change="tableSorting"
    :customRow="customRow"
  />
  <!-- :customRow="customRow" -->
    <a-col :span="24" v-if="state?.patientsAppointment?.patientAppointments?.length > 0">
        <Pagination :meta="state?.patientsAppointment?.patientAppointmentsMeta" commit="patientsAppointment/patientsAppointmentListing"
            :endpoint="`appointment-list/${params?.udid}`" :params="null"
            loader="patientsAppointment/patientAppointmentLoading" />
    </a-col>
   
    <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
        <AddAppointment @onClose="onClose($event)" :isEdit="true"/>

    </a-drawer>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { tableSortingCommon } from '@/commonMethods/commonMethod';
import Loader from "@/components/patients/Loader.vue"
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from '@/components/administration/clients/EmptyTable.vue';
import AddAppointment from "@/components/patients/patientDetails/leftPanel/tabs/appointment/AddAppointment";
   
        const visible = ref(false);
        const {params} = useRoute()
        const {dispatch,state} = useStore()
        onMounted(() => {
            dispatch("patientsAppointment/patientsAppointmentListing", params?.udid )
        })
        function customRow(record) {
            return {
                onClick: () => {
                    
                    dispatch('patientsAppointment/appointmentDetial',record?.id)
                        visible.value = true;
                }
            };
        }
        const tableSorting = (pagination, filters, sorter) => {
            let filter = ''
            if (state.patientsAppointment?.patientAppointmentsMeta?.total > state.patientsAppointment?.patientAppointmentsMeta?.per_page) {
                return tableSortingCommon('patientsAppointment/patientsAppointmentListing',`appointment-list/${params?.udid}` , sorter, state?.patientsAppointment?.patientAppointmentsMeta, filter, 'patientsAppointment/patientAppointmentLoading')
            }
        };
        const onClose = (event) =>{
            visible.value = event;
        }
        const columns = [
                {
                    title: "Type",
                    dataIndex: "type",
                    key: "type",
                    sorter: (a, b) => a.type.localeCompare(b.firstName)
                },
                {
                    title: "Staff",
                    dataIndex: "careCoordinator",
                    key: "careCoordinator",
                    sorter: (a, b) => a.careCoordinator.localeCompare(b.careCoordinator)
                },
                {
                    title: "Date",
                    dataIndex: "startDate",
                    key: "startDate",
                    sorter: (a, b) => a.startDate.localeCompare(b.startDate)
                },
                {
                    title: "Priority",
                    dataIndex: "priority",
                    key: "priority",
                    sorter: (a, b) => a.priority.localeCompare(b.priority)
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                   // sorter: (a, b) => a.status.localeCompare(b.status)
                },
                
            ]
</script>
  
