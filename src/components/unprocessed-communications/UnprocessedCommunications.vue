<template>
  <a-layout-content>
    <div class="common-bg">
    <a-row>
      <a-col :span="24">
        <h2 class="pageTittle">Unprocessed Communications</h2>
      </a-col>
      <a-col :span="12" class=" mb-24">
        <SearchField endPoint="communicationInbound" commit="unprocessedCommunications"/>
    </a-col>
    <!-- <a-col :span="12" >
        <div class="text-right mb-24">
            <ExportToExcel @click="exportExcel('careCoordinator_report','?filter='+search +
                    orderTable.data)" />
        </div>
    </a-col> -->
      <a-col :span="24">
        <UnprocessedCommunicationsTable />
      </a-col>
    </a-row>
  </div>
  </a-layout-content>
</template>

<script>
import UnprocessedCommunicationsTable from "@/components/unprocessed-communications/tables/UnprocessedCommunicationsTable"
//import { arrayToObjact, exportExcel } from "@/commonMethods/commonMethod";
import SearchField from "@/components/common/input/SearchField";
//import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import { useStore } from 'vuex';
import { onUnmounted } from 'vue-demi';
export default {
  components: {
    UnprocessedCommunicationsTable,
    //ExportToExcel,
    SearchField
  },
  setup() {
    const store = useStore()
    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    const orderTable = store.getters.orderTable
    return {
            //exportExcel,
            screensPermissions:store.getters.screensPermissions,
            //arrayToObjact,
            search:store.getters.searchTable,
            orderTable,
           
        };
  }
}
</script>