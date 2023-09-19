<template>
  <AddBloodPressure @hideDrawer="closeDrawer" v-if="props.deviceId == deviceIds.bloodPressureDeviceId" :deviceId="props.deviceId" :formTitle="props.formTitle" />
  <AddOxygenSaturation @hideDrawer="closeDrawer" v-if="props.deviceId == deviceIds.bloodOxygenDeviceId" :deviceId="props.deviceId" :formTitle="props.formTitle" />
  <AddBloodGlucose @hideDrawer="closeDrawer" v-if="props.deviceId == deviceIds.glucoseDeviceId" :deviceId="props.deviceId" :formTitle="props.formTitle" />
  <PatientVitalsLoader />
</template>

<script setup>
  import { 
    // defineProps,
    // defineEmits
  } from "vue";
  import AddBloodPressure from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/addVitals/AddBloodPressure";
  import AddOxygenSaturation from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/addVitals/AddOxygenSaturation";
  import AddBloodGlucose from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/addVitals/AddGlucose";
  import PatientVitalsLoader from '@/components/patients/patientDetails/leftPanel/tabs/vitals/PatientVitalsLoader';
import { useStore } from "vuex";
	import { deviceIds } from "@/config/common";
import { useRoute } from "vue-router";

  const store = useStore()
  const route = useRoute()
  
  const props = defineProps({
    deviceId: Number,
    formTitle: String,
  })
  const emit = defineEmits([
    'onClose'
  ])

  const closeDrawer = () => {
		store.dispatch('vitals/patientLatestVitals', route.params.udid)
    emit('onClose', false)
  }

</script>