<template>
<div v-if="loaderStatus" class="loader">
    <div class="loaderWrapper ">
        <!-- <div class="loaderInner"></div> -->
        <a-spin size="large" />
    </div>
</div>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";
export default {
    name: 'Logout Loader',
    setup() {
        const store = useStore();
        const loaderStatus = computed(() => {
            return store.state.common.logoutLoader;
        });
        return {
            loaderStatus
        }
        
    }
}
</script>
<style>
.loader {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.3);
	z-index:1;
}

.loaderWrapper {
    text-align: center;
    z-index:2;
    position: absolute;
    top: 50%;
    background-color: #fff;
    left: 50%;
    transform: translate(-50% , -50%);
    padding: 25px;
    border-radius: 10px;
    border: 0;
}
/* .loaderWrapper .loaderInner{
    border: 1px solid #000;
    border-radius: 50%;
    border-right-color: transparent;
    border-bottom-color: transparent;
    width: 50px;
    height: 50px;
    animation-name: loading;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
@keyframes loading{
from {
	transform: rotate(0deg);
}
to {
	transform: rotate(360deg);
}
} */
</style>