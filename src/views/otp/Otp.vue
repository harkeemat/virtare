<template>
    <div class="loginWrapper">
        <div class="logIn">
            <div class="loginInner">
                <a-row>
                    <WelcomeScreen />
                    <a-col :md="12">
                        <div class="rightWrapper">
                            <img class="rightImg" src="@/assets/images/curve.png" alt="image" />
                            <h2>{{ $t("login.login") }}</h2>
                            <p>
                                We have sent you <span>One Time Password</span> to your email
                            </p>
                            <h3>Please Enter OTP</h3>
                            <div class="otpBoxes">
                                <a-input></a-input>
                                <a-input></a-input>
                                <a-input></a-input>
                                <a-input></a-input>
                                <a-input></a-input>
                                <a-input></a-input>
                            </div>
                            <div class="resendOtp">
                                <div class="time">00:30</div>
                                <p>Don't receive OTP? <router-link to="#" class="disabled">Resend OTP</router-link></p>
                            </div>
                            <div class="anotherLogin">
                                <a-button type="primary">Verify OTP</a-button>
                                <router-link to="/"> Login with another account </router-link>
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
    </div>
</template>
<script>
import WelcomeScreen from "@/components/common/Welcome";
export default {
    components: {
        WelcomeScreen,
    },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";

.rightWrapper {
    p {
        font-size: 15px;

        span {
            font-family: $font-family-bold;
        }
    }

    h3 {
        font-size: 16px;
        margin: 20px 0 10px;
    }

    .otpBoxes {
        display: flex;
        justify-content: space-between;

        .ant-input {
            height: 40px;
            width: 40px;
            padding: 0;
            line-height: 40px;
            text-align: center;
        }
    }

    .resendOtp {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 5px 0 30px;
        p {
            font-size: 13px;
            a {
                &.disabled {
                    color: $gray-color-300;
                    cursor: no-drop;
                }
            }
        }
    }

    .anotherLogin {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 50px 0 0;
    }
}
</style>