<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="oxygenDefaultsForm" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Oxygen Saturation</a-typography-title>
        </a-col>
        
        <a-col :span="24">
          <a-row :gutter="[48, 16]">

            <a-col :span="24">
              <div class="form-heading" style="padding-top: 0;">
                <a-typography-title :level="3">WNL</a-typography-title>
                <a-typography-text>Within Normal Range</a-typography-text>
              </div>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['wnl', 'spo2_min']" label="SPO2 Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.percentageRegex, message: $t('global.allowedRangePercentage') }]">
                <InputNumber v-model:value="oxygenDefaultsForm.wnl.spo2_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['wnl', 'spo2_max']" label="SPO2 Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.percentageRegex, message: $t('global.allowedRangePercentage') }]">
                <InputNumber v-model:value="oxygenDefaultsForm.wnl.spo2_max" :disabled="false" />
              </a-form-item>
            </a-col>

            <!-- Moderate -->

            <a-col :span="24">
              <div class="form-heading">
                <a-typography-title :level="3">Moderate</a-typography-title>
                <a-typography-text>Moderate Range</a-typography-text>
              </div>
            </a-col>

            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'spo2_min']" label="SPO2 Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.percentageRegex, message: $t('global.allowedRangePercentage') }]">
                <InputNumber v-model:value="oxygenDefaultsForm.moderate.spo2_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'spo2_max']" label="SPO2 Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.percentageRegex, message: $t('global.allowedRangePercentage') }]">
                <InputNumber v-model:value="oxygenDefaultsForm.moderate.spo2_max" :disabled="false" />
              </a-form-item>
            </a-col>

            <!-- Critical -->

            <a-col :span="24">
              <div class="form-heading">
                <a-typography-title :level="3">Critical</a-typography-title>
                <a-typography-text>Critical Range</a-typography-text>
              </div>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['critical', 'spo2_below']" label="SPO2 Below" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.percentageRegex, message: $t('global.allowedRangePercentage') }]">
                <InputNumber v-model:value="oxygenDefaultsForm.critical.spo2_below" :disabled="false" />
              </a-form-item>
            </a-col>
            
          </a-row>
        </a-col>

      </a-row>
    </div>
    <div class="drawerFooter justifyBet">
      <Button classData="secondary-btn" @click="setDefaultVitals" :name="'Reset to Default'" />
      <a-space>
        <Button classData="secondary-btn" @click="hideDrawer" :name="'Cancel'" />
        <Button classData="primary-btn" html-type="submit" :name="'Save'" />
      </a-space>
    </div>
  </a-form>
  <PatientVitalsLoader />
</template>

<script setup>
import Button from "@/components/button/Button";
import InputNumber from "@/components/form-fields/InputNumber";
import PatientVitalsLoader from '@/components/patients/patientDetails/leftPanel/tabs/vitals/PatientVitalsLoader';
import {
  reactive,
  // defineEmits,
	computed,
	onMounted,
	watchEffect,
	ref
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { deviceIds } from "@/config/common";
import { regex } from "@/RegularExpressions/regex";

const emit = defineEmits(['hideDrawer'])

const store = useStore()
const route = useRoute()
const defaultVItals = ref(null)

const oxygenDefaultsForm = reactive({
  type: 'Oxygen Saturation',
  wnl: {
    spo2_min: '',
    spo2_max: '',
  },
  moderate: {
    spo2_min: '',
    spo2_max: '',
  },
  critical: {
    spo2_below: '',
  }
})

const endParams = computed(() => {
  return store.state.vitals.endParams
})

const getOxygenVitalDefaults = computed(() => {
  return store.state.vitals.getOxygenVitalDefaults
})

const defaultPatientVitals = computed(() => {
  return store.state.vitals.defaultPatientVitals
})

onMounted(() => {
  if(getOxygenVitalDefaults.value != null) {
    defaultVItals.value = getOxygenVitalDefaults.value
    Object.assign(oxygenDefaultsForm, defaultVItals.value)
  }
})

watchEffect(() => {
  if(defaultPatientVitals.value != null) {
    Object.assign(oxygenDefaultsForm, defaultPatientVitals.value)
  }
  else {
    Object.assign(oxygenDefaultsForm, defaultVItals.value)
  }
})

const submitForm = () => {
  store.dispatch('vitals/addVitalDefaults', {
    patientId: route.params.udid,
    data: oxygenDefaultsForm,
  })
  store.dispatch('vitals/getOxygenVitalDefaults', {
    patientId: route.params.udid,
    deviceType: deviceIds.bloodOxygenDeviceId
  })
  store.dispatch('vitals/patientLatestVitals', route.params.udid)
  store.dispatch('vitals/patientVitalsTable', {
    patientId: route.params.udid,
    deviceType: deviceIds.bloodOxygenDeviceId,
    activeTab: "oxygenLevels",
    endParams: endParams.value,
  })
  store.dispatch('vitals/patientVitalsGraph', {
    patientId: route.params.udid,
    deviceType: deviceIds.bloodOxygenDeviceId,
    activeTab: "oxygenLevels",
  })
  emit('hideDrawer')
}

const setDefaultVitals = () => {
  store.dispatch('vitals/defaultPatientVitals', {
    deviceType: deviceIds.bloodOxygenDeviceId,
  })
}

const hideDrawer = () => {
  store.commit('vitals/defaultPatientVitals', null)
  emit('hideDrawer')
}

</script>