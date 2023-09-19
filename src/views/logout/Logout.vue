<template>
	<div>
        <Loader/>
	</div>
</template>
<script>
import {onMounted} from "vue"
import {useStore} from "vuex"
import Loader from "@/components/loader/Loader.vue";
export default {
    name: "ViewLogout",
    setup() {
        const store = useStore();
        onMounted(() => {
            store.dispatch("logoutUser");
        });
        return {};
    },
    components: { Loader }
};
</script>