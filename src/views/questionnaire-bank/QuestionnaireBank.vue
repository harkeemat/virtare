<template>
    <!-- <a-layout>
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <Header />
        </a-layout-header>
        <a-layout>
            <a-layout-sider :style="{overflow: 'auto',height: '100vh',position: 'fixed',left: 0,}">
                <Sidebar />
            </a-layout-sider> -->
            <a-layout-content>
                <QuestionnaireBank :key="componentKey" />
             </a-layout-content>
       <!-- </a-layout>
    </a-layout> -->
</template>
    
<script>
    import QuestionnaireBank from "@/components/administration/questionnaire-bank/QuestionnaireBank";
    // import Header from "@/components/layout/header/Header";
    // import Sidebar from "@/components/administration/layout/sidebar/Sidebar";
    import { computed } from 'vue-demi';
    import { useStore } from 'vuex';

    export default {
        name: "Questionnaire Bank",
        components: {
            QuestionnaireBank,
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
    