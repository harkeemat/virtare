<template>
<a-modal max-width="1140px" width="50%" :title="'Reset Password'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :scrollToFirstError="true" ref="formRef" name="basic"  autocomplete="off" :model="resetPasswordForm" layout="vertical" @finish="submitForm" @finishFailed="onFinishFailed">
        <a-row :gutter="24">
        <a-col :sm="24" :xs="24">
          <ErrorMessage v-if="errorMsg?.password[0]" :name="errorMsg.password ? errorMsg.password[0] : ''" />
        </a-col>
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.newPassword')" name="password" :rules="[{ required: true, message: $t('global.password'),pattern:regex.password   }]">
                        <a-input-password @change="checkChangeInput()" v-model:value="resetPasswordForm.password" size="large" placeholder="New Password" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.confirmPassword')" name="confirmPassword" :rules="[{ required: true, message: $t('global.password'),pattern:regex.password   }]">
                        <a-input-password @change="checkChangeInput()" v-model:value="resetPasswordForm.confirmPassword" size="large" placeholder="Confirm New Password" />
                        <ErrorMessage v-if="errorMsg?.confirmPassword[0]" :name="errorMsg.confirmPassword ? errorMsg.confirmPassword[0] : ''" />
                        <ErrorMessage v-if="confirmPasswordError" :name="confirmPasswordError ? confirmPasswordError : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <a-button class="modal-button" @click="handleClear()">{{$t('global.clear')}}</a-button>
                <a-button  type="primary" html-type="submit">{{$t('global.resetPassword')}}</a-button>
            </a-col>
        </a-row>
    </a-form>
</a-modal>
</template>
<script>
import { computed, onUnmounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { regex } from "@/RegularExpressions/regex";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import {
  warningSwal,
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";

export default {
  components: {
    ErrorMessage,
  },
  props:{
      endPoint:String,
      id:String
  },
  setup(props,{emit}) {
    const store = useStore();
    const formRef = ref();

    const resetPasswordForm = reactive({
      password: "",
      confirmPassword: "",
    });
    const form = reactive({
      ...resetPasswordForm,
    });

    const confirmPasswordError = ref("");
    const submitForm = () => {
      if (resetPasswordForm.password != resetPasswordForm.confirmPassword) {
        confirmPasswordError.value =
          "Confirm Password Doesn't Match with New Password";
      } else {
        store.dispatch("staffPasswordReset", {
            data:resetPasswordForm,
            endPoint:props.endPoint,
            id:props.id
            }).then((response) => {
                if(response == true){
                    formRef.value.resetFields();
                    Object.assign(resetPasswordForm, form);
                    confirmPasswordError.value = "";
                    emit("saveModal", false);
                }
        });
      }
    };

    const handleClear = () => {
      formRef.value.resetFields();
      Object.assign(resetPasswordForm, form);
    };

    const errorMsg = computed(() => {
      return store.state.password.errorMsg;
    });

    onUnmounted(() => {
      store.commit("errorMsg", null);
    });

    
    function checkChangeInput() {
      store.commit("checkChangeInput", true);
      store.state.password.errorMsg = null
      confirmPasswordError.value = null
    }

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    const closeModal = () => {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("saveModal", false);
            Object.assign(resetPasswordForm, form);
            store.commit("checkChangeInput", false);
          } else {
            emit("saveModal", true);
          }
        });
      } else {
         formRef.value.resetFields()
      }
    };

    return {
      regex,
      checkFieldsData,
      closeModal,
      checkChangeInput,
      formRef,
      resetPasswordForm,
      submitForm,
      handleClear,
      errorMsg,
      confirmPasswordError,
    };
  },
};
</script>

<style scoped>
.modal-button {
  margin: 5px;
  padding: 7px 15px 5px 15px;
  height: auto;
}
</style>
