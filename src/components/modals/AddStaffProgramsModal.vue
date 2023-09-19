<template>
  <a-modal width="60%" title="Staff Programs" @cancel="closeModal()" centered :footer="false">
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,14,'id','name'),'name','udid')" :model="staffProgramsForm" ref="formRef" class="basic" name="basic" autocomplete="off" layout="vertical" @finish="submitForm">
      <a-row :gutter="24">

        <a-col :span="12">
          <div class="form-group">
            <a-form-item :label="$t('global.provider')" name="provider" :rules="[{ required: false, message: $t('global.provider')+' '+$t('global.validation') }]">
              <select class="customSelect" v-model="staffProgramsForm.providerId" size="large" ref="select" placeholder="Provider" @change="selectProvider($event);">
                <option v-for="provider in staffProviders" :key="provider.id" :value="provider">
                  {{ provider.name }}
                </option>
              </select>
              <!-- <ProvidersDropdown :defaultProviderData="defaultProviderData" v-model:value="staffProgramsForm.providerId" @handleProviderChange="selectProvider($event)" placeholder="Search Location" :disabled="disabledProvider" /> -->
            </a-form-item>
          </div>
        </a-col>

        <template v-if="dropdownProviderLocations && dropdownProviderLocations.length > 0" class="">
          <a-col :span="12" v-for="(locations, index) in dropdownProviderLocations" :key="locations.id">
            <a-form-item :label="dropdownProviderLocations[index][0].subLocationLevel ? dropdownProviderLocations[index][0].subLocationLevel : dropdownProviderLocations[index][0].entityType" name="location" :rules="[{required: false, message:dropdownProviderLocations[index][0].subLocationLevel ? dropdownProviderLocations[index][0].subLocationLevel : dropdownProviderLocations[index][0].entityType+' '+$t('global.validation')}]">
              <select class="customSelect" v-model="staffProgramsForm.locations[index]" size="large" ref="select" placeholder="Location" @change="selectLocation($event, index);">
                <option v-for="location in locations" :key="location.id" :value="location">
                  {{ location.name }}
                </option>
              </select>
            </a-form-item>
          </a-col>
        </template>
                        
        <a-col :sm="12" :xs="24" :xl="12">
          <div class="form-group">
            <a-form-item :label="$t('careCoordinator.coordinatorsModal.program')" name="program" :rules="[{ required: false, message: $t('careCoordinator.coordinatorsModal.program')+' '+$t('global.validation') }]">
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="staffProgramsForm.programs" size="large" mode="multiple">
                <a-select-option v-for="program in programsDropdownList" :key="program.programId" :value="program.programId">{{ program.program }}</a-select-option>
              </a-select>
              <ErrorMessage v-if="errorMsg && !staffProgramsForm.programs" :name="errorMsg.program?errorMsg.program[0]:''" />
            </a-form-item>
          </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,14,'id','name'),'name','udid')"> </FormBaseComponents>                
        <a-col :span="24">
          <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  onMounted,
  reactive,
	ref,
} from 'vue-demi'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import { arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
export default defineComponent({
  components: {
    FormButtons: defineAsyncComponent(()=>import("@/components/common/button/FormButtons")),
    // ProvidersDropdown: defineAsyncComponent(()=>import("@/components/modals/search/ProvidersDropdown")),
    FormBaseComponents
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const disabledProvider = ref(false)

    const staffProgramsForm = reactive({
      providerId: "",
      locations: [],
      programs: [],
    })

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider
    })

    const locationPrograms = computed(() => {
      return store.state.provider.locationPrograms
    })

    const allLocationsList = computed(() => {
      return store.state.provider.parentLocations
    })

    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg;
    });

    const dropdownProviderLocations = computed(() => {
      return store.state.provider.dropdownProviderLocations
    })
    
    const programsDropdownList = ref(null)

    const getProviderPrograms = computed(() => {
      return store.state.provider.getProviderPrograms
    })

    const selectProvider = (selected) => {
      let provider = selected.target.selectedOptions[0]._value
     
      store.commit('dropdownProviderLocations', null)
      // staffProgramsForm.providerId = provider.id
      store.commit('loadingStatus', true)
      // if(selectedProvider.value.id) {
        store.commit('selectedProvider', {
          id: provider.id
        })
      // }
      store.dispatch('dropdownProviderLocations', provider.id).then(() => {
        store.commit('loadingStatus', false)
      })
      store.dispatch('getProviderPrograms', provider.id).then(() => {
        programsDropdownList.value = getProviderPrograms.value
      })
    }

    const selectLocation = (selected, index) => {
      let location = selected.target.selectedOptions[0]._value
      store.commit('loadingStatus', true)
      dropdownProviderLocations.value.splice(index+1, 100)
      store.dispatch('locationPrograms', {
        providerID: selectedProvider.value.id,
        locationID: location.id,
        entityType: location.entityType,
      }).then(() => {
        programsDropdownList.value = locationPrograms.value
        if(locationPrograms.value.length == 0) {
          store.commit('errorMsg', {
            program: {
              0: "Please add programs for the selected location"
            }
          })
        }
        else {
          store.commit('errorMsg', null)
        }
      })
      store.dispatch('dropdownSubLocations', {
        providerId: selectedProvider.value.id,
        locationId: location.id,
        entityType: location.entityType,
      }).then(() => {
        store.commit('selectedLocation', location)
        store.commit('loadingStatus', false)
      })
    }

    onMounted(() => {
      store.commit('dropdownProviderLocations', null)
      if(selectedProvider.value != null) {
        staffProgramsForm.providerId = selectedProvider.value.id
        disabledProvider.value = true
        // selectProvider(selectedProvider.value.id)
      }
    })

    const closeModal = () => {
      emit('closeModal', true)
    }

    const submitForm = () => {
      let data = {
        programs: staffProgramsForm.programs
      }
      store.dispatch('addStaffPrograms', {
        staffId: route.params.udid,
        data: data
      }).then(() => {
        store.dispatch('staffPrograms', {
          staffId: route.params.udid,
          page: ""
        })
      })
    }

    const handleGlobalChange = (data, type) => {
      if (type == "staffProgramsForm.level") {
        staffProgramsForm.level = data;
      }
    }

    const defaultProviderData = computed(() => {
      return store.state.provider.defaultProviderData
    })

    const staffProviders = computed(() => {
      return store.state.provider.staffProviders
    })

    return {
      staffProviders,
      defaultProviderData,
      staffProgramsForm,
      submitForm,
      allLocationsList,
      closeModal,
      errorMsg,
      handleGlobalChange,
      dropdownProviderLocations,
      selectProvider,
      programsDropdownList,
      selectLocation,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames,
      disabledProvider,
    }
  }
  
})
</script>