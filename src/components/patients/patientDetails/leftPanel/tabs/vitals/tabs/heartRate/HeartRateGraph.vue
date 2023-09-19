<template>
  <div class="bp-detail">
    <a-typography-text>
      <div class="baseline-text">Pulse Normal: <strong>{{ getHeartRateBaselineValues?.wnl?.bpm_min }} - {{ getHeartRateBaselineValues?.wnl?.bpm_max }}</strong>
      Critical: <strong>{{ belowSign }}{{ getHeartRateBaselineValues?.critical?.bpm_below }}</strong> OR <strong>{{ aboveSign }}{{ getHeartRateBaselineValues?.critical?.bpm_above }}</strong></div>
    </a-typography-text>
    <a-typography-text>
      <span class="graph-color-3">BPM</span>
    </a-typography-text>

    <!-- <EmptyHeartRateGraph v-if="isAllNull" /> -->
    <Graphs
      :graphOptions="graphOptions"
      :graphSeries="graphSeries"
      activeTabName="HEART RATE"
      height="350"
    />
  </div>
</template>

<script setup>
  // import EmptyHeartRateGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/heartRate/EmptyHeartRateGraph"
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

  const store = useStore()
  const graphOptions = ref(null)
  const graphSeries = ref(null)
  const belowSign = '<'
  const aboveSign = '>'

  const patientHeartRateGraph = computed(() => {
    return store.state.vitals.patientHeartRateGraph
  })

  const getHeartRateBaselineValues = computed(() => {
    return store.state.vitals.getHeartRateBaselineValues
  })

  watchEffect(() => {
    let array = []
    patientHeartRateGraph.value?.series.map(element => {
      element.data.map(item => {
        if(item != null) {
          array.push(Number(item))
        }
      })
    })

    let minValue = getMinValue(array, getHeartRateBaselineValues.value?.wnl?.bpm_min, getHeartRateBaselineValues.value)
    let maxValue = getMaxValue(array, getHeartRateBaselineValues.value?.wnl?.bpm_max, getHeartRateBaselineValues.value)
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
      colors: [graphColors.graphColor3],
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
        categories: patientHeartRateGraph.value == null ? datesArray : patientHeartRateGraph.value?.categories,
        axisBorder: {
          show: true,
          color: '#000000',
        },
        tickPlacement: 'between'
      },
      yaxis: {
        min: minValue,
        max: maxValue,
        // min: 50,
        // max: 110,
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
            y: getHeartRateBaselineValues.value?.wnl?.bpm_min,
            y2: getHeartRateBaselineValues.value?.wnl?.bpm_max,
            fillColor: '#57CC99',
            strokeDashArray: 0,
            opacity: 0.2,
            label: {
              borderColor: '',
              offsetX: 10,
              // offsetY: 20,
              text: "HEART RATE",
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
      }
    },
    graphSeries.value =  patientHeartRateGraph.value == null ? graphSeries.value =  [
      {
        name: "BPM",
        data: []
      }
    ] : patientHeartRateGraph.value?.series
  })
</script>

<style>
.baseline-text {
  font-size: 15px;
}
</style>