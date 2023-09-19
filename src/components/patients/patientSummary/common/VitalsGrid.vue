<template>
  <a-col :sm="24" :xs="24" class="mb-24">
    <a-card :title="title">
      <div class="pageTittle patientSummaryFilter" v-if="!isEscalationAction">
      <DateFilter :Buttons="filterButtons" @clickButtons="showButton(deviceId)" :hideArray="hideFilterPatientsVital"  :commit="commit" />
      </div>
      <a-tabs v-if="!isEscalationAction">
        <a-tab-pane key="1" tab="Table" v-if="!escalationAdd" >
          <a-col :span="24">
            <strong>(<b class="brightRedColor">*</b>)</strong> <strong>Manual Entry. </strong>
          </a-col>
          <a-col :span="24">
              <div class="text-right mb-24" >
                <ExportToExcel  @click="exportExcel('patientVital_report',`?patientId=${patientId}&deviceType=${deviceId}`+ dateFilter)" />
              </div>
          </a-col>
          <VitalsTable  :columns="tableColumns" :data="tableData" :scroll="scroll"  />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Graph" v-if="chartSeries" >
          <ApexChart type="area" height="350" :options="chartOptions" :series="chartSeries" />
        </a-tab-pane>
      </a-tabs>
      <a-tabs v-if="isEscalationAction">
      <a-tab-pane key="1" tab="Graph" v-if="chartSeries ">
          <ApexChart type="area" height="350" :options="chartOptions" :series="chartSeries" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Table" v-if="!escalationAdd" >
          <a-col :span="24">
            <strong>(<b class="brightRedColor">*</b>)</strong> <strong>Manual Entry. </strong>
          </a-col>
          <a-col :span="24">
          <div class="text-right mb-24" >
            <ExportToExcel  @click="exportExcel('patientVital_report',`?patientId=${patientId}&deviceType=${deviceId}`)" />
          </div>
      </a-col>
          <VitalsTable :columns="tableColumns" :data="tableData" :scroll="scroll" />
        </a-tab-pane>
        
      </a-tabs>
      <template #extra v-if="!isEscalationAction">
        <a>
          <a-button class="btn blackBtn" @click="showModal">
            <PlusOutlined/>
          </a-button>
        </a>
      </template>
    </a-card>
  </a-col>
</template>

<script>
import {
  PlusOutlined,
  // InfoCircleOutlined
} from "@ant-design/icons-vue";
import VitalsTable from "@/components/patients/patientSummary/common/VitalsTable";
import ApexChart from "@/components/common/charts/ApexChart";
import DateFilter from "@/components/common/DateFilter"
import {  onMounted, onUnmounted, ref } from 'vue-demi';
import { useStore } from 'vuex';
import { dayWeekMonthdate ,hideFilterPatientsVital,exportExcel} from '@/commonMethods/commonMethod';
import { useRoute } from 'vue-router';
import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";

export default {
  components: {
    // InfoCircleOutlined,
    PlusOutlined,
    VitalsTable,
    ApexChart,
    DateFilter,
    ExportToExcel
  },
  props: {
    title: {
      type: String
    },
    deviceId: {
      type: Number
    },
    activeKey: {
      type: String
    },
    tableColumns: {
      type: Array
    },
    tableData: {
      type: Array
    },
    chartOptions: {
      type: Array
    },
    chartSeries: {
      type: Array
    },
    filterButtons: {
      type: Object
    },
    commit: {
      type: String
    },
    isEscalationAction:{
      type:Boolean
    },
    escalationAdd:{
      type:Boolean
    },
    scroll:{
      type:Object
    },
    patientId:{
      type:String
    },
  },
  setup(props, {emit}) {
    const store = useStore()
    const route = useRoute()

    const dateFilter = ref()
    const showModal = () => {
      emit('showModal')
    }
    
    const patientsRecord = store.getters.patientsRecord
    const patientId = props.patientId ? ref(props.patientId) : ref(route.params.udid)
    function getVitals() {
      if(props.commit=="bloodOxygenTimeline"){
       patientsRecord.value?.bloodOxygenTimeline ? apiCall(patientsRecord.value?.bloodOxygenTimeline, 100) : store.dispatch("timeLine", {
          id: 122,
          commit: "bloodOxygenTimeline"
        }).then(() => {
          apiCall(patientsRecord.value?.bloodOxygenTimeline, 100)
        })
      
    }else if(props.commit=="bloodGlucoseTimeline"){
      patientsRecord.value?.bloodGlucoseTimeline ? apiCall(patientsRecord.value?.bloodGlucoseTimeline, 101) : store.dispatch("timeLine", {
          id: 122,
          commit: "bloodGlucoseTimeline"
        }).then(() => {
          apiCall(patientsRecord.value?.bloodGlucoseTimeline, 101)
        })
    }else  if(props.commit=="bloodPressureTimeline"){
      patientsRecord.value?.bloodPressureTimeline ? apiCall(patientsRecord.value?.bloodPressureTimeline, 99) : store.dispatch("timeLine", {
          id: 122,
          commit: "bloodPressureTimeline"
        }).then(() => {
          apiCall(patientsRecord.value?.bloodPressureTimeline, 99)
        })
    }
    }
    const interval = ref('')
    onMounted(() => {
      if(route.name == 'PatientSummary') {
        getVitals()

      }else{
        getVitals()
      }
        
    interval.value =  setInterval(() => {
        if(route.name == 'PatientSummary') {
            getVitals()
      }
    }, 10000)
      
    })
     onUnmounted(()=>{
      clearInterval(interval.value);
     })
    function apiCall(data, deviceId) {
      let dateFormat = dayWeekMonthdate(data)
      dateFilter.value = dateFormat ? "&fromDate=" + dateFormat.fromDate + "&toDate=" + dateFormat.toDate : ''
      if(deviceId && !props.isEscalationAction) {
        store.dispatch("patientVitals", {
          patientId:patientId.value,
          deviceType: deviceId,
          filter: dateFilter.value,
        });
      }
      else if(!props.isEscalationAction) {
        store.dispatch("patientVitals", {
          patientId:patientId.value,
          deviceType: 99,
          filter: dateFilter.value,
        });
        store.dispatch("patientVitals", {
          patientId:patientId.value,
          deviceType: 100,
          filter: dateFilter.value,
        });
        store.dispatch("patientVitals", {
          patientId:patientId.value,
          deviceType: 101,
          filter: dateFilter.value,
        });
      }
    }

    function showButton(deviceId) {
      //store.commit('filteredVitals', true)
      if(deviceId == 99) {
        apiCall(patientsRecord.value?.bloodPressureTimeline, deviceId)
      }
      if(deviceId == 100) {
        apiCall(patientsRecord.value?.bloodOxygenTimeline, deviceId)
      }
      if(deviceId == 101) {
        apiCall(patientsRecord.value?.bloodGlucoseTimeline, deviceId)
      }
    }

    return {
      dateFilter,
      exportExcel,
      showModal,
      showButton,
      hideFilterPatientsVital
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  background-color: #777;
  color: #fff;
}
.pageTittle {
  margin: 0;
  .filter {
    position: initial;
    text-align: right;
  }
}
.text-right {
  @media (max-width:767px) {
    text-align: left;
    margin-top: 15px;
  }
}
</style>