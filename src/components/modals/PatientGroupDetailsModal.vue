<template>
  <a-modal class="patientGroupModal" width="60%" :title="'Patient Groups'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-table class="sortIconTable" rowKey="id" :columns="getPatientGroupColumns" :data-source="getPatientGroup" :pagination="false">
    </a-table>
  </a-modal>
</template>

<script>
import { computed, reactive } from 'vue-demi'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    
    const patientGroupForm = reactive({
      group: "",
    });

    const getPatientGroup = computed(() => {
      return store.state.patients.getPatientGroup
    })

    const submitPatientGroupForm = () => {
      store.dispatch('addPatientGroup', {
        patientId: route.params.id,
        data: patientGroupForm,
      }).then(() => {
        closeModal()
      })
    }

    const closeModal = () => {
      emit("closeModal", {
        modal: 'groupDetails',
        value: false,
      });
    }

    const getPatientGroupColumns = [
      {
        title: "Group",
        dataIndex: "group",
        key: "group",
        sorter: true,
      },
      {
        title: "Provider",
        dataIndex: "providerName",
        key: "providerName",
        sorter: true,
      },
      {
        title: "Location",
        dataIndex: "providerLocationName",
        key: "providerLocationName",
        sorter: true,
      },
    ]

    return {
      patientGroupForm,
      getPatientGroupColumns,
      getPatientGroup,
      submitPatientGroupForm,
      closeModal,
    }
  }
}
</script>