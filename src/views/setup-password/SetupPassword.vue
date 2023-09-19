<template>
  <div  v-if="isCodeValid==true" class="loginWrapper">
    <div class="logIn">
      <div class="loginInner">
        <a-row>
          <WelcomeScreen />
          <a-col :md="12">
            <SetupPassword :code="code"/>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
  <div v-else-if="isCodeValid==false" class="loginWrapper invalidCode">
    <div class="logIn">
      <div class="loginInner">
        <a-row>
          <WelcomeScreen />
          <a-col :md="12">
            <div class="rightWrapper">
              <img class="rightImg" src="@/assets/images/curve.png" alt="image" />
              <h3>Invalid Code</h3>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
  <Loader />
</template>
<script>
import { computed,watchEffect } from "vue";
import { useStore } from "vuex";
import { useRoute} from "vue-router";
import WelcomeScreen from "@/components/common/Welcome";
import SetupPassword from "@/components/setupPassword/SetupPassword.vue";
export default {
  components: {
    SetupPassword,
    WelcomeScreen,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const code = route.params.udid;

    watchEffect(() => {
      if(route.params.udid){
        store.dispatch("validateCode", code);
      }
    });

    const isCodeValid = computed(() => {
      return store.state.password.validateCode
    })
    return {
      code,
      isCodeValid
    }
  }
}
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