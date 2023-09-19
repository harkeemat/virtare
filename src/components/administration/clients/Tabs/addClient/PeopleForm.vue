<template>
  <a-row :gutter="[48, 16]" v-if="form">
    <a-col :span="12">

      <a-form-item :label="$t('clients.firstName')" class="required" name="firstName" @keypress="alphabetsOnly"
        :rules="[{ required: true, message: $t('global.required') }]">
        <!-- <a-input v-model:value="peopleForm.firstName" /> -->
        <NameField v-model:value="peopleForm.firstName" :placeholderData="$t('clients.firstName')" :disabled="false"
          :max="20" />
      </a-form-item>
    </a-col>
    <a-col :span="5" style="padding-right: 9px">
      <a-form-item :label="$t('clients.middleName')" name="middleName" @keypress="alphabetsOnly"
        :rules="[{ required: false, message: $t('global.required') }]">
        <NameField v-model:value="peopleForm.middleName" :placeholderData="$t('clients.middleName')" :disabled="false"
          :max="20" />
      </a-form-item>
    </a-col>
    <a-col :span="7" style="padding-left: 9px">
      <a-form-item :label="$t('clients.lastName')" class="required" name="lastName" @keypress="alphabetsOnly"
        :rules="[{ required: true, message: $t('global.required') }]">
        <!-- <a-input v-model:value="peopleForm.lastName" /> -->
        <NameField v-model:value="peopleForm.lastName" :placeholderData="$t('clients.lastName')" :disabled="false"
          :max="20" />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t('clients.jobTitle')" name="title"
        :rules="[{ required: false, message: $t('global.required') }, { ...alphanumeric, message: $t('global.alphanumeric') }]">
        <InputFields v-model:value="peopleForm.title" :placeholderData="$t('clients.jobTitle')" :disabled="false"
          :max="30" />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t('clients.npi')" name="npi"
        :rules="[{ required: false, message: $t('global.required'), pattern: regex.numeric }]">
        <InputFields v-model:value="peopleForm.npi" :placeholderData="$t('clients.npi')" :disabled="false" :max="10"
          v-on:keypress="numbersOnly" />
        <ErrorMessage v-if="error" :name="error.npi ? error.friendlyName[0] : ''" />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t('global.specialization')" name="specializationId"
        :rules="[{ required: false, message: $t('global.required') }]">
        <SelectBox v-model:value="peopleForm.specializationId" @focus="focus"
          :placeholderData="$t('global.specialization')" :globalCode="store.state.specialist.specialists"
          @onSearch="search" />

      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t('clients.email')" class="required" name="email"
        :rules="[{ required: true, message: $t('global.required'), type: 'email' }]">
        <!-- <a-input v-model:value="peopleForm.email" /> -->
        <InputFields v-model:value="peopleForm.email" :placeholderData="$t('clients.email')"
          :disabled="isEdit || isStaff ? true : false" @change="fieldChange('peopleForm.email')" />
        <ErrorMessage v-if="people?.errorClients"
          :name="people?.errorClients?.email ? people?.errorClients?.email[0] : ''" />
      </a-form-item>

    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t('clients.phoneNumber')" class="required" name="phoneNumber"
        :rules="[{ required: true, message: $t('global.required'), pattern: regex.phoneNumber }]">
        <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
        <InputFields v-maska="'###-###-####'" v-model:value="peopleForm.phoneNumber" max="12"
          :placeholderData="$t('clients.phoneNumber')" :disabled="false" v-on:keypress="numbersOnly" />
      </a-form-item>
    </a-col>
    <a-col :span="12">
      <a-form-item :label="$t('clients.timeZone')" class="required" name="timeZoneId"
        :rules="[{ required: true, message: $t('global.required') }]">
        <SelectBox v-model:value="peopleForm.timeZoneId" @focus="focus" :placeholderData="$t('clients.timeZone')"
          :globalCode="commonRecord?.timeZone" />
      </a-form-item>
    </a-col>
    <!-- <a-col :span="12">
      <a-form-item :label="$t('clients.faxNumber')" name="faxNumber"
        :rules="[{ required: false, message: $t('global.required') }]">
        <InputFields v-model:value="peopleForm.faxNumber" :placeholderData="$t('clients.faxNumber')"
          @keypress="numbersOnly" />
      </a-form-item>
    </a-col> -->
    <a-col :span="12" v-if="form && !isStaff">
      <a-form-item :label="$t('clients.role')" class="required" name="roleId"
        :rules="[{ required: true, message: $t('global.required') }]">
        <SelectBox v-model:value="peopleForm.roleId" @focus="focus" :placeholderData="$t('clients.role')"
          :globalCode="commonRecord?.rolesDropDown" @change="changeRole" />
      </a-form-item>
    </a-col>

    <a-col :span="12"
      v-if="arrayToObjectData(commonRecord?.rolesDropDown, peopleForm?.roleId, 'udid', 'name') != 'Non System User'">
      <a-form-item label=" `" name="type">
        <a-checkbox v-if="isEdit" v-model:checked="peopleForm.type"
          :disabled="arrayToObjectData(commonRecord?.rolesDropDown, peopleForm?.roleId, 'udid', 'name') == 'Non System User' ? true : false">Staff</a-checkbox>
        <a-checkbox v-else v-model:checked="peopleForm.type"
          :disabled="screen == 'addClient' || screen == 'person' ? !showExternal : false">Staff</a-checkbox>
      </a-form-item>
    </a-col>

    <a-col span="24"
      v-if="peopleForm?.roleId && arrayToObjectData(commonRecord?.rolesDropDown, peopleForm?.roleId, 'udid', 'name') != 'Non System User' && !isEdit && !isStaff">
      <a-typography>An email will be sent inviting user to join Tethr app</a-typography>
    </a-col>
  </a-row>

  <a-col :span="12" v-if="formObject">

    <a-form-item :label="$t('clients.firstName')" class="required" :name="['contactPerson', 'firstName']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <!-- <a-input v-model:value="peopleForm.firstName" /> -->
      <NameField v-model:value="peopleForm.contactPerson.firstName" :placeholderData="$t('clients.firstName')"
        :disabled="false" :max="20" />
    </a-form-item>
  </a-col>
  <a-col :span="5" style="padding-right: 9px" v-if="formObject">
    <a-form-item :label="$t('clients.middleName')" :name="['contactPerson', 'middleName']"
      :rules="[{ required: false, message: $t('global.required') }]">
      <NameField v-model:value="peopleForm.contactPerson.middleName" :placeholderData="$t('clients.middleName')"
        :disabled="false" :max="20" />
    </a-form-item>
  </a-col>
  <a-col :span="7" style="padding-left: 9px" v-if="formObject">
    <a-form-item :label="$t('clients.lastName')" class="required" :name="['contactPerson', 'lastName']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <!-- <a-input v-model:value="peopleForm.lastName" /> -->
      <NameField v-model:value="peopleForm.contactPerson.lastName" :placeholderData="$t('clients.lastName')"
        :disabled="false" :max="20" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.jobTitle')" :name="['contactPerson', 'title']"
      :rules="[{ required: false, message: $t('global.required') }, { ...alphanumeric, message: $t('global.alphanumeric') }]">
      <InputFields v-model:value="peopleForm.contactPerson.title" :placeholderData="$t('clients.jobTitle')"
        :disabled="false" :max="30" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.npi')" name="npi"
      :rules="[{ required: false, message: $t('global.required'), pattern: regex.numeric }]">
      <InputFields v-model:value="peopleForm.contactPerson.npi" :placeholderData="$t('clients.npi')" :disabled="false"
        :max="10" v-on:keypress="numbersOnly" />
      <ErrorMessage v-if="error" :name="error.npi ? error.friendlyName[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('global.specialization')" :name="['contactPerson', 'specializationId']"
      :rules="[{ required: false, message: $t('global.required') }]">
      <SelectBox v-model:value="peopleForm.contactPerson.specializationId" :placeholderData="$t('global.specialization')"
        :globalCode="store.state.specialist.specialists" @onSearch="search" />

    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.email')" class="required" :name="['contactPerson', 'email']"
      :rules="[{ required: true, message: $t('global.required'), type: 'email' }]">
      <!-- <a-input v-model:value="peopleForm.email" /> -->
      <InputFields v-model:value="peopleForm.contactPerson.email" :placeholderData="$t('clients.email')"
        :disabled="isEdit ? true : false" @change="fieldChange('peopleForm.email')" />
      <ErrorMessage v-if="people?.errorClients" :name="emaiVal ? emaiVal : ''" />
    </a-form-item>


  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.phoneNumber')" class="required" :name="['contactPerson', 'phoneNumber']"
      :rules="[{ required: true, message: $t('global.required'), pattern: regex.phoneNumber }, { ...invalidPhoneNumber, message: $t('global.invalidPhoneNumber') }]">
      <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
      <InputFields v-maska="'###-###-####'" v-model:value="peopleForm.contactPerson.phoneNumber" max="12"
        :placeholderData="$t('clients.phoneNumber')" :disabled="false" v-on:keypress="numbersOnly" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.timeZone')" class="required" :name="['contactPerson', 'timeZoneId']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <SelectBox v-model:value="peopleForm.contactPerson.timeZoneId" :placeholderData="$t('clients.timeZone')"
        :globalCode="commonRecord?.timeZone" />
    </a-form-item>
  </a-col>
  <!-- <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.faxNumber')" :name="['contactPerson', 'faxNumber']"
      :rules="[{ required: false, message: $t('global.required') }]">
      <InputFields v-model:value="peopleForm.contactPerson.faxNumber" :placeholderData="$t('clients.faxNumber')"
        @keypress="numbersOnly" />
    </a-form-item>
  </a-col> -->
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.role')" class="required" :name="['contactPerson', 'roleId']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <SelectBox v-model:value="peopleForm.contactPerson.roleId" :placeholderData="$t('clients.role')"
        :globalCode="commonRecord?.rolesDropDown" @change="changeRole" />
    </a-form-item>
  </a-col>
  <a-col :span="12"
    v-if="formObject && arrayToObjectData(commonRecord?.rolesDropDown, peopleForm?.contactPerson?.roleId, 'udid', 'name') != 'Non System User'">
    <a-form-item label=" `" name="type">
      <a-checkbox v-if="isEdit" v-model:checked="peopleForm.type"
        :disabled="people?.peopleDetails?.role == 'Non System User'">Staff</a-checkbox>
      <a-checkbox v-else v-model:checked="peopleForm.contactPerson.type"
        :disabled="screen == 'addClient' || screen == 'person' ? !showExternal : false">Staff</a-checkbox>
    </a-form-item>
  </a-col>
  <a-row :gutter="[48, 16]">
    <a-col span="24"
      v-if="peopleForm?.contactPerson?.roleId && arrayToObjectData(commonRecord?.rolesDropDown, peopleForm?.contactPerson?.roleId, 'udid', 'name') != 'Non System User' && !isEdit">
      <a-typography>An email will be sent inviting user to join Tethr app</a-typography>
    </a-col>
  </a-row>
</template>
<script setup>
import { defineComponent, reactive, ref, watchEffect } from 'vue-demi'
import { onMounted } from 'vue-demi'
import { useStore } from 'vuex'
import ErrorMessage from "@/components/common/messages/ErrorMessage"
import InputFields from "@/components/form-fields/InputFields.vue";
import NameField from "@/components/form-fields/NameField.vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"

import { regex } from "@/RegularExpressions/regex";
import { numbersOnly, arrayToObjectData, invalidPhoneNumber, alphabetsOnly, alphanumeric } from '@/commonMethods/commonMethod';
const props = defineProps(["form", "formObject", "isEdit", "isStaff", "showExternal", "screen"])
const emit = defineEmits(["toggleCheckbox"])
const store = useStore()

const peopleForm = props?.formObject ? reactive(props?.formObject) : reactive(props?.form)
const commonRecord = store.getters.commonRecords
const people = store.getters.clients
onMounted(() => {
  store.state.clients.errorClients = ''
  commonRecord.value?.commonRecord?.legth > 0 ? '' : store.dispatch('timeZone')
  store.dispatch("specialist/fetchSpecialist");
});
const emaiVal = ref()
watchEffect(() => {
  if (people.value?.errorClients) {
    people.value?.errorClients['contactPerson.email']?.length > 0 ? people.value?.errorClients['contactPerson.email']?.map((item) => {
      emaiVal.value = item
    }) : ''

  }
})
const fieldChange = (event) => {
  if (event == "peopleForm.email") {
    store.state.clients.errorClients = ''
    emaiVal.value = ''
  }
}
const search = (value) => {
  if (props?.formObject) {
    let isValuePresent = store.state.specialist.specialists.find(({ name }) =>
      new RegExp(value, "i").test(name)
    );
    if (typeof isValuePresent === "undefined")
      peopleForm.contactPerson.specializationId = value;
  } else {
    let isValuePresent = store.state.specialist.specialists.find(({ name }) =>
      new RegExp(value, "i").test(name)
    );
    if (typeof isValuePresent === "undefined")
      props.form.specializationId = value;
  }
};
const changeRole = (event) => {
  commonRecord.value?.rolesDropDown.map((item) => {
    if (item.udid == event) {
      emit('toggleCheckbox', item.name)
    }
  })
}
</script>
