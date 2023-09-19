<template>
  <a-row :gutter="24" v-bind:class="vitalGrid" >
    <template v-if="!patients.devices?.length>0">
      <a-col :sm="24">
        <a-alert message="No devices are assigned to this Patient. Please assign device(s) to see Vitals." type="error" />
      </a-col>
    </template>
    <template v-for="device in patients.devices" :key="device.id">
      <VitalsGrid
        v-if="device.deviceType == 'Blood Pressure'"
        title="Blood Pressure"
        :deviceId="device.deviceTypeId"
        :filterButtons="patientsRecord?.bloodPressureTimeline"
        commit="bloodPressureTimeline"
        :tableColumns="bloodPressureColumns"
        :tableData="patients.bloodPressure"
        :chartOptions="bloodPressureOptions"
        :chartSeries="patients.bloodPressureGraph?.records"
        @showModal="showAddBPModal"
        :isEscalationAction="isEscalationAction"
        :escalationAdd="escalationAdd"
       :scroll="{ x:'600px', y :'190px' }"
       :patientId="patientId"
      />
      <VitalsGrid
        v-if="device.deviceType == 'Glucose' "
        title="Blood Glucose"
        :deviceId="device.deviceTypeId"
        :filterButtons="patientsRecord?.bloodGlucoseTimeline"
        commit="bloodGlucoseTimeline"
        :tableColumns="bloodGlucoseColumns"
        :tableData="patients.bloodGlucose"
        :chartOptions="bloodGlucoseOptions"
        :chartSeries="patients.bloodGlucoseGraph?.records"
        @showModal="showAddBloodGlucoseModal"
        :isEscalationAction="isEscalationAction"
        :escalationAdd="escalationAdd"
        :scroll="{ x:'1500px', y :'190px'  }"
        :patientId="patientId"
      />

      <VitalsGrid
        v-if="device.deviceType == 'Oximeter' "
        title="Blood Oxygen Saturation"
        :deviceId="device.deviceTypeId"
        :filterButtons="patientsRecord?.bloodOxygenTimeline"
        commit="bloodOxygenTimeline"
        :tableColumns="bloodOxygenColumns"
        :tableData="patients.bloodOxygen"
        :chartOptions="bloodOxygenOptions"
        :chartSeries="patients.bloodOxygenGraph?.records"
        @showModal="showAddBloodOxygenModal"
        :isEscalationAction="isEscalationAction"
        :escalationAdd="escalationAdd"
        :scroll="{ x:'600px', y :'190px'  }"
        :patientId="patientId"
      />
    </template>
  </a-row>
  <AddVitalsModal v-if="visibleAddVitalsModal" v-model:visible="visibleAddVitalsModal" :title="title" :deviceId="deviceId" @closeModal="handleOk" :patientId="patientId" @ok="handleOk" />
</template>
<script>
import { computed, onMounted, ref } from 'vue-demi';
import AddVitalsModal from "@/components/modals/AddVitalsModal";
import VitalsGrid from "@/components/patients/patientSummary/common/VitalsGrid";
import { useStore } from 'vuex';
import {
  yaxis,
} from '@/commonMethods/commonMethod'
import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";

const bloodPressureColumns = [
      {
        title: "Time & Date Vitals Taken",
        dataIndex: "takeTime",
        key: "takeTime",
        slots: {
          customRender: "takeTime",
        },
      },
      {
        title: "Systolic",
        dataIndex: "blood_pressure_systolic",
        key: "blood_pressure_systolic",
        slots: {
          customRender: "blood_pressure_systolic",
        },
      },
      {
        title: "Diastolic",
        dataIndex: "blood_pressure_diastolic",
        key: "blood_pressure_diastolic",
        slots: {
          customRender: "blood_pressure_diastolic",
        },
      },
      {
        title: "BPM",
        dataIndex: "blood_pressure_bpm",
        key: "blood_pressure_bpm",
        slots: {
          customRender: "blood_pressure_bpm",
        },
      },
    ];
   const bloodOxygenColumns = [
      {
        title: "Time & Date Vitals Taken",
        dataIndex: "takeTime",
        key: "takeTime",
        slots: {
          customRender: "takeTime",
        },
      },
      {
        title: "SPO2",
        dataIndex: "oximeter_spo2",
        key: "oximeter_spo2",
        slots: {
          customRender: "oximeter_spo2",
        },
      },
      {
        title: "BPM",
        dataIndex: "oximeter_bpm",
        key: "oximeter_bpm",
        slots: {
          customRender: "oximeter_bpm",
        },
      },
    ];
  const bloodGlucoseColumns = [
      {
        title: "Time & Date Vitals Taken",
        dataIndex: "takeTime",
        key: "takeTime",
        width:"15%",
        slots: {
          customRender: "takeTime",
        },
      },
      {
        title: "Random Blood Sugar",
        dataIndex: "glucose_random_blood_sugar",
        key: "glucose_random_blood_sugar",
        width:"13%",
        slots: {
          customRender: "glucose_random_blood_sugar",
        },
      },
      {
        title: "Fasting Blood Sugar",
        dataIndex: "glucose_fasting_blood_sugar",
        key: "glucose_fasting_blood_sugar",
        width:"13%",
        slots: {
          customRender: "glucose_fasting_blood_sugar",
        },
      },
      {
        title: "Fasting",
        dataIndex: "glucose_fasting",
        key: "glucose_fasting",
        width:"10%",
        slots: {
          customRender: "glucose_fasting",
        },
      },
      {
        title: "Pre Meal",
        dataIndex: "glucose_pre_meal",
        key: "glucose_pre_meal",
        width:"10%",
        slots: {
          customRender: "glucose_pre_meal",
        },
      },
      {
        title: "Post Meal",
        dataIndex: "glucose_post_meal",
        key: "glucose_post_meal",
        width:"10%",
        slots: {
          customRender: "glucose_post_meal",
        },
      },
      {
        title: "Before Sleep",
        dataIndex: "glucose_before_sleep",
        key: "glucose_before_sleep",
        width:"10%",
        slots: {
          customRender: "glucose_before_sleep",
        },
      },
      {
        title: "General",
        dataIndex: "glucose_general",
        key: "glucose_general",
        width:"8%",
        slots: {
          customRender: "glucose_general",
        },
      },
    ];
export default {
  components: {
    AddVitalsModal,
    VitalsGrid,
  },
  props: {
		patientId: {
			type: String
		},
    isEscalationAction:{
      type:Boolean
    },
    escalationAdd:{
      type:Boolean
    }
  },
  setup() {
    const store = useStore()
    const visibleAddVitalsModal = ref(false)
    const title = ref(null)
    const deviceId = ref(null)
    const patients = computed(() => {
      return store.state.patients
    })
    const checkChangedInput = computed(() => {
      return store.state.common.checkChangeInput
    })
    onMounted(()=>{

    })
    const handleOk = (value) => {
      visibleAddVitalsModal.value = value ? value : true
      if(value && checkChangedInput.value) {
          warningSwal(messages.modalWarning).then((response) => {
              if (response == true) {
                  visibleAddVitalsModal.value = false
                  store.commit('checkChangeInput', false)
              }
              else {
                  visibleAddVitalsModal.value = true
              }
          });
      }
      else {
          visibleAddVitalsModal.value = false;
      }
    }
    const showAddBPModal = () => {
      deviceId.value = 99;
      visibleAddVitalsModal.value = true;
      title.value = 'Blood Pressure';
    };
    const showAddBloodOxygenModal = () => {
      deviceId.value = 100;
      visibleAddVitalsModal.value = true;
      title.value = 'Blood Oxygen Saturation';
    };
    const showAddBloodGlucoseModal = () => {
      deviceId.value = 101;
      visibleAddVitalsModal.value = true;
      title.value = 'Blood Glucose';
    };
    const bloodPressureOptions = {
      chart: {
        height: 210,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        title:{
          text: 'Time'
        },
        categories: patients.value.bloodPressureGraph?.timesArray,
      },
      yaxis: yaxis("Number of Vitals"),
    };

    const bloodOxygenOptions = {
      chart: {
        height: 210,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        title:{
          text: 'Time'
        },
        categories: patients.value.bloodOxygenGraph?.timesArray,
      },
      yaxis: yaxis("Number of Vitals"),
    };

    const bloodGlucoseOptions = {
      chart: {
        height: 210,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        title:{
          text: 'Time'
        },
        categories: patients.value.bloodGlucoseGraph?.timesArray,
      },
      yaxis: yaxis("Number of Vitals"),
    };

    return {
      showAddBPModal,
      showAddBloodGlucoseModal,
      showAddBloodOxygenModal,
      title,
      visibleAddVitalsModal,
      deviceId,
      handleOk,
      bloodPressureColumns,
      bloodGlucoseColumns,
      bloodOxygenColumns,
      bloodPressureOptions,
      bloodGlucoseOptions,
      bloodOxygenOptions,
      patients,
      vitalGrid:'vitalGrid',
      patientsRecord:store.getters.patientsRecord
    }
  }
}
</script>
<style scoped>
  .warningMessage {
    text-align: center;
    background: #f6c9af;
    padding: 15px;
    font-size: 16px !important;
  }
  .vitalGrid {
    margin-left: 5px !important;
    margin-right: 5px !important;
  }
</style>
