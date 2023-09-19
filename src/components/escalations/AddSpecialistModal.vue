<template>
  <a-modal max-width="1140px" width="100%" :title="$t('specialists.addSpecialist')" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
      <a-row :gutter="24">
          <a-col :span="24">
              <a-form :model="personalInfoData" :scrollToFirstError="true" ref="formRef" class="basic" name="basic" autocomplete="off" layout="vertical" @finish="personalInfo" @finishFailed="onFinishFailed">
                  <!-- <PersonalInformation /> -->
                  <a-row :gutter="24">
                      <a-col :sm="12" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: true, message: $t('global.firstName')+' '+$t('global.validation') }]">
  
                                  <a-input v-model:value.trim="personalInfoData.firstName" class="firstName" @change="checkChangeInput()" size="large" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.firstName" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <a-col :sm="12" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.middleName')" name="middleName">
                                  <a-input v-model:value.trim="personalInfoData.middleName" class="middleName" @change="checkChangeInput()" size="large" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.middleName" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <a-col :sm="12" :xs="12" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: true, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                  <a-input v-model:value.trim="personalInfoData.lastName" @change="checkChangeInput()" size="large" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.lastName" :name="errorMsg.lastName?errorMsg.lastName[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <!--<a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
                              <div class="form-group">
                                  <a-form-item name="designationId" :label="$t('global.designation')" :rules="[{ required: true, message: $t('global.designation')+' '+$t('global.validation') }]">
                                      <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.designationId" :dataId="17" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.designationId')" />
                                      <ErrorMessage v-if="errorMsg && !personalInfoData.designationId" :name="errorMsg.designationId?errorMsg.designationId[0]:''" />
                                  </a-form-item>
                              </div>
  
                          </a-col>-->
                      <a-col :sm="12" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item name="genderId" :label="$t('global.gender')" :rules="[{ required: true, message: $t('global.gender')+' '+$t('global.validation') }]">
                                  <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.genderId" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.genderId')" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.genderId" :name="errorMsg.genderId?errorMsg.genderId[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <a-col :sm="12" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(),type: 'email' }]">
                                  <a-input v-model:value.trim="personalInfoData.email" size="large" placeholder="test@test.com" @blur="emailChange()" @change="checkChangeInput()" />
                                  <ErrorMessage v-if="errorMsg" :name="errorMsg.email?errorMsg.email[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <a-col :sm="8" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                                  <a-input v-maska="'###-###-####'" max="12" @change="checkChangeInput()" v-model:value="personalInfoData.phoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.phoneNumber" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <!--<a-col v-if="staffType == 342" :sm="4" :xs="24" :xl="8">
                              <div class="form-group">
                                  <a-form-item label="Extension" name="extension" :rules="[{ required: true, message: $t('global.validValidation')+' '+'Extension'.toLowerCase(),pattern:regex.extension}]">
                                      <a-input  @change="checkChangeInput()"  v-model:value="personalInfoData.extension" placeholder="Enter 4 digit number" size="large" maxlength="4"  style="width: 100%" />
                                      <ErrorMessage v-if="errorMsg && !personalInfoData.extension" :name="errorMsg.extension?errorMsg.extension[0]:''" />
                                  </a-form-item>
                              </div>
                          </a-col>-->
                      <a-col :sm="12" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.specialization')" name="specializationId" :rules="[{ required: true, message: $t('global.specialization')+' '+$t('global.validation') }]">
                                  <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.specializationId" :dataId="2" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.specializationId')" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.specializationId" :name="errorMsg.specializationId?errorMsg.specializationId[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
                      <a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.network')" name="networkId" :rules="[{ required: true, message: $t('global.network')+' '+$t('global.validation') }]">
                                  <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.networkId" :dataId="10" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.networkId')" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.networkId" :name="errorMsg.networkId?errorMsg.networkId[0]:''" />
                              </a-form-item>
                          </div>
                      </a-col>
  
                      <a-col :span="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.provider')" name="provider" :rules="[{ required: true, message: $t('global.provider')+' '+$t('global.validation') }]">
                                  <ProvidersDropdown mode="multiple" v-model:value="personalInfoData.providers" placeholder="Search Provider" @handleProviderChange="handleProviderChange($event)" :fromStaff="true" />
                                  <!-- <ProvidersDropdown mode="multiple" :defaultProviderData="defaultProviderData" v-model:value="personalInfoData.providerId" @handleProviderChange="selectProvider($event)" placeholder="Search Location" /> -->
                              </a-form-item>
                          </div>
                      </a-col>
  
                      <a-col :span="8">
                          <div class="form-group">
                              <a-form-item :label="$t('global.defaultProvider')" name="defaultProvider" :rules="[{ required: true, message: $t('global.defaultProvider')+' '+$t('global.validation') }]">
                                  <select class="customSelect" v-model="personalInfoData.defaultProvider" size="large" ref="select">
                                      <option hidden value="">Select Default Provider</option>
                                      <option v-for="provider in addedProviders" :key="provider.value" :value="provider.value">
                                          {{ provider.label }}
                                      </option>
                                  </select>
                              </a-form-item>
                          </div>
                      </a-col>
  
                      <a-col v-if="staffType == 343" :sm="4" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item label="Organisation" name="organisation" :rules="[{ required: true, message: 'Organisation '+$t('global.validation') }]">
                                  <a-input @change="checkChangeInput()" v-model:value="personalInfoData.organisation" size="large" style="width: 100%" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.organisation" :name="errorMsg.organisation ? errorMsg.organisation[0] : ''" />
                              </a-form-item>
                          </div>
                      </a-col>
  
                      <a-col v-if="staffType == 343" :sm="4" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item label="Location" name="location" :rules="[{ required: false, message: 'Location '+$t('global.validation') }]">
                                  <a-input @change="checkChangeInput()" v-model:value="personalInfoData.location" size="large" style="width: 100%" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.location" :name="errorMsg.location ? errorMsg.location[0] : ''" />
                              </a-form-item>
                          </div>
                      </a-col>
  
                      <a-col v-if="staffType == 343" :sm="4" :xs="24" :xl="8">
                          <div class="form-group">
                              <a-form-item label="Building" name="building" :rules="[{ required: false, message: 'Building '+$t('global.validation') }]">
                                  <a-input @change="checkChangeInput()" v-model:value="personalInfoData.building" size="large" style="width: 100%" />
                                  <ErrorMessage v-if="errorMsg && !personalInfoData.building" :name="errorMsg.building ? errorMsg.building[0] : ''" />
                              </a-form-item>
                          </div>
                      </a-col>
                  </a-row>
  
                  <div class="steps-action personalInformation">
                      <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
                  </div>
              </a-form>
          </a-col>
      </a-row>
  </a-modal>
</template>

<script>
import { reactive, computed, onUnmounted, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { regex } from "@/RegularExpressions/regex";
import {
  //   successSwal,
  warningSwal,
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import FormButtons from "@/components/common/button/FormButtons";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import ProvidersDropdown from "@/components/modals/search/ProvidersDropdown"
export default {
  components: {
    GlobalCodeDropDown,
    FormButtons,
    ErrorMessage,
    ProvidersDropdown//: defineAsyncComponent(()=>import("@/components/modals/search/ProvidersDropdown")),
  },
  props: {
    staffType: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const phone = ref();
    const formRef = ref();

    const personalInfoData = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      // designationId: "",
      genderId: "",
      email: "",
      phoneNumber: "",
      specializationId: "",
      providers: [],
      defaultProvider: "",
      networkId: "",
      roleId: "",
      // extension: "",
      type: props.staffType,
      organisation: "",
      location: "",
      building: "",
    });

    const setPhoneNumber = (value) => {
      personalInfoData.phoneNumber = value;
    };

    const personalInfo = () => {
      personalInfoData.phoneNumber = personalInfoData.phoneNumber.replace(
        /-/g,
        ""
      );
      store.dispatch("addStaff", personalInfoData).then((response) => {
        if (response == true) {
          //   store.dispatch("specialists")
          formRef.value.resetFields();
          emit("assignToPatient");
          emit("closeSpecialistModal", false);
          store.dispatch("specialists")
          Object.assign(personalInfoData, form);
          store.commit("checkChangeInput", false);
        }
      });
    };

    const onFinishFailed = () => {
    
    };

    const handleChange = () => {};

    const addStaff = computed(() => {
      return store.state.careCoordinator.addStaff;
    });

    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg;
    });

    const addedProviders = computed(() => {
        return store.state.provider.addedProviders
    })

    function emailChange() {
      errorMsg.value.email ? (errorMsg.value.email[0] = null) : "";
    }

    const form = reactive({
      ...personalInfoData,
    });

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    function closeModal() {
      emit("saveModal", true);
      emit("closeModal");
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("saveModal", false);
            emit("closeModal");
            emit("closeSpecialistModal");
            store.state.careCoordinator.errorMsg = "";
            Object.assign(personalInfoData, form);
            store.dispatch("staffs");
            store.dispatch("specializationStaff");
            store.dispatch("networkStaff");
            store.commit("resetCounter");
            store.commit("checkChangeInput", false);
            store.state.careCoordinator.addStaff = null;
            formRef.value.resetFields();
          } else {
            emit("saveModal", true);
            emit("closeModal");
          }
        });
      } else {
        store.state.careCoordinator.addStaff = null;
        Object.assign(personalInfoData, form);
        store.commit("resetCounter");
        store.state.careCoordinator.errorMsg = "";
        emit("saveModal", false);
        emit("closeModal");
        emit("closeSpecialistModal");
        formRef.value.resetFields();
      }
    }
    onMounted(() => {
      store.state.careCoordinator.documentStaffDetails = null;
      if (props.staffType == 343) {
        personalInfoData.networkId = 5;
      }
    });
    onUnmounted(() => {
      store.commit("errorMsg", null);
      store.state.careCoordinator.addStaff = null;
    });

    const handleGlobalChange = (data, type) => {
      if (type == "personalInfoData.designationId") {
        personalInfoData.designationId = data;
      }
      if (type == "personalInfoData.genderId") {
        personalInfoData.genderId = data;
      }
      if (type == "personalInfoData.specializationId") {
        personalInfoData.specializationId = data;
      }
      if (type == "personalInfoData.networkId") {
        personalInfoData.networkId = data;
      }
    };

    const handleProviderChange = (selectedList) => {
				let list = []
				selectedList.map(element => {
					list.push(element.value)
				})
				personalInfoData.providers = list;
				store.commit('addedProviders', selectedList)
			};

    return {
      addedProviders,
      handleProviderChange,
      handleGlobalChange,
      setPhoneNumber,
      phone,
      formRef,
      checkFieldsData,
      checkChangeInput,
      closeModal,
      form,
      //   saveModal,
      emailChange,
      handleChange,
      regex,
      errorMsg,
      addStaff,
      personalInfoData,
      personalInfo,
      onFinishFailed,
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

.personalInformation {
  margin: 10px 0 0;
}
</style>
