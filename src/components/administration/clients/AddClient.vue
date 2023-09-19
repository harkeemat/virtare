<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="clientForm" :label-col="labelCol"
    :wrapper-col="wrapperCol">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">{{ formHeading ? formHeading : 'New Client' }}</a-typography-title>

        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('clients.legalName')" class="required" name="legalName"
                :rules="[{ required: true, message: $t('global.required') }]">
                <InputFields v-model:value="clientForm.legalName" :placeholderData="$t('clients.legalName')"
                  :disabled="false" :max="50"/>
                <ErrorMessage v-if="error" :name="error.legalName ? error.legalName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.friendlyName')" class="required" name="friendlyName"
                :rules="[{ required: true, message: $t('global.required') }]">
                <InputFields v-model:value="clientForm.friendlyName" :placeholderData="$t('clients.friendlyName')"
                  :disabled="false" :max="50"/>
                <ErrorMessage v-if="error" :name="error.friendlyName ? error.friendlyName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.npi')"  name="npi"
                :rules="[{ required: false,  message: $t('global.required'), pattern: regex.numeric }]">
                <InputFields v-model:value="clientForm.npi" :placeholderData="$t('clients.npi')" :disabled="false"
                  :max="10"  v-on:keypress="numbersOnly"/>
                <ErrorMessage v-if="error" :name="error.npi ? error.friendlyName[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.phoneNumber')" class="required" name="phoneNumber"
                :rules="[{ required: true, message: $t('global.required'), pattern: regex.phoneNumber },{...invalidPhoneNumber,message:$t('global.invalidPhoneNumber')}]">
                <InputFields v-maska="'###-###-####'" v-model:value="clientForm.phoneNumber" max="12"
                  :placeholderData="$t('clients.phoneNumber')" :disabled="false" />
                <ErrorMessage v-if="error" :name="error.phoneNumber ? error.phoneNumber[0] : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="!isEdit">
              <div :class="'form-heading'">
                <a-typography-title :level="3">Contact Person</a-typography-title>
                <a-typography-text>Contact person information</a-typography-text>
              </div>
            </a-col>
            <PeoplForm :formObject="clientForm" v-if="!isEdit" @toggleCheckbox="toggleCheckbox($event)" :showExternal="showExternal" screen="addClient" />
            <a-col :span="24">
              <div class="form-heading">
                <a-typography-title :level="3">Address</a-typography-title>
                <a-typography-text>Physical address for contractual needs</a-typography-text>
              </div>
            </a-col>
            <Address :form="clientForm"/>

            <a-col :span="24">
              <div class="form-heading">
                <a-typography-title :level="3">Terms</a-typography-title>
                <a-typography-text>Contractual Agreement</a-typography-text>
              </div>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.startDate')" class="required" name="startDate"
                :rules="[{ required: true, message: $t('global.required') }]">
                <ErrorMessage v-if="error" :name="error.startDate ? error.startDate[0] : ''" />
                <DateField
                  :disabledDateData="current => !current || current > dayjs(clientForm.endDate).subtract(0, 'day')"
                  v-model:value="clientForm.startDate" :globalDateFormat="globalDateFormat" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.endDate')" class="required" name="endDate"
                :rules="[{ required: true, message: $t('global.required') }]">
                <DateField
                  :disabledDateData="current => !current || current < dayjs(clientForm.startDate).subtract(0, 'day')"
                  v-model:value="clientForm.endDate" :globalDateFormat="globalDateFormat" />
                <ErrorMessage v-if="error" :name="error.endDate ? error.endDate[0] : ''" />

              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.contractType')" class="required" name="contractTypeId"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="clientForm.contractTypeId" @focus="focus"
                  :placeholderData="$t('clients.contractType')" @change="handleChange"
                  :globalCode="commonRecord.contractType" />
                <!-- <GlobalCodeDropDown v-model:value="clientForm.contractTypeId" :dataId="89" @handleGlobalChange="handleGlobalChange($event,'clientForm.contractTypeId')" :placeholderData="'Select Contract Type'" @focus="focus" ><template #suffixIcon><CaretDownOutlined />^</template></GlobalCodeDropDown> -->
                <ErrorMessage v-if="error" :name="error.contractTypeId ? error.contractTypeId[0] : ''" />

              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.programs')" class="required" name="programs"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox mode="multiple" v-model:value="clientForm.programs" @focus="focus"
                  :placeholderData="$t('clients.programs')" @change="handleChange" v-if="programList"
                  :globalCode="programList" entity="programs" :maxLength="12" :maxtag="4" />
                <!-- <ProgramsDropdownSearch mode="multiple" v-model:value="clientForm.programs" @focus="focus" :placeholderData="'Select Programs'" @change="handleChange" @handleProgramChange="handleGlobalChange($event,'clientForm.programs')" /> -->
                <ErrorMessage v-if="error" :name="error.programs ? error.programs[0] : ''" />
              </a-form-item>
            </a-col>


          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onClose" :name="'Cancel'" />
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="commonRecord.loading" />
    </div>
  </a-form>
</template>

<script>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { addTime, timeStampLocal, globalDateFormat,numbersOnly,invalidPhoneNumber,alphabetsOnly } from '@/commonMethods/commonMethod';
import moment from 'moment';
import { regex } from "@/RegularExpressions/regex";
import InputFields from "@/components/form-fields/InputFields.vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import DateField from "@/components/modals/search/DateField.vue";
import ErrorMessage from "@/components/common/messages/ErrorMessage"
import PeoplForm from "@/components/administration/clients/Tabs/addClient/PeopleForm"
import Address from "@/components/administration/clients/Tabs/addClient/Address.vue";
import dayjs from 'dayjs';
import Button from "@/components/button/Button.vue";
export default {
  components: {
    InputFields,
    SelectBox,
    DateField,
    ErrorMessage,
    PeoplForm,
    Address,
    Button
  },
  props: {
    isEdit: Boolean,
    formHeading: String
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const formRef = ref()
    const showExternal = ref(false)
    const focus = () => {

    };
    const programList = store.getters.programList
    const commonRecord = store.getters.commonRecords
    const clientInformation = store.getters.clients
    // const clientInformation = computed(() => {
    //   return store.state.clients.clientInformation
    // })
    const clientForm = reactive({
      phoneNumber: '',
      legalName: "",
      friendlyName: "",
      npi: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateId: "",
      zipCode: "",
      startDate: "",
      endDate: "",
      contractTypeId: "",
      programs: [],
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contactPersonPhoneNumber: "",
      roleId: '',
      contactPerson: {
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        specializationId: '',
        roleId: undefined,
        timeZoneId: undefined,
        npi:"",
        type: false,  // true - External, false - Internal
      },
    })
    const roleAssign = () => {
      if (!props.isEdit) {
        commonRecord.value?.rolesDropDown.map((item) => {
          if (item.name == 'Non System User') {
            showExternal.value = false
            clientForm.contactPerson.roleId = item.udid
          }
        })
      }
    }
    onMounted(() => {
      store.commit('loading',false)
      store.state.clients.errorClients = null
      programList.value?.length > 0 ? '' : store.dispatch("programList")
      commonRecord.value?.rolesDropDown > 0 ? roleAssign() : store.dispatch("rolesDropDown").then(() => {
        roleAssign()
      })
      document.body.scrollTop = 0
    })
    watchEffect(() => {
      if (props.isEdit) {
        if (clientInformation.value?.clientInformation != null) {
          Object.assign(clientForm, clientInformation.value?.clientInformation)
        }

      }
    })
    const error = store.getters.errorClients
    const submitForm = () => {
      store.commit('loading',true)
      // clientForm.startDate = timeStampLocal(addTime(moment(clientForm.startDate)))
      // clientForm.endDate = timeStampLocal(addTime(moment(clientForm.endDate)))
      clientForm.phoneNumber = clientForm.phoneNumber.replace(/-/g, '')
      clientForm.contactPerson.phoneNumber = clientForm.contactPerson.phoneNumber.replace(/-/g, '')
      const clientData = {
        phoneNumber: clientForm.phoneNumber,
        legalName: clientForm.legalName,
        friendlyName: clientForm.friendlyName,
        npi: clientForm.npi,
        addressLine1: clientForm.addressLine1,
        addressLine2: clientForm.addressLine2,
        city: clientForm.city,
        stateId: clientForm.stateId,
        zipCode: clientForm.zipCode,
        startDate: timeStampLocal(addTime(moment(clientForm.startDate))),
        endDate: timeStampLocal(addTime(moment(clientForm.endDate))),
        contractTypeId: clientForm.contractTypeId,
        programs: clientForm.programs,
        contactPerson: clientForm.contactPerson,
        type: clientForm.type,
        
      }
      if (props.isEdit) {
        store.dispatch("updateClient", {
          data: clientData,
          clientId: route.params.udid,
        }).then((resp) => {
          store.commit('loading',false)
          if (resp) {
            onClose()
            store.dispatch('clientInformation', route.params.udid)
          }
        })
      }
      else {
        store.dispatch("addClient", clientData).then((resp) => {
          store.commit('loading',false)
          if (resp) {
            router.push({
              name: "ClientDetails",
              params: { udid: clientInformation.value?.addClient?.udid }
            })
            clientInformation.value.addClient = null
            emit('onClose', false)
            store.dispatch('clientsList')
          }

        })
      }
    }

    const handleGlobalChange = (data, type) => {
      if (type == "clientForm.stateId") {
        clientForm.stateId = data;
      }
      if (type == "clientForm.contractTypeId") {
        clientForm.contractTypeId = data;
      }
      if (type == "clientForm.programs") {
        clientForm.programs = data;
      }
      // if (type == "providerLocationForm.level") {
      //   providerLocationForm.level = data;
      // }
    };

    const form = reactive({ ...clientForm })
    const onClose = () => {
      store.commit('loading',false)
      Object.assign(clientForm, form)
      emit('onClose', false)
      formRef.value ? formRef.value.resetFields() : ''
    };

    const handleChange = () => {

    };
    const zipCodeChange = (event) => {

      if (isNaN(event.target.value)) {
        clientForm.zipCode = ''
      }
    }

    const toggleCheckbox = (value) => {
      if(value == 'Non System User') {
        showExternal.value = false
        clientForm.type = true
      }
      else {
        showExternal.value = true
        clientForm.type = false
      }
    }

    return {
      handleGlobalChange,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      focus,
      toggleCheckbox,
      showExternal,
      handleChange,
      submitForm,
      clientForm,
      error,
      regex,
      programList,
      onClose,
      formRef,
      dayjs,
      commonRecord,
      globalDateFormat,
      zipCodeChange,
      numbersOnly,
      invalidPhoneNumber,
      alphabetsOnly
    };
  },
  // components: { CaretDownOutlined },
};
</script>



