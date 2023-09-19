<template>
  <div class="bp-detail">
    <a-typography-text>
      <div class="baseline-text">
        SPO2 Normal: <strong>{{ getOxygenBaselineValues?.wnl?.spo2_min }}% - {{ getOxygenBaselineValues?.wnl?.spo2_max }}%</strong>
        Critical: <strong>{{ belowSign }}{{ getOxygenBaselineValues?.critical?.spo2_below }}%</strong>
      </div>
    </a-typography-text>
    <a-typography-text>
      <span class="graph-color-4">SPO2</span>
    </a-typography-text>

    <!-- <EmptyOxygenGraph v-if="isAllNull" /> -->
    <Graphs
      :graphOptions="graphOptions"
      :graphSeries="graphSeries"
      activeTabName="SPO2"
      height="350"
    />
  </div>
</template>

<script setup>
  // import EmptyOxygenGraph from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/oxygenLevels/EmptyOxygenGraph"
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
  // const isAllNull = ref(true)
  const belowSign = '<'

  const patientOxygenSaturationGraph = computed(() => {
    return store.state.vitals.patientOxygenSaturationGraph
  })

  const getOxygenBaselineValues = computed(() => {
    return store.state.vitals.getOxygenBaselineValues
  })

  watchEffect(() => {
    let array = []
    patientOxygenSaturationGraph.value?.series.map(element => {
      element.data.map(item => {
        if(item != null) {
          array.push(Number(item))
        }
      })
    })

    let minValue = getMinValue(array, getOxygenBaselineValues.value?.wnl?.spo2_min, getOxygenBaselineValues.value)
    let maxValue = getMaxValue(array, getOxygenBaselineValues.value?.wnl?.spo2_max, getOxygenBaselineValues.value)
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
      colors: [graphColors.graphColor4],
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
        categories: patientOxygenSaturationGraph.value == null ? datesArray : patientOxygenSaturationGraph.value?.categories,
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
            y: getOxygenBaselineValues.value?.wnl?.spo2_min,
            y2: getOxygenBaselineValues.value?.wnl?.spo2_max,
            fillColor: '#9B5DE5',
            strokeDashArray: 0,
            opacity: 0.2,
            label: {
              borderColor: '',
              offsetX: 10,
              // offsetY: 20,
              text: "OXYGEN LEVELS",
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
    }
    graphSeries.value =  patientOxygenSaturationGraph.value == null ? graphSeries.value =  [
      {
        name: "SPO2",
        data: []
      }
    ] : patientOxygenSaturationGraph.value?.series
  })
</script>

<style>
.baseline-text {
  font-size: 15px;
}
</style>