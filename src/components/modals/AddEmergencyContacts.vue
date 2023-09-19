
<template>
	<a-modal width="60%" :title="isEmergencyContactEdit ? 'Edit Emergency Contact' :'Add Emergency Contact'" centered @cancel="closeModal()">
		<a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,16,'id','name'),'name','udid')" ref="formRef" :model="emergencyContactForm" layout="vertical" autocomplete="off" @finish="submitForm">
			<a-row :gutter="24">

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation') }]">
							<NameField @change="changedValue" v-model:value="emergencyContactForm.firstName" size="large" :max="20"/>
              <a-input @change="changedValue" v-model:value="emergencyContactForm.firstName" size="large" />
							<ErrorMessage v-if="errorMsg" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
							<NameField @change="changedValue" v-model:value="emergencyContactForm.middleName" size="large" :max="20"/>
							<ErrorMessage v-if="errorMsg" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
							<NameField @change="changedValue" v-model:value="emergencyContactForm.lastName" size="large" :max="20"/>
							<ErrorMessage v-if="errorMsg" :name="errorMsg.lastName?errorMsg.lastName[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('patient.demographics.emailAddress')" name="emergencyEmail" :rules="[{ required: false, message: $t('patient.demographics.emailAddress')+' '+$t('global.validation') }]">
							<a-input @change="changedValue" v-model:value="emergencyContactForm.emergencyEmail" placeholder="test@test.com" size="large" />
							<ErrorMessage v-if="errorMsg" :name="errorMsg.emergencyEmail?errorMsg.emergencyEmail[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.phoneNo')+' '+$t('global.validation'),pattern:regex.phoneNumber }]">
							<a-input v-maska="'###-###-####'" max="12" @change="changedValue" v-model:value="emergencyContactForm.phoneNumber" placeholder="Please enter 10 digit number" size="large"  style="width: 100%" />
							<ErrorMessage v-if="errorMsg" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="contactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
							<!-- <a-select v-model:value="emergencyContactForm.contactType" mode="multiple" size="large" style="width: 100%" :options="globalCode.pmOfcontact.globalCode.map((item) => ({label: item.name, value: item.id }))" /> -->
								<GlobalCodeDropDown @change="changedValue" v-model:value="emergencyContactForm.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'emergencyContactForm.contactType')"/>
							<ErrorMessage v-if="errorMsg" :name="errorMsg.contactType?errorMsg.contactType[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="contactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
							<!-- <a-select v-model:value="emergencyContactForm.contactTime" mode="multiple" size="large" style="width: 100%" :options="globalCode.ptOfDayContact.globalCode.map((item) => ({label: item.name, value: item.id }))" /> -->
								<GlobalCodeDropDown @change="changedValue" v-model:value="emergencyContactForm.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'emergencyContactForm.contactTime')"/>
							<ErrorMessage v-if="errorMsg" :name="errorMsg.contactTime?errorMsg.contactTime[0]:''" />
						</a-form-item>
					</div>
				</a-col>

				<a-col :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('global.gender')" name="gender" :rules="[{ required: false, message: $t('global.gender')+' '+$t('global.validation') }]">
							<!-- <a-select ref="select" v-model:value="emergencyContactForm.gender" style="width: 100%" size="large">
								<a-select-option value="" hidden>{{'Select Gender'}}</a-select-option>
								<a-select-option v-for="gender in globalCode.gender.globalCode" :key="gender.id" :value="gender.id">{{gender.name}}</a-select-option>
							</a-select> -->
							<GlobalCodeDropDown @change="changedValue" v-model:value="emergencyContactForm.gender"  :dataId="9" @handleGlobalChange="handleGlobalChange($event,'emergencyContactForm.gender')"/>
							<ErrorMessage v-if="errorMsg" :name="errorMsg.gender?errorMsg.gender[0]:''" />
						</a-form-item>
					</div>
				</a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,16,'id','name'),'name','udid')"> </FormBaseComponents>

				<!-- <a-col v-if="isEmergencyContactEdit" :md="12" :sm="12" :xs="24">
					<div class="form-group">
						<a-form-item :label="$t('global.isPrimary')" name="isPrimary">
              <a-switch v-model:checked="emergencyContactForm.isPrimary" size="large" />
            </a-form-item>
					</div>
				</a-col> -->

				<a-col :sm="24" :span="24">
					<ModalButtons :Id="isEmergencyContactEdit" @is_click="handleClear"/>
				</a-col>
			</a-row>
		</a-form>
		<Loader />
	</a-modal>
</template>
<script>
import ModalButtons from "@/components/common/button/ModalButtons";
import { computed, reactive, ref, watchEffect, onUnmounted } from "vue-demi";
import { useStore } from "vuex";
import Loader from "@/components/loader/Loader.vue";
import { useRoute } from "vue-router";
import ErrorMessage from "../common/messages/ErrorMessage";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import {warningSwal ,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import { messages } from "../../config/messages";
import { regex } from "@/RegularExpressions/regex";
// import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import NameField from "@/components/form-fields/NameField.vue"
export default {
  components: {
    ModalButtons,
    Loader,
    ErrorMessage,
    GlobalCodeDropDown,
	// PhoneNumber,
    FormBaseComponents,
    NameField
  },
  props: {
    patientId: {
      type: Number,
    },
    isEmergencyContactEdit: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const formRef = ref();
    const patientUdid = route.params.udid;
    const isValueChanged = ref(false);

    const globalCode = computed(() => {
      return store.state.common;
    });

    const patients = computed(() => {
      return store.state.patients;
    });

    const emergencyContactForm = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      emergencyEmail: "",
      phoneNumber: "",
      contactType: [],
      contactTime: [],
      gender: "",
      sameAsPrimary: "",
      // isPrimary: patients.value.emergencyContactDetails && patients.value.emergencyContactDetails.isPrimary ? patients.value.emergencyContactDetails.isPrimary : false,
    });

  
    const id = ref(null);
    
    if (props.isEmergencyContactEdit) {
      id.value = patients.value.emergencyContactDetails;
    }

    watchEffect(() => {
      if (props.isEmergencyContactEdit) {
        Object.assign(
          emergencyContactForm,
          patients.value.emergencyContactDetails
        );
      }
    });

    onUnmounted(() => {
      store.commit("errorMsg", null);
    });

    const modalClose = computed(() => {
      return store.state.patients.closeModal;
    });

    const form = reactive({ ...emergencyContactForm });

    const changedValue = () => {
      isValueChanged.value = true;
    };

    function closeModal() {
      emit("closeModal", {
        modal: "addEmergencyContact",
        value: true,
      });
      if (isValueChanged.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("closeModal", {
              modal: "addEmergencyContact",
              value: false,
            });
            Object.assign(emergencyContactForm, form);
            isValueChanged.value = false;
          } else {
            emit("closeModal", {
              modal: "addEmergencyContact",
              value: true,
            });
          }
        });
      }else{
         isValueChanged.value = false;
handleClear()
        emit("closeModal", {
          modal: "addEmergencyContact",
          value: false,
        });
      }
    }

    //.replace(/-/g,'')
    const submitForm = () => {
      let formatedPhone = emergencyContactForm.phoneNumber
      if (props.isEmergencyContactEdit) {
        store
          .dispatch("updateEmergencyContact", {
            patientUdid: patientUdid,
            contactUdid: patients.value.emergencyContactDetails.id,
            data: {
              firstName: emergencyContactForm.firstName,
              middleName: emergencyContactForm.middleName,
              lastName: emergencyContactForm.lastName,
              emergencyEmail: emergencyContactForm.emergencyEmail,
              phoneNumber: formatedPhone.replace(/-/g,''),
              contactType: emergencyContactForm.contactType,
              contactTime: emergencyContactForm.contactTime,
              gender: emergencyContactForm.gender,
              sameAsPrimary: emergencyContactForm.sameAsPrimary,
            },
          })
          .then(() => {
            if (route.name == "PatientSummary") {
              store.dispatch("emergencyContactsList", patientUdid);
            }
            if (modalClose.value == true) {
              emit("closeModal", {
                modal: "addEmergencyContact",
                value: false,
              });
               
              formRef.value.resetFields();
              Object.assign(emergencyContactForm, form);
            }
            isValueChanged.value = false;
          });
      } else {
        store
          .dispatch("addEmergencyContact", {
            patientUdid: patientUdid,
            data: {
              firstName: emergencyContactForm.firstName,
              middleName: emergencyContactForm.middleName,
              lastName: emergencyContactForm.lastName,
              emergencyEmail: emergencyContactForm.emergencyEmail,
              phoneNumber: formatedPhone.replace(/-/g,''),
              contactType: emergencyContactForm.contactType,
              contactTime: emergencyContactForm.contactTime,
              gender: emergencyContactForm.gender,
              sameAsPrimary: emergencyContactForm.sameAsPrimary
            },
          })
          .then(() => {
            if (route.name == "PatientSummary") {
              store.dispatch("emergencyContactsList", patientUdid);
            }
            if (modalClose.value == true) {
              emit("closeModal", {
                modal: "addEmergencyContact",
                value: false,
              });
               
              formRef.value.resetFields();
              Object.assign(emergencyContactForm, form);
            }
            isValueChanged.value = false;
          });
      }
    };

    const handleClear = () => {
      formRef.value.resetFields();
      Object.assign(emergencyContactForm, form);
    };

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg;
    });

    const handleGlobalChange = (data,type) =>{
            if(type =='emergencyContactForm.contactType'){
                emergencyContactForm.contactType = data
            }
            if(type=='emergencyContactForm.contactTime'){
                emergencyContactForm.contactTime = data
            }
            if(type=='emergencyContactForm.gender'){
                emergencyContactForm.gender = data
            }
        }

    return {
      handleGlobalChange,
      regex,
      formRef,
      globalCode,
      emergencyContactForm,
      submitForm,
      handleClear,
      errorMsg,
      closeModal,
      modalClose,
      id,
      changedValue,
      isValueChanged,
      bindProps: store.state.common.bindProps,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
};
</script>