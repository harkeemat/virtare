<template>
  <a-layout-content>
    <div class="common-bg">
      <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">Provider Summary</h2>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="mb-24">
          <a-col :sm="8" :xs="24">
              <div class="patientInfo patientSection">
                  <EditOutlined class="editIcon" style="float:right;padding:10px" @click="showModal(editSingleProvider?.id)" v-if="arrayToObjact(screensPermissions,23)"/>
                  <div class="patientImg">
                    <div class="info">
                      <p>
                        Name : {{ editSingleProvider?editSingleProvider.name:''}}
                      </p>
                      <p>
                        <a :href="`tel:${editSingleProvider?editSingleProvider.phoneNumber:''}`">
                          Phone : {{ editSingleProvider?editSingleProvider.phoneNumber:''}}
                        </a>
                      </p>
                      <p>
                        Address : {{ editSingleProvider?editSingleProvider.address:''}}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="pat-profile">
                      <div class="pat-profile-inner">
                        <div class="thumb-head">Program(s)</div>
                        <div class="thumb-desc" v-if="getProviderPrograms">
                          <p v-for="program in getProviderPrograms" :key="program.id">{{ program.name }}</p>
                        </div>
                      </div>
                      <div class="pat-profile-inner">
                          <div class="thumb-head">Tag(s)</div>
                          <div class="thumb-desc" v-if="selectedTags">
                            <p v-for="providerTag in selectedTags" :key="providerTag.id">
                              {{ providerTag.name }}
                            </p>
                          </div>
                      </div>
                      <div class="pat-profile-inner">
                          <div class="thumb-head">Module(s)</div>
                          <div class="thumb-desc" v-if="selectedModules">
                            <p v-for="providerModule in selectedModules" :key="providerModule.id">
                              {{ providerModule.name }}
                            </p>
                          </div>
                      </div>
                      <div class="pat-profile-inner">
                          <div class="thumb-head">Default City</div>
                          <div class="thumb-desc">{{ editSingleProvider?.city }}</div>
                      </div>
                      <div class="pat-profile-inner">
                          <div class="thumb-head">Total Locations</div>
                          <div class="thumb-desc">{{ editSingleProvider?.totalLocations }}</div>
                      </div>
                      <div class="pat-profile-inner">
                          <div class="thumb-head">Locations Added</div>
                          <div class="thumb-desc">{{ editSingleProvider?.countLocations }}</div>
                      </div>
                      <!-- <div class="pat-profile-inner">
                          <div class="thumb-head">Default Location</div>
                          <div v-if="editSingleProvider">
                            <p><strong> Country : </strong>{{ editSingleProvider.countryName }}</p>
                            <p><strong> State : </strong>{{ editSingleProvider.stateName }}</p>
                            <p><strong> City : </strong>{{ editSingleProvider.city }}</p>
                          </div>
                      </div> -->
                  </div>
              </div>
          </a-col>
          <a-col :sm="16" :xs="24" >
            <div class="summary-tabs" v-if="arrayToObjact(screensPermissions,31)">
              <h2 class="mb-24">Locations</h2>
              <div class="common-btn mb-24" v-if="isAddLocationAlowed">
                <a-button class="btn blackBtn" @click="showAddLocationModal">
                  <PlusOutlined />
                </a-button>
              </div>
              <ProviderLocationsTable :isList="true" />
            </div>
          </a-col>
      </a-row>
      </div>
      <Loader />
  </a-layout-content>
  <LocationsModal v-model:visible="locationsModalVisible" v-if="locationsModalVisible" :fromSummary="true" :fromTable="true" @closeLocationModal="closeLocationModal()" />
  <AdminProvidersModal v-if="visible" v-model:visible="visible" @closeModal="closeModal($event)" :isAdd="true" :providerId="providerID" />
  
</template>

<script>
import {
  ref,
  computed,
  watchEffect,
  onMounted,
  defineComponent,
  defineAsyncComponent,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Loader from "@/components/loader/Loader";
import {
  EditOutlined,
  // DeleteOutlined,
  // PhoneOutlined
  PlusOutlined
} from "@ant-design/icons-vue";
import { warningSwal, arrayToObjact } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import ProviderLocationsTable from "@/components/administration/providers/providerLocations/tables/ProviderLocationsTable";
import LocationsModal from "@/components/modals/LocationsModal"

const providerLocationsColumns = [
  {
    title: 'Location Name',
    dataIndex: 'locationName',
    key: 'locationName',
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: 'Parent',
    dataIndex: 'parentName',
    key: 'parentName',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    slots: {
      customRender: 'actions'
    }
  },
]

export default defineComponent({
  components: {
    Loader,
    LocationsModal,
    EditOutlined,
    // DeleteOutlined,
    // PhoneOutlined,
    PlusOutlined,
    ProviderLocationsTable,
    AdminProvidersModal: defineAsyncComponent(() =>
      import("@/components/modals/AdminProvidersModal")
    ),
  },

  setup() {
    function logout() {
      localStorage.removeItem("auth");
      localStorage.clear();
    }
    const store = useStore();
    const router = useRoute();
    const visible = ref(false);
    const providerID = ref();
    const locationsModalVisible = ref(false)
    const isAddLocationAlowed = ref(false)

    const showAddLocationModal = () => {
      locationsModalVisible.value = true
    }

    const showModal = (id) => {
      store.commit("isEditProvider", true);
      providerID.value = id;
      visible.value = true;
      store.dispatch("editSingleProvider", id);
    };

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    const addProviderLocation = computed(() => {
      return store.state.provider.addProviderLocation
    })

    const closeModal = (current) => {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            visible.value = false
            store.commit('checkChangeInput', false)
            store.commit('providerResetCounter', 0)
            store.commit("isEditProvider", false);
            store.commit('addProviderContact', null)
            store.commit('providerData', null)
            if(addProviderLocation.value != null) {
              store.dispatch('increaseLocationCount', {
                providerId: providerID.value,
                countLocations: true
              }).then(() => {
                store.dispatch("editSingleProvider", providerID.value)
              })
            }
          }
          else {
            store.commit('providerResetCounter', current)
            visible.value = true
            store.commit("isEditProvider", true);
          }
        });
      }
      else {
        visible.value = false
        store.commit('checkChangeInput', false)
        store.commit('providerResetCounter', 0)
        store.commit('addProviderContact', null)
        store.commit('providerData', null)
        if(addProviderLocation.value != null) {
          store.dispatch('increaseLocationCount', {
            providerId: providerID.value,
            countLocations: true
          }).then(() => {
            store.dispatch("editSingleProvider", providerID.value)
          })
        }
      }
    };

    const closeLocationModal = () => {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            if(addProviderLocation.value != null) {
              store.dispatch('increaseLocationCount', {
                providerId: router.params.id,
                countLocations: true
              }).then(() => {
                store.dispatch("editSingleProvider", router.params.id)
              })
            }
            locationsModalVisible.value = false
            store.commit('checkChangeInput', false)
          }
          else {
            locationsModalVisible.value = true
          }
        });
      } else {
        if(addProviderLocation.value != null) {
          store.dispatch('increaseLocationCount', {
            providerId: router.params.id,
            countLocations: true
          }).then(() => {
            store.dispatch("editSingleProvider", router.params.id)
          })
        }
        locationsModalVisible.value = false
        store.commit('checkChangeInput', false)
      }
    }

    const providerModules = computed(() => {
      return store.state.provider.providerModules;
    });

    const providerTags = computed(() => {
      return store.state.provider.providerTags;
    });

    const selectedTags = computed(() => {
      return store.state.provider.selectedTags;
    });

    const selectedModules = computed(() => {
      return store.state.provider.selectedModules;
    });

    const globalCode = computed(() => {
      return store.state.common;
    });

    onMounted(() => {
      store.commit('providerContact', null)
      var finalTags = []
      var finalModules = []
      store.dispatch("editSingleProvider", router.params.id).then(() => {
        store.dispatch('getProviderPrograms', router.params.id)
        isAddLocationAlowed.value = editSingleProvider.value.totalLocations > editSingleProvider.value.countLocations ? true : false
        let globalTags = globalCode.value.documentTags;
        let globalModules = globalCode.value.modules;
        
        if(globalTags && providerTags.value) {
          globalTags.map(item => {
            if(providerTags.value.includes(item.id)) {
              finalTags.push(item)
            }
          })
        }
        
        if(globalModules && providerModules.value) {
          globalModules.map(item => {
            if(providerModules.value.includes(item.id)) {
              finalModules.push(item)
            }
          })
        }

        store.commit('selectedTags', finalTags)
        store.commit('selectedModules', finalModules)
      })

      store.dispatch('providerLocations', router.params.id)
    });

    watchEffect(() => {
      store.dispatch("providerLocationList", router.params.id);
      store.dispatch("providerLocationList", router.params.id);
    
    });
    const editSingleProvider = computed(() => {
      return store.state.provider.editSingleProvider;
    });
    const providerLocations = computed(() => {
      return store.state.provider.providerLocations;
    });
    const getProviderPrograms = computed(() => {
      return store.state.provider.getProviderPrograms;
    });

    // const providerTags = computed(() => {
    //   return store.state.common.documentTags;
    // });
    // const providerModules = computed(() => {
    //   return store.state.common.modules;
    // });

    function deleteProviderLocation(id) {
      if (router.params.id != null) {
        warningSwal(messages.deleteWarning).then((response) => {
          if (response == true) {
            store
              .dispatch("deleteProviderLocation", {
                id: router.params.id,
                locationId: id,
              })
              .then(() => {
                store.dispatch("providerLocationList", router.params.id);
              }, 2000);
          }
        });
      } else {
        warningSwal(messages.deleteWarning).then((response) => {
          if (response == true) {
            store.dispatch("deleteProviderLocation", {
              providerID: router.params.id,
              locationID: id,
            });
            setTimeout(() => {
              store.dispatch("providerLocationList", router.params.id);
            }, 2000);
          }
        });
      }
    }

    return {
      providerID,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      logout,
      globalCode,
      editSingleProvider,
      getProviderPrograms,
      selectedTags,
      providerLocations,
      providerLocationsColumns,
      selectedModules,
      watchEffect,
      visible,
      deleteProviderLocation,
      showModal,
      closeModal,
      closeLocationModal,
      showAddLocationModal,
      locationsModalVisible,
      isAddLocationAlowed
    };
  },
});
</script>

<style>
.patientSection {
  margin: 0 !important;
  padding: 0 0 30px 0 !important;
  background-color: #daeedb;
}
.patientInfo .patientImg {
  border-bottom: 0px none !important;
}
</style>