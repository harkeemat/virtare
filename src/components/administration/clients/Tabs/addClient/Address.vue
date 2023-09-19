<template>
  <a-col :span="12" v-if="form">
    <a-form-item :label="$t('clients.addressLine1')" class="required" name="addressLine1"
      :rules="[{ required: true, message: $t('global.required') }]">
      <InputFields v-model:value="peopleForm.addressLine1" :placeholderData="$t('clients.addressLine1')"
        :disabled="false" />
      <ErrorMessage v-if="error" :name="error.addressLine1 ? error.addressLine1[0] : ''" />
    </a-form-item>
  </a-col> 
  <a-col :span="12" v-if="form">
    <a-form-item :label="$t('clients.addressLine2')" name="addressLine2"
      :rules="[{ required: false, message: $t('global.required') }]">
      <InputFields v-model:value="peopleForm.addressLine2" :placeholderData="$t('clients.addressLine2')"
        :disabled="false" />
      <ErrorMessage v-if="error" :name="error.addressLine2 ? error.addressLine2[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="form">
    <a-form-item :label="$t('clients.city')" class="required" name="city"
      :rules="[{ required: true, message: $t('global.required') }]">
      <InputFields v-model:value="peopleForm.city" :placeholderData="$t('clients.city')" :disabled="false" :max="20" v-on:keypress="alphabetsOnly"/>
      <ErrorMessage v-if="error" :name="error.city ? error.city[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="5" style="padding-right: 9px" v-if="form">
    <a-form-item :label="$t('clients.state')" class="required" name="stateId"
      :rules="[{ required: true, message: $t('global.required') }]">
      <!-- <GlobalCodeDropDown v-model:value="peopleForm.stateId" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'peopleForm.stateId')" :placeholderData="'Select State'" @focus="focus" ><template #suffixIcon><CaretDownOutlined />^</template></GlobalCodeDropDown> -->
      <SelectBox v-model:value="peopleForm.stateId" :placeholderData="$t('clients.state')" @focus="focus"
        @change="handleChange" :globalCode="common?.state"><template #suffixIcon>
          <CaretDownOutlined />^
        </template></SelectBox>
      <ErrorMessage v-if="error" :name="error.stateId ? error.stateId[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="7" style="padding-left: 9px" v-if="form">
    <a-form-item :label="$t('clients.zipCode')" class="required" name="zipCode"
      :rules="[{ required: true, message: $t('global.required'), pattern: regex.zipCode }]">
      <InputFields v-model:value="peopleForm.zipCode"  :placeholderData="$t('clients.zipCode')"
        :disabled="false" :max="5" v-on:keypress="numbersOnly"/>
      <ErrorMessage v-if="error" :name="error?.zipCode ? error?.zipCode[0] : ''" />

    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.addressLine1')" class="required" :name="['address', 'addressLine1']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <!-- <a-input v-model:value="peopleForm.lastName" /> -->
      <InputFields v-model:value="peopleForm.address.addressLine1" :placeholderData="$t('clients.addressLine1')"
        :disabled="false" />
      <ErrorMessage v-if="people?.errorClients"
        :name="people?.errorClients?.address?.addressLine1 ? people?.errorClients?.address?.addressLine1[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.addressLine2')" :name="['address', 'addressLine2']"
      :rules="[{ required: false, message: $t('global.required') }]">
      <!-- <a-input v-model:value="peopleForm.lastName" /> -->
      <InputFields v-model:value="peopleForm.address.addressLine2" :placeholderData="$t('clients.addressLine2')"
        :disabled="false" />
      <ErrorMessage v-if="people?.errorClients"
        :name="people?.errorClients?.address?.addressLine2 ? people?.errorClients?.address?.addressLine2[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="12" v-if="formObject">
    <a-form-item :label="$t('clients.city')" class="required" :name="['address', 'city']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <!-- <a-input v-model:value="peopleForm.lastName" /> -->
      <InputFields v-model:value="peopleForm.address.city" :placeholderData="$t('clients.city')" :disabled="false" :max="20" v-on:keypress="alphabetsOnly"/>
      <ErrorMessage v-if="people?.errorClients"
        :name="people?.errorClients?.address?.city ? people?.errorClients?.address?.city[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="5" style="padding-right: 9px;" v-if="formObject">
    <a-form-item :label="$t('clients.state')" class="required" :name="['address', 'stateId']"
      :rules="[{ required: true, message: $t('global.required') }]">
      <!-- <a-input v-model:value="peopleForm.lastName" /> -->
      <SelectBox v-model:value="peopleForm.address.stateId" @focus="focus" :placeholderData="$t('clients.state')"
        :globalCode="common?.state" />
      <ErrorMessage v-if="people?.errorClients"
        :name="people?.errorClients?.address?.stateId ? people?.errorClients?.address?.stateId[0] : ''" />
    </a-form-item>
  </a-col>
  <a-col :span="7" style="padding-left: 9px;" v-if="formObject">
    <a-form-item :label="$t('clients.zipCode')" class="required" :name="['address', 'zipCode']"
      :rules="[{ required: true, message: $t('global.required'), pattern: regex.zipCode }]">
      <!-- <a-input v-model:value="peopleForm.lastName" /> -->
      <InputFields v-model:value="peopleForm.address.zipCode" :placeholderData="$t('clients.zipCode')" :disabled="false"
         :max="5" v-on:keypress="numbersOnly"/>
      <ErrorMessage v-if="people?.errorClients"
        :name="people?.errorClients?.address?.zipCode ? people?.errorClients?.address?.zipCode[0] : ''" />
    </a-form-item>
  </a-col>
</template>
<script>
import { defineComponent, reactive } from 'vue-demi'
import { onMounted } from 'vue-demi'
import { useStore } from 'vuex'
import ErrorMessage from "@/components/common/messages/ErrorMessage"
import InputFields from "@/components/form-fields/InputFields.vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { regex } from "@/RegularExpressions/regex";
import { numbersOnly,alphabetsOnly } from '@/commonMethods/commonMethod';
export default defineComponent({
  components: {
    InputFields,
    SelectBox,
    ErrorMessage,
  },
  props: {
    form: Object,
    formObject: Object
  },
  setup(props) {
    const store = useStore()

    const peopleForm = props?.formObject ? reactive(props?.formObject) : reactive(props?.form)
    const common = store.getters.commonRecords
    const people = store.getters.clients
    onMounted(() => {
      store.state.clients.errorClients = ''

    });

  
    return {
      common,
      people,
      peopleForm,
      numbersOnly,
      alphabetsOnly,
      regex,
    };

  },
})
</script>
  