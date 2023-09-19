<template>
  <!-- <div v-if="authRole == 'Staff'" class="locationDropdown">
    <div class="location">
      <a-select ref="select" placeholder="Locations" @change="getLocationPrograms($event)" :disabled="staffLocations && staffLocations.length == 1" v-model:value="selectedValue">
        <a-select-option v-for="location in staffLocations" :key="location.id" :value="location">
          {{ location.locationName }}
        </a-select-option>
      </a-select>
    </div>
  </div> -->

  <!-- <div v-if="staffLocations.length > 0" class="locationDropdown">
    <div class="location" v-for="(locations, index) in staffLocations" :key="locations.id">
      <a-dropdown-button v-if="defaultLocationName != null && defaultLocationName != ''" :disabled="disabledLocation">
        <span> {{defaultLocationName}} </span>
        <template #icon><DownOutlined /></template>
      </a-dropdown-button>
      <a-select v-else-if="staffLocations && staffLocations.length > 0" ref="select" placeholder="Locations" @change="getLocationPrograms($event, index)">
        <a-select-option v-for="location in locations" :key="location.id" :value="location">
          {{ location.name }}
        </a-select-option>
      </a-select>
    </div>
  </div> -->

  <div class="locationDropdown">
    <div>
      <a-row>
        <a-col class="location" v-for="(locations, index) in headerProviderLocations" :key="index">
        <!-- <a-form-item :label="headerProviderLocations[index][0].subLocationLevel ? headerProviderLocations[index][0].subLocationLevel : headerProviderLocations[index][0].entityType" :rules="[{required: false, message:headerProviderLocations[index][0].subLocationLevel ? headerProviderLocations[index][0].subLocationLevel : headerProviderLocations[index][0].entityType+' '+$t('global.validation')}]"> -->
          <select v-if="defaultLocationName != null && defaultLocationName != ''" class="customSelect" size="large" ref="select" placeholder="Location" @change="getLocationPrograms($event, index);" :value="defaultLocationName">
            <option value="" hidden>Select {{headerProviderLocations[index][0].subLocationLevel ? headerProviderLocations[index][0].subLocationLevel : headerProviderLocations[index][0].entityType}}</option>
            <option v-for="location in locations" :key="location.id" :value="location">
              {{ location.name }}
            </option>
          </select>
          <select v-else class="customSelect" size="large" ref="select" placeholder="Location" @change="getLocationPrograms($event, index);">
            <option value="" hidden>Select {{headerProviderLocations[index][0].subLocationLevel ? headerProviderLocations[index][0].subLocationLevel : headerProviderLocations[index][0].entityType}}</option>
            <option v-for="location in locations" :key="location.id" :value="location">
              {{ location.name }}
            </option>
          </select>
        </a-col>
      </a-row>
    </div>
  </div>

</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue-demi';
import {
    // DownOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    // DownOutlined,
  },
  props: {
    disabled: {
      type: Boolean
    },
    authRole: {
      type: String
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const disabledLocation = ref(true)
    const authUser = JSON.parse(localStorage.getItem("auth"));
    const authStaff = authUser.user.staff

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider
    })

    const selectedLocation = computed(() => {
      return store.state.provider.selectedLocation
    })

    const selectedProgram = computed(() => {
      return store.state.provider.selectedProgram
    })
    
    const locationPrograms = computed(() => {
      return store.state.provider.locationPrograms
    })

    const locationsDropdown = computed(() => {
      return store.state.provider.locationsDropdown
    })

    const programsDropdown = computed(() => {
      return store.state.provider.programsDropdown
    })

    const providerLocations = computed(() => {
      return store.state.provider.providerLocations
    })

    const headerProviderLocations = computed(() => {
      return store.state.provider.headerProviderLocations
    })

    const staffLocations = computed(() => {
      return store.state.careCoordinator.staffLocations
    })

    const selectedValue = ref(null)
    const defaultLocationName = ref('')
    let userRoles = authStaff.role.map(role => {
      return role.name
    })

    onMounted(() => {
      selectedValue.value = authStaff.defaultLocation ? authStaff.defaultLocation.locationName : ""
      if(selectedProvider.value != null && selectedProvider.value != "") {
        store.dispatch('providerLocations', selectedProvider.value.id).then(() => {
          store.commit('selectedLocation', selectedLocation.value)
          store.commit('locationsDropdown', selectedLocation.value?.locationName)
        })
      }

      if(!userRoles.includes("Super Admin") && !userRoles.includes("Provider Admin")) {
        if(userRoles.includes("Staff")) {
          disabledLocation.value = false
          // store.dispatch('headerProviderLocations', selectedProvider.value.id)
          store.dispatch('staffLocations', {
            staffId: authStaff.id,
            page: ""
          })
        }
        else {
          // 
        }
      }

      if(selectedLocation.value != null) {
        store.dispatch('locationPrograms', {
          providerID: selectedProvider.value.id,
          locationID: selectedLocation.value.id,
          entityType: selectedLocation.value.entityType
        }).then(() => {
          store.commit('selectedProgram', selectedProgram.value)
          store.commit('programsDropdown', selectedProgram.value?.name)
        })
      }
    })

    const getLocationPrograms = (selected, index) => {
      store.commit('isManualHeader', true)
      emit('changeDropdown')
      let location = selected.target.selectedOptions[0]._value
      store.commit('selectedProgram', null)
      store.commit('programsDropdown', "")
      headerProviderLocations.value.splice(index+1, 100)
      selectedValue.value = location
      store.commit('locationsDropdown', null)
      store.commit('selectedProgram', null)
      store.commit('programsDropdown', null)

      store.dispatch('headerSubLocations', {
        providerId: selectedProvider.value.id,
        locationId: location.id,
        entityType: location.entityType,
      }).then((response) => {
        if(response == true) {
          store.dispatch('locationPrograms', {
            providerID: selectedProvider.value ? selectedProvider.value.id : authStaff.providerId,
            locationID: location.id,
            entityType: location.entityType,
          })
          store.commit('selectedLocation', location)
          store.commit('updateComponentKey')
        }
      })
    }

    return {
      getLocationPrograms,
      locationPrograms,
      locationsDropdown,
      programsDropdown,
      disabledLocation,
      providerLocations,
      headerProviderLocations,
      selectedValue,
      staffLocations,
      defaultLocationName,
    }
  }
}
</script>

<style lang="scss" scoped>
.locationDropdown .location {
  padding-right: 12px;
}
.ant-select { width: 150px; }
</style>