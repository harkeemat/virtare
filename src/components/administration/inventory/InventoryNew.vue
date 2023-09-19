<template>
  <div class="common-wrapper">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-typography-title :level="2" class="common-heading">Inventory</a-typography-title>
        <a-typography-text class="common-tag-line caption">
          {{ $t('global.inventoryText') }}
        </a-typography-text>
      </a-col>
      <a-col :span="12" class="text-right" v-if="rolesPermissionFind(screensPermissions, [337])">
        <a-space>
        <a-button class="primary-btn" @click="showDrawer">
          <template #icon>
            <PlusOutlined />
          </template>
          New Inventory
        </a-button>
      </a-space>
      </a-col>
      <a-col :span="24">
        <SearchField :endPoint="API_ENDPOINTS['inventory']" commit="inventory" v-if="rolesPermissionFind(screensPermissions, [336,338,337])"/>
        <InventoryTable  v-if="rolesPermissionFind(screensPermissions, [336,338,337])"
          @is_click="customRow" />
      </a-col>
    </a-row>
  </div>
  <a-drawer placement="right" :closable="false" :visible="visible" @close="onClose" width="60%">
    <AddInventory :isEdit="isEdit" @is-visible="onClose" />
  </a-drawer>
</template>
<script setup>
import { PlusOutlined } from "@ant-design/icons-vue";
import AddInventory from "@/components/administration/inventory/AddInventory";
import { ref } from "vue";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
import { useStore } from "vuex";
import InventoryTable from "@/components/administration/inventory/tables/InventoryTable";
import SearchField from "@/components/common/input/SearchField";
import { API_ENDPOINTS } from "@/config/apiConfig"
    const visible = ref(false);
    const store = useStore();
    const isEdit = ref(false);
    const showDrawer = () => {
      visible.value = true;
      isEdit.value = false;
    };

    const onClose = (event) => {
      visible.value = event;
    };
    function customRow() {

      visible.value = true;
      isEdit.value = true;
    }
   const  screensPermissions =  store.getters.screensPermissions
</script>

<style lang="scss" scoped>
.search-input {
  margin: 60px 0 15px;
  width: 500px !important;
}
</style>