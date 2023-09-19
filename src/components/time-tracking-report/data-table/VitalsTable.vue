<template>
  <a-table class="sortIconTable" rowKey="id" :columns="columns" :data-source="data" :pagination="false" >
    <template #blood_pressure_systolic="{record}">
      <span v-if="record.blood_pressure_systolic" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.blood_pressure_bpm_color }">{{ record.blood_pressure_systolic }}</span>
    </template>
    <template #blood_pressure_diastolic="{record}">
      <span v-if="record.blood_pressure_diastolic" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.blood_pressure_diastolic_color }">{{ record.blood_pressure_diastolic }}</span>
    </template>
    <template #blood_pressure_bpm="{record}">
      <span v-if="record.blood_pressure_bpm" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.blood_pressure_bpm_color }">{{ record.blood_pressure_bpm }}</span>
    </template>
    
    <template #glucose_random_blood_sugar="{record}">
      <span v-if="record.glucose_random_blood_sugar" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_random_blood_sugar }}</span>
    </template>
    <template #glucose_fasting_blood_sugar="{record}">
      <span v-if="record.glucose_fasting_blood_sugar" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_fasting_blood_sugar }}</span>
    </template>
    <template #glucose_fasting="{record}">
      <span v-if="record.glucose_fasting" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_fasting }}</span>
    </template>
    <template #glucose_pre_meal="{record}">
      <span v-if="record.glucose_pre_meal" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_pre_meal }}</span>
    </template>
    <template #glucose_post_meal="{record}">
      <span v-if="record.glucose_post_meal" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_post_meal }}</span>
    </template>
    <template #glucose_before_sleep="{record}">
      <span v-if="record.glucose_before_sleep" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_before_sleep }}</span>
    </template>
    <template #glucose_general="{record}">
      <span v-if="record.glucose_general" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.glucose_general }}</span>
    </template>
    
    <template #oximeter_spo2="{record}">
      <span v-if="record.oximeter_spo2" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.oximeter_spo2 }}</span>
    </template>
    <template #oximeter_bpm="{record}">
      <span v-if="record.oximeter_bpm" :style="{ padding: 'inherit', 'border': '2px solid', 'border-color': record.color }">{{ record.oximeter_bpm }}</span>
    </template>

  </a-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array
    },
    data: {
      type: Array
    },
    className: {
      type: String
    }
  }
}
</script>

<style scoped>
  /* .dangerValue { margin: 0px 3px; } */
  th, td { text-align: center; }
  .chatBoxRight .ant-table-fixed {
    width: 800px !important
  }
  .ant-table-fixed {
    width: 1350px !important
  }
</style>