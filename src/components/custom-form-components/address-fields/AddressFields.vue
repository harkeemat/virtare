<template>
<a-form :model="address" name="basic" ref="formRef" scrollToFirstError=true autocomplete="off" layout="vertical" @finish="demographic()" @finishFailed="demographicsFailed">
    <a-row :gutter="24">
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.country')" name="country" :rules="[{ required: true, message: $t('global.country')+' '+$t('global.validation') }]">
                    <GlobalCodeDropDown @change="changedValue" v-model:value="address.country" :dataId="20" @handleGlobalChange="handleGlobalChange($event,'country')" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.state')" name="state" :rules="[{ required: true, message: $t('global.state')+' '+$t('global.validation') }]">
                    <GlobalCodeDropDown @change="changedValue" v-model:value="address.state" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'state')" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.state?errorMsg.state[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.city')" name="city" :rules="[{ required: true, message: $t('global.city')+' '+$t('global.validation') }]">
                    <a-input @keyup="changedValue" v-model:value="address.city" size="large" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.city?errorMsg.city[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.zipcode')" name="zipCode" :rules="[{ required: true, message:$t('global.validValidation')+' '+ $t('global.zipcode').toLowerCase(),pattern: regex.zipCode }]">
                    <a-input-number @keyup="changedValue" style="width:100%" v-model:value="address.zipCode" placeholder="Please enter 5 digit number" size="large" maxlength="5" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.zipCode?errorMsg.zipCode[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :span="24">
            <div class="form-group">
                <a-form-item :label="$t('global.address')+' 1'" name="address" :rules="[{ required: true, message: $t('global.address')+' '+$t('global.validation') }]">
                    <a-textarea size="large" @keyup="changedValue" v-model:value="address.address" allow-clear />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.address?errorMsg.address[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.address')+' 2'" name="appartment" :rules="[{ required: false, message: $t('global.address')+' '+$t('global.validation') }]">
                    <a-textarea size="large" @keyup="changedValue" v-model:value="address.appartment" allow-clear />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.appartment?errorMsg.appartment[0]:''" />
                </a-form-item>
            </div>
        </a-col>
    </a-row>
</a-form>
</template>
<script>
import { reactive, defineComponent } from "vue";
import { regex } from "@/RegularExpressions/regex";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
export default defineComponent({
  props: {},
  components: {
    GlobalCodeDropDown,
  },

  setup() {
    const address = reactive({
      country: 19,
      state: "",
      city: "",
      zipCode: "",
      appartment: "",
      address: "",
    });

    const handleGlobalChange = (data, type) => {
      if (type == "state") {
        address.state = data;
      }
      if (type == "country") {
        address.country = data;
      }
    };

    return {
      regex,
      address,
      handleGlobalChange,
    };
  },
});
</script>
    
<style lang="scss">

.validation {
  color: red;
}

.ant-input-number-handler-wrap {
  display: none;
}

label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked {
  width: fit-content;
}
</style>
    