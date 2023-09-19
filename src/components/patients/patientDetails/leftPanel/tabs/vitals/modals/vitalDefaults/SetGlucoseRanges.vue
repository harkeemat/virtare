<template>
  <a-form class="common-form" ref="formRef" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" >
  <div class="drawerBody">
    <a-row :gutter="[48, 16]">
      <a-col :span="24">
        <a-typography-title :level="2" class="common-heading">Glucose</a-typography-title>
      </a-col>

      <a-col :span="24">
        <a-checkbox class="custom-checkbox" @change="changeSetForAll" :checked="setForAll">Set for All</a-checkbox>
      </a-col>

      <a-col :span="24"></a-col>
      
      <a-col :span="24">
          <a-table :data-source="dataSource" :columns="columns" :pagination="false" bordered size="middle">
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'vitalTypeName'">
                {{ text }}
                <span style="float: right">
                  <span v-if="editableData[record.key]">
                    <CheckOutlined class="row-btn" @click="save(record.key)" title="Save" />
                  </span>
                  <span v-else>
                    <EditOutlined class="row-btn" @click="edit(record.key)" title="Edit" />
                  </span>
                </span>
              </template>
              <template v-if="['wnl_min', 'wnl_max', 'moderate_lower_min', 'moderate_lower_max', 'moderate_higher_min', 'moderate_higher_max', 'critical_below', 'critical_above'].includes(column.dataIndex)">
                <div>
                  <InputNumber v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" :disabled="false" />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
            </template>
          </a-table>
      </a-col>

    </a-row>
  </div>
  <div class="drawerFooter">
    <span v-if="showError" class="showError">
      <svg class="showError-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.71749 2.89589L1.36499 13.5009C1.23401 13.7277 1.16471 13.9849 1.16398 14.2468C1.16324 14.5087 1.2311 14.7662 1.36081 14.9938C1.49051 15.2213 1.67753 15.4109 1.90327 15.5438C2.129 15.6766 2.38558 15.748 2.64749 15.7509H15.3525C15.6144 15.748 15.871 15.6766 16.0967 15.5438C16.3224 15.4109 16.5095 15.2213 16.6392 14.9938C16.7689 14.7662 16.8367 14.5087 16.836 14.2468C16.8353 13.9849 16.766 13.7277 16.635 13.5009L10.2825 2.89589C10.1488 2.67547 9.96053 2.49323 9.73588 2.36675C9.51124 2.24027 9.25779 2.17383 8.99999 2.17383C8.74218 2.17383 8.48873 2.24027 8.26409 2.36675C8.03944 2.49323 7.85119 2.67547 7.71749 2.89589Z" stroke="#F95932" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 7.22461V10.2246" stroke="#F95932" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 12.75H9.00755" stroke="#F95932" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ global.allowedRangeGlucose }}
    </span>
    <Button classData="secondary-btn" @click="hideDrawer" :name="'Close'" />
    <Button classData="primary-btn" html-type="submit" @click="submitForm" :name="'Save'" :disabled="editableDataKey != null || showError" />
  </div>
  </a-form>
  <PatientVitalsLoader />
</template>

<script setup>
import Button from "@/components/button/Button";
import PatientVitalsLoader from '@/components/patients/patientDetails/leftPanel/tabs/vitals/PatientVitalsLoader';
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { useStore } from 'vuex';
import { deviceIds } from "@/config/common";
import { useRoute } from "vue-router";
import InputNumber from "@/components/form-fields/InputNumber";
import global from "@/locales/english-modules/global";

const emit = defineEmits(['hideDrawer'])

const editableData = reactive({});
const store = useStore()
const route = useRoute()
const setForAll = ref(false)
const showError = ref(false)
const editableDataKey = ref(null)

const glucoseVitalDefaultsList = computed(() => {
  return store.state.vitals.glucoseVitalDefaultsList
})

const glucoseRangeVitalFields = computed(() => {
  return store.state.vitals.glucoseRangeVitalFields
})

const defaultPatientVitals = computed(() => {
  return store.state.vitals.defaultPatientVitals
})

const vitalTypeValue = computed(() => {
  return store.state.vitals.vitalTypeValue
})

const dataSource = ref([]);

onMounted(() => {
  store.dispatch('vitals/defaultPatientVitals', {
    deviceType: deviceIds.glucoseDeviceId,
  })
  store.dispatch('vitals/glucoseRangeVitalFields', deviceIds.glucoseDeviceId)
  store.dispatch('vitals/glucoseVitalDefaultsList', route.params.udid).then(() => {
    glucoseVitalDefaultsList.value.map((item, index) => {
      dataSource.value.push({
        key: index,
        vitalType: item.vitalType,
        vitalTypeName: item.vitalTypeName,
        wnl_min: item.wnl.glucose_min,
        wnl_max: item.wnl.glucose_max,
        moderate_lower_min: item.moderate.lowest.glucose_min,
        moderate_lower_max: item.moderate.lowest.glucose_max,
        moderate_higher_min: item.moderate.highest.glucose_min,
        moderate_higher_max: item.moderate.highest.glucose_max,
        critical_below: item.critical.glucose_below,
        critical_above: item.critical.glucose_above,
      })
    })
  })
})

const edit = key => {
  cancel(editableDataKey.value)
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  editableDataKey.value = editableData[key].key;
};

const changeSetForAll = (event) => {
  cancel(editableDataKey.value)
  dataSource.value = []
  setForAll.value = event.target.checked
  if(event.target.checked) {
    dataSource.value = [{
      key: 0,
      vitalType: 1,
      vitalTypeName: 'All',
      wnl_min: defaultPatientVitals.value.wnl.glucose_min,
      wnl_max: defaultPatientVitals.value.wnl.glucose_max,
      moderate_lower_min: defaultPatientVitals.value.moderate.lowest.glucose_min,
      moderate_lower_max: defaultPatientVitals.value.moderate.lowest.glucose_max,
      moderate_higher_min: defaultPatientVitals.value.moderate.highest.glucose_min,
      moderate_higher_max: defaultPatientVitals.value.moderate.highest.glucose_max,
      critical_below: defaultPatientVitals.value.critical.glucose_below,
      critical_above: defaultPatientVitals.value.critical.glucose_above,
    }]
  }
  else {
    glucoseVitalDefaultsList.value.map((item, index) => {
      dataSource.value.push({
        key: index,
        vitalType: item.vitalType,
        vitalTypeName: item.vitalTypeName,
        wnl_min: item.wnl.glucose_min,
        wnl_max: item.wnl.glucose_max,
        moderate_lower_min: item.moderate.lowest.glucose_min,
        moderate_lower_max: item.moderate.lowest.glucose_max,
        moderate_higher_min: item.moderate.highest.glucose_min,
        moderate_higher_max: item.moderate.highest.glucose_max,
        critical_below: item.critical.glucose_below,
        critical_above: item.critical.glucose_above,
      })
    })
  }
};

let requestArray = []

const save = key => {
  if(editableDataKey.value != null) {
    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    delete editableData[key];
  }
  makeArray()
  editableDataKey.value = null
  let data = dataSource.value.filter(item => key === item.key)[0]
  if((data?.wnl_min < 1 || data?.wnl_min > 2000) ||
     (data?.wnl_max < 1 || data?.wnl_max > 2000) ||
     (data?.moderate_lower_min < 1 || data?.moderate_lower_min > 2000) ||
     (data?.moderate_lower_max < 1 || data?.moderate_lower_max > 2000) ||
     (data?.moderate_higher_min < 1 || data?.moderate_higher_min > 2000) ||
     (data?.moderate_higher_max < 1 || data?.moderate_higher_max > 2000) ||
     (data?.critical_below < 1 || data?.critical_below > 2000) ||
     (data?.critical_above < 1 || data?.critical_above > 2000)
    ) {
    showError.value = true
  }
  else {
    showError.value = false
  }
}

const makeArray = () => {
  requestArray = []
  dataSource.value.map((item) => {
    if(item.vitalTypeName == 'All') {
      glucoseRangeVitalFields.value.map(element => {
        requestArray.push({
          vitalType: element.id,
          vitalTypeName: element.name,
          wnl: {
            glucose_min: item.wnl_min,
            glucose_max: item.wnl_max,
          },
          moderate: {
            lowest: {
              glucose_min: item.moderate_lower_min,
              glucose_max: item.moderate_lower_max,
            },
            highest: {
              glucose_min: item.moderate_higher_min,
              glucose_max: item.moderate_higher_max,
            }
          },
          critical: {
            glucose_below: item.critical_below,
            glucose_above: item.critical_above
          },
        })
      })
    }
    else {
      requestArray.push({
        vitalType: item.vitalType,
        vitalTypeName: item.vitalTypeName,
        wnl: {
          glucose_min: item.wnl_min,
          glucose_max: item.wnl_max,
        },
        moderate: {
          lowest: {
            glucose_min: item.moderate_lower_min,
            glucose_max: item.moderate_lower_max,
          },
          highest: {
            glucose_min: item.moderate_higher_min,
            glucose_max: item.moderate_higher_max,
          }
        },
        critical: {
          glucose_below: item.critical_below,
          glucose_above: item.critical_above
        },
      })
    }
  })
}

const submitForm = () => {
  save(editableDataKey.value)
  let requestData = {
    patientId: route.params.udid,
    data: {
      type: 'Glucose',
      data: requestArray
    }
  }
  store.dispatch('vitals/addVitalDefaults', requestData).then(response => {
    store.dispatch('vitals/glucoseVitalDefaultsList', route.params.udid).then(() => {
      setForAll.value = false
      dataSource.value = []
      glucoseVitalDefaultsList.value.map((item, index) => {
        dataSource.value.push({
          key: index,
          vitalType: item.vitalType,
          vitalTypeName: item.vitalTypeName,
          wnl_min: item.wnl.glucose_min,
          wnl_max: item.wnl.glucose_max,
          moderate_lower_min: item.moderate.lowest.glucose_min,
          moderate_lower_max: item.moderate.lowest.glucose_max,
          moderate_higher_min: item.moderate.highest.glucose_min,
          moderate_higher_max: item.moderate.highest.glucose_max,
          critical_below: item.critical.glucose_below,
          critical_above: item.critical.glucose_above,
        })
      })
      hideDrawer()
    })
    store.dispatch('vitals/getGlucoseVitalDefaults', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      vitalType: 0,
    })
    store.dispatch('vitals/getGlucoseVitalDefaults', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      vitalType: vitalTypeValue.value,
    })
  })
}

const cancel = key => {
  delete editableData[key]
  editableDataKey.value = null
  showError.value = false
};

const hideDrawer = () => {
  emit('hideDrawer')
}

const columns = [{
  title: 'Vital Type',
  dataIndex: 'vitalTypeName',
  key: 'vitalTypeName',
  width: 200,
  onFilter: (value, record) => record.vitalTypeName.indexOf(value) === 0,
}, {
  title: 'WNL',
  children: [{
    title: 'Min',
    dataIndex: 'wnl_min',
    key: 'wnl_min',
  }, {
    title: 'Max',
    dataIndex: 'wnl_max',
    key: 'wnl_max',
  }],
},
{
  title: 'Moderate',
  children: [{
    title: 'Lower',
    children: [{
      title: 'Min',
      dataIndex: 'moderate_lower_min',
      key: 'moderate_lower_min',
    }, {
      title: 'Max',
      dataIndex: 'moderate_lower_max',
      key: 'moderate_lower_max',
    }],
  }, {
    title: 'Higher',
    children: [{
      title: 'Min',
      dataIndex: 'moderate_higher_min',
      key: 'moderate_higher_min',
    }, {
      title: 'Max',
      dataIndex: 'moderate_higher_max',
      key: 'moderate_higher_max',
    }],
  }],
},{
  title: 'Critical',
  children: [{
    title: 'Below',
    dataIndex: 'critical_below',
    key: 'critical_below',
  }, {
    title: 'Above',
    dataIndex: 'critical_above',
    key: 'critical_above',
  }],
}];
</script>

<style>
.row-btn {
  cursor: pointer;
  color: #3083F0;
  font-weight: 900;
  font-size: 16px;
}
svg.showError-svg {
  position: relative;
  top: -1px;
  right: 9px;
}
.showError {
  font-size: 16px;
}
</style>
