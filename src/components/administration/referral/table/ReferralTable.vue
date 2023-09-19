
<template>
  <a-table class="common-table" v-if="state.referral.globalReferral?.length > 0" rowKey="id" :columns="referralColumns"
    :data-source="state.referral.globalReferral"  :pagination="false"
    @change="tableSorting">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex == 'patientName'">
        <!-- <router-link v-if="rolesPermissionFind(state.screenPermissions?.screensPermissions, [63])"
          :to="{ name: 'PatientDetails', params: { udid: record.patientId } }">{{
            text?.length > 20 ? text.substring(0, 20) + '...' : text }}</router-link> -->
        <span >{{ text }}</span>
      </template>

    </template>
  </a-table>
  <div v-else>
    <EmptyTable :text="$t('global.notFound')" />
  </div>
  <a-col :span="24" v-if="state.referral.globalReferral?.length > 0">
    <Pagination :meta="state.referral.referralMeta" commit="referral" :endpoint="API_ENDPOINTS['referralList']"
      :params="null" loader="loadingTableStatus" />
  </a-col>
  <TableLoader />
</template>
<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Pagination from "@/components/pagination/Pagination";
import { ref, onMounted, } from "vue";
import TableLoader from "@/components/loader/TableLoader";
import { useStore } from "vuex";
import {
  arrayToObjact,
  showPatientModal,
  tableSortingCommon,
  rolesPermissionFind
} from "@/commonMethods/commonMethod";
import { API_ENDPOINTS } from "@/config/apiConfig"
import { useRoute } from 'vue-router';
const { dispatch, state } = useStore();
const route = useRoute()
onMounted(() => {
  dispatch("referral")
});
const tableSorting = (pagination, filters, sorter) => {
  let filter = ''
  if (state.referral.referralMeta?.total > state.referral.referralMeta?.per_page) {
    return tableSortingCommon('referral', API_ENDPOINTS['referralList'], sorter, state.referral.referralMeta, filter, 'loadingTableStatus')
  }
};
const referralColumns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber)
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => a.email.localeCompare(b.email)
  },
  {
    title: "Patient Name",
    dataIndex: "patientName",
    sorter: (a, b) => a.patientName.localeCompare(b.patientName)
  },
];

</script>

<style  scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
