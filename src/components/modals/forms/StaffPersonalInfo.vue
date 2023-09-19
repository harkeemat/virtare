<template>
  <a-modal max-width="1140px" scrollToFirstError=true width="100%" :title="escalationProvider?'Add Form': staffType == 342 ? $t('careCoordinator.coordinatorsModal.updateCoordinator') : 'Update Specialist'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :model="personalInfoData" class="basic" name="basic"  scrollToFirstError=true autocomplete="off" layout="vertical" @finish="personalInfo" @finishFailed="onFinishFailed">
        <!-- <PersonalInformation /> -->
        <a-row :gutter="24">
            <a-col :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: true, message: $t('global.firstName')+' '+$t('global.validation') }]">
                        <a-input v-model:value="personalInfoData.firstName" size="large" class="firstName" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.firstName" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item :label="$t('global.middleName')" name="middleName">
                        <a-input v-model:value="personalInfoData.middleName" size="large" class="middleName" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.middleName" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: true, message: $t('global.lastName')+' '+$t('global.validation') }]">
                        <a-input v-model:value="personalInfoData.lastName" @change="checkChangeInput()" size="large"/>
                        <ErrorMessage v-if="errorMsg && !personalInfoData.lastName" :name="errorMsg.lastName?errorMsg.lastName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <!--<a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item name="designationId" :label="$t('global.designation')" :rules="[{ required: true, message: $t('global.designation')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.designationId" :dataId="17" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.designationId')" placeholder="Please Select"/>
                        <ErrorMessage v-if="errorMsg && !personalInfoData.designationId" :name="errorMsg.designationId?errorMsg.designationId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>-->
            <a-col :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item name="genderId" :label="$t('global.gender')" :rules="[{ required: true, message: $t('global.gender')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.genderId" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.genderId')" placeholder="Please Select" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.genderId" :name="errorMsg.genderId?errorMsg.genderId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(),type: 'email' }]">
                        <a-input v-model:value="personalInfoData.email" placeholder="test@test.com" @blur="emailChange()" @change="checkChangeInput()" size="large"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.email?errorMsg.email[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="8" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                          <a-input v-maska="'###-###-####'" max="12" @change="checkChangeInput()" v-model:value="personalInfoData.phoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%"   />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.phoneNumber" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col v-if="staffType == 342" :sm="4" :xs="24" :xl="8">
              <div class="form-group">
                  <a-form-item label="Extension" name="extension" :rules="[{ required: false, message: $t('global.validValidation')+' '+'Extension'.toLowerCase(),pattern:regex.extension}]">
                      <a-input  @change="checkChangeInput()"  v-model:value="personalInfoData.extension" placeholder="Enter 4 digit number" size="large" maxlength="4"  style="width: 100%" />
                      <ErrorMessage v-if="errorMsg && !personalInfoData.extension" :name="errorMsg.extension?errorMsg.extension[0]:''" />
                  </a-form-item>
              </div>
            </a-col>
            <a-col :sm="12" :xs="24" :xl="8">
                <div class="form-group">
                    <a-form-item :label="$t('global.specialization')" name="specializationId" :rules="[{ required: true, message: $t('global.specialization')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.specializationId" :dataId="2" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.specializationId')" placeholder="Please Select" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.specializationId" :name="errorMsg.specializationId?errorMsg.specializationId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" :xl="8" v-if="escalationProvider">
                <div class="form-group">
                    <a-form-item :label="$t('global.network')" name="networkId" :rules="[{ required: true, message: $t('global.network')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="checkChangeInput()" :disabled="staffType == 343" v-model:value="personalInfoData.networkId" :dataId="10" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.networkId')" placeholder="Please Select" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.networkId" :name="errorMsg.networkId?errorMsg.networkId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" :xl="8" v-else>
                <div class="form-group">
                    <a-form-item :label="$t('global.network')" name="networkId" :rules="[{ required: true, message: $t('global.network')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="checkChangeInput()" :disabled="staffType == 343" v-model:value="personalInfoData.networkId" :dataId="10" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.networkId')" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.networkId" :name="errorMsg.networkId?errorMsg.networkId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
                        
            <!-- <a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
              <div class="form-group">
                  <a-form-item :label="$t('careCoordinator.coordinatorsModal.defaultLocation')" name="defaultLocation" :rules="[{ required: true, message: $t('careCoordinator.coordinatorsModal.defaultLocation')+' '+$t('global.validation') }]">
                      <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="personalInfoData.defaultLocation" size="large" @change="checkChangeInput($event)">
                          <a-select-option v-for="location in providerLocations" :key="location.id" :value="location.id">{{ location.locationName }}</a-select-option>
                      </a-select>
                      <ErrorMessage v-if="errorMsg && !personalInfoData.defaultLocation" :name="errorMsg.defaultLocation?errorMsg.defaultLocation[0]:''" />
                  </a-form-item>
              </div>
            </a-col>
            
            <a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
              <div class="form-group">
                <a-form-item :label="$t('careCoordinator.coordinatorsModal.program')" name="program" :rules="[{ required: true, message: $t('careCoordinator.coordinatorsModal.program')+' '+$t('global.validation') }]">
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="personalInfoData.program" size="large">
                    <a-select-option v-for="program in locationPrograms" :key="program.udid" :value="program.udid">{{ program.name }}</a-select-option>
                  </a-select>
                  <ErrorMessage v-if="errorMsg && !personalInfoData.program" :name="errorMsg.program?errorMsg.program[0]:''" />
                </a-form-item>
              </div>
            </a-col> -->

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
            <!-- <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.level')" name="level" :rules="[{ required: true, message: $t('global.level')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.level" :globalCode="careCordinator.staffLevels" />
                        <ErrorMessage v-if="errorMsg && !personalInfoData.level" :name="errorMsg.level?errorMsg.level[0]:''" />
                    </a-form-item>
                </div>
            </a-col> -->
        </a-row>

        <div class="steps-action">
          <ModalButtons :Id="Id" @is_cancel="closeModal" />
          <!-- <a-button  type="primary" html-type="submit">{{$t('global.update')}}</a-button> -->
        </div>
    </a-form>
  </a-modal>
</template>


<script>
import {reactive, computed,onUnmounted, watchEffect } from "vue";
import { useStore } from "vuex";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import { regex } from "@/RegularExpressions/regex";
import { successSwal,warningSwal, } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import { useRoute } from "vue-router";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import ModalButtons from "@/components/common/button/ModalButtons";
// import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
export default {
  components: {
    // PhoneNumber,
    ErrorMessage,
    GlobalCodeDropDown,
    ModalButtons,
  },
  props:{
    escalationProvider:{
      type:Boolean
    },
    staffType: {
      type: Number
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const personalInfoData = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      designationId: "",
      genderId: "",
      email: "",
      phoneNumber: "",
      specializationId: "",
      networkId: props.escalationProvider?5:'',
      roleId: '',
      level: '',
      extension:'',
      organisation: "",
      location: "",
      building: "",
      defaultLocation: "",
      program: "",
      
    });

     const setPhoneNumber = (value) => {
      personalInfoData.phoneNumber = value;
    };

    const careCoordinatorSummary = computed(() => {
      return store.state.careCoordinatorSummary.staffSummary
    });

    const specialistSummary = computed(() => {
      return store.state.specialists.specialistSummary
    });

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider
    })

    const providerLocations = computed(() => {
      return store.state.provider.providerLocations
    })

    const providerPrograms = computed(() => {
      return store.state.provider.providerPrograms;
    });

    watchEffect(()=>{
      if(selectedProvider.value != null && selectedProvider.value != "") {
        store.dispatch('providerLocations', selectedProvider.value.id)
        store.dispatch('editSingleProvider', selectedProvider.value.id)
      }
      if(route.name == 'CoordinatorSummary') {
        Object.assign(personalInfoData, careCoordinatorSummary.value)
      }
      else {
        Object.assign(personalInfoData, specialistSummary.value)
      }
    })

     const form = reactive({
      ...personalInfoData,
    });

    const personalInfo = () => {
      let phone = personalInfoData.phoneNumber
      store.dispatch("updateStaff", {
      id:route.params.udid,
      data:{
        firstName: personalInfoData.firstName,
        middleName: personalInfoData.middleName,
        lastName: personalInfoData.lastName,
        designationId: personalInfoData.designationId,
        genderId: personalInfoData.genderId,
        email: personalInfoData.email,
        phoneNumber: phone.replace(/-/g,''),
        specializationId: personalInfoData.specializationId,
        networkId: personalInfoData.networkId,
        roleId: personalInfoData.roleId,
        extension: personalInfoData.extension,
        defaultLocation: personalInfoData.defaultLocation,
        program: personalInfoData.program,
      }
      });
      setTimeout(()=>{
        if(careCoordinators.value.closeModal==true){
          if(route.name == 'CoordinatorSummary') {
            store.dispatch("staffSummary", route.params.udid);
          }
          else if(route.name == 'SpecialistSummary') {
            store.dispatch("specialistSummary", route.params.udid);
          }
          emit("saveModal", false)
          store.commit("resetCounter")
          store.commit('checkChangeInput',false)
          Object.assign(personalInfoData, form);
      }
      },2000)
      
    };

    const onFinishFailed = (value) => {
      console.log(value);
    };

    const handleChange = () => {};

    const careCordinator = computed(() => {
      return store.state.common;
    });

    const careCoordinators = computed(() => {
      return store.state.careCoordinator;
    });

    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg;
    });

    function emailChange(){
        errorMsg.value.email?errorMsg.value.email[0]=null:''
    }

    const locationPrograms = computed(() => {
      return store.state.provider.locationPrograms
    })

    function checkChangeInput(value){
      store.commit('checkChangeInput',true)
      if(value) {
        store.dispatch('locationPrograms', {
          providerID: selectedProvider.value.id,
          locationID: value
        }).then(() => {
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
      }
    }

    function saveModal() {
      emit("saveModal", false);
      successSwal(messages.formSuccess);
      Object.assign(personalInfoData, form);
      store.dispatch("allStaffList");
    }

    const checkFieldsData = computed(()=>{
      return store.state.common.checkChangeInput;
    })

    function closeModal() {
      emit("saveModal", true)
      if(checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("saveModal", false)
            Object.assign(personalInfoData, form)
            store.commit("resetCounter")
            store.state.careCoordinator.addStaff =null
            store.commit('checkChangeInput',false)
          }
          else {
            emit("saveModal", true);
          }
        });
      }
      else {
        emit("saveModal", false)
      }
    }

    onUnmounted(()=>{
      store.commit('errorMsg',null)
    })

    const handleGlobalChange = (data,type) =>{
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
    }
         
    return {
      handleGlobalChange,
      setPhoneNumber,
      checkFieldsData,
      checkChangeInput,
      closeModal,
      form,
      saveModal,
      emailChange,
      handleChange,
      // scrollToTop,
      regex,
      errorMsg,
      careCoordinators,
      careCordinator,
      personalInfoData,
      onFinishFailed,
      personalInfo,
      bindProps: store.state.common.bindProps,
      Id:true,
      providerLocations,
      providerPrograms,
      locationPrograms,
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