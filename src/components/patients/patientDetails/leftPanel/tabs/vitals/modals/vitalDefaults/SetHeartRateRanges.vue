<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="heartRateDefaultsForm" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Heart Rate</a-typography-title>
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
              <a-form-item class="required" :name="['wnl', 'bpm_min']" label="BPM Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.wnl.bpm_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item class="required" :name="['wnl', 'bpm_max']" label="BPM Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.wnl.bpm_max" :disabled="false" />
              </a-form-item>
            </a-col>

            <!-- Moderate -->

            <a-col :span="24">
              <div class="form-heading">
                <a-typography-title :level="3">Moderate</a-typography-title>
                <a-typography-text>Moderate Range</a-typography-text>
              </div>
            </a-col>

            <!-- Lowest -->

            <a-col :span="24">
              <div class="capital">
                <a-typography-title :level="5">Moderately Low</a-typography-title>
              </div>
            </a-col>

            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'bpm_min']" label="bpm Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.moderate.lowest.bpm_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'bpm_max']" label="bpm Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.moderate.lowest.bpm_max" :disabled="false" />
              </a-form-item>
            </a-col>

            <!-- Highest -->

            <a-col :span="24">
              <div class="capital">
                <a-typography-title :level="5">Moderately High</a-typography-title>
              </div>
            </a-col>

            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'bpm_min']" label="bpm Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.moderate.highest.bpm_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'bpm_max']" label="bpm Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.moderate.highest.bpm_max" :disabled="false" />
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
              <a-form-item :class="'required'" :name="['critical', 'bpm_below']" label="BPM Below" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.critical.bpm_below" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['critical', 'bpm_above']" label="BPM Above" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="heartRateDefaultsForm.critical.bpm_above" :disabled="false" />
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
const defaultVitals = ref(null)

const heartRateDefaultsForm = reactive({
  type: 'Heart Rate',
  wnl: {
    bpm_min: '',
    bpm_max: '',
  },
  moderate: {
    lowest: {
      bpm_min: '',
      bpm_max: '',
    },
    highest: {
      bpm_min: '',
      bpm_max: '',
    },
  },
  critical: {
    bpm_below: '',
    bpm_above: '',
  }
})

const endParams = computed(() => {
  return store.state.vitals.endParams
})

const getHeartRateVitalDefaults = computed(() => {
  return store.state.vitals.getHeartRateVitalDefaults
})

const defaultPatientVitals = computed(() => {
  return store.state.vitals.defaultPatientVitals
})

onMounted(() => {
  if(getHeartRateVitalDefaults.value != null) {
    defaultVitals.value = getHeartRateVitalDefaults.value
    Object.assign(heartRateDefaultsForm, defaultVitals.value)
  }
})

watchEffect(() => {
  if(defaultPatientVitals.value != null) {
    Object.assign(heartRateDefaultsForm, defaultPatientVitals.value)
  }
  else {
    Object.assign(heartRateDefaultsForm, defaultVitals.value)
  }
})

const submitForm = () => {
  store.dispatch('vitals/addVitalDefaults', {
    patientId: route.params.udid,
    data: heartRateDefaultsForm,
  })
  store.dispatch('vitals/getHeartRateVitalDefaults', {
    patientId: route.params.udid,
    deviceType: deviceIds.heartRateDeviceId
  })
  store.dispatch('vitals/patientLatestVitals', route.params.udid)
  store.dispatch('vitals/patientVitalsTable', {
    patientId: route.params.udid,
    deviceType: deviceIds.heartRateDeviceId,
    activeTab: "heartRate",
    endParams: endParams.value,
  })
  store.dispatch('vitals/patientVitalsGraph', {
    patientId: route.params.udid,
    deviceType: deviceIds.heartRateDeviceId,
    activeTab: "heartRate",
  })
  emit('hideDrawer')
}

const setDefaultVitals = () => {
  store.dispatch('vitals/defaultPatientVitals', {
    deviceType: deviceIds.heartRateDeviceId,
  })
}

const hideDrawer = () => {
  store.commit('vitals/defaultPatientVitals', null)
  emit('hideDrawer')
}

</script>