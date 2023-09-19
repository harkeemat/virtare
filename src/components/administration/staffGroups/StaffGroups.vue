<template>
  <a-layout-content>
    <div class="common-bg">
      <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">
            {{ $t('staffGroups.groups') }}
            <div class="commonBtn" v-if="arrayToObjact(screensPermissions, 421)">
              <!-- <Button :name="$t('staffGroups.createGroup')" @click="showGroupModal"/> -->
              <ShowModalButton @click="showGroupModal" :buttonText="$t('staffGroups.createGroup')"/>
            </div>
          </h2>
        </a-col>
        <a-col :span="12" class="mb-24">
            <SearchField endPoint="group" commit="groupsList" loader="groupLoadingStatus" v-if="arrayToObjact(screensPermissions, 20)"/>
        </a-col>
        <a-col :span="12" >
          <div class="text-right mb-24">
            <!-- <ExportToExcel /> -->
            <!-- <ExportToExcel @click="exportExcel('staffGroup','?fromDate=&toDate='+search)" /> -->
          </div>
        </a-col>
        <a-col :span="24">
          <StaffGroupTable />
        </a-col>
      </a-row>
    </div>
  </a-layout-content>
  <!-- Modal -->
  <StaffGroupModal v-if="visibleGroupModal" v-model:visible="visibleGroupModal" @closeModal="closeModal" :isEdit="false" />
  
</template>

<script>
import { computed, defineAsyncComponent,onMounted,ref } from "vue";
import { useStore } from 'vuex';
import {
  arrayToObjact,
  // exportExcel
} from "@/commonMethods/commonMethod";
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
import { warningSwal } from '../../../commonMethods/commonMethod';
import { messages } from '../../../config/messages';
export default {
  components: {
    ShowModalButton,
    StaffGroupTable: defineAsyncComponent(()=>import("@/components/administration/staffGroups/tables/StaffGroupsTable")),
    // StaffGroupModal: defineAsyncComponent(()=>import("@/components/administration/staffGroups/modals/StaffGroupsModal")),
    StaffGroupModal: defineAsyncComponent(()=>import("@/components/administration/staffGroups/modals/StaffGroupsModalNew")),
    SearchField: defineAsyncComponent(()=>import("@/components/common/input/SearchField")),
    // Button: defineAsyncComponent(()=>import("@/components/common/button/Button")),
    // ExportToExcel: defineAsyncComponent(()=>import("@/components/common/export-excel/ExportExcel")),
  },

  setup() {
    const store = useStore()
    const visibleGroupModal = ref(false);

    const showGroupModal = () => {
      store.commit('groupCompositionDetails', null)
      store.dispatch('rolePermissions').then(() => {
        visibleGroupModal.value = true;
      })
    };

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider
    })

    /* const errorMsg = computed(() => {
      return store.state.staffGroups.errorMsg
    }) */

    onMounted(() => {
      store.dispatch("searchTable", "&search=");
            store.dispatch("orderTable", {
                data: "&orderField=&orderBy=",
            });
      store.state.provider.dropdownProviderLocations = []
      if(selectedProvider.value != null && selectedProvider.value != "") {
        store.dispatch('providerLocations', selectedProvider.value.id)
      }
    })
    
    const checkChangeInput = computed(() => {
      return store.state.common.checkChangeInput
    })

    const closeModal = () => {
      if (checkChangeInput.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            store.commit('groupCompositions', null)
            store.commit('addGroupComposition', null)
            visibleGroupModal.value = false;
          }
          else {
            visibleGroupModal.value = true;
          }
        })
      }
      else {
        store.commit('groupCompositions', null)
        store.commit('addGroupComposition', null)
        visibleGroupModal.value = false;
      }
    }

    return {
      visibleGroupModal,
      showGroupModal,
      closeModal,
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      // exportExcel,
    };
  },
};
</script>

<style scoped>
.searchField { margin-bottom: 20px;}
</style>