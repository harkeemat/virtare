<template>
  <a-table rowKey="id" class="sortIconTable" :pagination="false" :columns="locationsColumns" :data-source="parentProviderLocations" @expand="getSubLocations">
      
    <template #programs="{record}">
      <p v-for="program in record.programs" :key="program.id">{{ program.program }}</p>
    </template>
    
    <template #actions="{record}" v-if="isList">
      <a-tooltip placement="bottom">
        <template #title>
          Program(s)
        </template>
        <a class="icons" @click="locationPrograms(record)">
          <PlusCircleOutlined />
        </a>
      </a-tooltip>
      <!-- <a-tooltip placement="bottom">
        <template #title>
          Program(s)
        </template>
        <a class="icons" @click="editProviderLocation(record.id)">
          <EditOutlined />
        </a>
      </a-tooltip> -->
      <!-- <a-tooltip placement="bottom">
        <template #title>
          Delete
        </template>
        <a class="icons" @click="deleteProviderLocation(record.id, record.entityType)">
          <DeleteOutlined />
        </a>
      </a-tooltip> -->
    </template>

  </a-table>
  <ProviderLocationsLoadingStatus />

  <LocationsModal v-model:visible="visibleProviderLocation" @closeLocationModal="closeLocationModal" />
  <LocationsProgramsModal v-if="visibleProviderLocationPrograms" v-model:visible="visibleProviderLocationPrograms" :locationId="locationId" :parentLocationId="parentLocationId" :entityType="locationEntityType" :parentEntityType="parentEntityType" @closeModal="closeModal" />
</template>

<script>
import {
  PlusCircleOutlined,
  // DeleteOutlined,
  // EditOutlined,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref } from 'vue-demi'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import LocationsProgramsModal from "@/components/modals/LocationsProgramsModal";
import LocationsModal from "@/components/modals/LocationsModal";
import { warningSwal } from '../../../../../commonMethods/commonMethod';
import { messages } from '../../../../../config/messages';
import ProviderLocationsLoadingStatus from "@/components/loader/ProviderLocationsLoadingStatus";

export default {
  components: {
    PlusCircleOutlined,
    // DeleteOutlined,
    // EditOutlined,
    LocationsProgramsModal,
    LocationsModal,
    ProviderLocationsLoadingStatus,
  },
  props: {
    isList: {
      type: Boolean
    },
    providerID: {
      type: Number
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const providerId = route.params.id ? route.params.id : reactive(props.providerID)
    const visibleProviderLocationPrograms = ref(false)
    const visibleProviderLocation = ref(false)
    const locationId = ref(null)
    const locationEntityType = ref(null)
    const parentEntityType = ref(null)
    const parentLocationId = ref(null)

    onMounted(() => {
      // store.dispatch('providerLocations', providerId)
    })
    
    const providerPrograms = computed(() => {
      return store.state.provider.providerPrograms
    })
    
    const providerLocations = computed(() => {
      return store.state.provider.providerLocations
    })
    
    const parentProviderLocations = computed(() => {
      return store.state.provider.parentProviderLocations
    })
    
    const subLocationsList = computed(() => {
      return store.state.provider.subLocationsList
    })
    
    // const subLocationsByParentId = computed(() => {
    //   return store.state.provider.subLocationsByParentId
    // })

    const providerLocationsColumns = [
      {
        title: 'Location',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Program(s)',
        dataIndex: 'programs',
        key: 'programs',
        slots: {
          customRender: 'programs'
        }
      }
    ]

    const providerLocationsColumnsList = [
      {
        title: 'Location',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Program(s)',
        dataIndex: 'programs',
        key: 'programs',
        slots: {
          customRender: 'programs'
        }
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

    const closeModal = () => {
      emit('closeModal')
      visibleProviderLocationPrograms.value = false
    }

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    const addProviderLocation = computed(() => {
      return store.state.provider.addProviderLocation
    })

    const closeLocationModal = () => {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            visibleProviderLocation.value = false
            if(addProviderLocation.value != null) {
              store.dispatch('increaseLocationCount', {
                providerId: providerId,
                countLocations: true
              }).then(() => {
                store.dispatch("editSingleProvider", providerId)
              })
            }
          }
          else {
            visibleProviderLocation.value = true
          }
        });
      } else {
        visibleProviderLocation.value = false
        if(addProviderLocation.value != null) {
          store.dispatch('increaseLocationCount', {
            providerId: providerId,
            countLocations: true
          }).then(() => {
            store.dispatch("editSingleProvider", providerId)
          })
        }
      }
    }

    const locationPrograms = (record) => {
      let entityType = record.entityType
      locationEntityType.value = entityType
      parentEntityType.value = record.parentEntityType
      parentLocationId.value = record.parentId
      if(record.parentEntityType != "" && record.parentEntityType != '' && record.parentEntityType != null) {
        store.dispatch('dropdownLocationPrograms', {
          providerID: providerId,
          locationID: parentLocationId.value,
          entityType: record.parentEntityType,
        })
      }
      else {
        store.commit('dropdownLocationPrograms', providerPrograms.value)
      }
      store.dispatch('locationPrograms', {
        providerID: providerId,
        locationID: record.id,
        entityType: entityType,
      }).then(() => {
        locationId.value = record.id
      })
      visibleProviderLocationPrograms.value = true
    }

    const deleteProviderLocation = (id, entityType) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteProviderLocation", {
            providerID: providerId,
            locationID: id,
            entityType: entityType,
          }).then(() => {
            store.dispatch('providerLocations', providerId)
            store.dispatch('locationPrograms', {
              providerID: providerId,
              locationID: id,
              entityType: entityType
            })
          })
        }
      })
    }

    const editProviderLocation = (id) => {
      store.dispatch("providerLocationById", {
        providerId: providerId,
        locationId: id,
      }).then(() => {
        visibleProviderLocation.value = true
        emit('isEdit', id)
      })
    }

    function findNodeWithId(key, locationsList) {
      for(let location of locationsList) {
        if(location.key === key) {
          return location
        }
        if(location.children) {
          const idFoundInChildren = findNodeWithId(key, location.children)
          if(idFoundInChildren !== null) {
            return idFoundInChildren
          }
        }
      }
      return null
    }

    const getSubLocations = (isExpanded, location) => {
      store.dispatch('subLocationsList', {
        providerId: providerId,
        locationId: location.id,
        entityType: location.entityType,
        parentKey: location.key,
      }).then(() => {
        let findNode = findNodeWithId(location.key, parentProviderLocations.value)
        findNode.children = []
        if(isExpanded) {
          subLocationsList.value.map(subLocation => {
            if(subLocation.parentKey == location.key) {
              findNode.children.push({
                id: subLocation.id,
                key: subLocation.key,
                parentKey: subLocation.parentKey,
                udid: subLocation.udid,
                name: subLocation.name,
                parentId: subLocation.parentId,
                parentName: subLocation.parentName,
                providerId: subLocation.providerId,
                providerName: subLocation.providerName,
                entityType: subLocation.entityType,
                parentEntityType: subLocation.parentEntityType,
                programs: subLocation.programs,
                children: subLocation.children,
              })
            }
          })
        }
        else {
          providerLocations.value.map(() => {
            findNode.children = []
          })
        }
      })
    }

    return {
      getSubLocations,
      locationsColumns: props.isList ? providerLocationsColumnsList : providerLocationsColumns,
      parentProviderLocations,
      closeModal,
      closeLocationModal,
      locationPrograms,
      visibleProviderLocationPrograms,
      visibleProviderLocation,
      locationId,
      parentLocationId,
      locationEntityType,
      parentEntityType,
      deleteProviderLocation,
      editProviderLocation,
    }
  }
  
}
</script>

<style scoped>
  .anticon-plus-circle {
    color: #1D8FFB;
    font-size: 20px !important;
  }
</style>