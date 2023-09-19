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
            <QuestionTemplateDetail />
       </a-layout-content>
     <!-- </a-layout>
</a-layout> -->
</template>
<script>
import QuestionTemplateDetail from "@/components/administration/questionnaire-template/QuestionTemplateDetail";
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/administration/layout/sidebar/Sidebar";
export default {
    name: "Questionnaire Template Detail",
    components: {
        QuestionTemplateDetail,
        // Header,
        // Sidebar,
    },
    setup() {
        return {}
    }
}
</script>
