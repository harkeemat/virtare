<template>
  <a-table class="sortIconTable" rowKey="id" :columns="arrayToObjact(screensPermissions, 423) || arrayToObjact(screensPermissions, 424) ? columnsWithActions : columns" :data-source="groupsList" :scroll="{ x: '900', y:'calc(100vh - 290px)' }" :pagination="false" @change="handleTableChange">
    
    <template #staffRequirements="{record}">
      <p v-for="composition in record.composition" :key="composition.id">{{ composition.count+' '+composition.designation }}</p>
    </template>
    
    <template #actions="{record}" v-if="arrayToObjact(screensPermissions, 423) || arrayToObjact(screensPermissions, 424)">
      <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions, 423)">
        <template #title>
          <span>{{ $t('staffGroups.editGroup') }}</span>
        </template>
        <a class="icons" @click="editGroup(record.udid)"><EditOutlined /></a>
      </a-tooltip>
      <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions, 424)">
        <template #title>
          <span>{{ $t('staffGroups.deleteGroup') }}</span>
        </template>
        <a class="icons" @click="deleteGroup(record.udid)"> <DeleteOutlined /></a>
      </a-tooltip>
    </template>

    <template #isActive="{record}">
      <a-switch v-model:checked="record.isActive" @change="updateStatus(record.udid, $event)" />
    </template>
    
  </a-table>
<GroupLoader />
  <!-- Modal -->
  <StaffGroupModal v-if="visibleGroupModal" v-model:visible="visibleGroupModal" @closeModal="closeModal" :isEdit="true" :groupID="idGroup" />
  
</template>

<script>
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { computed, ref, watchEffect, defineAsyncComponent, onMounted } from "vue";
import { useStore } from 'vuex';
import GroupLoader from "@/components/loader/GroupLoader"
import {
  warningSwal,
  arrayToObjact
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";

export default {
  components: {
    DeleteOutlined,
    EditOutlined,
    GroupLoader,
    // StaffGroupModal: defineAsyncComponent(()=>import("@/components/administration/staffGroups/modals/StaffGroupsModal")),
    StaffGroupModal: defineAsyncComponent(()=>import("@/components/administration/staffGroups/modals/StaffGroupsModalNew")),
  },
  setup() {
    const store = useStore()
    const checked = true;
    const idGroup = ref(null);
    const visibleGroupModal = ref(false);
    
    const editGroup = (id) => {
      store.commit('groupCompositionDetails', null)
      idGroup.value = id
      store.dispatch('groupDetails', id).then(() => {
        visibleGroupModal.value = true;
      })
      store.dispatch('rolePermissions')
      store.dispatch('groupStaffList', id)
      // store.dispatch('groupProgramsList', id)
      // store.dispatch('groupProvidersList', id)
      store.dispatch('groupPermissions', id)
      store.commit("resetCounter")
    };

    /* const errorMsg = computed(() => {
      return store.state.staffGroups.errorMsg
    }) */
    
    const updateStatus = (id, value) => {
      store.dispatch('updateGroup', {
        id: id,
        data: {
          isActive: value
        }
      }).then(() => {
        store.dispatch('groupsList')
      })
    };

    const deleteGroup = (id) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch('deleteGroup', id).then(() => {
            store.dispatch('groupsList')
          })
        }
      })
    }

    watchEffect(() => {
      store.dispatch('groupsList')
    })

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider
    })
    const groupsList = computed(() => {
      return store.state.staffGroups.groupsList
    })
    const groupsMeta = store.getters.groupsMeta
    onMounted(() => {
      
    })
        let record = []
        let scroller = ""
        onMounted(() => {
          if(selectedProvider.value != null && selectedProvider.value != "") {
        store.dispatch('providerLocations', selectedProvider.value.id)
      }
            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop +1
                if (currentScroll >= maxScroll) {
                    let current_page = groupsMeta.value?.current_page + 1
                    if (current_page <= groupsMeta.value?.total_pages) {
                        
                        scroller = maxScroll;
                        groupsMeta.value = ""
                        record = groupsList.value
                        store.dispatch("groupsList", "?page=" + current_page + store.getters.searchTable.value +
                            store.getters.orderTable.value?.data).then(() => {
                            loadMoredata()
                        });
                    }
                }
            });
        });

        function loadMoredata() {

            const newData = groupsList.value
            newData.forEach((element) => {
                record.push(element)
            });
            
            
            store.state.staffGroups.groupsList = record;
            var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent?.scrollTo(0, scroller);
            }, 50)
        }
        const handleTableChange = (pag, filters, sorter) => {
            if (sorter.order) {
                let order = sorter.order == "ascend" ? "ASC" : "DESC";
                let orderParam = "&orderField=" + sorter.field + "&orderBy=" + order;
                store.dispatch("orderTable", {
                    data: orderParam,
                    orderBy: order,
                    page: pag,
                    filters: filters,
                });
                store.dispatch(
                  "groupsList",
                    "?page=" + store.getters.searchTable.value + orderParam
                );
            } else {
                store.dispatch("orderTable", {
                    data: "&orderField=&orderBy=",
                });
                store.dispatch(
                  "groupsList",
                    "?page=" +
                    store.getters.searchTable.value +
                    store.getters.orderTable.value.data
                )
            }
        }
    
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

    const columns = [
      {
        title: "Group",
        dataIndex: "group",
        key: "group",
        sorter: true,
      },
      {
        title: "Provider",
        dataIndex: "providerName",
        key: "providerName",
        sorter: true,
      },
      {
        title: "Location",
        dataIndex: "providerLocationName",
        key: "providerLocationName",
      },
      {
        title: "Staff Requirements",
        dataIndex: "staffRequirements",
        key: "staffRequirements",
        slots: {
          customRender: "staffRequirements",
        },
      },
      {
        title: "Maximum Patients Count",
        dataIndex: "maximumPatientsCount",
        key: "maximumPatientsCount",
      },
      {
        title: "Patients Added",
        dataIndex: "patientAdded",
        key: "patientAdded",
      },
    ];

    const columnsWithActions = [
      {
        title: "Group",
        dataIndex: "group",
        key: "group",
        sorter: true,
      },
      {
        title: "Provider",
        dataIndex: "providerName",
        key: "providerName",
        sorter: true,
      },
      {
        title: "Location",
        dataIndex: "providerLocationName",
        key: "providerLocationName",
      },
      {
        title: "Staff Requirements",
        dataIndex: "staffRequirements",
        key: "staffRequirements",
        slots: {
          customRender: "staffRequirements",
        },
      },
      {
        title: "Maximum Patients Count",
        dataIndex: "maximumPatientsCount",
        key: "maximumPatientsCount",
      },
      {
        title: "Patients Added",
        dataIndex: "patientAdded",
        key: "patientAdded",
      },
      {
        title: "Action(s)",
        dataIndex: "actions",
        slots: {
          customRender: "actions",
        },
      },
    ];

    return {
      closeModal,
      visibleGroupModal,
      editGroup,
      deleteGroup,
      checked,
      columns,
      groupsList,
      idGroup,
      updateStatus,
      screensPermissions:store.getters.screensPermissions,
      arrayToObjact,
      columnsWithActions,
      handleTableChange
    }
  }
}
</script>