<template>
<!-- <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <Header />
    </a-layout-header>
    <a-layout>
        <a-layout-sider :style="{overflow: 'auto',height: '100vh',position: 'fixed',left: 0,}">
            <Sidebar />
        </a-layout-sider>-->
        <a-layout-content> 
            <TemplateResponse />
         </a-layout-content>
   <!-- </a-layout>
</a-layout> -->
</template>
<script>
import TemplateResponse from "@/components/administration/questionnaire-template/TemplateResponse";
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/administration/layout/sidebar/Sidebar";
export default {
    name: "Template Response",
    components: {
        TemplateResponse,
        // Header,
        // Sidebar,
    },
    setup() {
        return {}
    }
}
</script>
