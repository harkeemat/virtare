<template>
  <div class="bp-detail">
    <a-typography-text>

      <div class="baseline-text">
        Glucose Normal: <strong>{{ getGlucoseVitalDefaults?.wnl?.glucose_min }} - {{ getGlucoseVitalDefaults?.wnl?.glucose_max }}</strong>
        Critical: <strong>{{ belowSign }}{{ getGlucoseVitalDefaults?.critical?.glucose_below }}</strong> OR <strong>{{ aboveSign }}{{ getGlucoseVitalDefaults?.critical?.glucose_above }}</strong>
      </div>
      
    </a-typography-text>
    <a-typography-text>
      <span class="graph-color-5">{{ vitalTypeName }}</span>
    </a-typography-text>
    <a-form class="common-form" >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item>
                <SelectBox :value="vitalTypeValue" @change="onVitalTypeChange" :globalCode="glucoseRangeVitalFields" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form>

    <!-- <EmptyGlucoseGraph v-if="isAllNull" :vitalTypeName="vitalTypeName" /> -->
    <Graphs
      :graphOptions="graphOptions"
      :graphSeries="graphSeries"
      activeTabName="GLUCOSE LEVELS"
      height="350"
    />
  </div>
</template>

<script setup>
  // import EmptyGlucoseGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/glucoseLevels/EmptyGlucoseGraph"
  import Graphs from "@/components/common/charts/Graphs";
  import {
    computed,
    watchEffect,
    ref,
		onMounted
  } from "vue";
  import { useStore } from "vuex";
  import { graphColors, deviceIds } from "@/config/common.js";
  import SelectBox from "@/components/form-fields/SelectBox";
  import { useRoute } from "vue-router";
import moment from "moment";
import { getMaxValue, getMinValue, getDates } from "@/commonMethods/commonMethod";

  const store = useStore()
  const route = useRoute()
  const graphOptions = ref(null)
  const graphSeries = ref(null)
  const vitalTypeValue = ref(5)
  const vitalTypeName = ref('Fasting')
  // const isAllNull = ref(true)
  const belowSign = '<'
  const aboveSign = '>'

  const patientGlucoseGraph = computed(() => {
    return store.state.vitals.patientGlucoseGraph
  })

  const getGlucoseVitalDefaults = computed(() => {
    return store.state.vitals.getGlucoseVitalDefaults
  })

  const glucoseRangeVitalFields = computed(() => {
    return store.state.vitals.glucoseRangeVitalFields
  })

  const onVitalTypeChange = (value) => {
    store.commit('vitals/vitalTypeValue', value)
    let glucoseVitalFields = glucoseRangeVitalFields.value
    glucoseVitalFields.map(field => {
      if(field.id == value) {
        vitalTypeName.value = field.name
      }
    })

    vitalTypeValue.value = value
    store.dispatch('vitals/patientVitalsGraph', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      activeTab: "glucoseLevels",
      vitalType: value,
    })
    // .then(() => {
      // if(patientGlucoseGraph.value == null || patientGlucoseGraph.value?.length == 0) {
        // graphSeries.value = []
        // isAllNull.value = true
      // }
      // else {
        // isAllNull.value = false
      // }
    // })

    store.dispatch('vitals/getGlucoseVitalDefaults', {
      patientId: route.params.udid,
      deviceType: deviceIds.glucoseDeviceId,
      vitalType: value,
    })
  }

  onMounted(() =>{
    store.dispatch('vitals/vitalFields', deviceIds.glucoseDeviceId)
    store.dispatch('vitals/glucoseRangeVitalFields', deviceIds.glucoseDeviceId)
  })

  watchEffect(() => {
    let array = []
    patientGlucoseGraph.value?.series.map(element => {
      element.data.map(item => {
        if(item != null) {
          array.push(Number(item))
        }
      })
    })

    let minValue = getMinValue(array, getGlucoseVitalDefaults.value?.wnl?.glucose_min, getGlucoseVitalDefaults.value)
    let maxValue = getMaxValue(array, getGlucoseVitalDefaults.value?.wnl?.glucose_max, getGlucoseVitalDefaults.value)
    let datesArray = getDates(10, 'DD')
    
    graphOptions.value = {
      chart: {
        zoom: {
          enabled: false,
        },
        type: 'line',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout', // linear, easein, easeout, easeinout
          speed: 500,
          animateGradually: {
            enabled: true,
            delay: 50
          },
          dynamicAnimation: {
            enabled: true,
            speed: 500,
          }
        },
      },
      grid: {
        show: true,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: [graphColors.graphColor5],
      markers: {
        size: 6,
        hover: {
          size: 8
        }
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: patientGlucoseGraph.value == null ? datesArray : patientGlucoseGraph.value?.categories,
        axisBorder: {
          show: true,
          color: '#000000',
        },
        tickPlacement: 'between'
      },
      yaxis: {
        min: minValue,
        max: maxValue,
        tickAmount: 5,
        forceNiceScale: true,
        axisBorder: {
          show: true,
          color: '#000000',
        },
        tickPlacement: 'between',
        labels: {
          formatter: function(val) {
            return val?.toFixed(0);
          }
        }
      },
      annotations: {
        position: 'front',
        yaxis: [
          {
            y: getGlucoseVitalDefaults.value?.wnl?.glucose_min,
            y2: getGlucoseVitalDefaults.value?.wnl?.glucose_max,
            fillColor: '#F15BB5',
            strokeDashArray: 0,
            opacity: 0.2,
            label: {
              borderColor: '',
              offsetX: 10,
              // offsetY: 20,
              text: "GLUCOSE LEVELS",
              position: 'left',
              textAnchor: 'right',
              style: {
                background: '#ffffff00',
                color: '#1B4F93',
                fontSize: '15px',
              },
            }
          }
        ]
      },
    }
    graphSeries.value =  patientGlucoseGraph.value == null ? graphSeries.value =  [
      {
        name: vitalTypeName,
        data: []
      }
    ] : patientGlucoseGraph.value?.series
  })
</script>

<style scoped>
.common-form {
  text-align: left;
  margin-bottom: 10px;
  /* float: right !important;
  position: relative;
  right: -364px;
  width: 80%;
  top: 16px; */
}
.update-btn {
  cursor: pointer;
}
</style>
