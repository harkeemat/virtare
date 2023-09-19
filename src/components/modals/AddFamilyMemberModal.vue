<template>
<a-modal width="80%" :title="isFamilyMemberEdit ? $t('global.updateFamilyMembers') :$t('global.addFamilyMembers') " centered @cancel="closeModal()" :maskClosable="true" zIndex="1040">
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,47,'id','name'),'name','udid')" ref="formRef" :model="familyMemberForm" layout="vertical" @finish="submitForm">
        <a-row :gutter="24">

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: true, message: $t('global.firstName')+' '+$t('global.validation') }]">
                        <NameField @change="changedValue" v-model:value="familyMemberForm.firstName" @keyup="keyup" size="large" :max="20"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                      <NameField @change="changedValue" v-model:value="familyMemberForm.middleName" @keyup="keyup" size="large" :max="20"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: true, message: $t('global.lastName')+' '+$t('global.validation') }]">
                      <NameField @change="changedValue" v-model:value="familyMemberForm.lastName" @keyup="keyup" size="large" :max="20"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.lastName?errorMsg.lastName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('patient.demographics.emailAddress')" name="familyEmail" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(), type: 'email' }]">
                        <a-input @change="changedValue" v-model:value="familyMemberForm.familyEmail" @keyup="keyup" placeholder="test@test.com" size="large" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.familyEmail?errorMsg.familyEmail[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.phoneNo')" name="familyPhoneNumber" :rules="[{ required: true, message: $t('global.phoneNo')+' '+$t('global.validation') }]">
                        <!-- <PhoneNumber @change="changedValue" v-model.trim:value="familyMemberForm.familyPhoneNumber" @setPhoneNumber="setPhoneNumber" /> -->
                        <a-input v-maska="'###-###-####'" max="12" @change="changedValue" v-model:value="familyMemberForm.familyPhoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.familyPhoneNumber?errorMsg.familyPhoneNumber[0]:''" />

                        <!-- <a-input-number @change="changedValue" v-model:value="familyMemberForm.familyPhoneNumber" @keyup="keyup" placeholder="Please enter 10 digit number" size="large" maxlength="10" style="width: 100%" /> -->
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="familyContactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="changedValue" v-model:value="familyMemberForm.familyContactType" @keyup="keyup" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'familyMemberForm.familyContactType')" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.familyContactType?errorMsg.familyContactType[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="familyContactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="changedValue" v-model:value="familyMemberForm.familyContactTime" @keyup="keyup" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'familyMemberForm.familyContactTime')" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.familyContactTime?errorMsg.familyContactTime[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.gender')" name="familyGender" :rules="[{ required: true, message: $t('global.gender')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="changedValue" v-model:value="familyMemberForm.familyGender" @keyup="keyup" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'familyMemberForm.familyGender')" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.familyGender?errorMsg.familyGender[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.relation')" name="relation" :rules="[{ required: true, message: $t('global.relation')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown @change="changedValue" v-model:value="familyMemberForm.relation" @keyup="keyup" :dataId="8" @handleGlobalChange="handleGlobalChange($event,'familyMemberForm.relation')" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.relation?errorMsg.relation[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
              <div class="form-group">
                <a-form-item :label="$t('global.isPrimary')" name="isPrimary">
                  <a-switch v-model:checked="familyMemberForm.isPrimary" size="large" />
                </a-form-item>
              </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
              <div class="form-group">
                <a-form-item :label="$t('global.vitalAuthorization')" name="vitalAuthorization">
                  <a-switch v-model:checked="familyMemberForm.vitalAuthorization" size="large" />
                </a-form-item>
              </div>
            </a-col>

            <a-col :md="8" :sm="8" :xs="24">
              <div class="form-group">
                <a-form-item :label="$t('global.messageAuthorization')" name="messageAuthorization">
                  <a-switch v-model:checked="familyMemberForm.messageAuthorization" size="large" />
                </a-form-item>
              </div>
            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,47,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :sm="24" :span="24">
                <ModalButtons :Id="id" @is_click="handleClear" @is_cancel="closeModal()" />
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
    isFamilyMemberEdit: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const formRef = ref();
    const patientUdid = reactive(props.patientId);
    const isValueChanged = ref(false);

    const globalCode = computed(() => {
      return store.state.common;
    });

    const familyMemberDetails = computed(() => {
      return store.state.patients.familyMemberDetails;
    });

    const familyMemberForm = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      familyEmail: "",
      familyPhoneNumber: "",
      familyContactType: [],
      familyContactTime: [],
      familyGender: "",
      relation: "",
      vitalAuthorization: false,
      messageAuthorization: false,
      isPrimary:
        familyMemberDetails.value && familyMemberDetails.value.isPrimary
          ? familyMemberDetails.value.isPrimary
          : false,
    });
    const form = reactive({
      ...familyMemberForm,
    });

    const changedValue = () => {
      store.state.patients.errorMsg = "";
      isValueChanged.value = true;
    };

    function closeModal() {
      if (isValueChanged.value) {
        emit("closeModal", {
          modal: "addFamilyMember",
          value: true,
        });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            handleClear();
            emit("closeModal", {
              modal: "addFamilyMember",
              value: false,
            });
            Object.assign(familyMemberForm, form);
            isValueChanged.value = false;
            store.commit('errorMsg', null)
          } else {
            emit("closeModal", {
              modal: "addFamilyMember",
              value: true,
            });
          }
        });
      } else {
        handleClear();
        emit("closeModal", {
          modal: "addFamilyMember",
          value: false,
        });
      }
    }

    const id =
      props.isFamilyMemberEdit && familyMemberDetails.value
        ? ref(familyMemberDetails.value.id)
        : ref(null);
    watchEffect(() => {
      if (props.isFamilyMemberEdit) {
        Object.assign(familyMemberForm, familyMemberDetails.value);
      }
    });

    const keyup = () => {
      store.commit("errorMsg", null);
    };

    onUnmounted(() => {
      store.commit("errorMsg", null);
    });

    const modalClose = computed(() => {
      return store.state.patients.closeModal;
    });
    const submitForm = () => {
      let familyMemberFormRecord = {...familyMemberForm}
      if (props.isFamilyMemberEdit) {
        store
          .dispatch("updateFamilyMember", {
            patientUdid: patientUdid,
            familyUdid: familyMemberDetails.value.id,
            data: familyMemberFormRecord,
          })
          .then(() => {
            if (!errorMsg.value) {
              if (route.name == "PatientSummary") {
                store.dispatch("patientDetails", patientUdid);
                store.dispatch("familyMembersList", patientUdid);
              }
              if (modalClose.value == true) {
                emit("closeModal", {
                  modal: "addFamilyMember",
                  value: false,
                });
                formRef.value.resetFields();
                Object.assign(familyMemberForm, form);
              }
            }
          });
      } else {
        store
          .dispatch("addFamilyMember", {
            patientUdid: patientUdid,
            data: familyMemberFormRecord,
          })
          .then(() => {
            if (!errorMsg.value) {
              if (route.name == "PatientSummary") {
                store.dispatch("patientDetails", patientUdid);
                store.dispatch("familyMembersList", patientUdid);
              }
              if (modalClose.value == true) {
                emit("closeModal", {
                  modal: "addFamilyMember",
                  value: false,
                });
                formRef.value.resetFields();
                Object.assign(familyMemberForm, form);
              }
            }
          });
      }
    };

    const handleClear = () => {
      formRef.value.resetFields();
      Object.assign(familyMemberForm, form);
      store.commit('errorMsg', null)
    };

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg;
    });

    const setPhoneNumber = (value) => {
      familyMemberForm.familyPhoneNumber = value;
    };

    const handleGlobalChange = (data, type) => {
      if (type == "familyMemberForm.familyContactType") {
        familyMemberForm.familyContactType = data;
      }
      if (type == "familyMemberForm.familyContactTime") {
        familyMemberForm.familyContactTime = data;
      }
      if (type == "familyMemberForm.familyGender") {
        familyMemberForm.familyGender = data;
      }
      if (type == "familyMemberForm.relation") {
        familyMemberForm.relation = data;
      }
    };

    return {
      handleGlobalChange,
      changedValue,
      formRef,
      globalCode,
      familyMemberForm,
      submitForm,
      handleClear,
      errorMsg,
      isValueChanged,
      closeModal,
      modalClose,
      id,
      keyup,
      setPhoneNumber,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
};
</script>
