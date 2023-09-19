<template>
  <div class="rightWrapper">
      <img class="rightImg" src="@/assets/images/curve.png" alt="image" />
      <h2>Setup Password</h2>
      <a-form ref="formRef" :model="setupPasswordForm" layout="vertical" @finish="submitForm"> 
        <ErrorMessage v-if="errorMsg" :name="errorMsg.password[0]? errorMsg.password[0]: ''" />
          <a-col :sm="24" :xs="24">
              <div class="form-group">
                  <a-form-item :label="$t('global.newPassword')" name="newPassword" :rules="[{ required: true, message: $t('global.password'),pattern:regex.password   }]">
                      <a-input-password v-model:value="setupPasswordForm.newPassword" placeholder="Enter New Password" size="large" />
                  </a-form-item>
              </div>
          </a-col>
          <a-col :sm="24" :xs="24">
              <div class="form-group">
                  <a-form-item :label="$t('global.confirmNewPassword')" name="confirmNewPassword" :rules="[{ required: true, message: $t('global.password'),pattern:regex.password   }]">
                      <a-input-password v-model:value="setupPasswordForm.confirmNewPassword" placeholder="Confirm Password" size="large" />
                      <ErrorMessage v-if="confirmNewPasswordError" :name="confirmNewPasswordError ? confirmNewPasswordError : ''" />
                  </a-form-item>
              </div>
          </a-col>
          <a-col :sm="12" :xs="24" >
              <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.submit')}}</a-button>
          </a-col>
      </a-form>
  </div>
  <Loader />
</template>
<script>
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import Loader from "../loader/Loader";
import { regex } from "@/RegularExpressions/regex";
// import WelcomeScreen from "@/components/common/Welcome";
export default defineComponent({
  components: {
    ErrorMessage,
    Loader,
    // WelcomeScreen,
  },
  props:{
    code:String
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const formRef = ref();
    const login = ref(true)
    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg
    })

    const setupPasswordForm = reactive({
      newPassword: "",
      confirmNewPassword: "",
    });
    const form = reactive({
      ...setupPasswordForm,
    });
onMounted(()=>{
  login.value = route.query?.login
})
    const confirmNewPasswordError = ref("");
    const submitForm = () => {
      confirmNewPasswordError.value = "";
      if (setupPasswordForm.newPassword != setupPasswordForm.confirmNewPassword) {
        confirmNewPasswordError.value =
          "Confirm Password doesn't match with New Password";
      } else {
        if(route.query?.token){
          store.dispatch('staffPasswordReset', {
            endPoint:'staff',
            id:route.params.udid,
            data:{
              password:setupPasswordForm.newPassword,
              confirmPassword:setupPasswordForm.confirmNewPassword,
              token:route.query?.token
            }
          }).then((status) => {
              if (status == true) {
                // store.dispatch("addStaffRole", {
                //   id: route.params.udid,
                //   data: {roles:['f29df1b5-00f3-42be-ba8f-6caec6cb0065']},
                // }).then((resp)=>{
                // 
                // })
                  if(status==true){
                    router.push("/");
                  }
              }
            });
        }else{
          // This block the forgot password
          store.dispatch("setupPassword", {
              code: props.code,
              newPassword: setupPasswordForm.newPassword,
              confirmNewPassword: setupPasswordForm.confirmNewPassword,
            })
            .then((status) => {
              if (status == true) {
                router.push({
                            name: 'ThankYou',
                            query: {
                                login: login.value,
                            }
                            })
                formRef.value.resetFields();
                Object.assign(setupPasswordForm, form);
              }
            });
        }
      }
    };

    const isCodeValid = computed(() => {
      return store.state.password.validateCode;
    });

    return {
      regex,
      errorMsg,
      formRef,
      setupPasswordForm,
      submitForm,
      isCodeValid,
      confirmNewPasswordError,
      login
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.setupPassword {
  .logIn {
    max-width: 500px;

    .loginInner {
      .rightWrapper {
        .logo {
          max-width: 100px;
          margin: 0 0 20px;
        }
      }
    }
  }
}
</style>
