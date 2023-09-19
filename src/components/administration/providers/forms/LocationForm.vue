<template>
  <a-form :model="providerLocationForm" autocomplete="off" :scrollToFirstError="true" layout="vertical" @finish="submitForm">

    <a-row :gutter="24">
      <a-col span="24">
        <div class="form-group">
          <a-form-item name="country" :rules="[{ required: true, message: 'Country'+' '+$t('global.validation') }]">
            <GlobalCodeDropDown  v-model:value="providerLocationForm.country" :dataId="20" @handleGlobalChange="handleGlobalChange($event,'providerLocationForm.country')" @change="checkChangeInput()" :disabled="isCitySaved ? true : false" />
          </a-form-item>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="24">
        <div class="form-group">
          <a-form-item name="state" :rules="[{ required: true, message: 'State'+' '+$t('global.validation') }]">
            <GlobalCodeDropDown v-model:value="providerLocationForm.state" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'providerLocationForm.state')" @change="checkChangeInput()" :disabled="isCitySaved ? true : false" />
          </a-form-item>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="24" class="treeView innerLocation">
      
      <a-col :span="23">
        <div class="treeViewInner">
          <DownOutlined />
          <div class="form-group">
            <a-form-item name="city" :rules="[{ required: true, message: 'City'+' '+$t('global.validation') }]">
              <a-input v-model:value="providerLocationForm.city" placeholder="Enter City" size="large"  style="width:100%" :disabled="isCitySaved ? true : false" @change="checkChangeInput()" />
            </a-form-item>
          </div>
        </div>
      </a-col>

      <a-col :span="1">
        <span class="roundBtn" v-if="!isCitySaved">
          <a-tooltip placement="right" @click="submitForm('City', null); checkChangeInput()">
            <template #title>
              <span>{{$t('global.save')}}</span>
            </template>
            <a class="icons">
              <SaveOutlined />
            </a>
          </a-tooltip>
        </span>
        <span class="roundBtn" v-else>
          <a-tooltip placement="right" @click="addField('City', null); checkChangeInput()">
            <template #title>
              <span>{{$t('global.add')}}</span>
            </template>
            <a class="icons">
              <PlusCircleOutlined />
            </a>
          </a-tooltip>
        </span>
      </a-col>

      <a-col span="24">
        <a-row gutter="20" class="innerLocation" v-for="(location, index) in providerLocationForm.subLocations" :key="location.id">
          <a-col span="10">
            <div class="treeViewInner ">
              <DownOutlined />
              <div class="form-group">
                <a-form-item :name="['subLocations', index, 'subLocationLevel']" :rules="[{ required: true, message: 'Designation'+' '+$t('global.validation') }]" style="width:100%">
                  <GlobalCodeDropDown :listHeight="100" v-model:value="location.subLocationLevel" :dataId="80" @handleGlobalChange="handleGlobalChange($event, 'providerLocationForm.subLocations.subLocationLevel', location); checkChangeInput();" placeholder="Select Level" style="width:100%" :disabled="location.isSaved" />
                </a-form-item>
              </div>
            </div>
          </a-col>
          <a-col span="10">
            <div class="form-group">
              <a-form-item :name="['subLocations', index, 'subLocationName']" :rules="[{ required: true, message: 'Designation'+' '+$t('global.validation') }]">
                <a-input v-model:value="location.subLocationName" placeholder="Enter Name" size="large" style="width:100%" :disabled="location.isSaved" />
              </a-form-item>
            </div>
          </a-col>

          <a-col :span="4">
            <span class="roundBtn" v-if="!location.isSaved">
              <a-tooltip placement="right" @click="submitForm('subLocation', location)" >
                <template #title>
                  <span>{{$t('global.save')}}</span>
                </template>
                <a class="icons">
                  <SaveOutlined />
                </a>
              </a-tooltip>
            </span>
            <span class="roundBtn" v-else>
              <a-tooltip placement="right" @click="addField('subLocation', location)">
                <template #title>
                  <span>{{$t('global.add')}}</span>
                </template>
                <a class="icons">
                  <PlusCircleOutlined />
                </a>
              </a-tooltip>
            </span>
            <span class="roundBtn" v-if="providerLocationForm.subLocations.length > 1 && index > 0">
              <a-tooltip placement="right" @click="removeFields(location)" >
                <template #title>
                  <span>{{$t('global.delete')}}</span>
                </template>
                <a class="icons">
                  <DeleteOutlined  />
                </a>
              </a-tooltip>
            </span>
          </a-col>

        </a-row>
      </a-col>

    </a-row>

    <div class="steps-action" v-if="fromSummary">
      <a-form-item >
        <a-button type="primary" @click="saveData">{{$t('global.save')}}</a-button>
      </a-form-item>
    </div>

  </a-form>
</template>

<script>
import { computed, defineAsyncComponent, defineComponent, onMounted, reactive, ref } from "vue";
import {
  SaveOutlined,
  PlusCircleOutlined,
  DownOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    SaveOutlined,
    PlusCircleOutlined,
    DownOutlined,
    DeleteOutlined,
    GlobalCodeDropDown: defineAsyncComponent(()=>import("@/components/modals/search/GlobalCodeSearch.vue")),
  },
  props: {
    fromSummary: {
      type: Boolean
    },
    fromTable: {
      type: Boolean
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const providerID = ref(null)

    const providerLocationById = computed(() => {
      return store.state.provider.providerLocationById
    })

    const editSingleProvider = computed(() => {
      return store.state.provider.editSingleProvider
    })

    const updateSingleProvider = computed(() => {
      return store.state.provider.updateSingleProvider
    })

    const addProviderLocation = computed(() => {
      return store.state.provider.addProviderLocation
    })

    const addProviderSubLocation = computed(() => {
      return store.state.provider.addProviderSubLocation
    })

    const providerLocationsList = computed(() => {
      return store.state.provider.providerLocationsList
    })

    const providerLocationForm = reactive({
      country: "",
      state: "",
      city: "",
      subLocations: [],
    })

    // const formProviderLocation = reactive({ ...providerLocationForm })
    
    const providerData = computed(() => {
      return store.state.provider.providerData
    })

    onMounted(() => {
      if(!props.fromSummary) {
        if(editSingleProvider.value != null) {
          providerID.value = editSingleProvider.value.id;
          if(editSingleProvider.value.defaultLocation != null)  {
            isCitySaved.value = true
            Object.assign(providerLocationForm, {
              country: editSingleProvider.value.countryId,
              state: editSingleProvider.value.stateId,
              city: editSingleProvider.value.city,
            })
          }
        }
        else if(updateSingleProvider.value != null) {
          providerID.value = updateSingleProvider.value.id;
          if(updateSingleProvider.value.defaultLocation != null)  {
            isCitySaved.value = true
            Object.assign(providerLocationForm, {
              country: updateSingleProvider.value.countryId,
              state: updateSingleProvider.value.stateId,
              city: updateSingleProvider.value.city,
            })
          }
        }
        else if(providerData.value != null) {
          isCitySaved.value = true
          providerID.value = providerData.value.id;
          Object.assign(providerLocationForm, {
            country: providerData.value.countryId,
            state: providerData.value.stateId,
            city: providerData.value.city,
          })
        }
      }
      else {
        providerID.value = route.params.id
        if(!props.fromTable) {
          Object.assign(providerLocationForm, {
            country: editSingleProvider.value.countryId,
            state: editSingleProvider.value.stateId,
            city: editSingleProvider.value.city,
          })
        }
      }
    })

    const isCitySaved = ref(false)
    const entityTypeSaved = ref(null)
    const locationIdSaved = ref(null)

    const submitForm = (type, location) => {
      let index = providerLocationForm.subLocations.indexOf(location)
      if(type == 'City') {
        store.dispatch('addProviderLocation', {
          providerId: providerID.value,
          data: providerLocationForm,
        }).then(() => {
          isCitySaved.value = true
          store.dispatch('providerLocations', providerID.value)
        })
      }
      else {
        store.dispatch('addProviderSubLocation', {
          providerId: providerID.value,
          locationId: entityTypeSaved.value == 'subLocation' ? locationIdSaved.value : addProviderLocation.value?.cityId ? addProviderLocation.value.cityId : providerLocationsList.value[0].state[0].city[0].id,
          entityType: entityTypeSaved.value,
          data: location,
        }).then(() => {
          providerLocationForm.subLocations[index].isSaved = true
          providerLocationForm.subLocations[index].id = addProviderSubLocation.value ? addProviderSubLocation.value.id : ''
          store.dispatch('providerLocations', providerID.value)
        })
      }
    }

    const addField = (type, location) => {
      entityTypeSaved.value = type
      let index = providerLocationForm.subLocations.indexOf(location)
      if(type == 'City') {
        if(!props.fromSummary) {
          if(editSingleProvider.value != null)  {
            locationIdSaved.value = editSingleProvider.value.defaultLocation.id
          }
        }
        else {
          if(providerLocationById.value != null) {
            locationIdSaved.value = providerLocationById.value.defaultLocation.id
          }
          else if(addProviderLocation.value != null) {
            locationIdSaved.value = addProviderLocation.value.cityId
          }
        }
        providerLocationForm.subLocations.splice(index+1, 0, {
          subLocationLevel: '',
          subLocationName: '',
          subLocationParent: '',
          isSaved: false,
        })
      }
      else {
        locationIdSaved.value = location.id
        providerLocationForm.subLocations.splice(index+1, 0, {
          subLocationLevel: '',
          subLocationName: '',
          subLocationParent: location.id,
          isSaved: false,
        });
      }
    };

    const handleGlobalChange = (data, type, item) => {
      let index = providerLocationForm.subLocations.indexOf(item);
      if (type == "providerLocationForm.subLocations.subLocationLevel") {
        providerLocationForm.subLocations[index].subLocationLevel = data;
      }
      if (type == "providerLocationForm.country") {
        providerLocationForm.country = data;
      }
      if (type == "providerLocationForm.state") {
        providerLocationForm.state = data;
      }
    }

    const removeFields = item => {
      let index = providerLocationForm.subLocations.indexOf(item);

      if (index !== -1) {
        providerLocationForm.subLocations.splice(index, 1);
      }
    };

    const saveData = () => {
      if(!props.fromSummary) {
        emit('closeLocationModal')
      }
      else {
        store.commit("checkChangeInput", false);
        emit('closeLocationModal')
      }
    }

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    return {
      addField,
      removeFields,
      providerLocationForm,
      submitForm,
      handleGlobalChange,
      addProviderLocation,
      editSingleProvider,
      isCitySaved,
      saveData,
      checkChangeInput,
    };
  },
});
</script>

<style>

.roundBtn .anticon {
  font-size: 25px;
  margin-right: 10px;
  height: 40px;
  color: #1D8FFB;
  position: relative;
  top: 8px !important;
}
.roundBtn .anticon-delete {
  color: #dc3545;
}
</style>