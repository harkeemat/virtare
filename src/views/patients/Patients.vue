<template>
<!-- <div>
    <a-layout>
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <Header @collapsMenu="collapsMenu($event)"/>
        </a-layout-header>
        <a-layout>
            <a-layout-sider v-show="toggleMenu" :style="{overflow: 'auto', height: '100vh',position: 'fixed',left: 0,}">
                <Sidebar />
            </a-layout-sider> -->
            <a-layout-content>
                <Patients :key="componentKey" />
           </a-layout-content>
         <!-- </a-layout>
    </a-layout>
</div> -->
</template>

<script>
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/layout/sidebar/Sidebar";
import Patients from "@/components/patients/Patients";
import { computed } from 'vue-demi';
import { useStore } from 'vuex';

import { ref } from 'vue-demi';
export default {
    components: {
        // Header,
        // Sidebar,
        Patients
    },

    setup() {
        const store = useStore()
        const componentKey = computed(() => {
        return store.state.common.componentKey
        })
        const toggleMenu = ref(true)
        // function collapsMenu(value){
        //     toggleMenu.value= value
        // }
        return {
            componentKey,
            toggleMenu,
            // collapsMenu

        };
    },
};
</script>
