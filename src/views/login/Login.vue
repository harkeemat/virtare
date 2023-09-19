<template>
<div class="loginWrapper" v-if="!isLogged">
    <div class="logIn">
        <div class="loginInner">
            <a-row>
                <WelcomeScreen />
                <a-col :md="12">
                    <div class="rightWrapper">
                        <img class="rightImg" src="@/assets/images/curve.png" alt="image" />
                        <h2>{{$t('login.login')}}</h2>
                        <Login />
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</div>
</template>

<script>
import {computed } from "vue";
import Login from "@/components/login/Login";
import WelcomeScreen from "@/components/common/Welcome";
import { useStore} from "vuex";
export default {
    name: "ViewLogin",
    components: {
        Login,
        WelcomeScreen
    },
    
    setup() {
        const store = useStore();
        const isLogged = computed(()=>{
            return store.state.authentication.loggedInUser
        })
        return {
            isLogged
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
.leftWrapper {
    h3 {
        font-size: 18px;
        text-align: justify !important;
        position: relative;
        margin: 0 0 30px;

        &::before {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            height: 2px;
            background-color: $primary-color;
            width: 50px;
        }
    }
}
</style>
