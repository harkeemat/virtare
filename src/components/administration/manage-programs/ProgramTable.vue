<template>
  <a-col :span="24">
    <EmptyTable :text="$t('global.inventoryTable')" v-if="programs?.manageProgramList?.length === 0" />
    <a-table class="sortIconTable common-table no-link" rowKey="id" :columns="programs?.programColumns"
      :data-source="programs?.manageProgramList" 
      @change="handleTableChange" :pagination="false">
    </a-table>

    <TableLoader />
  </a-col>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import TableLoader from "@/components/loader/TableLoader";
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
const store = useStore();
const programs = computed(() => {
  return store.state.programs;
});
onMounted(() => {
  store.dispatch("manageProgramList");
});
</script>

<style lang="scss" scoped>
.common-table {
  margin: 60px 0 0;
}
</style>
