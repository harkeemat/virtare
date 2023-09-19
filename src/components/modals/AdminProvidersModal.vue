<template>
  <a-modal :title="title" width="80%" v-model:visible="visible" :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-row :gutter="24">
      <!-- <a-col :sm="24" :xs="24">
        <div class="common-btn mb-24" ref="customScrollTop" style="float:left">
          <a-button type="primary" @click="bitrixSearch" >
            Bitrix Lookup
          </a-button>
        </div>
      </a-col> -->
      <a-col :span="24">
        <a-steps v-model:current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>

        <div class="steps-content" v-if="steps[current].title == 'Providers'">
          <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,27,'id','name'),'name','udid')" :model="providerForm" autocomplete="off" :scrollToFirstError="true" layout="vertical" @finish="submitProviderForm">
            <a-row :gutter="24">
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('providers.providerName')" name="name" :rules="[{ required: true, message: $t('providers.providerName')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerForm.name" size="large" @change="checkChangeInput()" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('providers.providerAddress')" name="address" :rules="[{ required: true, message: $t('providers.providerAddress')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerForm.address" size="large" @change="checkChangeInput()" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('global.country')" name="countryId" :rules="[{ required: true, message: $t('global.country')+' '+$t('global.validation') }]">
                    <GlobalCodeDropDown  v-model:value="providerForm.countryId" :dataId="20" @handleGlobalChange="handleGlobalChange($event,'providerForm.countryId')" @change="checkChangeInput()" :disabled="isEditProvider" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.country?errorMsg.country[0]:''" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('global.state')" name="stateId" :rules="[{ required: true, message: $t('global.state')+' '+$t('global.validation') }]">
                    <GlobalCodeDropDown v-model:value="providerForm.stateId" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'providerForm.stateId')" @change="checkChangeInput()" :disabled="isEditProvider" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.state?errorMsg.state[0]:''" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('providers.city')" name="city" :rules="[{ required: true, message: $t('providers.city')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerForm.city" size="large" @change="checkChangeInput()" :disabled="isEditProvider" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('providers.zipcode')" name="zipcode" :rules="[{ required: true, message:$t('global.validValidation')+' '+ $t('global.zipcode').toLowerCase(),pattern: regex.zipCode }]">
                    <a-input v-model:value="providerForm.zipcode" size="large" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.zipCode?errorMsg.zipCode[0]:''" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('providers.domain')" name="domain" :rules="[{ required: true, message:$t('global.validDomainValidation'), pattern: regex.domainName  }]">
                    <a-input v-model:value="providerForm.domain" placeholder="" size="large" @change="checkChangeInput()" :disabled="isProviderEdit ? true : false" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.domain ? errorMsg.domain[0] : ''" />
                  </a-form-item>
                </div>
              </a-col>
              <a-col :md="8" :sm="24">
                  <div class="form-group">
                      <a-form-item :label="$t('providers.phoneNumber')" name="phoneNumber" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                          <a-input v-maska="'###-###-####'" max="12" @change="checkChangeInput()"  v-model:value="providerForm.phoneNumber" placeholder="Please enter 10 digit number" size="large"  style="width: 100%" />
                          <!-- <PhoneNumber @change="checkChangeInput()" v-model:value.trim="providerForm.phoneNumber" @setPhoneNumber="setPhoneNumberProviderForm"/> -->
                          <ErrorMessage v-if="errorMsg" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
                      </a-form-item>
                  </div>
              </a-col>
              <a-col :md="8" :sm="24">
                  <div class="form-group">
                      <a-form-item :label="$t('providers.tags')" name="tagId" :rules="[{ required: true, message: $t('providers.tags')+' '+$t('global.validation') }]">
                          <GlobalCodeDropDown v-model:value="providerForm.tagId" mode="tags" :dataId="12" @handleGlobalChange="handleGlobalChange($event,'providerForm.tagId')" @change="checkChangeInput()" />
                      </a-form-item>
                  </div>
              </a-col>
              <a-col :md="8" :sm="24">
                  <div class="form-group">
                      <a-form-item :label="$t('providers.modules')" name="moduleId" :rules="[{ required: true, message: $t('providers.modules')+' '+$t('global.validation') }]">
                          <!-- <GlobalCodeDropDown :listHeight="100" v-model:value="providerForm.moduleId" mode="multiple"  :dataId="48" @handleGlobalChange="handleGlobalChange($event,'providerForm.moduleId')" @change="checkChangeInput()" /> -->
                          <a-select placeholder="Please Select" :getPopupContainer="triggerNode => triggerNode.parentNode" ref="select" mode="multiple" v-model:value="providerForm.moduleId" style="width: 100%" size="large" @change="checkChangeInput()">
                            <a-select-option value="" hidden>{{'Select Module(s)'}}</a-select-option>
                            <a-select-option v-for="roleModule in rolesAndPermissions" :key="roleModule.id" :value="roleModule.id">{{ roleModule.name }}</a-select-option>
                          </a-select>
                          <ErrorMessage v-if="errorMsg" :name="errorMsg.moduleId ? errorMsg.moduleId[0] : ''" />
                      </a-form-item>
                  </div>
              </a-col>
              <a-col :md="8" :sm="24">
                  <div class="form-group">
                      <a-form-item :label="$t('providers.programs')" name="programs" :rules="[{ required: true, message: $t('providers.programs')+' '+$t('global.validation') }]">
                          <a-select placeholder="Please Select" :getPopupContainer="triggerNode => triggerNode.parentNode" ref="select" mode="multiple" v-model:value="providerForm.programs" style="width: 100%" size="large" @change="checkChangeInput()">
                            <a-select-option value="" hidden>{{'Select Program(s)'}}</a-select-option>
                            <a-select-option v-for="program in activeProgramsList" :key="program.udid" :value="program.udid">{{ program.name }}</a-select-option>
                          </a-select>
                          <ErrorMessage v-if="errorMsg" :name="errorMsg.programs ? errorMsg.programs[0] : ''" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :md="8" :sm="24">
                <div class="form-group">
                  <a-form-item :label="$t('providers.totalLocations')" name="totalLocations" :rules="[{ required: true, message: $t('providers.totalLocations')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerForm.totalLocations" size="large" @change="checkChangeInput()" />
                  </a-form-item>
                </div>
              </a-col>
              
              <a-col :md="8" :sm="24">
                  <div class="form-group">
                      <label>Active/Inactive</label>
                      <a-switch v-model:checked="providerForm.isActive" @change="UpdateStatus($event)" />
                  </div>
              </a-col>
              <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,27,'id','name'),'name','udid')"> </FormBaseComponents>

              <a-col :span="24">
                  <div class="steps-action">
                      <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                      <a-button v-if="current < steps?.length - 1" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
                      <a-button v-if="current == steps?.length - 1" type="primary" @click="$message.success('Processing complete!')">
                          {{$t('global.done')}}
                      </a-button>
                  </div>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="steps-content" v-if="steps[current].title == 'Contact Person'">
          <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,28,'id','name'),'name','udid')" :model="providerContactForm" autocomplete="off" :scrollToFirstError="true" layout="vertical" @finish="submitProviderContactForm">

            <a-row :gutter="24">

              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="form-group">
                  <a-form-item :label="$t('providers.firstName')" name="firstName" :rules="[{ required: true, message: $t('providers.firstName')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerContactForm.firstName" size="large" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.firstName ? errorMsg.firstName[0] : ''" />
                  </a-form-item>
                </div>
              </a-col>

              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="form-group">
                  <a-form-item :label="$t('providers.middleName')" name="middleName" :rules="[{ required: false, message: $t('providers.middleName')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerContactForm.middleName" size="large" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.middleName ? errorMsg.middleName[0] : ''" />
                  </a-form-item>
                </div>
              </a-col>

              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="form-group">
                  <a-form-item :label="$t('providers.lastName')" name="lastName" :rules="[{ required: true, message: $t('providers.lastName')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerContactForm.lastName" size="large" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.lastName ? errorMsg.lastName[0] : ''" />
                  </a-form-item>
                </div>
              </a-col>

              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="form-group">
                  <a-form-item :label="$t('providers.email')" name="email" :rules="[{ required: true, message: $t('providers.email')+' '+$t('global.validation')  }]">
                    <a-input v-model:value="providerContactForm.email" size="large" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.email ? errorMsg.email[0] : ''" />
                  </a-form-item>
                </div>
              </a-col>

              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="form-group">
                  <a-form-item :label="$t('providers.phoneNumber')" name="phoneNumber" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                    <a-input v-maska="'###-###-####'" max="12" @change="checkChangeInput()"  v-model:value="providerContactForm.phoneNumber" placeholder="Please enter 10 digit number" size="large"  style="width: 100%" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
                  </a-form-item>
                </div>
              </a-col>

              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <div class="form-group">
                  <a-form-item :label="$t('providers.genderId')" name="genderId" :rules="[{ required: true, message: $t('providers.genderId')+' '+$t('global.validation')  }]">
                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="providerContactForm.genderId" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'providerContactForm.genderId')" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.genderId ? errorMsg.genderId[0] : ''" />
                  </a-form-item>
                </div>
              </a-col>
              <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,28,'id','name'),'name','udid')"> </FormBaseComponents>

              <a-col :span="24">
                <div class="steps-action">
                  <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                  <a-button v-if="current < steps?.length - 1" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
                  <a-button v-if="current == steps?.length - 1" type="primary" html-type="submit" @click="$message.success('Processing complete!')">
                    {{$t('global.done')}}
                  </a-button>
                </div>
              </a-col>

            </a-row>
          </a-form>
        </div>

        <div class="steps-content addLocations" v-if="steps[current].title == 'Locations'">
          <LocationForm :fromSummary="false" />

          <!-- <div>
            <ProviderLocationsTable :isList="false" @isEdit="showProviderLocation($event)" :providerID="providerID" />
          </div> -->

          <div class="steps-action">
            <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
            <a-button v-if="current < steps?.length - 1" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
            <a-button :disabled="providerLocations == null" v-if="current == steps?.length - 1" type="primary" html-type="submit" @click="closeModal">
              {{$t('global.done')}}
            </a-button>
          </div>

        </div>
      </a-col>
    </a-row>
    <Loader/>
    <BitrixSearch v-if="bitrixVisible" v-model:visible="bitrixVisible" />
  </a-modal>
</template>
<script>
import { ref, computed,onMounted, reactive, watchEffect,defineAsyncComponent } from "vue";
import { useStore } from "vuex";
import Loader from "@/components/loader/Loader";
import {
  warningSwal,
  successSwal,
  arrayToObjact,
  errorSwal,
  arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import { 
  // DeleteOutlined,
  // EditOutlined
} from "@ant-design/icons-vue";
import { regex } from "@/RegularExpressions/regex";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
// import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
// // import FormButtons from "@/components/common/button/FormButtons"
import ErrorMessage from "@/components/common/messages/ErrorMessage"
import { useRoute } from 'vue-router';
// import ProviderLocationsTable from "@/components/administration/providers/providerLocations/tables/ProviderLocationsTable";
// import RoleForm from ".././modals/forms/Roles";
// import RoleTable from ".././care-coordinator/tables/RoleTable";
import LocationForm from "@/components/administration/providers/forms/LocationForm";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  components: {
    // DeleteOutlined,
    // EditOutlined,
    Loader,
    GlobalCodeDropDown,
    // PhoneNumber,
    BitrixSearch:defineAsyncComponent(() =>
      import("@/components/escalations/BitrixSearch.vue")
    ),
    // FormButtons,
    ErrorMessage,
    FormBaseComponents,
    // ProviderLocationsTable,
    // RoleForm,
    // RoleTable,
    // PhoneNumber
    LocationForm,
  },
  props: {
    isAdd: {
      type: Boolean,
    },
    providerId: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    // const current = ref(0)
    const visible = ref(true)
    const store = useStore()
    const route = useRoute()
    const clearLocationForm =ref()
    const title = props.isAdd ? "Edit Providers" : "Add Providers";
    const isProviderEdit = props.isAdd ? true : false;

    const providersData = computed(() => {
      return store.state.provider;
    })

    const editSingleProvider = computed(() => {
      return store.state.provider.editSingleProvider;
    })
    
    const providerID = ref(null)
    const bitrixVisible = ref(false)
    const showParent = ref(false)
    const contactId = ref(null)

    const providerForm = reactive({
      name: "",
      address: "",
      countryId: 19,
      stateId: "",
      city: "",
      domain: "",
      zipcode: "",
      phoneNumber: "",
      tagId: ref([]),
      moduleId: ref([]),
      programs: [],
      isActive: true,
      totalLocations: "",
    });

    const form = reactive({ ...providerForm })
    const rolesAndPermissions = computed(() => {
      return store.state.rolesAndPermissions.rolesAndPermissions
    })
    
    const isEditProvider = computed(() => {
      return store.state.provider.isEditProvider
    })
    
    onMounted(() => {
      store.commit('providerContact', null)
      if(route.name != "providerSummary") {
        store.commit('editSingleProvider', null)
      }
      store.dispatch("roles");
      store.dispatch("rolePermissions");
      if(props.providerId != null) {
        providerID.value = props.providerId
      }
      if(editSingleProvider.value != null) {
        providerID.value = editSingleProvider.value.id
      }
      store.commit('addProviderContact', null)
      store.commit('errorMsg', null)
      if(providerID.value != null) {
        store.dispatch('providerLocations', providerID.value)
        store.dispatch('providerContact', providerID.value).then(() => {
          Object.assign(providerContactForm, providerContact.value)
        })
      }
    })
    
    const providerContact = computed(() => {
      return store.state.provider.providerContact
    })
    
    const providerLocations = computed(() => {
      return store.state.provider.providerLocationsList
    })
    
    const parentLocations = computed(() => {
      return store.state.provider.parentLocations
    })
    
    const providerLocationById = computed(() => {
      return store.state.provider.providerLocationById
    })
    
    const roles = computed(() => {
      return store.state.careCoordinator.roles
    })

    const providerContactForm = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      genderId: "",
      websiteUrl: "",
      isActive: 1,
      noOfLocations:''
    });

    const providerLocationForm = reactive({
      location: "",
      level: "",
      parent: "",
    })

    const addProviderContact = computed(() => {
      return store.state.provider.addProviderContact;
    })

    const providerData = computed(() => {
      return store.state.provider.providerData;
    })

    /* const addStaffRole = computed(() => {
      return store.state.careCoordinator.addStaffRole;
    }) */
    
    const stepValue = ref(0)
    const current = computed({
      get: () => store.state.provider.counter,
      set: (value) => {
      stepValue.value = value
      store.commit("checkChangeInput", false);
      if(editSingleProvider.value == null) {
          if(value == 1) {
            if (providersData.value.provider != null || providersData.value.updateSingleProvider != null) {
              store.state.provider.counter = value;
            }
            else {
              if (Object.values(providerForm).filter((item) => item != "").length >= 9 ) {
                submitProviderForm();
              } else {
                errorSwal(messages.fieldsRequired);
                store.state.provider.counter = current.value;
              }
            }
          }
          else if(value == 2) {
            if (addProviderContact.value != null) {
              store.state.provider.counter = value;
            }
            else {
              if (Object.values(providerContactForm).filter((item) => item != "").length >= 4 ) {
                submitProviderContactForm();
              } else {
                errorSwal(messages.fieldsRequired);
                store.state.provider.counter = current.value;
              }
            }
          }
          // else if(value == 3) {
          //   if(addStaffRole.value) {
          //     store.state.provider.counter = value;
          //   }
          //   else {
          //     errorSwal(messages.fieldsRequired);
          //     store.state.provider.counter = value-1;
          //   }
          // }
          else {
            store.state.provider.counter = value;
          }
        }
        else {
          store.state.provider.counter = value
        }
      },
    });

    function UpdateStatus(event) {
      providerForm.isActive = event;
    }
    
    const submitProviderForm = () => {
      providerForm.phoneNumber = providerForm.phoneNumber.replace(/-/g,'')
      if (providersData.value.provider == null && !providerID.value) {
        store.dispatch("addProvider", providerForm).then(() => {
          store.dispatch('addProviderLocation', {
            providerId: providersData.value.provider.id,
            data: {
              isDefault: 1,
              country: providerForm.countryId,
              state: providerForm.stateId,
              city: providerForm.city,
            },
          })
          store.state.provider.providersListAll = "";
          store.dispatch("providersListAll");
        })
      }
      else {
        store.dispatch("updateSingleProvider", {
          data:providerForm,
          id: providerID.value,
        }).then(() => {
          store.dispatch('updateProviderLocation', {
            providerId: providerID.value,
            locationId: providerData.value?.defaultLocation.id,
            data: {
              isDefault: 1,
              country: providerForm.countryId,
              state: providerForm.stateId,
              city: providerForm.city,
            },
          })
          store.state.provider.providersListAll = "";
          store.dispatch("providersListAll");
          store.dispatch("editSingleProvider", providerID.value);
        })
      }
    };

    const submitProviderContactForm = () => {
      let adminRoles = []
      roles.value.map(role => {
        if(role.name == 'Provider Admin') {
          adminRoles.push(role.udid)
        }
      })
      
      providerContactForm.phoneNumber = providerContactForm.phoneNumber.replace(/-/g,'')
      if (addProviderContact.value != null) {
        store.dispatch("updateProviderContact", {
          providerId: providerID.value,
          data: providerContactForm,
          contactId: addProviderContact.value.id,
        }).then(() => {
          contactId.value = addProviderContact.value.id
          store.commit('checkChangeInput', false)
          emit("closeModal");
          // emit("closeModal");
        })
      }
      if(providerContact.value != null) {
        store.dispatch("updateProviderContact", {
          providerId: providerID.value,
          data: providerContactForm,
          contactId: providerContact.value.id,
        }).then(() => {
          contactId.value = providerContact.value.id
          store.commit('checkChangeInput', false)
          emit("closeModal");
          // emit("closeModal");
        })
      }
      else {
        store.dispatch("addProviderContact", {
          providerId: providerID.value,
          data: providerContactForm
        }).then(() => {
          store.dispatch("addStaffRole", {
            id: addProviderContact.value.id,
            data: {
              roles: adminRoles
            },
          }).then(() => {
              store.commit('checkChangeInput', false)
            })
          // emit("closeModal");
        })
      }
    }

    const providerLocationlistData = computed(() => {
      return store.state.provider.providerLocationList;
    })

    

    const columns = computed(() => {
      return store.state.provider.columns;
    })

    const editProviderLocationData = computed(() => {
      return store.state.provider.editProviderLocation;
    })

    const next = () => {
      store.commit("providerCounterPlus");
    };

    const prev = () => {
      store.commit("providerCounterMinus");
    };

    const globalCode = computed(() => {
      return store.state.common;
    });

    const providers = store.getters.providersRecords.value;

    const providerTags = computed(() => {
      return store.state.common.documentTags;
    });

    const providerModules = computed(() => {
      return store.state.common.modules;
    });

    const formProviderLocation = reactive({
      ...providerLocationForm,
    });

    function saveModal() {
      successSwal(messages.formSuccess);
      Object.assign(providerForm, form);
      // store.commit("providerResetCounter");
      emit("closeModal");
      store.commit('editProviderLocation', null)
      store.commit("checkChangeInput", false);
      providersData.value.provider=null
    }

    function checkChangeInput(text, level) {
      if(text == 'level') {
        let parentLevel = null
        let levelText = null
        switch (level) {
          case 359:
            levelText = "City"
            break;
          case 360:
            parentLevel = "City"
            levelText = "Street"
            break;
          case 361:
            parentLevel = "Street"
            levelText = "Building"
            break;
          case 362:
            parentLevel = "Building"
            levelText = "Floor"
            break;
          case 363:
            parentLevel = "Floor"
            levelText = "Department"
            break;
          case 364:
            parentLevel = "Department"
            levelText = "Room"
            break;
          default:
            break;
        }
        if(levelText != 'City') {
          store.dispatch('parentLocations', {
            providerId: providerID.value,
            level: parentLevel
          }).then(() => {
            showParent.value = true
          })
        }
        else {
          showParent.value = false
        }
      }
      // store.commit('parentLocations', null)
      store.commit("checkChangeInput", true);
    }

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    function closeModal() {
      emit("closeModal", stepValue.value)
    }
    onMounted(()=>{
      store.state.provider.counter = 0
      store.state.provider.providerLocationList = null
    })
    watchEffect(() => {
      //store.state.provider.counter = 0;
      store.dispatch('activeProgramsList')
      if(providersData.value.provider != null) {
        providerID.value = providersData.value.provider.id
      }
      if (providerID.value != null) {
        if (editSingleProvider.value) {
          store.commit("loadingStatus", true);
          Object.assign(providerForm, editSingleProvider.value);
          Object.assign(providerLocationForm, editProviderLocationData.value);
          providerLocationForm.numberOfLocations = editProviderLocationData.value?.noOfLocations
          store.dispatch("providerLocationList", providerID.value);
          setTimeout(() => {
            store.commit("loadingStatus", false);
          }, 2000);
        }
      }
    });

    const handleGlobalChange = (data, type) => {
      if (type == "providerForm.countryId") {
        providerForm.countryId = data;
      }
      if (type == "providerForm.stateId") {
        providerForm.stateId = data;
      }
      if (type == "providerForm.tagId") {
        providerForm.tagId = data;
      }
      if (type == "providerForm.moduleId") {
        providerForm.moduleId = data;
      }
      if (type == "providerContactForm.genderId") {
        providerContactForm.genderId = data;
      }
      // if (type == "providerLocationForm.level") {
      //   providerLocationForm.level = data;
      // }
    };

    const activeProgramsList = computed(() => {
      return store.state.programs.activeProgramsList
    })
    
    const submitProviderLocationForm = () => {
      if(isEditLocation.value) {
        store.dispatch('updateProviderLocation', {
          providerId: providerID.value,
          locationId: providerLocationId.value,
          data: providerLocationForm,
        }).then(() => {
          store.dispatch('providerLocations', providerID.value)
          emit("closeModal");
          showParent.value = false
          Object.assign(providerLocationForm, formProviderLocation)
          providerLocationId.value = null;
        })
      }
      else {
        store.dispatch('addProviderLocation', {
          providerId: providerID.value,
          data: providerLocationForm,
        }).then(() => {
          store.dispatch('providerLocations', providerID.value)
          emit("closeModal");
          showParent.value = false
          Object.assign(providerLocationForm, formProviderLocation)
          providerLocationId.value = null;
        }) 
      }
      store.commit("isEditProvider", false);
    }

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
    
    const providerLocationId = ref(null)
    const isEditLocation = ref(false)
    const showProviderLocation = (locationId) => {
      providerLocationId.value = locationId
      store.dispatch('providerLocationById', {
        providerId: providerID.value,
        locationId: locationId,
      }).then(() => {
        isEditLocation.value = true
        Object.assign(providerLocationForm, {
          location: providerLocationById.value.locationName,
          level: providerLocationById.value.level,
          parent: providerLocationById.value.parentName,
        })
        if(providerLocationById.value.parent != "" && providerLocationById.value.parent != null) {
          showParent.value = true
        }
        else {
          showParent.value = false
        }
      })
    }
    
    const deleteProviderLocation = (locationId) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store.dispatch("deleteProviderLocation", {
            providerID: providerID.value,
            locationID: locationId,
          }).then(() => {
            store.dispatch('providerLocations', providerID.value)
            store.dispatch('providerLocationById', {
              providerId: providerID.value,
              locationId: locationId,
            })
          })
        }
      })
    }

    const errorMsg = computed(() => {
      return store.state.provider.errorMsg;
    });

    const bitrixSearch = ()=>{
      bitrixVisible.value = true
    }
    
    return {
      bitrixSearch,
      bitrixVisible,
      // isEditLocation,
      // editProviderLocation,
      showProviderLocation,
      deleteProviderLocation,
      activeProgramsList,
      handleGlobalChange,
      clearLocationForm,
      editProviderLocationData,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      // setPhoneNumberProviderForm,
      // setPhoneNumberProviderLocationForm,
      checkChangeInput,
      checkFieldsData,
      UpdateStatus,
      regex,
      current,
      visible,
      providerForm,
      editSingleProvider,
      providerLocationForm,
      submitProviderForm,
      next,
      prev,
      saveModal,
      closeModal,
      props,
      title,
      emit,
      columns,
      providers,
      globalCode,
      providerTags,
      providerModules,
      providerLocationlistData,
      submitProviderLocationForm,
      showParent,
      providerLocationsColumns,
      providerLocations,
      parentLocations,
      errorMsg,
      steps: !isEditProvider.value ? [
        {
          title: "Providers",
          content: "First-content",
        },
        {
          title: "Contact Person",
          content: "Second-content",
        },
        {
          title: "Locations",
          content: "Last-content",
        },
      ] :
      [
        {
          title: "Providers",
          content: "First-content",
        },
        {
          title: "Contact Person",
          content: "Second-content",
        },
      ],
      providerID,
      bindProps: store.state.common.bindProps,
      providerContactForm,
      submitProviderContactForm,
      contactId,
      isProviderEdit,
      rolesAndPermissions,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
      isEditProvider,
    };
  },
};
</script>

<style scoped>
.steps-content {
  margin-top: 16px;
  border-radius: 6px;
  min-height: 200px;
  text-align: left;
  padding: 12px 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.steps-action {
  text-align: right;
}
</style>