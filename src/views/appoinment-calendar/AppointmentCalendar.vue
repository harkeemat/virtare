<template>
<!-- <div>
    <a-layout>
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <Header @is-heardeVisible="appointment($event)" />
        </a-layout-header>
        <a-layout>
                <Sidebar />
            </a-layout-sider>-->
            <a-layout-content> 
                <Appointment :key="componentKey" :headerData="data"/>
             </a-layout-content>
       <!-- </a-layout>
    </a-layout>
</div> -->
</template>

    
    
<script>
// import Header from "@/components/layout/header/Header";
// import Sidebar from "@/components/layout/sidebar/Sidebar";
import Appointment from "@/components/appoinment-calendar/AppointmentCalendar";
import { computed } from 'vue-demi';
import { useStore } from 'vuex';

import { ref } from "vue"
export default {
    components: {
        // Header,
        // Sidebar,
        Appointment
    },
    props: {

    },
    setup() {
        const store = useStore()
        const componentKey = computed(() => {
            return store.state.common.componentKey
        })
       const data = ref('')
        const appointment = event => {
            
            data.value = event.date
        }

        return {
            appointment,
            data,
            componentKey,
        };
    },
};
</script>
