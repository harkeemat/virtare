
<template>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle">
                        {{ pageTitle }}
                        <!--  -->
                        <div class="commonBtn" >
                            <!-- <Button :name="buttonName" @click="showModal(true)" v-if="arrayToObjact(screensPermissions,22)"/> -->
                            <ShowModalButton @click="showModal(true)" :buttonText="'Provider'" v-if="arrayToObjact(screensPermissions,22)"/>
                        </div>
                    </h2>
                </a-col>
                <!--  -->
                <a-col :span="12" >
                    <SearchField endPoint="provider" v-if="arrayToObjact(screensPermissions,21)" />
                </a-col>
                <a-col :span="12">
                    <!--  -->
                    <div class="text-right mb-24" >
                        <div class="text-right mb-24">
                            <ExportToExcel  @click="exportExcel('provider_report','?fromDate=&toDate='+search)" v-if="arrayToObjact(screensPermissions,26)"/>
                        </div>
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24" >
                    <div class="list-view" v-show="!toggle">
                        <ProvidersTable @isEdit="showModal($event)" v-if="arrayToObjact(screensPermissions,21)"/>
                        <Loader />
                    </div>
                </a-col>
            </a-row>
        </div>
    </a-layout-content>
    <!-- Modal -->
    <AdminProvidersModal v-if="visible" v-model:visible="visible" @ok="handleOk" @closeModal="closeModal($event)" :isAdd="isAdd" :providerId="providerID" />
</template>
<script>
import AdminProvidersModal from "@/components/modals/AdminProvidersModal";
import ProvidersTable from "@/components/administration/providers/tables/ProvidersTable";
import { useStore } from "vuex";
import SearchField from "@/components/common/input/SearchField";
// import Button from "@/components/common/button/Button";
import { ref, watchEffect, onUnmounted, computed } from "vue";
import Loader from "@/components/loader/Loader";
import { arrayToObjact, exportExcel } from "@/commonMethods/commonMethod";
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
import { warningSwal } from '@/commonMethods/commonMethod';
import { messages } from '@/config/messages';
import ShowModalButton from "@/components/common/show-modal-button/ShowModalButton";
export default {
  components: {
    ShowModalButton,
    AdminProvidersModal,
    ProvidersTable,
    SearchField,
    // Button,
    Loader,
    ExportToExcel,
  },

  setup() {
    const store = useStore();
    const isAdd = ref(false);
    const visible = ref(false);
    const providerID = ref();
    const showModal = (e) => {
      if (e.providerId) {
        providerID.value = e.providerId;
        isAdd.value = true;
      } else {
        providerID.value = null;
        isAdd.value = false;
      }
      visible.value = e;
    };

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });
    
    const providerData = computed(() => {
      return store.state.provider.providerData
    })

    const closeModal = (current) => {
      let idProvider = providerData.value != null ? providerData.value.id : providerID.value
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            visible.value = false
            store.commit('checkChangeInput', false)
            store.commit('providerResetCounter', 0)
            store.commit("isEditProvider", false);
            store.commit('addProviderContact', null)
            store.commit('providerData', null)
            if(idProvider != null) {
              store.dispatch('increaseLocationCount', {
                providerId: idProvider,
                countLocations: true
              }).then(() => {
                store.dispatch("editSingleProvider", idProvider)
              })
            }
          }
          else {
            store.commit('providerResetCounter', current)
            visible.value = true
            store.commit("isEditProvider", true);
          }
        });
      } else {
        visible.value = false
        store.commit('checkChangeInput', false)
        store.commit('providerResetCounter', 0)
        store.commit("isEditProvider", false);
        store.commit('addProviderContact', null)
        store.commit('providerData', null)
        if(idProvider != null) {
          store.dispatch('increaseLocationCount', {
            providerId: idProvider,
            countLocations: true
          }).then(() => {
            store.dispatch("editSingleProvider", idProvider)
          })
        }
      }
    };

    const searchData = () => {};
    watchEffect(() => {
      store.dispatch("providersListAll");
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    const handleOk = () => {
      visible.value = false;
    };
    const editSingleProvider = (id) => {
      isAdd.value = false;
      store.dispatch("editSingleProvider", id).then(() => {
        visible.value = true;
      });
    };
    const checked = ref([false]);

    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    return {
      exportExcel,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      editSingleProvider,
      searchData,
      providerID,
      size: ref([]),
      visible,
      showModal,
      handleOk,
      isAdd,
      checked,
      closeModal,
      pageTitle: "Providers",
      search: store.getters.searchTable,
    };
  },
};
</script>
