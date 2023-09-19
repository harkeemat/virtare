<template>
  <a-form ref="formRef" class="common-form" :model="state.formData" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-typography-title :level="2" class="common-heading">Insurance</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.insuranceNumber')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="insuranceNumber">
                <InputFields :placeholderData="$t('patient.onboarding.insuranceNumber')"
                  v-model:value="state.formData.insuranceNumber" :max="20" />
                <ErrorMessage v-if="error"
                  :name="error?.insurance?.insuranceNumber ? error?.insurance?.insuranceNumber[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.insuranceName')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="insuranceNameId">
                <SelectBox v-model:value="state.formData.insuranceNameId"
                  :placeholderData="$t('patient.onboarding.insuranceName')" :globalCode="store.state.common.insuranceName"
                  :maxLength="12" :maxtag="4" :notFoundContent="true" @onSearch="search" />
                <ErrorMessage v-if="error"
                  :name="error?.insurance?.insuranceName ? error?.insurance?.insuranceName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.startDate')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="startDate">
                <DateField
                  :disabledDateData="current => !current || current > dayjs(state.formData.endDate).subtract(0, 'day')"
                  v-model:value="state.formData.startDate" :globalDateFormat="globalDateFormat" />
                <ErrorMessage v-if="error" :name="error?.insurance?.startDate ? error?.insurance?.startDate[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.onboarding.endDate')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="endDate">
                <DateField
                  :disabledDateData="current => !current || current < dayjs(state.formData.startDate).subtract(0, 'day')"
                  v-model:value="state.formData.endDate" :globalDateFormat="globalDateFormat" />
                <ErrorMessage v-if="error" :name="error?.insurance?.endDate ? error?.insurance?.endDate[0] : ''" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter" :class="isEdit && rolesPermissionFind(screensPermissions, [538]) ? `justifyBet` : ``">
      <!-- add permission of delete insurance  -->
      <a-popconfirm :title="messages.deleteInsurance" ok-text="Yes" cancel-text="No" @confirm="deleteInsurance"
        v-if="(isEdit && rolesPermissionFind(screensPermissions, [538]))">
        <Button classData="delete-btn" name="Delete"></Button>
      </a-popconfirm>
      <a-space>
        <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
        <Button classData="primary-btn" html-type="submit" :name="'Save'"
          v-if="rolesPermissionFind(screensPermissions, [535]) || !isEdit" :loading="common.loading" />
      </a-space>
    </div>
  </a-form>
</template>
<script>
import { reactive, ref, watchEffect } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { numbersOnly, rolesPermissionFind } from '@/commonMethods/commonMethod';
import Button from "@/components/button/Button.vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { globalDateFormat, dateFormatClient, } from '@/commonMethods/commonMethod';
import InputFields from "@/components/form-fields/InputFields.vue";
import DateField from "@/components/modals/search/DateField.vue";
import dayjs from 'dayjs';
import { messages } from "@/config/messages";
export default {
  emits: ['onClose'],
  components: {
    SelectBox,
    Button,
    InputFields,
    DateField,
  },
  props: {
    isEdit: Boolean
  },
  setup(props, { emit }) {
    const store = useStore()
    const common = store.getters.commonRecords
    const insuranceRecord = store.getters.insuranceRecord
    const formRef = ref()
    const route = useRoute()
    const focus = () => {
      console.log("focus");
    };
    const state = reactive({
      formData: {
        "insuranceNumber": '',
        "insuranceNameId": '',
        "startDate": '',
        "endDate": ''
      }
    })
    const form = reactive({ ...state?.formData })
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
    watchEffect(() => {
      if (props?.isEdit && insuranceRecord.value) {
        Object.assign(state.formData, insuranceRecord.value?.insuranceDetailFromUdid)
      }
    })
    //if add new insurance name in global code then global code api call
    const apiCall = ref(false)
    const submitForm = () => {
      store.dispatch("patientsAddInsurance", { id: route?.params?.udid, data: state?.formData, insuranceId: state?.formData?.id }).then((res) => {
        if (res) {
          //Refresh insurance listing
          store.dispatch("insuranceList", { id: route?.params?.udid })
          if (apiCall.value) {
            store.dispatch("globalCodes").then(() => {
              apiCall.value = false
            })
          }
          onClose()
        }
      })
    }
    const onClose = () => {
      //close form
      store.commit('loading', false)
      formRef.value?.resetFields();
      Object.assign(state.formData, form)
      emit('onClose', false)
    };
    const deleteInsurance = () => {
      store.dispatch('insuranceDeleteFromPatient', { id: route?.params?.udid, insuranceId: state?.formData?.id }).then(() => {
        store.dispatch('insuranceList', { id: route?.params?.udid })
        onClose()
      })
    }
    //Action buttons
    const handleButtonClick = e => {
      console.log('click left button', e);
    };
    const handleMenuClick = e => {
      console.log('click', e);
    };
    //const  insuranceValue = ref('')

    // const getInsuranceValue = (event) =>{
    //   insuranceValue.value = event

    // }
    // if search any name from  insurance drop down  but list empty then auto add value in drop down
    const search = value => {
      /** check searched value present is in list */
      let isValuePresent = common.value?.insuranceName.find(({ name }) => new RegExp(value, 'i').test(name));
      if (typeof isValuePresent === 'undefined')
        state.formData.insuranceNameId = value;
    }
    // const getInsuranceExit =() =>{
    //   let match = false
    //   common.value?.insuranceName.map((item)=>{
    //     if(item.name.toLowerCase().indexOf(insuranceValue.value.toLowerCase()) >= 0){
    //       match = item.name.toLowerCase().indexOf(insuranceValue.value.toLowerCase()) >= 0
    //     }
    //   })
    //   if(match===false){
    //     apiCall.value = true
    //     state.formData.insuranceNameId=insuranceValue.value
    //   }
    // }
    return {
      //getInsuranceExit,
      handleButtonClick,
      handleMenuClick,
      formRef,
      common,
      insuranceRecord,
      focus,
      handleChange,
      numbersOnly,
      state,
      labelCol: { span: 24 },
      onClose,
      submitForm,
      globalDateFormat,
      dateFormatClient,
      store,
      dayjs,
      messages,
      deleteInsurance,
      //getInsuranceValue,
      search,
      rolesPermissionFind,
      screensPermissions: store.getters.screensPermissions,
    };
  },
};
</script>
