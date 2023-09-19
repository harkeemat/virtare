<template>
  <div class="common-bg">
    <div class="common-wrapper">
      <a-row :gutter="16">
        <a-col :span="18">
          <a-typography-title :level="2" class="common-heading"
            >{{ $t('specialists.title') }}</a-typography-title
          >
          <a-typography-text class="common-tag-line caption">
            {{ $t("global.specialistText") }}
          </a-typography-text>
        </a-col>
        <a-col :span="6" class="text-right" v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [515])">
          <a-dropdown-button class="primary-dropdown">
            Actions
            <template #overlay>
              <a-menu @click="openForm" class="actionDropdown">
                <a-menu-item class="newPatient"
                  @click="() => {visible = true; store.commit('specialist/isStaff',true); }"
                  ><PlusOutlined />
                  New Specialist
                </a-menu-item>
              </a-menu>
            </template>
            <template #icon>
              <CaretDownOutlined />
            </template>
          </a-dropdown-button>
        </a-col>
        <a-col :span="24">
          <SearchField
           commit="specialist/members"
           endPoint="staffData/list-staff-specialists"
           loader="loadingTableStatus"
           v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [515,514,517])"
          />
          <SpecialistsTable v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [515,514,517])"/>
          
        </a-col>
        <a-drawer
          placement="right"
          :closable="false"
          width="60%"
          :visible="visible"
        >
          <Create v-if="visible" @hideDrawer="hideDrawer" />
        </a-drawer>
      </a-row>
    </div>
  </div>
  <!-- <CoordinatorsModal v-model:visible="visibleCoordinatorsModal" @closeSpecialistModal="closeModal($event)" :staffType="343" /> -->
</template>

<script setup>
import { watchEffect, onUnmounted, ref, onMounted } from "vue";
import SpecialistsTable from "@/components/specialists/tables/SpecialistsTable";

import { API_ENDPOINTS } from "@/config/apiConfig";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { rolesPermissionFind } from "@/commonMethods/commonMethod";
import Create from "@/components/specialists/Create";

import { useStore } from "vuex";
// import {
//   arrayToObjact,
// } from "@/commonMethods/commonMethod"
import SearchField from "@/components/common/input/SearchField";
const visible = ref(false);
const store = useStore();
// watchEffect(() => {
//   store.dispatch("specialists");
//   store.dispatch("searchTable", "&search=");
//   store.dispatch("orderTable", {
//     data: "&orderField=&orderBy=",
//   });
// });

// onUnmounted(() => {
//   store.dispatch("searchTable", "&search=");
//   store.dispatch("orderTable", {
//     data: "&orderField=&orderBy=",
//   });
// });

onMounted(() => {
   store.dispatch('specialist/fetchList');
});

const hideDrawer = () => {
   visible.value = false;
}

</script>
<style lang="scss" scoped>
.search-input {
  margin: 60px 0 15px;
  width: 500px !important;
}
</style>


