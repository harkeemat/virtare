<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="BPDefaultsForm" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Blood Pressure</a-typography-title>
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
              <a-form-item :class="'required'" :name="['wnl', 'systolic_min']" label="systolic Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.wnl.systolic_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['wnl', 'systolic_max']" label="systolic Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.wnl.systolic_max" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['wnl', 'diastolic_min']" label="diastolic Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.wnl.diastolic_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['wnl', 'diastolic_max']" label="diastolic Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.wnl.diastolic_max" :disabled="false" />
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
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'systolic_min']" label="systolic Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.lowest.systolic_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'systolic_max']" label="systolic Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.lowest.systolic_max" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'diastolic_min']" label="diastolic Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.lowest.diastolic_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'diastolic_max']" label="diastolic Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.lowest.diastolic_max" :disabled="false" />
              </a-form-item>
            </a-col>

            <!-- Highest -->

            <a-col :span="24">
              <div class="capital">
                <a-typography-title :level="5">Moderately High</a-typography-title>
              </div>
            </a-col>

            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'systolic_min']" label="systolic Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.highest.systolic_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'systolic_max']" label="systolic Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.highest.systolic_max" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'diastolic_min']" label="diastolic Min" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.highest.diastolic_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'diastolic_max']" label="diastolic Max" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.moderate.highest.diastolic_max" :disabled="false" />
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
              <a-form-item :class="'required'" :name="['critical', 'systolic_below']" label="Systolic Below" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.critical.systolic_below" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['critical', 'systolic_above']" label="Systolic Above" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.critical.systolic_above" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['critical', 'diastolic_below']" label="Diastolic Below" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.critical.diastolic_below" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['critical', 'diastolic_above']" label="Diastolic Above" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.BPRegex, message: $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="BPDefaultsForm.critical.diastolic_above" :disabled="false" />
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

const BPDefaultsForm = reactive({
  type: 'Blood Pressure',
  wnl: {
    systolic_min: '',
    systolic_max: '',
    diastolic_min: '',
    diastolic_max: '',
  },
  moderate: {
    lowest: {
      systolic_min: '',
      systolic_max: '',
      diastolic_min: '',
      diastolic_max: '',
    },
    highest: {
      systolic_min: '',
      systolic_max: '',
      diastolic_min: '',
      diastolic_max: '',
    },
  },
  critical: {
    systolic_below: '',
    systolic_above: '',
    diastolic_below: '',
    diastolic_above: '',
  }
})

const endParams = computed(() => {
  return store.state.vitals.endParams
})

const getBPVitalDefaults = computed(() => {
  return store.state.vitals.getBPVitalDefaults
})

const defaultPatientVitals = computed(() => {
  return store.state.vitals.defaultPatientVitals
})

onMounted(() => {
  if(getBPVitalDefaults.value != null) {
    defaultVitals.value = getBPVitalDefaults.value
    Object.assign(BPDefaultsForm, defaultVitals.value)
  }
})

watchEffect(() => {
  if(defaultPatientVitals.value != null) {
    Object.assign(BPDefaultsForm, defaultPatientVitals.value)
  }
  else {
    Object.assign(BPDefaultsForm, defaultVitals.value)
  }
})

const submitForm = () => {
  store.dispatch('vitals/addVitalDefaults', {
    patientId: route.params.udid,
    data: BPDefaultsForm,
  }).then(() => {
    store.dispatch('vitals/getBPVitalDefaults', {
      patientId: route.params.udid,
      deviceType: deviceIds.bloodPressureDeviceId
    })
    store.dispatch('vitals/patientLatestVitals', route.params.udid)
    store.dispatch('vitals/patientVitalsTable', {
      patientId: route.params.udid,
      deviceType: deviceIds.bloodPressureDeviceId,
      activeTab: "bloodPressure",
      endParams: endParams.value,
    })
    store.dispatch('vitals/patientVitalsGraph', {
      patientId: route.params.udid,
      deviceType: deviceIds.bloodPressureDeviceId,
      activeTab: "bloodPressure",
    })
    emit('hideDrawer')
  })
}

const setDefaultVitals = () => {
  store.dispatch('vitals/defaultPatientVitals', {
    deviceType: deviceIds.bloodPressureDeviceId,
  })
}

const hideDrawer = () => {
  store.commit('vitals/defaultPatientVitals', null)
  emit('hideDrawer')
}

</script>

<style>
.capital {
  text-transform: uppercase;
  margin-top: 20px;
}
</style>