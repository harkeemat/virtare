<template>
  <a-table v-if="emergencyContacts?.length > 0" :dataSource="emergencyContacts" :columns="emergencyContactsColumns"
    class="common-table" :pagination="false" :customRow="customRow" @change="tableSorting">
  </a-table>
  <div v-else>
    <EmptyTable :text="$t('global.emergencyContactTab')" />
  </div>
  <a-col :span="24" v-if="emergencyContacts?.length > 0">
    <Pagination :meta="deviceRecord?.deviceMeta" :endpoint="emergencyContactsList(route?.params?.udid)" :params="null" loader="patientTabLoader" />
  </a-col>
  <PatientTabsLoader />
  <a-drawer placement="right" :closable="false" :visible="visibleEmergencyContactForm" width="60%">
    <EmergencyContactForm @onClose="closeForm($event)" :isEdit="true"/>
  </a-drawer>
</template>

<script>
import EmptyTable from '@/components/administration/clients/EmptyTable.vue';
import Pagination from "@/components/pagination/Pagination";
import PatientTabsLoader from "@/components/patients/PatientTabsLoader";
import EmergencyContactForm from "@/components/patients/patientDetails/leftPanel/tabs/emergencyContacts/EmergencyContactForm";
import { useStore } from 'vuex';
// import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { emergencyContactsList } from "@/config/apiConfig"

export default {
  components: {
    EmptyTable,
    Pagination,
    PatientTabsLoader,
    EmergencyContactForm,
  },
  setup() {
    const store = useStore()
    // const route = useRoute()

    const visibleEmergencyContactForm = ref(false);

    function customRow(record) {
      return {
        onClick: () => {
          visibleEmergencyContactForm.value = true;
          store.commit('emergencyContacts/emergencyContactDetails', record)
        },
      };
    }

    const emergencyContacts = computed(() => {
      return store.state.emergencyContacts.emergencyContacts
    })
    
    onMounted(() => {
      // store.dispatch('emergencyContacts/emergencyContacts', route.params.udid)
      store.dispatch('emergencyContacts/emergencyContacts', 'b2a5ecd9-1420-484d-a42f-8daaa5d4fafa')
    })

    const closeForm = (event) => {
      visibleEmergencyContactForm.value = event
    }

    const emergencyContactsColumns = [
      {
        title: "Name",
        dataIndex: "fullName",
        key: "fullName",
        sorter: (a, b) => a.fullName.localeCompare(b.fullName)
      },
      {
        title: "Preferred method of contact",
        dataIndex: "fullName",
        key: "fullName",
        sorter: (a, b) => a.fullName.localeCompare(b.fullName)
      },
      {
        title: "Preferred time of day for contact",
        dataIndex: "fullName",
        key: "fullName",
        sorter: (a, b) => a.fullName.localeCompare(b.fullName)
      },
    ]

    return {
      visibleEmergencyContactForm,
      customRow,
      emergencyContactsColumns,
      emergencyContacts,
      emergencyContactsList,
      closeForm,
    }
  }
}
</script>