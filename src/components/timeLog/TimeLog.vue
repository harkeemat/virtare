
<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-typography-title :level="2" class="common-heading">Raw Billing Data</a-typography-title>

        <a-typography-text class="common-tag-line caption">
          {{ $t('global.rawBillingText') }}
        </a-typography-text>
      </a-col>
      <a-col :span="12" class="text-right">
        <a-space size="large">
          <!-- v-if="arrayToObjectData(screensPermissions, 336, 'id')" -->
          <div class="common-form">
            <a-form-item>
              <a-range-picker :format="globalDateFormat" @change="onRangeChange" />
            </a-form-item>
          </div>
          <!-- v-if="arrayToObjectData(screensPermissions, 336, 'id')" -->
          <ExportToExcel
            v-if="store.state.billing?.billingList?.length !== 0 && rolesPermissionFind(screensPermissions, [336])"
            @click="exportExcel('cptBilling_report', '?fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate + store.state.common.searchTable + store.state.common.orderTable?.data + '&processDate=1')" />
        </a-space>
      </a-col>
      <a-col :span="24">
        <SearchField endPoint="billing/service/log" commit="BILLING_LIST" loader="BILLING_LOADING" otherParam="&processDate=1"/>
        <TimeLogTable></TimeLogTable>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>

import { onMounted, onUnmounted } from "vue";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
//import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { exportExcel, globalDateFormat, timeStamp, rolesPermissionFind } from "@/commonMethods/commonMethod";
import TimeLogTable from "@/components/timeLog/TimeLogTable";
//import { tableSortingCommon } from '@/commonMethods/commonMethod';
import SearchField from "@/components/common/input/SearchField";
const store = useStore();
onMounted(() => {
  store.dispatch("orderTable", {
    data: "&orderField=&orderBy=",
  });
  store.dispatch("searchTable", "&search=");
  store.commit("billingFilterDate", { fromDate: '', toDate: '' })
});

onUnmounted(() => {
  store.commit("billingFilterDate", { fromDate: '', toDate: '' })
  store.commit("otherFilters", '')
});
const onRangeChange = (value, dateString) => {
  if (value) {
    store.commit('billingFilterDate', { fromDate: dateString[0] ? timeStamp(dateString[0]) : '', toDate: dateString[1] ? timeStamp(dateString[1] + ' 23:59:59') : '' })
  } else {
    store.commit('billingFilterDate', { fromDate: dateString[0] ? timeStamp(dateString[0]) : '', toDate: dateString[1] ? timeStamp(dateString[1]) : '' })
  }
  store.commit("otherFilters", "&fromDate=" + store.state.billing?.billingFilterDate?.fromDate + "&toDate=" + store.state.billing?.billingFilterDate?.toDate)
  store.dispatch('commonAction', { 'method': 'get', 'endPoint': 'billing/service/log' + '?fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate + store.getters.orderTable.value?.data + store.getters.searchTable.value+'&processDate=1', 'loader': 'BILLING_LOADING', "commit": 'BILLING_LIST' })
};
const screensPermissions = store.getters.screensPermissions
</script>

<style lang="scss" scoped>
.search-input {
  margin: 60px 0 15px;
  width: 500px !important;
}
</style>