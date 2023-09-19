<template>
  <a-form class="common-form" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-row :gutter="[48, 16]">
      <a-col :span="12">
        <a-form-item label="Legal Name" class="required">
          <a-input :value="clientInformation?.legalName" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Friendly Name" class="required">
          <a-input :value="clientInformation?.friendlyName" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="National Provider Identifier (NPI)" >
          <a-input :value="clientInformation?.npi" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Phone Number" class="required">
          <a-input :value="clientInformation?.phoneNumber" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <div class="form-heading">
          <a-typography-title :level="3">Address</a-typography-title>
          <a-typography-text>Physical address for contractual needs</a-typography-text>
        </div>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Line 1" class="required">
          <a-input :value="clientInformation?.addressLine1" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12" v-if="clientInformation?.addressLine2">
        <a-form-item label="Line 2" >
          <a-input :value="clientInformation?.addressLine2" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="City" class="required">
          <a-input :value="clientInformation?.city" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="5" style="padding-right: 9px">
        <a-form-item label="State" class="required">
          <SelectBox ref="select" :value="clientInformation?.stateName" style="width: 100%" @focus="focus"
            @change="handleChange"  disabled>
          </SelectBox>
        </a-form-item>
      </a-col>
      <a-col :span="7" style="padding-left: 9px">
        <a-form-item label="Zipcode" class="required">
          <a-input :value="clientInformation?.zipCode" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <div class="form-heading">
          <a-typography-title :level="3">Terms</a-typography-title>
          <a-typography-text>Contractual Agreement</a-typography-text>
        </div>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Start Date" class="required">
          <a-date-picker style="width: 100%" :value="clientInformation?.startDate" placeholder=" " disabled
            :format="dateFormatList" :value-format="dateFormatList" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="End Date" class="required">
          <a-date-picker style="width: 100%" :value="clientInformation?.endDate" placeholder=" " disabled
            :format="dateFormatList" :value-format="dateFormatList" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Contract Type" class="required">
          <SelectBox ref="select" :value="clientInformation?.contractTypeName" 
            @change="handleChange"  disabled />
            
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="$t('clients.programs')" class="required" name="programs"
          :rules="[{ required: true, message: $t('clients.programs') + ' ' + $t('global.validation') }]">

          <!-- <ProgramsDropdownSearch mode="multiple" v-model:value="clientForm.programs" @focus="focus" :placeholderData="'Select Programs'" @change="handleChange" @handleProgramChange="handleGlobalChange($event,'clientForm.programs')" /> -->
          <SelectBox mode="multiple" v-model:value="clientInformation.programs" @focus="focus"
            :placeholderData="'Select Programs'" v-if="clientInformation" :globalCode="programList" entity="programs"
            :disabled="true" :maxLength="12" :maxtag="4"/>

        </a-form-item>
      </a-col>
      <!-- <a-col :span="24">
        <div :class="'form-heading'">
          <h3>Contact Person</h3>
          <p>Contact person information</p>
        </div>
      </a-col>
      <a-col :span="12">
        <a-form-item label="First Name" class="required">
          <a-input :value="clientInformation?.firstName" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="5" style="padding-right: 9px">
        <a-form-item label="Middle Name">
          <a-input :value="clientInformation?.middleName" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="7" style="padding-left: 9px">
        <a-form-item label="Last Name" class="required">
          <a-input :value="clientInformation?.lastName" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Email" class="required">
          <a-input :value="clientInformation?.email" disabled />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Phone Number" class="required">
          <a-input :value="clientInformation?.contactPersonPhoneNumber" disabled />
        </a-form-item>
      </a-col> -->
    </a-row>
  </a-form>
  <ClientLoader />
</template>

<script>

import { computed, onMounted, watchEffect } from "vue";
import { useStore } from 'vuex';
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { globalDateFormat } from '@/commonMethods/commonMethod';
import ClientLoader from "@/components/administration/clients/ClientLoader.vue";
export default {
  components: {  SelectBox ,ClientLoader},
  setup() {
    const store = useStore()


    const clientInformation = computed(() => {
      return store.state.clients.clientInformation
    })

    onMounted(() => {
      store.dispatch("programList");
    })
    watchEffect(() => {
    })
    const focus = () => {
    };

    const handleChange = () => {
    };

    const dateFormatList = globalDateFormat

    return {
      clientInformation,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      focus,
      handleChange,
      dateFormatList,
      globalDateFormat,
      programList: store.getters.programList,
    };
  },

};
</script>

