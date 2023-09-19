<template>
  <a-checkbox @change="changeSetForAll">Set for All</a-checkbox>
  
  <a-table :data-source="dataSource" :columns="columns" :pagination="false" bordered size="middle">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'vitalTypeName'">
        {{ text }}
        <span style="float: right">
          <span v-if="editableData[record.key]">
            <CheckOutlined class="row-btn" @click="save(record.key)" />
          </span>
          <span v-else>
            <EditOutlined class="row-btn" @click="edit(record.key)" />
          </span>
        </span>
      </template>
      <template v-if="['wnl_min', 'wnl_max', 'moderate_lower_min', 'moderate_lower_max', 'moderate_higher_min', 'moderate_higher_max', 'critical_below', 'critical_above'].includes(column.dataIndex)">
        <div>
          <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash-es';
import { useStore } from 'vuex';
import { deviceIds } from "@/config/common";

const editableData = reactive({});
const store = useStore()

const glucoseVitalDefaultsList = computed(() => {
  return store.state.vitals.glucoseVitalDefaultsList
})

const dataSource = ref([]);

onMounted(() => {
  store.dispatch('vitals/glucoseVitalDefaultsList', '699cce09-810d-47c9-8342-2c93e5748f5f').then(() => {
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

const changeSetForAll = (event) => {
  dataSource.value = []
  if(event.target.checked) {
    dataSource.value = [{
      key: 0,
      vitalType: 1,
      vitalTypeName: 'All',
      wnl_min: glucoseVitalDefaultsList.value[0].wnl.glucose_min,
      wnl_max: glucoseVitalDefaultsList.value[0].wnl.glucose_max,
      moderate_lower_min: glucoseVitalDefaultsList.value[0].moderate.lowest.glucose_min,
      moderate_lower_max: glucoseVitalDefaultsList.value[0].moderate.lowest.glucose_max,
      moderate_higher_min: glucoseVitalDefaultsList.value[0].moderate.highest.glucose_min,
      moderate_higher_max: glucoseVitalDefaultsList.value[0].moderate.highest.glucose_max,
      critical_below: glucoseVitalDefaultsList.value[0].critical.glucose_below,
      critical_above: glucoseVitalDefaultsList.value[0].critical.glucose_above,
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

const edit = key => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};

const save = key => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
  delete editableData[key];

  let requestArray = []
  let vitalTypeName = dataSource.value.filter(item => key === item.key)[0].vitalTypeName

  dataSource.value.map((item) => {
    // if(item.vitalTypeName == vitalTypeName) {
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
    // }
  })

  let requestData = {
    patientId: '699cce09-810d-47c9-8342-2c93e5748f5f',
    data: {
      type: 'Glucose',
      data: requestArray
    }
  }
  store.dispatch('vitals/addVitalDefaults', requestData).then(response => {
    store.dispatch('vitals/glucoseVitalDefaultsList', '699cce09-810d-47c9-8342-2c93e5748f5f')
    store.dispatch('vitals/getGlucoseVitalDefaults', {
      patientId: '699cce09-810d-47c9-8342-2c93e5748f5f',
      deviceType: deviceIds.glucoseDeviceId,
      vitalType: 0,
    })
  })
};

// const cancel = key => {
//   delete editableData[key];
// };

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
</style>
