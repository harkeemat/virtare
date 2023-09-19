<template>
  <div class="bp-detail">
    <a-typography-text>
      <div class="baseline-text">Systolic Normal: <strong>{{ getBPBaselineValues?.wnl?.systolic_min }} - {{ getBPBaselineValues?.wnl?.systolic_max }}</strong>
      Critical: <strong>{{ belowSign }}{{ getBPBaselineValues?.critical?.systolic_below }}</strong> OR <strong>{{ aboveSign }}{{ getBPBaselineValues?.critical?.systolic_above }}</strong></div>
      <br />
      <div class="baseline-text">Diastolic Normal: <strong>{{ getBPBaselineValues?.wnl?.diastolic_min }} - {{ getBPBaselineValues?.wnl?.diastolic_max }}</strong>
      Critical: <strong>{{ belowSign }}{{ getBPBaselineValues?.critical?.diastolic_below }}</strong> OR <strong>{{ aboveSign }}{{ getBPBaselineValues?.critical?.diastolic_above }}</strong></div>
    </a-typography-text>
    <a-typography-text>
      <span class="graph-color-1">Systolic</span>
      <span class="graph-color-2">Diastolic</span>
      <!-- <span class="graph-color-3">BPM</span> -->
    </a-typography-text>
    <!-- <EmptyBloodPressureGraph v-if="isAllNull" /> -->
    <Graphs
      :graphOptions="graphOptions"
      :graphSeries="graphSeries"
      activeTabName="BP"
      height="350"
    />
    <!-- <img v-else src="@/assets/images/emptyChart.png" alt="" style="width: 100%" /> -->
  </div>
</template>

<script setup>
  // import EmptyBloodPressureGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/bloodPressure/EmptyBloodPressureGraph"
  import Graphs from "@/components/common/charts/Graphs";
  import {
    computed,
    watchEffect,
    ref
  } from "vue";
  import { useStore } from "vuex";
  import { graphColors } from "@/config/common.js";
import moment from "moment";
import { getMaxValue, getMinValue, getDates } from "@/commonMethods/commonMethod";
// import { useRoute } from "vue-router";
// import { deviceIds } from "@/config/common";

  const store = useStore()
  // const route = useRoute()
  const graphOptions = ref(null)
  const graphSeries = ref(null)
  const belowSign = '<'
  const aboveSign = '>'

  const patientBloodPressureGraph = computed(() => {
    return store.state.vitals.patientBloodPressureGraph
  })

  /* const getBPVitalDefaults = computed(() => {
    return store.state.vitals.getBPVitalDefaults
  }) */

  const getBPBaselineValues = computed(() => {
    return store.state.vitals.getBPBaselineValues
  })

  watchEffect(() => {
    let sysArray = []
    let diasArray = []

    patientBloodPressureGraph.value?.series.map(element => {
      element.data.map(item => {
        if(item != null) {
          element.name == 'Systolic' ? sysArray.push(Number(item)) : diasArray.push(Number(item))
        }
      })
    })

    let minValue = getMinValue(diasArray, getBPBaselineValues.value?.wnl?.diastolic_min, getBPBaselineValues.value)
    let maxValue = getMaxValue(sysArray, getBPBaselineValues.value?.wnl?.systolic_max, getBPBaselineValues.value)
    let datesArray = getDates(10, 'DD')

    graphOptions.value = {
      chart: {
        zoom: {
          enabled: false,
        },
        type: "line",
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
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: [graphColors.graphColor1, graphColors.graphColor2],
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
        categories: patientBloodPressureGraph.value == null ? datesArray : patientBloodPressureGraph.value?.categories,
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
            y: getBPBaselineValues.value?.wnl?.systolic_min,
            y2: getBPBaselineValues.value?.wnl?.systolic_max,
            fillColor: '#F95932',
            strokeDashArray: 0,
            opacity: 0.2,
            label: {
              borderColor: '',
              offsetX: 10,
              // offsetY: 20,
              text: "SYSTOLIC",
              position: 'left',
              textAnchor: 'right',
              style: {
                background: '#ffffff00',
                color: '#1B4F93',
                fontSize: '15px',
              },
            }
          },
          {
            y: getBPBaselineValues.value?.wnl?.diastolic_min,
            y2: getBPBaselineValues.value?.wnl?.diastolic_max,
            fillColor: '#3083F0',
            strokeDashArray: 0,
            opacity: 0.2,
            label: {
              borderColor: '',
              offsetX: 10,
              // offsetY: 20,
              text: "DIASTOLIC",
              position: "left",
              textAnchor: 'right',
              style: {
                background: '#ffffff00',
                color: '#1B4F93',
                fontSize: '15px',
              },
            }
          },
        ]
      }
    },
    graphSeries.value = patientBloodPressureGraph.value == null ? graphSeries.value =  [
      {
        name: "SYSTOLIC",
        data: []
      },
      {
        name: "DIASTOLIC",
        data: []
      }
    ] : patientBloodPressureGraph.value?.series
  })
</script>

<style>
.baseline-text {
  font-size: 15px;
}
</style>