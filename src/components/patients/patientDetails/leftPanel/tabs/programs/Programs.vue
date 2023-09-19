<template>
  <EmptyTable :text="$t('global.programTab')"
    v-if="store.state.patientProgram.patientPrograms.length === 0 && !store.state.patientProgram.programsLoading" />
  <a-table :dataSource="store.state.patientProgram.patientPrograms" :columns="columns" class="common-table"
    :loading="store.state.patientProgram.programsLoading" :pagination="false" v-else :customRow="customRow"/>
  <Pagination v-if="store.state.patientProgram.patientPrograms.lengthh > 0"
    :meta="store.state.ppatientProgramsatientProgram.patientProgramsMeta" commit="patientPrograms"
    :endpoint="`patientData/${route.params.udid}/program`" :params="null" />
    <a-drawer placement="right" :closable="false" :visible="visibleForm" width="60%">
    <AddProgram  @onClose="closeForm($event)" v-if="visibleForm" :programId="programId"/> 
  </a-drawer>
</template>

<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Pagination from "@/components/pagination/Pagination";
import AddProgram from "./AddProgram.vue";
const store = useStore();
const route = useRoute();
const visibleForm = ref(false)
const programId = ref('')
const columns = [
  {
    title: "Programs",
    dataIndex: "program",
    key: "program",
  },
  {
    title: "Inrollment Date",
    dataIndex: "enrollmentDate",
    key: "enrollmentDate",
    ellipsis: true,
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    ellipsis: true,
  },
  {
    title: "Billing Date",
    dataIndex: "billingStartDate",
    key: "billingStartDate",
    ellipsis: true,
  },
   {
    title: "Discharge Date",
    dataIndex: "dischargeDate",
    key: "dischargeDate",
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
  },
];

onMounted(() => {
  store.dispatch("fetchPatientProgram", route.params.udid);
});

onUnmounted(() => {
  console.log("program unmounted...");
});
const closeForm= ()=>{
  visibleForm.value = false
  programId.value = ''
}
function customRow(record) {
            return {
                onClick: () => {
                  programId.value = record.id
                  visibleForm.value = true
                },
            };
        }
</script>
