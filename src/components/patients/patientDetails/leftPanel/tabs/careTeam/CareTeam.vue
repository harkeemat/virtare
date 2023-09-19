<template>
  <a-table
    v-if="store.state.patientsCareTeam?.patietCareTeamList?.length > 0"
    :dataSource="store.state.patientsCareTeam?.patietCareTeamList"
    :columns="columns"
    class="common-table no-link"
    :pagination="false"
    :customRow="customRow"
    @change="tableSorting"
  >
  </a-table>
  <div v-if="store.state.patientsCareTeam?.patietCareTeamList?.length == 0">
    <EmptyTable :text="$t('global.careTeamTab')" />
  </div>
  <a-col
    :span="24"
    v-if="store.state.patientsCareTeam?.patietCareTeamList?.length > 0"
  >
    <Pagination
      :meta="store.state.patientsCareTeam?.careTeamMeta"
      commit="patietCareTeamList"
      :endpoint="careTeamAssign(route?.params?.udid)"
      :params="null"
      loader="patientTabLoader"
    />
  </a-col>
  <PatientTabsLoader />
  <a-drawer placement="right" :closable="false" width="60%" :visible="visible">
    <Create v-if="visible" @hideDrawer="hideDrawer" />
  </a-drawer>
</template>

<script setup>
import { onMounted, onUnmounted,ref } from "vue";
//import AssignCareTeam from "@/components/patients/patientDetails/leftPanel/tabs/careTeam/AssignCareTeam";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { careTeamAssign } from "@/config/apiConfig";
import { tableSortingCommon } from "@/commonMethods/commonMethod";
import PatientTabsLoader from "@/components/patients/PatientTabsLoader";
import Pagination from "@/components/pagination/Pagination";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Create from '@/components/specialists/Create';
const route = useRoute();
const store = useStore();
const visible = ref(false);
//const careTeamRecord = store.getters.patientCareTeamRecord
//const deletedId = ref()
onMounted(() => {
  store.dispatch("patietCareTeamList", { id: route?.params?.udid });
  //store.dispatch("patietSpecialistList", { id: route?.params?.udid })
});
function customRow(record) {
  return {
    onClick: () => {
      store.commit("specialist/isEdit", true);
      store.commit('specialist/specialistId',record.udid)
      visible.value = true;
    },
  };
}

const hideDrawer = () => {
   visible.value = false;
}

const tableSorting = (pagination, filters, sorter) => {
  let filter = "";
  if (
    store.state.patientsCareTeam?.careTeamMeta?.total >
    store.state.patientsCareTeam?.careTeamMeta?.per_page
  ) {
    return tableSortingCommon(
      "patietCareTeamList",
      careTeamAssign(route?.params?.udid),
      sorter,
      store.state.patientsCareTeam?.deviceMeta,
      filter,
      "patientTabLoader"
    );
  }
};
onUnmounted(() => {});

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    //sorter: (a, b) => a.name.localeCompare(b.name),
    width: "25%",
  },
  // {
  //   title: "Title",
  //   dataIndex: "title",
  //   key: "title",
  //   // sorter: (a, b) => a.title.localeCompare(b.title),
  //   width: "25%",
  // },
  {
    title: "Specialization",
    dataIndex: "specialization",
    key: "specialization",
    //sorter: (a, b) => a.specialization.localeCompare(b.specialization),
    width: "25%",
  },
  {
    title: "Careteam",
    dataIndex: "careteam",
    key: "careteam",
    //sorter: (a, b) => a.specialization.localeCompare(b.specialization),
    width: "25%",
  },
  {
    title: "Staff",
    dataIndex: "network",
    key: "network",
    //sorter: (a, b) => a.network.localeCompare(b.network),
    width: "25%",
  },
];
</script>

