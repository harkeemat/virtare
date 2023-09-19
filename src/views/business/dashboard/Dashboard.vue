<template>
<!-- <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <Header />
    </a-layout-header>
    <a-layout>
        <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
            <Sidebar />
        </a-layout-sider> -->
        <Dashboard />
    <!-- </a-layout>
</a-layout> -->
</template>
<script>
import Dashboard from "@/components/business/dashboard/Dashboard"
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/layout/sidebar/Sidebar";
export default {
    name: 'Business Dashboard View',
    components: {
        Dashboard,
        // Header,
        // Sidebar,
    }
}
</script>
