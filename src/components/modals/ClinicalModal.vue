<template>
  <a-modal width="90%" title="History & Meds" centered :maskClosable="false" @cancel="closeModal()">
    <ClinicalData :idPatient="idPatient"/>
  </a-modal>
</template>

<script>
import { computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  actionTrack
} from '@/commonMethods/commonMethod';
import ClinicalData from '@/components/modals/forms/ClinicalData';
export default {
  props:{
    idPatient:String
  },
  components: {
    ClinicalData,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();

    watchEffect(() => {
      if(route.name == "PatientSummary") {
        // 
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