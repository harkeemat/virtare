<template>
  <a-modal width="90%" title="Conditions Details" centered :maskClosable="false" @cancel="closeModal()">
    <PatientConditions />
  </a-modal>
</template>

<script>
import { computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  actionTrack
} from '@/commonMethods/commonMethod';
import PatientConditions from '@/components/modals/forms/PatientConditions';
export default {
  components: {
    PatientConditions,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();

    watchEffect(() => {
      if(route.name == "PatientSummary") {
        store.dispatch('patientConditions', route.params.udid);
      }
    })

    const conditionsColumns = [
      {
        title: "Conditions",
        dataIndex: "condition",
        key: "condition",
      },
    ];

    const conditionsList = computed(() => {
      return store.state.patients.conditionsList
    })

    const closeModal = () => {
      emit('closeModal')
    }

    return {
      actionTrack,
      conditionsColumns,
      conditionsList,
      closeModal,
    };
  },
}
</script>