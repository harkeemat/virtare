<template>
  <a-form ref="formRef" class="common-form" :model="familyMember.formData" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-typography-title :level="2" class="common-heading">{{ isEdit ? "Edit" : "Add" }} Family
            Member</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('clients.firstName')" class="required" name="firstName"
                :rules="[{ required: true, message: $t('global.required') }]">
                <!-- <a-input v-model:value="peopleForm.firstName" /> -->
                <NameField v-model:value="familyMember.formData.firstName" :placeholderData="$t('clients.firstName')"
                  :disabled="false" :max="20" />
              </a-form-item>
            </a-col>
            <a-col :span="5" style="padding-right: 9px">
              <a-form-item :label="$t('clients.middleName')" name="middleName"
                :rules="[{ required: false, message: $t('global.required') }]">
                <NameField v-model:value="familyMember.formData.middleName" :placeholderData="$t('clients.middleName')"
                  :disabled="false" :max="20" />
              </a-form-item>
            </a-col>
            <a-col :span="7" style="padding-left: 9px">
              <a-form-item :label="$t('clients.lastName')" class="required" name="lastName"
                :rules="[{ required: true, message: $t('global.required') }]">
                <!-- <a-input v-model:value="peopleForm.lastName" /> -->
                <NameField v-model:value="familyMember.formData.lastName" :placeholderData="$t('clients.lastName')"
                  :disabled="false" :max="20" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item :label="$t('clients.phoneNumber')" class="required" name="phoneNumber" :rules="[
                {
                  required: true,
                  message: $t('global.required'),
                  pattern: regex.phoneNumber,
                },
              ]">
                <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
                <InputFields v-maska="'###-###-####'" max="12" v-model:value="familyMember.formData.phoneNumber"
                  :placeholderData="$t('clients.phoneNumber')" :disabled="false" v-on:keypress="numbersOnly" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('clients.email')" class="required" name="familyEmail" :rules="[
                {
                  required: true,
                  message: $t('global.required'),
                  type: 'email',
                },
              ]">
                <!-- <a-input v-model:value="peopleForm.email" /> -->
                <InputFields v-model:value="familyMember.formData.familyEmail" :placeholderData="$t('clients.email')"
                  @change="fieldChange()" />
                <ErrorMessage v-if="familyMember?.familyStore?.familyMemberError" :name="
                  familyMember?.familyStore?.familyMemberError?.email
                    ? familyMember?.familyStore?.familyMemberError?.email[0]
                    : ''" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="required" :label="$t('global.relation')" name="relation"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="familyMember.formData.relation" @focus="focus"
                  :placeholderData="$t('global.relation')" :globalCode="familyMember?.common?.relation"
                  @change="deviceChange" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" :xs="24">
              <a-form-item name="isPrimary">
                <a-checkbox class="custom-checkbox" v-model:checked="familyMember.formData.isPrimary">{{
                  $t('global.primaryContact') }}</a-checkbox>
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter" :class="isEdit && rolesPermissionFind(screensPermissions, [304]) ? `justifyBet` : ``">
      <a-popconfirm :title="messages.deleteFamilyMember" ok-text="Yes" cancel-text="No" @confirm="deleteFamily"
        v-if="isEdit && rolesPermissionFind(screensPermissions, [304])">
        <Button classData="delete-btn" name="Delete"></Button>
      </a-popconfirm>
      <a-space>
        <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
        <Button classData="primary-btn" html-type="submit" :name="'Save'"
          v-if="rolesPermissionFind(screensPermissions, [303]) || !isEdit" :loading="familyMember?.common?.loading" />
      </a-space>
    </div>
  </a-form>
</template>
<script>
import { watchEffect, reactive, ref } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue";
import { numbersOnly, rolesPermissionFind } from "@/commonMethods/commonMethod";
import InputFields from "@/components/form-fields/InputFields.vue";
import Button from "@/components/button/Button.vue";
import { useStore } from "vuex";
import NameField from "@/components/form-fields/NameField.vue";
import { useRoute } from "vue-router";
import { regex } from "@/RegularExpressions/regex";
import { messages } from "@/config/messages";
export default {
  emits: ["onClose"],
  components: {
    SelectBox,
    InputFields,
    Button,
    NameField,
  },
  props: {
    isEdit: Boolean,
  },
  setup(props, { emit }) {
    const formRef = ref();
    const store = useStore();
    const familyMember = reactive({
      route: useRoute(),
      common: store.getters.commonRecords,
      familyStore: store.getters.familyMemberRecord,
      formData: {
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        relation: "",
        familyEmail: "",
        isPrimary: false,
      },
    });
    watchEffect(() => {
      if (familyMember?.familyStore?.detailOfFamilyMember && props?.isEdit) {
        Object.assign(
          familyMember.formData,
          familyMember?.familyStore?.detailOfFamilyMember
        );
      }
    });
    const form = reactive({ ...familyMember.formData });
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    const submitForm = () => {
      familyMember.formData.phoneNumber =
        familyMember.formData.phoneNumber.replace(/-/g, "");
      store
        .dispatch("addfamilyMember", {
          familyMemberId: familyMember?.formData?.udid,
          id: familyMember?.route?.params?.udid,
          data: familyMember.formData,
        })
        .then((res) => {
          if (res) {
            store.dispatch("familyMemberList", {
              id: familyMember?.route.params?.udid,
            });
            onClose();
          }
        });
    };
    const fieldChange = () => {
      familyMember?.familyStore?.familyMemberError
        ? (familyMember.familyStore.familyMemberError = "")
        : "";
    };
    const onClose = () => {
      store.commit("loading", false);
      formRef.value?.resetFields();
      Object.assign(familyMember.formData, form);
      emit("onClose", false);
    };
    const deleteFamily = () => {
      store.dispatch('deleteFamilyMemberFromPatients', { familyMemberId: familyMember?.formData?.udid }).then(() => {
        store.dispatch('familyMemberList', { id: familyMember?.route?.params?.udid })
        onClose()
      })
    }
    return {
      handleChange,
      numbersOnly,
      familyMember,
      labelCol: { span: 24 },
      onClose,
      submitForm,
      regex,
      formRef,
      fieldChange,
      deleteFamily,
      messages,
      rolesPermissionFind,
      screensPermissions: store.getters.screensPermissions,
    };
  },
};
</script>

