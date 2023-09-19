<template>
  <div class="bp-detail">
    <a-typography-text>
      Baseline Min: <span>82</span>
      Normal: <span>90</span>
      Max: <span>130</span>
    </a-typography-text>
    <a-typography-text>
      <span class="graph-color-1">BH</span>
    </a-typography-text>
    
    <Graphs
      :graphOptions="graphOptions"
      :graphSeries="graphSeries"
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
      datesArray.value.push(Number(date.subtract(i, 'day').format('DD')));
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
      colors: [graphColors.graphColor1],
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
        categories: datesArray
      },
      yaxis: {
        type: 'numeric',
        min: 10,
        max: 100,
        logBase: 20,
        forceNiceScale: true,
      },
      annotations: {
        position: 'front',
        yaxis: [
          {
            y: 30,
            y2: 50,
            fillColor: '#cc99ff',
            opacity: 0.4,
            label: {
              text: "BH",
              position: 'left',
              textAnchor: 'right',
              style: {
                background: '#ffffff00',
                borderColor: '#ffffff00',
                color: '#1B4F93',
                fontSize: '15px',
                // fontWeight: 400,
                cssClass: 'annotationLabel',
                padding: {
                  left: 1,
                  right: 1,
                  top: 1,
                  bottom: 5,
                }
              },
            }
          }
        ]
      }
    }
    graphSeries.value =  [{name: "BH", data: []}]
  })
</script>

<style scoped>
.common-form {
  text-align: left;
  margin-bottom: 10px;
}
</style>