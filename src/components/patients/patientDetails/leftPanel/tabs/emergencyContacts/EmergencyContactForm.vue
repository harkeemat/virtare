<template>
  <a-form ref="formRef" class="common-form" :model="emergencyContactForm" :label-col="labelCol" :wrapper-col="wrapperCol" @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title v-if="!isEdit" :level="2" class="common-heading">Emergency Contact</a-typography-title>
          <a-typography-title v-else :level="2" class="common-heading">{{ emergencyContactDetails.fullName }}</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.firstName')" class="required" name="firstName"
                :rules="[{ required: true, message: $t('global.required')}]">
                <InputFields  v-model:value="emergencyContactForm.firstName" :placeholderData="$t('patient.onboarding.firstName')" :disabled="false" />
                <ErrorMessage v-if="error" :name="error.firstName ? error.firstName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.middleName')" class="not-required" name="middleName"
                :rules="[{ required: false, message: $t('global.required')}]">
                <InputFields  v-model:value="emergencyContactForm.middleName" :placeholderData="$t('patient.onboarding.middleName')" :disabled="false" />
                <ErrorMessage v-if="error" :name="error.middleName ? error.middleName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.lastName')" class="required" name="lastName"
                :rules="[{ required: true, message: $t('global.required')}]">
                <InputFields  v-model:value="emergencyContactForm.lastName" :placeholderData="$t('patient.onboarding.lastName')" :disabled="false" />
                <ErrorMessage v-if="error" :name="error.lastName ? error.lastName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.email')" class="required" name="emergencyEmail"
                :rules="[{ required: true, message: $t('global.required')}]">
                <InputFields  v-model:value="emergencyContactForm.emergencyEmail" :placeholderData="$t('patient.onboarding.email')" :disabled="false" />
                <ErrorMessage v-if="error" :name="error.emergencyEmail ? error.emergencyEmail[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.phoneNumber')" class="required" name="phoneNumber"
                :rules="[{ required: true, message: $t('global.required')}]">
                <InputFields  v-model:value="emergencyContactForm.phoneNumber" :placeholderData="$t('patient.onboarding.phoneNumber')" :disabled="false" />
                <ErrorMessage v-if="error" :name="error.phoneNumber ? error.phoneNumber[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.contactMethod')" class="required" name="contactType"
                :rules="[{ required: true, message: $t('global.required')}]">
                <SelectBox mode="multiple" v-model:value="emergencyContactForm.contactType" @focus="focus" :placeholderData="$t('patient.onboarding.contactMethod')" :globalCode="commonRecords?.pmOfcontact" @change="handleChange" />
                <ErrorMessage v-if="error" :name="error.contactType ? error.contactType[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.preferredTimeofDayforContact')" class="required" name="contactTime"
                :rules="[{ required: true, message: $t('global.required')}]">
                <SelectBox mode="multiple" v-model:value="emergencyContactForm.contactTime" @focus="focus" :placeholderData="$t('patient.onboarding.preferredTimeofDayforContact')" :globalCode="commonRecords?.ptOfDayContact" @change="handleChange" />
                <ErrorMessage v-if="error" :name="error.contactTime ? error.contactTime[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.biologicalGender')" class="required" name="gender"
                :rules="[{ required: true, message: $t('global.required')}]">
                <SelectBox v-model:value="emergencyContactForm.gender" @focus="focus" :placeholderData="$t('patient.onboarding.biologicalGender')" :globalCode="commonRecords?.gender" @change="handleChange" />
                <ErrorMessage v-if="error" :name="error.gender ? error.gender[0] : ''" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <a-popconfirm title="Are you sure, you want to remove this Emergency Contact?" ok-text="Yes" cancel-text="No"
        @confirm="removeEmergencyContact" v-if="isEdit" >
        <a-button class="delete-btn"> Remove </a-button>
      </a-popconfirm>

      <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="commonRecords.loading" />
    </div>
  </a-form>
</template>

<script>
import InputFields from "@/components/form-fields/InputFields.vue"
import SelectBox from "@/components/form-fields/SelectBox.vue"
import Button from "@/components/button/Button.vue"
import {
	computed,
  onMounted,
  // computed,
  reactive
} from 'vue'
import { useStore } from 'vuex'
// import { useRoute } from 'vue-router'
import ErrorMessage from "@/components/common/messages/ErrorMessage"

export default {
  emits: [
    'onClose'
  ],
  props: {
    isEdit: Boolean,
    emergencyContactMessage:String
  },
  components: {
    InputFields,
    SelectBox,
    Button,
    ErrorMessage,
  },
  setup(props, {emit}) {
    const store = useStore()
    // const route = useRoute()
    const commonRecords = store.getters.commonRecords

    const emergencyContactDetails = computed(() => {
      return store.state.emergencyContacts.emergencyContactDetails
    })

    const emergencyContactForm = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      emergencyEmail: "",
      phoneNumber: "",
      contactType: [],
      contactTime: [],
      gender: "",
      sameAsPrimary: false,
    })

    onMounted(() => {
      if(props.isEdit) {
        Object.assign(emergencyContactForm, emergencyContactDetails.value)
      }
    })

    const submitForm = () => {
      let emergencyContactData = {
        firstName: emergencyContactForm.firstName,
        middleName: emergencyContactForm.middleName,
        lastName: emergencyContactForm.lastName,
        emergencyEmail: emergencyContactForm.emergencyEmail,
        phoneNumber: emergencyContactForm.phoneNumber,
        contactType: emergencyContactForm.contactType,
        contactTime: emergencyContactForm.contactTime,
        gender: emergencyContactForm.gender,
        sameAsPrimary: emergencyContactForm.sameAsPrimary,
      }
      if(props.isEdit) {
        store.dispatch('emergencyContacts/updateEmergencyContact', {
          patientUdid: 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa',
          emergencyContactId: emergencyContactDetails.value.udid,
          data: emergencyContactData,
        }).then((response) => {
          if(response) {
            store.dispatch('emergencyContacts/emergencyContacts', 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa')
          }
        })
      }
      else {
        store.dispatch('emergencyContacts/addEmergencyContact', {
          patientUdid: 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa',
          data: emergencyContactData,
        }).then((response) => {
          if(response) {
            store.dispatch('emergencyContacts/emergencyContacts', 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa')
          }
        })
      }
    }

    const onClose = () => {
      emit('onClose', false)
      store.commit('emergencyContacts/emergencyContactDetails', null)
    }

    const handleChange = (value) => {
      console.log('handleChange', value)
    }

    const removeEmergencyContact = () => {
      store.dispatch('emergencyContacts/removeEmergencyContact', {
        patientUdid: 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa',
        contactUdid: emergencyContactDetails.value.udid
      }).then(() => {
        emit('onClose', false)
        store.dispatch('emergencyContacts/emergencyContacts', 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa')
        store.commit('emergencyContacts/emergencyContactDetails', null)
      })
    }

    return {
      emergencyContactForm,
      commonRecords,
      submitForm,
      onClose,
      handleChange,
      removeEmergencyContact,
      emergencyContactDetails,
      labelCol: { span: 24 },
    }
  }
}
</script>