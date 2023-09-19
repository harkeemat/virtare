<template>
  <!-- <a-table
    v-if="meta.specialists?.length > 0"
    class="common-table"
    rowKey="id"
    :scroll="{ x: 1500 }"
    :data-source="meta.specialists"
    :pagination="false"
    :columns="specialistsColumns"
    @change="tableSorting"
    :customRow="customRow"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex == 'name'">
        <span>{{ text }}</span>
      </template>
      <template v-if="column.dataIndex == 'createAt'">
        <span>{{ dateFormat(text) }}</span>
      </template>
    </template>
  </a-table>
  <div v-if="meta.specialists?.length == 0">
    <EmptyTable :text="$t('global.staffPage')" />
  </div>
  <a-col :span="24" v-if="meta.specialists?.length > 0">
    <Pagination
      :meta="meta?.specialistsMeta"
      commit="SPECIALISTS"
      :endpoint="API_ENDPOINTS['specialists']"
      :params="search"
      loader="loadingTableStatus"
    />
  </a-col> -->
  <TableLoader />
  <a-table
    v-if="store.state.specialist.members?.data?.length > 0"
    class="common-table"
    rowKey="id"
    :data-source="store.state.specialist.members?.data"
    :pagination="false"
    :columns="specialistsColumns"
    @change="tableSorting"
    :customRow="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [517]) ? customRow : ''"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex == 'name'">
        <span>{{ text }}</span>
      </template>
      <template v-if="column.dataIndex == 'title'">
        <span>{{ text ? text : '-' }}</span>
      </template>
      <template v-if="column.dataIndex == 'specialization'">
        <span>{{ text ? text : '-' }}</span>
      </template>
      <template v-if="column.dataIndex == 'createAt'">
        <span>{{ dateFormat(text) }}</span>
      </template>
      <!-- <template v-if="column.dataIndex == 'network'">
        <span>{{ text === 'Internal' ? 'Yes': 'No' }}</span>
      </template> -->
    </template>
  </a-table>
  <div v-if="store.state.specialist.members?.data?.length == 0">
    <EmptyTable :text="$t('global.staffPage')" />
  </div>
  <a-col :span="24" v-if="store.state.specialist.members?.data?.length > 0">
    <Pagination
      :meta="store.state.specialist.members?.meta?.pagination"
      commit="specialist/members"
      endpoint="/staffData/list-staff-specialists"
      :params="search"
      loader="loadingTableStatus"
    />
  </a-col>
  <a-drawer placement="right" :closable="false" :visible="visible" width="60%">
    <Create v-if="visible" @hideDrawer="hideDrawer" />
  </a-drawer>
</template>

<script setup>
import {
  dateFormat,
  tableYScroller,
  tableSortingCommon,
} from "@/commonMethods/commonMethod";
import Pagination from "@/components/pagination/Pagination";
import SpecialistDetail from "@/components/specialists/tables/SpecialistDetail";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
//import { defineProps } from "vue";
import { useStore } from "vuex";
import { API_ENDPOINTS } from "@/config/apiConfig";
import Create from "@/components/specialists/Create";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
import TableLoader from "@/components/loader/TableLoader";
import { ref } from "vue";
const store = useStore();
const meta = store.getters.specialistRecord.value;
const search = store.getters.searchTable;
const visible = ref(false);
const { commit } = useStore();
const specialistId = ref("");
function customRow(record) {
  return {
    onClick: () => {
      specialistId.value = record.udid;
      visible.value = true;
      commit("specialist/isEdit", true);
      commit("specialist/specialistId", record.udid);
    },
  };
}

const hideDrawer = () => {
  visible.value = false;
};

const onClose = (event) => {
  visible.value = event;
  specialistId.value = "";
};
const tableSorting = (pagination, filters, sorter) => {
  let filter = search.value;
  if (store.state.specialist.members?.data?.length > 0) {
    // sorting api call (commit,endpont,sorting,meta,filter,loader)
    return tableSortingCommon(
      "specialist/members",
      "/staffData/list-staff-specialists",
      sorter,
      store.state.specialist.members?.meta?.pagination,
      filter,
      "loadingTableStatus"
    );
  }
};
const specialistsColumns = [
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) =>
      a && a?.name && b && b?.name ? a.name.localeCompare(b.name) : "",
  },
  {
    title: "Name",
    dataIndex: "fullName",
    sorter: (a, b) =>
      a && a?.fullName && b && b?.fullName ? a.fullName.localeCompare(b.fullName) : "",
  },
  {
    title: "Specialization",
    dataIndex: "specialization",
    sorter: (a, b) =>
      a && a?.specialisation && b && b?.specialisation
        ? a?.specialisation.localeCompare(b?.specialisation)
        : "",
  },
  {
    title: "Staff",
    dataIndex: "network",
    sorter: (a, b) =>
      a && a?.name && b && b?.name ? a.name.localeCompare(b.name) : "",
  },
  // {
  //   title: "Phone Number",
  //   dataIndex: "phoneNumber",
  //   sorter: (a, b) =>
  //     a && a?.phoneNumber && b && b?.phoneNumber
  //       ? a.phoneNumber.localeCompare(b.phoneNumber)
  //       : "",
  // },
  // {
  //   title: "Email",
  //   dataIndex: "email",
  //   sorter: (a, b) =>
  //     a && a?.email && b && b?.email ? a.email.localeCompare(b.email) : "",
  // },
  // {
  //   title: "NPI",
  //   dataIndex: "npi",
  //   sorter: (a, b) =>
  //     a && a?.npi && b && b?.npi ? a.npi.localeCompare(b.npi) : "",
  // },
  // {
  // 	title: 'Created At',
  // 	dataIndex: 'createAt',
  // 	sorter: (a, b) =>a  && a?.createAt && b && b?.createAt ? a.createAt-b.createAt : '',
  // },
];
</script>
<style  scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
