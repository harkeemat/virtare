<template>
  <EmptyTable v-if="patientVitalAttributes == 0" :text="$t('global.patientVitalAttributes')" />
  <div v-else class="table-data">
    <template v-for="(attribute, index) in patientVitalAttributes" :key="index">
      <div :class="index > 0 ? 'attribute-section' : ''">
        <a-typography-text :level="4">
          <strong>Goal Type: <a href="javascript:void(0)">{{ attribute.name }}</a></strong>
        </a-typography-text><br/>
        <a-typography-text>Vitals Range</a-typography-text>
        <a-table v-if="attribute.deviceType == 'bloodPressure'" class="common-table attributes-table" :dataSource="attribute.attributes" :columns="bloodPressureColumns" :pagination="false"/>
        <a-table v-if="attribute.deviceType == 'oximeter'" class="common-table attributes-table" :dataSource="attribute.attributes" :columns="oxygenColumns" :pagination="false"/>
        <a-table v-if="attribute.deviceType == 'glucose'" class="common-table attributes-table" :dataSource="attribute.attributes" :columns="glucoseColumns" :pagination="false"/>
      </div>
    </template>
    <!-- <Pagination v-if="patientVitalAttributes > 0" :meta="state.patientVitalAttributes.meta.pagination" :endpoint="`/escalation/${route.params.udid}`" commit="patientVitalAttributes" loader="patientAlertLoading" /> -->
  </div>
</template>

<script setup>

import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

/** component  */
import EmptyTable from '@/components/patients/patientDetails/leftPanel/tabs/vitalAttributes/EmptyTable';
// import Pagination from '@/pagination/Pagination.vue';

const store = useStore();
const route = useRoute();

const bloodPressureColumns = [
  {
    title: 'Systolic',
    dataIndex: 'systolic',
    key: 'systolic',
  },
  {
    title: 'Diastolic',
    dataIndex: 'diastolic',
    key: 'diastolic',
  },
  {
    title: 'BPM',
    dataIndex: 'bpm',
    key: 'bpm',
  },
  {
    title: 'Assigned Date',
    dataIndex: 'assignedDate',
    key: 'assignedDate',
  },
]

const oxygenColumns = [
  {
    title: 'SPO2',
    dataIndex: 'spo2',
    key: 'spo2',
  },
  {
    title: 'BPM',
    dataIndex: 'bpm',
    key: 'bpm',
  },
  {
    title: 'Assigned Date',
    dataIndex: 'assignedDate',
    key: 'assignedDate',
  },
]

const glucoseColumns = [
  {
    title: 'Fasting',
    dataIndex: 'fasting',
    key: 'fasting',
  },
  {
    title: 'Random',
    dataIndex: 'random',
    key: 'random',
  },
  {
    title: 'Pre Meal',
    dataIndex: 'preMeal',
    key: 'preMeal',
  },
  {
    title: 'Post Meal',
    dataIndex: 'postMeal',
    key: 'postMeal',
  },
  {
    title: 'Before Sleep',
    dataIndex: 'beforeSleep',
    key: 'beforeSleep',
  },
  {
    title: 'Assigned Date',
    dataIndex: 'assignedDate',
    key: 'assignedDate',
  },
]

onMounted(async () => {
  store.dispatch("patientVitalAttributes", route.params.udid)
})

const patientVitalAttributes = computed(() => {
  return store.state.patientsStore.patientVitalAttributes
})

onUnmounted(() => {
  console.log('Alert unmounted...')
});

</script>

<style scoped>
.attribute-section {
  margin-top: 60px;
}
.attributes-table {
  margin-top: 15px;
}
</style>