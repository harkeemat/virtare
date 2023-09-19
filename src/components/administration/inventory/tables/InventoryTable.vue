<template>
  <EmptyTable :text="$t('global.inventoryTable')" v-if="store.state.inventory?.inventoriesList?.length === 0" />
  <a-table v-else class="common-table" rowKey="id" :customRow="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [336,338,337]) ? customRow : ''" :columns="inventoryColumns"
    :data-source="store.state.inventory?.inventoriesList" 
    :pagination="false" @change="tableSorting">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex == 'isAvailable'">
        <a-tooltip placement="bottom" v-if="text == 'Assigned'">
          <template #title>
            <span>{{ "Patient" }}</span>
          </template>
          <span >{{ record?.fullName?.length > 20
            ? record?.fullName.substring(0, 20) + "..."
            : record.fullName ? record.fullName : '-' }}</span>
        </a-tooltip>
      </template>
    </template>
  </a-table>
  <Pagination v-if="store.state.inventory?.inventoriesList.length > 0" :meta="store.state.inventory?.inventoryMeta"
    commit="inventory" :endpoint="API_ENDPOINTS['inventory']" :params="'&active=1'" loader="loadingStatus" />
  <!-- <a-drawer placement="right" :closable="false" :visible="addDeviceVisible" @close="onClose" width="60%">
    <AddDeviceModal :inventoryId="inventoryId" :inventoryScreen="true" @closeModal="handleOk($event)"
      v-if="addDeviceVisible" />
  </a-drawer> -->
  <Loader /> 
</template>
  
<script setup>
import { watchEffect, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { tableSortingCommon,rolesPermissionFind } from "@/commonMethods/commonMethod";
//import AddDeviceModal from "@/components/modals/AddDevice";
import Loader from "@/components/loader/Loader";
import { API_ENDPOINTS } from "@/config/apiConfig"
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
import Pagination from "@/components/pagination/Pagination";
const emit = defineEmits(["edit-inventory", "is_click"])
const store = useStore();
const addDeviceVisible = ref(false);
watchEffect(() => {

});
onMounted(() => {
  store.dispatch("inventoriesList");
  store.dispatch("searchTable", "&search=");
  store.dispatch("orderTable", {
    data: "&orderField=&orderBy=",
  });

});
const inventoryId = ref('')
function showAddDevice() {
  addDeviceVisible.value = true;
  //inventoryId.value = id
}
function customRow(event) {
  if (!addDeviceVisible.value) {
    return {
      onClick: () => {
        store.dispatch('inventoryDetails', event.id)
        emit("is_click", event);
      },
    };
  }
}
const inventoryColumns = [
  {
    title: "Manufacture Name",
    dataIndex: "manufacture",
    key: "manufacture",
    sorter: (a, b) =>a  && a?.manufacture && b && b?.manufacture ? a.manufacture.localeCompare(b.manufacture):'',
  },
  {
    title: "Device Type",
    dataIndex: "deviceType",
    key: "deviceType",
    sorter: (a, b) =>a  && a?.deviceType && b && b?.deviceType ? a.deviceType.localeCompare(b.deviceType):'',
  },

  {
    title: "Mac Address/Serial Number",
    dataIndex: "serialNumber",
   
  },

  {
    title: "Assigned To",
    dataIndex: "isAvailable",
    sorter: (a, b) =>a  && a?.isAvailable && b && b?.isAvailable ? a.isAvailable.localeCompare(b.isAvailable):'',
  },
];
/*Table sorting from common fuction */
const tableSorting = (pagination, filters, sorter) => {
  /*add extra filters */
  let filter = '&active=1'
  /* Check if record show only one page then run only client side sorting */
  if (store.state.inventory?.inventoryMeta?.total > store.state.inventory?.inventoryMeta?.per_page) {
    return tableSortingCommon('inventory', API_ENDPOINTS['inventory'], sorter, store.state.inventory?.inventoryMeta, filter, 'loadingStatus')
  }
};
// const handleOk = ({ modal, value }) => {
//   addDeviceVisible.value = value;
// };
</script>
<style  scoped>
.common-table {
  margin: 60px 0 0;
}
</style>