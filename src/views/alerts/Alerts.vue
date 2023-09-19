<template>
  <div class="common-wrapper" v-if="rolesPermissionFind(state.screenPermissions?.screensPermissions, [544])">
    <a-row :gutter="16">
      <a-col :span="18">
        <a-typography-title :level="2" class="common-heading">{{
          $t("alerts.alerts")
        }}</a-typography-title>
        <a-typography-text class="common-tag-Createline caption">{{
          $t("alerts.textLine")
        }}</a-typography-text>
      </a-col>
      <a-col :span="6" class="text-right">
        <a-dropdown-button class="primary-dropdown" :loading="toggleLoading">
          Actions
          <template #overlay>
            <a-menu class="actionDropdown">
              <a-menu-item-group>
                <template #title>Filter</template>
                <a-menu-item
                  :class="status == '' ? 'activeMenu' : ''"
                  title="Show All"
                  key="allpatients"
                  @click="
                    () => {
                      status = '';
                    }
                  "
                  >Active</a-menu-item
                >
                <a-menu-item
                  :class="status != '' ? 'activeMenu' : ''"
                  title="Watchlist"
                  key="watchlist"
                  @click="() => (status = 'Closed')"
                  >Archived</a-menu-item
                >
              </a-menu-item-group>
            </a-menu>
          </template>
          <template #icon>
            <CaretDownOutlined />
          </template>
        </a-dropdown-button>
      </a-col>
      <a-col :span="24">
        <SearchField
          endPoint="escalation-list"
          commit="alerts/alerts"
          loader="alerts/alertLoading"
          placeholder="Search with name or reference.."
          :otherParam="`&status=${status}`"
        />
        <EmptyTable
          :text="$t('global.alertTab')"
          v-if="
            state.alerts.alerts.length == 0 && !state.alerts.isalertsLoading
          "
        />
        <a-table
          class="common-table"
          :dataSource="state.alerts.alerts"
          :columns="columns"
          :pagination="false"
          :customRow="rolesPermissionFind(state.screenPermissions?.screensPermissions, [545]) ? customRow : ''"
          :loading="state.alerts.isalertsLoading || isLoading"
          v-else
          @change="tableSorting"

        >
          <template #bodyCell="{ column, record,text }">
            <template v-if="column.dataIndex === 'patientStatus'">
              <patient-status
                :color="record.color"
                :continueReading="record.continueReading"
                :reviewed="record.reviewed"
                :flag="record.flag"
              />
            </template>
            <template v-if="column.dataIndex == 'reason'">
              <span>{{ record.reason ? record.reason : '-' }}</span>
            </template>
            <template v-if="column.dataIndex == 'patientName'">
                <router-link v-if="rolesPermissionFind(state.screenPermissions?.screensPermissions, [63])"
                 :to="{  name: 'PatientDetails', params: { udid:record.patientId  }}"
                >{{ text }}</router-link>
                <span v-else>{{ text }}</span>
            </template>
          </template>
        </a-table>
        <Pagination
          v-if="state.alerts.alerts.length > 0"
          :meta="state.alerts.meta.pagination"
          endpoint="escalation-list"
          commit="alerts/alerts"
          loader="alerts/alertLoading"
          :params="`&status=${status}`"
        />
      </a-col>
    </a-row>
  </div>
  <a-drawer placement="right" :closable="false" width="60%" :visible="isOpen">
    <Create @hideDrawer="hideDrawer" v-if="isOpen" :isAction="isAction" />
  </a-drawer>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Create from "@/components/alerts/Create";
import PatientStatus from "@/components/patients/patientDetails/PatientStatus";
import Pagination from "@/components/pagination/Pagination.vue";
import { tableSortingCommon,rolesPermissionFind } from "@/commonMethods/commonMethod";
import SearchField from "@/components/common/input/SearchField";
import { CaretDownOutlined } from "@ant-design/icons-vue";
const { dispatch, state, commit,getters } = useStore();
const isOpen = ref(false);
const isAction = ref(true);
const isLoading = ref(false);
const status = ref("");
const toggleLoading = ref(false);
const columns = [
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) =>
      a && a?.createdAt && b && b?.createdAt
        ? a.createdAt.localeCompare(b.createdAt)
        : "",
  },
  {
    title: "Reference No",
    dataIndex: "reference_no",
    key: "reference_no",
    sorter: (a, b) =>
      a && a?.reference_no && b && b?.reference_no
        ? a.reference_no -b.reference_no
        : "",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    sorter: (a, b) =>
      a && a?.type && b && b?.type ? a.type.localeCompare(b.type) : "",
  },
  {
    title: "Patient Status",
    dataIndex: "patientStatus",
    key: "patientStatus",
    width: 80,
    align: "center",
  },

  {
    title: "Patient",
    dataIndex: "patientName",
    key: "patientName",
    sorter: (a, b) =>
      a && a?.patientName && b && b?.patientName
        ? a.patientName.localeCompare(b.patientName)
        : "",
  },
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
    sorter: (a, b) =>
      a && a?.reason && b && b?.reason ? a.reason.localeCompare(b.reason) : "",
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
  async onClick() {
    isLoading.value = true;
    await dispatch("alerts/fetchalert", record.udid);
    commit("alerts/escaltionId", record.udid);
    commit("alerts/isAction", true);
    isOpen.value = true;
    isAction.value = true;
    isLoading.value = false;
  },
});
const tableSorting = (pagination, filters, sorter) => {
  let filter = `&status=${status.value}`;
  if (
    state.alerts.meta.pagination?.total > state.alerts.meta.pagination?.per_page
  ) {
    return tableSortingCommon(
      "alerts/alerts",
      `escalation-list`,
      sorter,
      state.alerts.meta.pagination,
      filter,
      "alerts/alertLoading"
    );
  }
};
onMounted(() => {
  dispatch("alerts/fetchalerts");
});

const hideDrawer = () => {
  isOpen.value = false;
  isAction.value = false;
};

watch(status, async (changedStatus) => {
  toggleLoading.value = true;
  let search = getters.searchTable.value.split('=')[1];
  await dispatch("alerts/fetchalerts", {
    status: changedStatus,
    page: 1,
    search
  });
  toggleLoading.value = false;
});
</script>

<style lang="scss" scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
