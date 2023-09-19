<template>
  <div class="loginWrapper">
    <div class="logIn">
      <div class="loginInner">
        <a-row>
          <WelcomeScreen />
          <a-col :xs="24" :md="12">
            <div class="rightWrapper">
              <img class="rightImg" src="@/assets/images/curve.png" alt="image" />
              <h2>Forgot Password</h2>
              <a-form ref="formRef" :model="forgotPasswordForm" layout="vertical" @finish="submitForm">
                <a-col :sm="24" :xs="24">
                  <div class="form-group">
                    <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: true, message: $t('global.required')  }]">
                      <a-input v-model:value="forgotPasswordForm.email" placeholder="Email Address" size="large" />
                    </a-form-item>
                  </div>
                </a-col>
                <div class="buttons">
                  <a-button class="modal-button" type="primary" html-type="submit">
                    {{$t('global.send')}}
                    <template #icon><LoginOutlined style="fontSize: 16px;"/></template>
                  </a-button>
                  <router-link to="/"> {{ $t("login.loginUser") }} </router-link>
                </div>
              </a-form>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref
} from "vue";
import { useStore } from "vuex";
import WelcomeScreen from "@/components/common/Welcome";
import { LoginOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    WelcomeScreen,
    LoginOutlined
  },
  setup() {
    const store = useStore()
    const formRef = ref()
    const forgotPasswordForm = reactive({
      email: ''
    })
    const form = reactive({ ...forgotPasswordForm })
    const submitForm = () => {
      store.dispatch('forgotPassword', forgotPasswordForm).then(() => {
        formRef.value.resetFields();
        Object.assign(forgotPasswordForm, form)
      })
    }
    
    return {
      formRef,
      forgotPasswordForm,
      submitForm,
    };
  },
});
</script>
