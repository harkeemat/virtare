<template>
  <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,35,'id','name'),'name','udid')" :model="createGroupForm" layout="vertical" @finish="submitForm" autocomplete="off">
    <a-row :gutter="24">

      <a-col :span="isEdit ? 24 : 12">
        <div class="form-group">
          <a-form-item :label="$t('staffGroups.groupName')" name="group" :rules="[{required: true, message:$t('staffGroups.groupName')+' '+$t('global.validation')}]">
            <a-input v-model:value="createGroupForm.group" size="large" @keyup="changeInput" />
            <ErrorMessage v-if="errorMsg != null" :name="errorMsg.groupName ? errorMsg.groupName[0] : '' " />
          </a-form-item>
        </div>
      </a-col>

      <a-col :span="12" v-if="!isEdit">
        <div class="form-group">
          <a-form-item :label="$t('global.provider')" name="providerId" :rules="[{ required: true, message: $t('global.provider')+' '+$t('global.validation') }]">
            <select class="customSelect" v-model="createGroupForm.providerId" size="large" ref="select" placeholder="Provider" @change="selectProvider($event);">
              <option v-for="provider in staffProviders" :key="provider.id" :value="provider">
                {{ provider.name }}
              </option>
            </select>
            <!-- <ProvidersDropdown :defaultProviderData="staffProviders" v-model:value="createGroupForm.providerId" @handleProviderChange="selectProvider($event);" placeholder="Provider" /> -->
            <ErrorMessage v-if="errorMsg != null" :name="errorMsg.providerId ? errorMsg.providerId[0] : '' " />
          </a-form-item>
        </div>
      </a-col>

      <template v-if="!isEdit && dropdownProviderLocations && dropdownProviderLocations.length > 0" class="">
        <a-col :span="12" v-for="(locations, index) in dropdownProviderLocations" :key="locations.id">
          <a-form-item :label="dropdownProviderLocations[index][0].subLocationLevel ? dropdownProviderLocations[index][0].subLocationLevel : dropdownProviderLocations[index][0].entityType" name="providerLocation" :rules="[{required: false, message:$t('staffGroups.providerLocation')+' '+$t('global.validation')}]">
            <select class="customSelect" v-model="createGroupForm.providerLocation[index]" size="large" ref="select" placeholder="Location" @change="selectLocation($event, index);">
              <option v-for="location in locations" :key="location.id" :value="location">
                {{ location.name }}
              </option>
            </select>
            <!-- <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="createGroupForm.providerLocation[index]" size="large" ref="select" placeholder="Location" @change="selectLocation($event, index);">
              <a-select-option v-for="location in locations" :key="location.id" :value="location">
                {{ location.name }}
              </a-select-option>
            </a-select> -->
            <ErrorMessage v-if="errorMsg != null" :name="errorMsg.providerLocation ? errorMsg.providerLocation[0] : '' " />
          </a-form-item>
        </a-col>
      </template>

      <template v-else-if="groupLocationSelected && groupLocationSelected != null" class="">
        <a-col :span="12" v-for="locations in groupLocationSelected" :key="locations.id">
          <a-form-item :label="'Location'" name="providerLocation" :rules="[{required: false, message:$t('staffGroups.providerLocation')+' '+$t('global.validation')}]">
            <a-input v-model:value="locations.locationName" size="large" @keyup="changeInput" :disabled="true" />
          </a-form-item>
        </a-col>
      </template>

      <a-col :span="24">
        <div class="form-group">
          <a-form-item @change="changeInput" :label="$t('global.isActive')" name="isActive">
            <a-switch v-model:checked="createGroupForm.isActive" @change="changeInput" />
          </a-form-item>
        </div>
      </a-col>
      <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,35,'id','name'),'name','udid')"> </FormBaseComponents>

      <a-col :span="24">
        <div class="form-group">
          <div class="steps-action">
            <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-form>
  <Loader />
</template>

<script>
import {
  computed,
  reactive,
  ref,
  watchEffect,
  defineAsyncComponent,
	defineComponent,
	onMounted,
} from 'vue-demi';
import { useStore } from 'vuex';
import {
 
  arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
// import Loader from "@/components/loader/Loader";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  props: {
    isEdit: {
      type: Boolean
    },
    groupID: {
      type: Number
    }
  },
  components: {
    ErrorMessage: defineAsyncComponent(()=>import("@/components/common/messages/ErrorMessage")),
    // ProvidersDropdown: defineAsyncComponent(()=>import("@/components/modals/search/ProvidersDropdown")),
    // LocationsDropdown: defineAsyncComponent(()=>import("@/components/modals/search/LocationsDropdown")),
    Loader: defineAsyncComponent(()=>import("@/components/loader/Loader")),
    FormBaseComponents
  },
  setup(props, { emit }) {
    const store = useStore()
    const groupId = ref()
    const isProviderDisabled = ref(false)
    const title = props.isEdit ? 'Edit Group' : 'Create Group'
    const authUser = JSON.parse(localStorage.getItem("auth")).user;
    const authStaff = authUser.staff

    let userRoles = []
    if(authStaff && authStaff != null) {
      userRoles = authStaff.role.map(role => {
        return role.name
      })
    }

    const errorMsg = computed(() => {
      return store.state.staffGroups.errorMsg
    })

    const createGroup = computed(() => {
      return store.state.staffGroups.createGroup
    })

    const groupDetails = computed(() => {
      return store.state.staffGroups.groupDetails
    })

    const groupLocationSelected = computed(() => {
      return store.state.staffGroups.groupLocationSelected
    })
    
    const groupLocations = computed(() => {
      return store.state.provider.groupLocations;
    });

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider
    })

    const providerLocations = computed(() => {
      return store.state.provider.providerLocations
    })

    /* const selectedLocation = computed(() => {
      return store.state.provider.selectedLocation
    }) */

    const createGroupForm = reactive({
      group: "",
      isActive: true,
      level: "",
      providerLocation: [],
      providerId: "",
      entityType: "",
    })

    onMounted(() => {
      if(createGroup.value == null) {
        store.commit('groupLocationSelected', null)
      }
      if(userRoles.includes('Super Admin')) {
        // store.commit('selectedProvider', "")
        store.state.provider.dropdownProviderLocations = []
        isProviderDisabled.value = false
      }
      store.commit('groupCompositionDetails', null)
      store.dispatch('providersListAll')
      if(selectedProvider.value != null && selectedProvider.value != "") {
          store.dispatch('providerLocations', selectedProvider.value.id).then(() => {
              store.commit('dropdownProviderLocations', providerLocations.value)
              isProviderDisabled.value = true
          })
          createGroupForm.providerId = selectedProvider.value.id
      }
    })

    watchEffect(() => {
      if(groupDetails.value) {
        Object.assign(createGroupForm, groupDetails.value)
        groupId.value = props.groupID ? props.groupID : groupDetails.value.udid;
      }
    })

    const submitForm = () => {
      /* store.commit('selectedProvider', {
        id: createGroupForm.providerId
      }) */
      let locationSelected = null
      let formData = null

      if(createGroupForm.providerLocation != undefined && createGroupForm.providerLocation?.length > 0) {
        locationSelected = createGroupForm.providerLocation.pop()
        store.commit('groupLocationSelected', createGroupForm.providerLocation.map(location => {
          let loc = {
            id: location.id,
            entityType: location.entityType,
            locationId: location.locationId,
            locationName: location.locationName,
          }
          return loc
        }))
        store.commit('dropdownProviderLocations', null)
        formData = {
          group: createGroupForm.group,
          isActive: createGroupForm.isActive,
          level: createGroupForm.level,
          providerLocation: locationSelected.id,
          providerId: selectedProvider.value != null && selectedProvider.value != "" ? selectedProvider.value.id : selectedProvider.value,
          entityType: locationSelected.entityType,
        }
      }
      else {
        formData = {
          group: createGroupForm.group,
          isActive: createGroupForm.isActive,
          providerId: selectedProvider.value != null && selectedProvider.value != "" ? selectedProvider.value.id : selectedProvider.value,
        }
      }
      store.commit('errorMsg', null)

      if(props.isEdit) {
        store.dispatch('updateGroup', {
          id: groupId.value,
          data: formData,
        }).then(() => {
          store.commit('counterPlus')
          store.dispatch('groupsList')
          store.dispatch('groupDetails', createGroup.value.udid)
        })
      }
      else {
        if(createGroupForm.providerId == "" || createGroupForm.providerId == null) {
          store.commit('errorMsg', {
            providerId: {
              0: "Provider is required"
            }
          })
        }
        else if(createGroupForm.providerLocation.length == 0) {
          store.commit('errorMsg', {
            providerLocation: {
              0: "Location is required"
            }
          })
        }
        if(groupDetails.value != null) {
          store.dispatch('updateGroup', {
            id: groupDetails.value.udid,
            data: formData,
          }).then(() => {
            store.commit('counterPlus')
            store.dispatch('groupsList')
            store.dispatch('groupDetails', groupDetails.value.udid)
          })
        }
        else if(createGroup.value != null) {
          store.dispatch('updateGroup', {
            id: createGroup.value.udid,
            data: formData,
          }).then(() => {
            store.commit('counterPlus')
            store.dispatch('groupsList')
            store.dispatch('groupDetails', createGroup.value.udid)
          })
        }
        else {
          store.dispatch('createGroup', formData)
          store.dispatch('groupsList')
        }
      }
      store.state.provider.dropdownProviderLocations = []
    }

    const closeModal = () => {
      emit('closeModal')
      if(userRoles.includes('Super Admin')) {
        store.commit('selectedProvider', "")
        store.state.provider.dropdownProviderLocations = []
        isProviderDisabled.value = false
      }
    }

    const changeInput = () => {
      store.commit('errorMsg', null)
    }

    const dropdownProviderLocations = computed(() => {
      return store.state.provider.dropdownProviderLocations
    })

    const checkChangeInput = (text, level) => {
      store.commit('checkChangeInput', true)
      if(text == 'level') {
        let levelText = null
        switch (level) {
          case 359:
            levelText = "City"
            break;
          case 360:
            levelText = "Street"
            break;
          case 361:
            levelText = "Building"
            break;
          case 362:
            levelText = "Floor"
            break;
          case 363:
            levelText = "Department"
            break;
          case 364:
            levelText = "Room"
            break;
          default:
            break;
        }
        store.dispatch('parentLocations', {
          providerId: selectedProvider.value.id,
          level: levelText
        }).then(() => {
          store.commit('errorMsg', null)
        })
      }
    }

    const handleGlobalChange = (data, type) => {
      if (type == "createGroupForm.level") {
        createGroupForm.level = data;
      }
    }

    const parentProviderLocations = computed(() => {
      return store.state.provider.parentProviderLocations
    })

    const dropdownSubLocationsList = computed(() => {
      return store.state.provider.dropdownSubLocationsList
    })

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

    const getSubLocations = (value) => {
      let findNode = findNodeWithId(value.slice(-1)[0], parentProviderLocations.value)
      findNode.children = []
      store.dispatch('dropdownSubLocationsList', {
        providerId: selectedProvider.value != null && selectedProvider.value != "" ? selectedProvider.value.id : selectedProvider.value,
        locationId: findNode.id,
        entityType: findNode.entityType,
        parentKey: findNode.key,
      }).then(() => {
          dropdownSubLocationsList.value.map(subLocation => {
            if(subLocation.parentKey == findNode.key) {
              findNode.children.push({
                value: subLocation,
                title: subLocation.title,
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
                programs: subLocation.programs,
                children: [{}],
              })
            }
          })
      })
    }

    const selectProvider = (selected) => {
      let provider = selected.target.selectedOptions[0]._value
      store.state.provider.dropdownProviderLocations = []
      createGroupForm.providerLocation = []
      store.commit('groupLocationSelected', null)
      store.commit('errorMsg', null)
      // createGroupForm.providerId = provider.id
      store.commit('selectedProvider', {
        id: provider.id
      })
      store.dispatch('dropdownProviderLocations', provider.id)
    }

    const selectLocation = (selected, index) => {
      store.commit('errorMsg', null)
      let location = selected.target.selectedOptions[0]._value
      dropdownProviderLocations.value.splice(index+1)
      store.dispatch('dropdownSubLocations', {
        providerId: selectedProvider.value != null && selectedProvider.value != "" ? selectedProvider.value.id : selectedProvider.value,
        locationId: location.id,
        entityType: location.entityType,
      }).then((response) => {
        if(response == true) {
          store.commit('selectedLocation', location)
        }
      })
    }

    const providersList = computed(() => {
      return store.state.provider.providersListAll
    })

    const defaultProviderData = computed(() => {
      return store.state.provider.defaultProviderData
    })

    const staffProviders = computed(() => {
      return store.state.provider.staffProviders
    })

    return {
      staffProviders,
      defaultProviderData,
      selectProvider,
      title,
      closeModal,
      changeInput,
      createGroupForm,
      submitForm,
      errorMsg,
      groupLocations,
      checkChangeInput,
      handleGlobalChange,
      parentProviderLocations,
      getSubLocations,
      selectLocation,
      dropdownProviderLocations,
      providersList,
      groupLocationSelected,
      isProviderDisabled,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
    };
  },
});
</script>

<style lang="scss" scoped>
  .ant-select {
    display: block !important;
  }
</style>