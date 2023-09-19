<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-typography-title :level="2" class="common-heading">{{ $t('global.processBilling') }}</a-typography-title>
        <a-typography-text class="common-tag-line caption">
          {{ $t('global.processBillingText') }}
        </a-typography-text>
      </a-col>
      <a-col :span="12" class="text-right">
        <a-space size="large">
          <div class="common-form">
            <a-form-item>
              <a-range-picker :format="globalDateFormat" @change="onRangeChange" />
            </a-form-item>
          </div>
          <ExportToExcel
            v-if="store.state.billing?.processBillingList?.length !== 0 && rolesPermissionFind(screensPermissions, [336])"
            @click="exportExcel('cptBillingProcess_report', '?fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate + store.state.common.searchTable + store.state.common.orderTable?.data)" />
        </a-space>
      </a-col>
      <a-col :span="24">
        <SearchField endPoint="process/billing/log" commit="PROCESS_BILLING_LIST" loader="BILLING_LOADING" />
        <BillingTable />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
//import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { exportExcel, timeStamp, globalDateFormat, rolesPermissionFind } from "@/commonMethods/commonMethod";
import BillingTable from "@/components/billing/BillingTable";
//import { tableSortingCommon } from '@/commonMethods/commonMethod';
import SearchField from "@/components/common/input/SearchField";
const store = useStore();
const value1 = ref('')
onMounted(() => {
  store.dispatch("orderTable", {
    data: "&orderField=&orderBy=",
  });
  store.dispatch("searchTable", "&search=");
  store.commit("billingFilterDate", { fromDate: '', toDate: '' })
  //store.dispatch("billingList");
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
  store.dispatch('commonAction', { 'method': 'get', 'endPoint': 'process/billing/log' + '?fromDate=' + store.state.billing?.billingFilterDate?.fromDate + '&toDate=' + store.state.billing?.billingFilterDate?.toDate + store.getters.orderTable.value?.data + store.getters.searchTable.value, 'loader': 'BILLING_LOADING', "commit": 'PROCESS_BILLING_LIST' })
};
const screensPermissions = store.getters.screensPermissions
</script>
  
<style lang="scss" scoped>
.search-input {
  margin: 60px 0 15px;
  width: 500px !important;
}
</style>