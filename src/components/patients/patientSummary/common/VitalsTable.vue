<template>
  <a-table rowKey="id" :scroll="scroll?scroll:{ x:'',y:'calc(100vh - 490px)' }"  :columns="columns" :data-source="data" :pagination="false" class="vitalTable sortIconTable">
    <template #takeTime="{record}"> 
      <a-tooltip placement="bottom">
                <template #title>
                    <span v-if="record?.addType == 'Manual'">{{"Manual Entry. "}}</span>
                </template>
                <a class="icons">
                  <span v-if="record.addType == 'Manual'" class="brightRedColor" style="font-size: 16px;"> *</span>
                </a>
              </a-tooltip>
                <span>{{ record?.takeTime }}</span>
      </template>
      <template #headerCell="{ column }">

        <span v-if="column.key == 'glucose_random_blood_sugar'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'glucose_fasting_blood_sugar'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'glucose_fasting'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'glucose_pre_meal'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'glucose_post_meal'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'glucose_before_sleep'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'glucose_general'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{glucoseRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{glucoseRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{glucoseRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

        <span v-if="column.key == 'oximeter_spo2'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{oxiSpo2Range?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{oxiSpo2Range?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{oxiSpo2Range?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

        <span v-if="column.key == 'oximeter_bpm'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{systolicRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{systolicRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{systolicRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'blood_pressure_systolic'">
        {{ column.title }}
        <a-tooltip placement="right"  color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{systolicRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{systolicRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{systolicRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>

      <span v-if="column.key == 'blood_pressure_diastolic'">
        {{ column.title }}
        <a-tooltip placement="right" color="#fff">
        <template #title>
          <a-space direction="vertical">
          <a-typography-text style="color:#7ff000" strong>WNL: {{diastolicRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{diastolicRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{diastolicRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>
      <span v-if="column.key == 'blood_pressure_bpm'">
        {{ column.title }}
        <a-tooltip placement="right" color="#fff">
        <template #title>
          <a-space direction="vertical">

          <a-typography-text style="color:#7ff000" strong>WNL: {{bpmRange?.wnl}}</a-typography-text>
          <a-typography-text style="color:#f35b04" strong>Moderate: {{bpmRange?.moderate}}</a-typography-text>
          <a-typography-text style="color:#cc0000" strong>Critical: {{bpmRange?.critical}}</a-typography-text>
          </a-space>
        </template>
        <InfoCircleOutlined class="infoIcon"/>
      </a-tooltip>
      </span>
      </template>
    <template #blood_pressure_systolic="{record}">
      <span v-if="record.blood_pressure_systolic" class="vitalValue" :style="{ 'border-color': record.blood_pressure_systolic_color }">{{ record.blood_pressure_systolic }}</span>
    </template>
    <template #blood_pressure_diastolic="{record}">
      <span v-if="record.blood_pressure_diastolic" class="vitalValue" :style="{ 'border-color': record.blood_pressure_diastolic_color }">{{ record.blood_pressure_diastolic }}</span>
    </template>
    <template #blood_pressure_bpm="{record}">
      <span v-if="record.blood_pressure_bpm" class="vitalValue" :style="{ 'border-color': record.blood_pressure_bpm_color }">{{ record.blood_pressure_bpm }}</span>
    </template>
    
    <template #glucose_random_blood_sugar="{record}">
      <span v-if="record.glucose_random_blood_sugar" class="vitalValue" :style="{ 'border-color': record.glucose_random_blood_sugar_color }">{{ record.glucose_random_blood_sugar }}</span>
    </template>
    <template #glucose_fasting_blood_sugar="{record}">
      <span v-if="record.glucose_fasting_blood_sugar" class="vitalValue" :style="{ 'border-color': record.glucose_fasting_blood_sugar_color }">{{ record.glucose_fasting_blood_sugar }}</span>
    </template>
    <template #glucose_fasting="{record}">
      <span v-if="record.glucose_fasting" class="vitalValue" :style="{ 'border-color': record.glucose_fasting_color }">{{ record.glucose_fasting }}</span>
    </template>
    <template #glucose_pre_meal="{record}">
      <span v-if="record.glucose_pre_meal" class="vitalValue" :style="{ 'border-color': record.glucose_pre_meal_color }">{{ record.glucose_pre_meal }}</span>
    </template>
    <template #glucose_post_meal="{record}">
      <span v-if="record.glucose_post_meal" class="vitalValue" :style="{ 'border-color': record.glucose_post_meal_color }">{{ record.glucose_post_meal }}</span>
    </template>
    <template #glucose_before_sleep="{record}">
      <span v-if="record.glucose_before_sleep" class="vitalValue" :style="{ 'border-color': record.glucose_before_sleep_color }">{{ record.glucose_before_sleep }}</span>
    </template>
    <template #glucose_general="{record}">
      <span v-if="record.glucose_general" class="vitalValue" :style="{ 'border-color': record.glucose_general_color }">{{ record.glucose_general }}</span>
    </template>
    
    <template #oximeter_spo2="{record}">
      <span v-if="record.oximeter_spo2" class="vitalValue" :style="{ 'border-color': record.oximeter_spo2_color }">{{ record.oximeter_spo2 }}</span>
    </template>
    <template #oximeter_bpm="{record}">
      <span v-if="record.oximeter_bpm" class="vitalValue" :style="{ 'border-color': record.oximeter_bpm_color }">{{ record.oximeter_bpm }}</span>
    </template>

  </a-table>
</template>

<script>
import {
  InfoCircleOutlined
} from "@ant-design/icons-vue";
export default {
  props: {
    columns: {
      type: Array
    },
    data: {
      type: Array
    },
    scroll:{
      type: Object
    },
  },
  components:{
    InfoCircleOutlined
  },
  setup(){

    return{
      systolicRange:{wnl:'94 - 130',moderate:'93-89 and 131-150',critical:'<88 and >150'},
      diastolicRange:{wnl:'65 - 90',moderate:'64-55 and 91-100',critical:'<54 and >101'},
      bpmRange:{wnl:'60-90',moderate:'59-55 and 91-100',critical:'<55 and >101'},
      oxiSpo2Range:{wnl:'93-100',moderate:'92- 90',critical:'89 and lower'},
      oxiBpmRange:{wnl:'60-90',moderate:'59-55 and 91-100',critical:'<55 and >101'},
      glucoseRange:{wnl:'90-130',moderate:'80-89 and 131-150',critical:'<79 and >151'}

    }
  }
}
</script>


<style lang="scss" scoped>
  /* .dangerValue { margin: 0px 3px; } */
  th, td { text-align: center; }
  .chatBoxRight .ant-table-fixed {
    width: 800px !important
  }
  .ant-table-fixed {
    width: 1350px !important
  }
  .infoIcon{
    vertical-align: middle;
    margin: 0 0px 0 5px;
    color: #1890ff;
  }
</style>