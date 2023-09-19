<template>
  <div class="bp-detail">
    <Graphs
      :graphOptions="graphOptions"
      :graphSeries="graphSeries"
      activeTabName="BP"
      height="350"
    />
  </div>
</template>

<script setup>
  import Graphs from "@/components/common/charts/Graphs";
  import {
    watchEffect,
    ref,
  } from "vue";
  import { graphColors } from "@/config/common.js";
  import moment from "moment";

  const graphOptions = ref(null)
  const graphSeries = ref(null)

  const datesArray = ref([])

  watchEffect(() => {
    for (let i = 0; i <= 9; i++) {
      let date = moment();
      let today = moment().format("DD")
      let dateVal = Number(date.subtract(i, 'day').format('DD'))
      if(today != dateVal) {
        datesArray.value.push(dateVal);
      }
      else {
        datesArray.value.push('Today');
      }
    }
    datesArray.value.reverse()

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
        categories: datesArray,
        axisBorder: {
          show: true,
          color: '#000000',
        },
        tickPlacement: 'between'
      },
      yaxis: {
        min: 60,
        max: 160,
        tickAmount: 6,
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
            y: 94,
            y2: 130,
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
            y: 65,
            y2: 90,
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
    }
    graphSeries.value =  [
      {
        name: "SYSTOLIC",
        data: []
        // data: [null, null, null, null, null, null, null, null, null, null]
      },
      {
        name: "DIASTOLIC",
        data: []
        // data: [null, null, null, null, null, null, null, null, null, null]
      }
    ]
  })
</script>

<style scoped>
.common-form {
  text-align: left;
  margin-bottom: 10px;
}
</style>
