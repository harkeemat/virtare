<template>
  <a-layout-content>
    <div class="common-bg">
      <a-row>
        <a-col :span="24">
          <h2 class="pageTittle">Reset Password</h2>
        </a-col>
      </a-row>
      <a-form ref="formRef" :model="resetPasswordForm" layout="vertical" @finish="submitForm">
        <a-row :gutter="24">
          <a-col :sm="24" :xs="24">
            <div class="form-group">
              <a-form-item :label="$t('global.currentPassword')" name="currentPassword" :rules="[{ required: true, message: $t('global.required')  }]">
                <a-input-password v-model:value="resetPasswordForm.currentPassword" size="large" placeholder="Current Password" />
                <ErrorMessage v-if="errorMsg" :name="errorMsg.currentPassword ? errorMsg.currentPassword[0] : ''" />
              </a-form-item>
            </div>
          </a-col>
          <a-col :sm="24" :xs="24">
            <div class="form-group">
              <a-form-item :label="$t('global.newPassword')" name="newPassword" :rules="[{ required: true, message: $t('global.password'),pattern:regex.password  }]">
                <a-input-password v-model:value="resetPasswordForm.newPassword" size="large" placeholder="New Password" />
              </a-form-item>
            </div>
          </a-col>
          <a-col :sm="24" :xs="24">
            <div class="form-group">
              <a-form-item :label="$t('global.confirmPassword')" name="confirmPassword" :rules="[{ required: true, message: $t('global.password')  }]">
                <a-input-password v-model:value="resetPasswordForm.confirmPassword" size="large" placeholder="Confirm New Password" />
                <ErrorMessage v-if="errorMsg" :name="errorMsg.confirmPassword ? errorMsg.confirmPassword[0] : ''" />
                <ErrorMessage v-if="confirmPasswordError" :name="confirmPasswordError ? confirmPasswordError : ''" />
              </a-form-item>
            </div>
          </a-col>
          <a-col :sm="12" :xs="24">
            <a-button class="modal-button-local" @click="handleClear()">{{$t('global.clear')}}</a-button>
            <a-button  type="primary" html-type="submit">{{$t('global.resetPassword')}}</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-layout-content>
</template>

<script>
import { computed, onUnmounted, reactive, ref } from "vue";
import { useStore } from 'vuex';
import { regex } from "@/RegularExpressions/regex";
import ErrorMessage from "@/components/common/messages/ErrorMessage"

export default {
  components: {
    ErrorMessage,
  },
  setup() {
    const store = useStore()
    const formRef = ref();

    const resetPasswordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    const form = reactive({ ...resetPasswordForm })

    const confirmPasswordError = ref('');
    const submitForm = () => {
      if(resetPasswordForm.newPassword != resetPasswordForm.confirmPassword) {
        confirmPasswordError.value = "Confirm Password Doesn't Match with New Password"
      }
      else {
        store.dispatch('resetPassword', resetPasswordForm).then((resp) => {
          if(resp==true){
            formRef.value.resetFields();
            Object.assign(resetPasswordForm, form)
            confirmPasswordError.value = ''
          }
        })
      }
    }

    const handleClear = () => {
      formRef.value.resetFields();
      Object.assign(resetPasswordForm, form)
    }

    const errorMsg = computed(() => {
      return store.state.password.errorMsg
    })

    onUnmounted(() => {
      store.commit('errorMsg', null)
    })

    return {
      formRef,
      resetPasswordForm,
      submitForm,
      handleClear,
      errorMsg,
      regex,
      confirmPasswordError,
    };
  },
};
</script>

<style scoped>
  .modal-button-local {
    margin: 5px;
  }
</style>
