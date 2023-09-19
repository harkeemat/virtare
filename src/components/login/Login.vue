<template>
    <a-form :model="loginForm" layout="vertical" @finish="loginUser">
        <div class="field">
            <a-form-item name="email" :rules="[{ required: true, message: $t('global.required')  }]">
                <a-input v-model:value="loginForm.email" :placeholder="$t('login.ePlaceholder')" size="large" />
            </a-form-item>
        </div>
        <div class="field">
            <a-form-item name="password" :rules="[{ required: true, message: $t('global.required')  }]">
                <a-input-password v-model:value="loginForm.password" :placeholder="$t('login.psdPlaceholder')" size="large" />
            </a-form-item>
        </div>
        <div class="field">
            <a-form-item>
                <a-checkbox v-model:checked="rememberMe" :defaultChecked="rememberMe">Remember Me</a-checkbox>
            </a-form-item>
        </div>
        <div class="field">
            <span class="error">{{ errorMsg?.errorMsg?.message }}</span>
        </div>
        <div class="buttons">
            <a-button type="primary" html-type="submit" :loading="iconLoading">
                {{$t("login.login")}}
                <template #icon><LoginOutlined style="fontSize: 16px;"/></template>
            </a-button>
            <!-- <router-link :to="{ name: 'ForgotPassword', params: { udid: '' }}"> -->
            <router-link to="/forgot-password">
                {{ $t("login.forgotPassword") }}
            </router-link>
        </div>
    </a-form>
</template>
<script>
import {
  computed,
  reactive,
  ref,
  onUnmounted,
  watchEffect,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { enCodeString, key, deCodeString } from "@/commonMethods/commonMethod";
import { LoginOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    LoginOutlined,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const rememberMe = ref(true);
    const loginForm = reactive({
      email: "",
      password: "",
      fireBaseToken:localStorage.getItem('fireBaseToken')
    });
    const iconLoading = ref(false);
    // const crypt = (salt, text) => {
    //     const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    //     const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    //     const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    //     return text
    //         .split("")
    //         .map(textToChars)
    //         .map(applySaltToChar)
    //         .map(byteHex)
    //         .join("");
    // };

    // const decrypt = (salt, encoded) => {
    //     const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    //     const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    //     return encoded
    //         .match(/.{1,2}/g)
    //         .map((hex) => parseInt(hex, 16))
    //         .map(applySaltToChar)
    //         .map((charCode) => String.fromCharCode(charCode))
    //         .join("");
    // };

    const loginUser = () => {
      iconLoading.value = true;
      if (rememberMe.value) {
        localStorage.setItem("email", loginForm.email);
        localStorage.removeItem("password");
        localStorage.setItem("password", enCodeString(key, loginForm.password));
      } else {
        localStorage.removeItem("email");

        localStorage.removeItem("password");
      }

      store
        .dispatch("login", {
          email: loginForm.email,
          password: enCodeString(key, loginForm.password),
          fireBaseToken:loginForm.fireBaseToken?loginForm.fireBaseToken:localStorage.getItem('fireBaseToken')
        })
        .then((resp) => {
          if(resp==true){
            store.dispatch("globalCodes");
            store.dispatch("permissions");
            // store.dispatch("escalationStaus")
            // store.dispatch("appointmentConference");
            store.dispatch("notificationList");
            // store.dispatch("allPatientsList")
            // store.dispatch("allStaffList")
          }
          })
    };
    const error = computed(() => {
      return store.state.dashBoard.errorMsg;
    });
    watchEffect(() => {
      if (localStorage.getItem("email")) {
        loginForm.email = localStorage.getItem("email");
      }
      if (localStorage.getItem("password")) {
        let ciphertext = localStorage.getItem("password");

        loginForm.password = deCodeString(key, ciphertext);
      }
      if (error.value) {
        iconLoading.value = false;
      }
    });
    onMounted(() => {
      removeStorage();
    });
    onUnmounted(() => {
      iconLoading.value = false;
      store.state.dashBoard.errorMsg = "";
    });
    const loggedInUser = computed(() => {
      return store.state.authentication.loggedInUser;
    });

    const errorMsg = computed(() => {
      return store.state.authentication;
    });

    function removeStorage() {
      localStorage.removeItem("user");
      localStorage.removeItem("barmenu");
      localStorage.removeItem("staff");
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
      localStorage.removeItem("roleAuth");
      localStorage.removeItem("access");
      localStorage.removeItem("accessPermission");
      localStorage.removeItem("permission");
      localStorage.removeItem("screensPermission");
      localStorage.removeItem("widgetsPermission");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("checkLogin");
    }
    return {
      errorMsg,
      loginForm,
      loginUser,
      router,
      iconLoading,
      loggedInUser,
      rememberMe,
      enCodeString,
      deCodeString,
      key,
    };
  },
};
</script>

<style scoped>
span.error {
  color: #ff0000;
}
</style>
