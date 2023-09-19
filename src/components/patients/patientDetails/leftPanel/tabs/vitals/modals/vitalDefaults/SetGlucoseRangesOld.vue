<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="glucoseRangesForm" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Glucose</a-typography-title>
        </a-col>
        
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            
            <a-col :span="12">
              <a-form-item class="required" name="vitalType" label="Vital Type" :rules="[{ required: false, message: $t('global.required') }]">
                <SelectBox v-model:value="glucoseRangesForm.vitalType" :globalCode="glucoseVitalFieldsDropdown" @changeData="changeFieldType($event)" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <div class="form-heading" style="padding-top: 0;">
                <a-typography-title :level="3">WNL</a-typography-title>
                <a-typography-text>Within Normal Range</a-typography-text>
              </div>
            </a-col>
            
            <a-col :span="12">
              <a-form-item class="required" :name="['wnl', 'glucose_min']" label="Glucose Min" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.wnl.glucose_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item class="required" :name="['wnl', 'glucose_max']" label="Glucose Max" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.wnl.glucose_max" :disabled="false" />
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
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'glucose_min']" label="glucose Min" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.moderate.lowest.glucose_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'lowest', 'glucose_max']" label="glucose Max" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.moderate.lowest.glucose_max" :disabled="false" />
              </a-form-item>
            </a-col>

            <!-- Highest -->

            <a-col :span="24">
              <div class="capital">
                <a-typography-title :level="5">Moderately High</a-typography-title>
              </div>
            </a-col>

            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'glucose_min']" label="glucose Min" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.moderate.highest.glucose_min" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['moderate', 'highest', 'glucose_max']" label="glucose Max" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.moderate.highest.glucose_max" :disabled="false" />
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
              <a-form-item :class="'required'" :name="['critical', 'glucose_below']" label="Glucose Below" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.critical.glucose_below" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <a-form-item :class="'required'" :name="['critical', 'glucose_above']" label="Glucose Above" :rules="[{ required: false, message: $t('global.required') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="glucoseRangesForm.critical.glucose_above" :disabled="false" />
              </a-form-item>
            </a-col>
            
            <a-col :span="12">
              <Button v-if="showAddMore" classData="secondary-btn" :name="'+ Add More'" @click="addMoreData" />
            </a-col>
            
          </a-row>
        </a-col>
        
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <div class="vitalsTable">
              <a-col :span="24">
                <a-table v-if="localGlucoseVitalsRanges?.length > 0" :dataSource="localGlucoseVitalsRanges" :columns="vitalsColumns" :pagination="false">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'type'">
                      {{ record.vitalTypeName }}
                    </template>
                    <template v-if="column.dataIndex == 'wnl'">
                      {{ record.wnl.glucose_min }} - {{ record.wnl.glucose_max }}
                    </template>
                    <template v-if="column.dataIndex == 'moderate'">
                      {{ record.moderate.lowest.glucose_min }} - {{ record.moderate.lowest.glucose_max }}
                      &nbsp;Or&nbsp;
                      {{ record.moderate.highest.glucose_min }} - {{ record.moderate.highest.glucose_max }}
                    </template>
                    <template v-if="column.dataIndex == 'critical'">
                      {{ belowSign }}{{ record.critical.glucose_below }}
                      &nbsp;Or&nbsp;
                      {{ aboveSign }}{{ record.critical.glucose_above }}
                    </template>
                  </template>
                </a-table>
              </a-col>
            </div>
          </a-row>
        </a-col>

      </a-row>
    </div>
    <div class="drawerFooter justifyBet">
      <Button classData="primary-btn" @click="setDefaultVitals" :name="'Reset to Default'" />
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
import SelectBox from "@/components/form-fields/SelectBox";
import PatientVitalsLoader from '@/components/patients/patientDetails/leftPanel/tabs/vitals/PatientVitalsLoader';
import {
  reactive,
  // defineEmits,
	computed,
	onMounted,
	watchEffect,
	ref,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { deviceIds, vitalsTypes } from "@/config/common";
import { regex } from "@/RegularExpressions/regex";

const emit = defineEmits(['hideDrawer'])

const store = useStore()
const route = useRoute()
const showAddMore = ref(false)
const belowSign = '<'
const aboveSign = '>'
const formRef = ref()

const glucoseRangesForm = reactive({
  vitalType: '',
  vitalTypeName: 'Fasting',
  wnl: {
    glucose_min: '',
    glucose_max: '',
  },
  moderate: {
    lowest: {
      glucose_min: '',
      glucose_max: '',
    },
    highest: {
      glucose_min: '',
      glucose_max: '',
    },
  },
  critical: {
    glucose_below: '',
    glucose_above: '',
  }
})

const glocoseRangesFormReactive = reactive({ ...glucoseRangesForm })

// const endParams = computed(() => {
//   return store.state.vitals.endParams
// })

const getGlucoseVitalDefaults = computed(() => {
  return store.state.vitals.getGlucoseVitalDefaults
})

const defaultPatientVitals = computed(() => {
  return store.state.vitals.defaultPatientVitals
})

const localGlucoseVitalsRanges = computed(() => {
  return store.state.vitals.localGlucoseVitalsRanges
})

const glucoseRangeVitalFields = computed(() => {
  return store.state.vitals.glucoseRangeVitalFields
})

const glucoseVitalFieldsDropdown = computed(() => {
  return store.state.vitals.glucoseVitalFieldsDropdown
})

const changeFieldType = (value) => {
  glucoseRangesForm.vitalType = value

  let glucoseVitalFields = glucoseVitalFieldsDropdown.value
  glucoseVitalFields.map(field => {
    if(field.id == value) {
      glucoseRangesForm.vitalTypeName = field.name
    }
  })
  
  if(value == 1 && value == '1') {
    showAddMore.value = false
    localStorage.setItem('localGlucoseVitalsRanges', JSON.stringify([]))
    store.commit('vitals/localGlucoseVitalsRanges', JSON.parse(localStorage.getItem('localGlucoseVitalsRanges')))
  }
  else {
    showAddMore.value = true
  }
}

const addMoreData = () => {
  let glucoseVitalFields = glucoseVitalFieldsDropdown.value
  glucoseVitalFields.map(field => {
    if(field.id == glucoseRangesForm.vitalType) {
      glucoseRangesForm.vitalTypeName = field.name
    }
  })
  store.dispatch('vitals/glucoseVitalsRanges', glucoseRangesForm).then(() => {
    store.commit('vitals/localGlucoseVitalsRanges', JSON.parse(localStorage.getItem('localGlucoseVitalsRanges')))
    Object.assign(glucoseRangesForm, {})
    formRef.value.resetFields()
  })
}

onMounted(() => {
  localStorage.setItem('localGlucoseVitalsRanges', JSON.stringify([]))
  store.dispatch('vitals/glucoseVitalFieldsDropdown', deviceIds.glucoseDeviceId)
  store.dispatch('vitals/glucoseRangeVitalFields', deviceIds.glucoseDeviceId)
  if(getGlucoseVitalDefaults.value != null) {
    Object.assign(glucoseRangesForm, getGlucoseVitalDefaults.value)
  }
  glucoseRangesForm.vitalType = vitalsTypes.fasting
})

watchEffect(() => {
  if(defaultPatientVitals.value != null) {
    Object.assign(glucoseRangesForm, defaultPatientVitals.value)
  }
  else {
    Object.assign(glucoseRangesForm, getGlucoseVitalDefaults.value)
  }
})

const submitForm = () => {
  // glucoseRangesForm.vitalType = glucoseRangesForm.vitalType == 1 ? 0 : glucoseRangesForm.vitalType
  // glucoseRangesForm.vitalTypeName = glucoseRangesForm.vitalType == 0 ? 'All' : glucoseRangesForm.vitalTypeName
  // let glucoseRangesFormData = []

  let requestArray = []
  if(glucoseRangesForm.vitalType == 1) {
    glucoseRangeVitalFields.value.map(item => {
      requestArray.push({
        vitalType: item.id,
        vitalTypeName: item.name,
        wnl: glucoseRangesForm.wnl,
        moderate: glucoseRangesForm.moderate,
        critical: glucoseRangesForm.critical,
      })
    })
  }

  // glucoseRangesFormData.push(glucoseRangesForm)
  let requestData = {
    patientId: route.params.udid,
    data: {
      type: 'Glucose',
      data: localGlucoseVitalsRanges.value.length > 0 ? localGlucoseVitalsRanges.value : requestArray
    }
  }
  store.dispatch('vitals/addVitalDefaults', requestData).then(() => {
    emit('hideDrawer')
    store.dispatch('vitals/getGlucoseVitalDefaults', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      vitalType: 0,
    })
    store.dispatch('vitals/patientLatestVitals', route.params.udid)
    store.dispatch('vitals/patientVitalsTable', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      activeTab: "glucoseLevels",
      endParams: endParams.value,
    })
    store.dispatch('vitals/patientVitalsGraph', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      activeTab: "glucoseLevels",
    })
    localStorage.setItem('localGlucoseVitalsRanges', JSON.stringify([]))
  })
}

const setDefaultVitals = () => {
  showAddMore.value = false
  store.dispatch('vitals/defaultPatientVitals', {
    deviceType: deviceIds.glucoseDeviceId,
  })
}

const hideDrawer = () => {
  store.commit('vitals/localGlucoseVitalsRanges', [])
  localStorage.setItem('localGlucoseVitalsRanges', JSON.stringify([]))
  store.commit('vitals/defaultPatientVitals', null)
  emit('hideDrawer')
}
 const vitalsColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'WNL',
    dataIndex: 'wnl',
    key: 'wnl',
  },
  {
    title: 'Moderate',
    dataIndex: 'moderate',
    key: 'moderate',
  },
  {
    title: 'Critical',
    dataIndex: 'critical',
    key: 'critical',
  },
 ]

</script>

<style scoped>
.vitalsTable { font-size: 14px; }
</style>