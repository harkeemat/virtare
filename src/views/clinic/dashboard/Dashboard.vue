<template>
    <!-- <a-layout>
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <Header />
        </a-layout-header>
        <a-layout>
            <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
                <Sidebar />
            </a-layout-sider> -->
            <Dashboard :key="componentKey" />
        <!-- </a-layout>
    </a-layout> -->
</template>

<script>
import Dashboard from "@/components/clinic/dashboard/Dashboard"
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/layout/sidebar/Sidebar";
import { computed } from 'vue-demi';
import { useStore } from 'vuex';

export default {
    name: 'ViewDashboard',
    components: {
        Dashboard,
        // Header,
        // Sidebar,
    },
    setup() {
        const store = useStore()
        const componentKey = computed(() => {
            return store.state.common.componentKey
        })

        return {
            componentKey,
        }
    }
}
</script>
