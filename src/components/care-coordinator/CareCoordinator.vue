<template>
  <div class="common-bg">
    <a-row>
      <a-col :span="12">
        <a-typography-title :level="2" class="common-heading">Care Coordinator</a-typography-title>
        <a-typography-text class="common-tag-line caption">
        </a-typography-text>
      </a-col>
      <a-col :span="24">
        <SearchField endPoint="staffData/list" commit="staff" v-if="arrayToObjact(screensPermissions, 40)"
          />
      </a-col>
      <a-col :span="24">
        <CoordinatorTable :urlFilters="route.query.filter"></CoordinatorTable>
        <TableLoader />
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import { onUnmounted, onMounted } from "vue";
import CoordinatorTable from "./tables/CoordinatorTable";
import TableLoader from "@/components/loader/TableLoader";
import { useStore } from "vuex";
import { arrayToObjact } from "@/commonMethods/commonMethod";
import SearchField from "@/components/common/input/SearchField";
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
onMounted(() => {
  store.dispatch("staffs");
  store.dispatch("searchTable", "&search=");
  store.dispatch("orderTable", {
    data: "&orderField=&orderBy=",
  });
});


onUnmounted(() => {
  store.dispatch("searchTable", "&search=");
  store.dispatch("orderTable", {
    data: "&orderField=&orderBy=",
  });
});

const screensPermissions = store.getters.screensPermissions
</script>

<style lang="scss" scoped>
:deep(.ant-table-body) {
  min-height: 200px;
}

.colorBox {
  margin: 0px 0 10px;

  &.active {
    margin-top: 0;
  }
}
</style>
