<template>
  <Loader v-if="store.state.medical.medicalLoader" />
  <a-form ref="formRef" class="common-form" :model="state.medical" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-typography-title :level="2" class="common-heading">{{ isEdit ? 'Edit' : 'Add' }} Medical
            History</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('patient.medical.diagnosis')" class="required" name="diagnosis" :rules="[
                {
                  required: true,
                  message: $t('global.required'),
                },
              ]">
                <InputFields v-model:value="state.medical.diagnosis" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.medical.diagnosisCode')" class="required" name="diagnoseCode"
                :rules="[{ required: true, message: $t('global.required') }]">
                <ConditionCodeDropDown listHeight="400" :targetRecords="patientConditionsList"
                  :editDataCondition="state.editDataCondition" v-model:value="state.medical.diagnoseCode"
                  @handleConditionChange="handleConditionChange($event)" @change="changedValue" mode="single"
                  entity="code" />
                <ErrorMessage class="error" v-if="errorMsg" :name="errorMsg.condition ? errorMsg.condition[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.medical.diagnoseDate')" class="required" name="diagnoseDate"
                :rules="[{ required: true, message: $t('global.required') }]">
                <DateField :disabledDateData="current => !current || current > dayjs().subtract(0, 'day')"
                  v-model:value="state.medical.diagnoseDate" :globalDateFormat="globalDateFormat" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="$t('patient.medical.note')" class="required" name="note"
                :rules="[{ required: true, message: $t('global.required') }]">
                <Textarea v-model:value="state.medical.note" />
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item :label="$t('patient.medical.cured')" :labelCol={span:3}>
                <a-radio-group v-model:value="state.medical.cured" class="custom-checkbox">
                  <a-radio :style="radioStyle" :value="true">Yes</a-radio>
                  <a-radio :style="radioStyle" :value="false">No</a-radio>
                </a-radio-group>
                <!-- <a-checkbox value="true" class="custom-checkbox" :checked="state.medical.cured===true ? true :false"
                    @change="curedCheck($event,'true')">Yes</a-checkbox>
                  <a-checkbox value="false"  class="custom-checkbox" :checked="state.medical.cured===false ? false :true"
                    @change="curedCheck($event,'false')">No</a-checkbox> -->
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter" :class="isEdit && rolesPermissionFind(screensPermissions, [77]) ? `justifyBet` : ``">
      <a-popconfirm :title="messages?.deleteMedical" ok-text="Yes" cancel-text="No" @confirm="deletemedical"
        v-if="isEdit && rolesPermissionFind(screensPermissions, [77])">
        <Button classData="delete-btn" name="Delete"></Button>
      </a-popconfirm>
      <a-space>
        <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
        <Button classData="primary-btn" html-type="submit" :name="'Save'"
          v-if="rolesPermissionFind(screensPermissions, [76]) || !isEdit" :loading="common.loading" />
      </a-space>
    </div>
  </a-form>
</template>
<script>
import { reactive, ref, computed, onMounted, watchEffect } from "vue";
import Button from "@/components/button/Button.vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import InputFields from "@/components/form-fields/InputFields.vue";
import ConditionCodeDropDown from "@/components/modals/search/ConditionSearch.vue";
import DateField from "@/components/modals/search/DateField.vue";
import { globalDateFormat, rolesPermissionFind } from '@/commonMethods/commonMethod';
import Textarea from "@/components/form-fields/Textarea";
import dayjs from 'dayjs';
import { messages } from "@/config/messages";
import Loader from "@/components/patients/Loader.vue"
export default {
  emits: ['onClose'],
  components: {
    Button,
    ConditionCodeDropDown,
    DateField,
    InputFields,
    Textarea,
    Loader
  },
  props: {
    isEdit: Boolean
  },
  setup(props, { emit }) {
    const store = useStore()
    const common = store.getters.commonRecords
    const medicalRecord = store.getters.medicalRecord
    const formRef = ref()
    const route = useRoute()
    const focus = () => {
      console.log("focus");
    };
    const state = reactive({
      editDataCondition: [],
      medical: {
        "diagnosis": '',
        "cured": false,
        "note": '',
        "diagnoseCode": undefined,
        "diagnoseDate": '',

      }
    })
    const form = reactive({ ...state.medical })
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };


    const submitForm = () => {
      store.dispatch("addMedicalHistory", { id: route?.params?.udid, medicalId: state?.medical?.udid, data: state?.medical }).then((res) => {
        if (res) {
          //Refresh device listing after add inventory
          store.dispatch("medicalList", { id: route?.params?.udid })
          store.dispatch("patientNotesList", { id: route?.params?.udid })
          onClose()
        }
      })
    }
    onMounted(() => {

    })
    watchEffect(() => {
      if (props?.isEdit && medicalRecord.value?.medicalDetail) {
        state.editDataCondition = []
        Object.assign(state.medical, medicalRecord.value?.medicalDetail)
        //state.medical.cured = state.medical?.cured ? true : false
        state.editDataCondition.push({ code: medicalRecord.value?.medicalDetail?.diagnoseCodeName, value: medicalRecord.value?.medicalDetail?.diagnoseCode })
      }
    })
    const onClose = () => {
      //close form
      store.commit('loading', false)
      formRef.value?.resetFields();
      Object.assign(state.medical, form)
      emit('onClose', false)
    };
    const editDataCondition = computed(() => {
      return store.state.patients.editConditionDetails;
    });
    const patientConditionsList = computed(() => {
      return store.state.patients.patientConditions
    })
    const plainOptions = [{
      label: 'Yes',
      value: 'true',
    }, {
      label: 'No',
      value: 'no',
    }];

    const handleConditionChange = (val) => {
      state.medical.diagnoseCode = val;
    };
    const deletemedical = () => {
      store.dispatch('medicalHistoryDelete', { id: route?.params?.udid, medicalId: medicalRecord.value?.medicalDetail?.udid }).then(() => {
        store.dispatch("medicalList", { id: route?.params?.udid })
        store.dispatch("patientNotesList", { id: route?.params?.udid })
        onClose()
      })
    }
    return {
      store,
      formRef,
      common,
      focus,
      handleChange,
      state,
      labelCol: { span: 24 },
      onClose,
      submitForm,
      patientConditionsList,
      editDataCondition,
      dayjs,
      globalDateFormat,
      plainOptions,
      handleConditionChange,
      deletemedical,
      messages,
      rolesPermissionFind,
      screensPermissions: store.getters.screensPermissions
    };
  },
};
</script>
