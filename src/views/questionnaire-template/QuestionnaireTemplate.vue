<template>
 <a-layout-content> 
            <QuestionnaireTemplate :key="componentKey" />
</a-layout-content>
</template>
<script>
import QuestionnaireTemplate from "@/components/administration/questionnaire-template/QuestionnaireTemplate";
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/administration/layout/sidebar/Sidebar";
import { computed } from 'vue-demi';
import { useStore } from 'vuex';

export default {
    name: "Questionnaire Template",
    components: {
        QuestionnaireTemplate,
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
