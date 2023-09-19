
<template>
  <EmptyTable :text="$t('global.cptTable')" v-if="store.state.cptCodes.cptCodesList?.length === 0" />
  <a-table v-else class="common-table no-link" rowKey="id" :columns="cptCodesColumns" 
    :data-source="store.state.cptCodes.cptCodesList" :pagination="false" @change="tableSorting">
  </a-table>
  <Pagination v-if="store.state.cptCodes.cptCodesList.length > 0" :meta="store.state.cptCodes.cptMeta"
    commit="cptCodeActivities" :endpoint="API_ENDPOINTS['activeCptCodes']" :params="'&active=1'" loader="loadingStatus" />
  <Loader />
</template>
<script setup>
import { onMounted } from "vue";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/pagination/Pagination";
import { useStore } from "vuex";
import { tableSortingCommon } from "@/commonMethods/commonMethod";
import { API_ENDPOINTS } from "@/config/apiConfig"
const store = useStore()
onMounted(() => {
});
/*Table sorting from common fuction */
const tableSorting = (pagination, filters, sorter) => {
  /*add extra filters */
  let filter = '&active=1'
  /* Check if record show only one page then run only client side sorting */
  if (store.state.cptCodes.cptMeta?.total > store.state.cptCodes.cptMeta?.per_page) {
    return tableSortingCommon('cptCodeActivities', API_ENDPOINTS['activeCptCodes'], sorter, store.state.cptCodes.cptMeta, filter, 'loadingStatus')
  }
};

const cptCodesColumns = [
  {
    title: "Activity",
    dataIndex: "name1",
    sorter: true,
  },
  {
    title: "CPT Code",
    dataIndex: "cptCode",
    sorter: true
  },

  // {
  //   title: "Billing Amount",
  //   dataIndex: "billingAmout",
  //   sorter:true,
  //   align: 'right'
  // },
]
</script>

<style lang="scss" scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
