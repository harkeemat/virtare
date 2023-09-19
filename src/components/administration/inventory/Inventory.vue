
<template>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">
                        Inventory
                        <div class="commonBtn" >
                            <!-- <Button :name="buttonName" @click="showModal" v-if="arrayToObjact(screensPermissions,337)"/> -->
                            <ShowModalButton @click="showModal" :buttonText="'Inventory'" v-if="arrayToObjact(screensPermissions,337)"/>
                        </div>
                    </h2>
                </a-col>
                <a-col :span="12" >
                    <SearchField endPoint="inventory" v-if="arrayToObjact(screensPermissions,336)"/>
                </a-col>
                <a-col :span="12" >
                    <div class="text-right mb-24">
                        <ExportToExcel @click="exportExcel('inventory_report','?fromDate=&toDate='+search)" v-if="arrayToObjact(screensPermissions,340)"/>
                    </div>
                </a-col>
                <a-col :span="24" >
                    <InventoryTable @edit-inventory="editInventory" v-if="arrayToObjact(screensPermissions,336)"/>
                </a-col>
            </a-row>
        </div>
    </a-layout-content>
            
    <!--modals-->
    <InventoryModal  v-model:visible="visible"  @is-visible="handleOk($event)" :isAdd="isAdd" />
    <!---->
</template>
<script>
import InventoryModal from "@/components/modals/InventoryModal";
import InventoryTable from "@/components/administration/inventory/tables/InventoryTable";
import SearchField from "@/components/common/input/SearchField";
// import Button from "@/components/common/button/Button";
import { ref, onUnmounted } from "vue";
import { useStore } from "vuex";
import { exportExcel, arrayToObjact } from "@/commonMethods/commonMethod";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";

export default {
  components: {
    ShowModalButton,
    InventoryModal,
    InventoryTable,
    SearchField,
    // Button,
    ExportToExcel,
  },
  setup() {
    const store = useStore();
    const checked = ref([false]);
    const visible = ref(false);
    const isAdd = ref(false);

    const showModal = () => {
      isAdd.value = false;
      visible.value = true;
    };
    const handleOk = (event) => {
      visible.value = event;
    };
    const searchData = (value) => {
      store.dispatch("searchGlobalCodes", value);
    };

    const editInventory = ({ id, deviceTypeId }) => {
      isAdd.value = true;
      store.dispatch("inventoryDetails", id).then(() => {
        store.dispatch("deviceModalsList", deviceTypeId).then(() => {
          visible.value = true;
        });
      });
    };
    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    return {
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      exportExcel,
      isAdd,
      editInventory,
      checked,
      visible,
      showModal,
      handleOk,
      searchData,
      size: ref([]),
      search: store.getters.searchTable,
    };
  },
};
</script>
