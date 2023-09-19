<template>
  <EmptyTable
    :text="$t('global.alertTab')"
    v-if="state.alerts.patientAlerts == 0 && !state.alerts.patientAlertLoading"
  />
  <a-table
    class="common-table"
    :dataSource="state.alerts.patientAlerts"
    :columns="columns"
    :pagination="false"
    :loading="state.alerts.patientAlertLoading"
    :customRow="rolesPermissionFind(state.screenPermissions?.screensPermissions, [545]) ?customRow :''"
    v-else
  >
   <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex == 'reason'">
        <span>{{ text ? text : '-' }}</span>
      </template>
    </template>
  </a-table>
  <Pagination
    v-if="state.alerts.patientAlerts > 0"
    :meta="state.alerts.meta.pagination"
    :endpoint="`/escalation/${route.params.udid}`"
    commit="patientAlerts"
    loader="patientAlertLoading"
  />
  <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
    <Create @hideDrawer="hideDrawer" v-if="visible" />
  </a-drawer>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

/** component  */
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Pagination from "@/components/pagination/Pagination";
import Create from "@/components/alerts/Create";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
const visible = ref(false);

const { dispatch, state, commit } = useStore();
const route = useRoute();
const columns = [
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Reference No",
    dataIndex: "reference_no",
    key: "reference_no",
    sorter: (a, b) =>
      a && a?.reference_no && b && b?.reference_no
        ? a.reference_no - b.reference_no
        : "",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
  },
  // {
  //   title: "Sent To",
  //   dataIndex: "sentTo",
  //   key: "sentTo",
  // },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   key: "status",
  //   width: 80,
  //   align: "center",
  // },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

const customRow = (record) => ({
  onClick() {
    dispatch("alerts/fetchalert", record.udid);
    commit("alerts/escaltionId", record.udid);
    visible.value = true;
    commit("alerts/isAction", true);
  },
});

const hideDrawer = () => {
  visible.value = false;
};

onMounted(async () => {
  dispatch("alerts/patientAlert", route.params.udid);
});

onUnmounted(() => {
  console.log("Alert unmounted...");
});
</script>
