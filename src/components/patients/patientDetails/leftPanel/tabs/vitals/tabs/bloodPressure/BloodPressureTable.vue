<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-typography-title :level="2" class="common-sub-heading">Readings</a-typography-title>
      <a-typography-text class="common-tag-line caption">
        {{ $t('global.vitalReadingsText') }}
      </a-typography-text>
    </a-col>
    <a-col :span="12" class="text-right" v-if="patientVitalsTable.length > 0">
      <!-- <a-space>
        <ExportToExcel @click="exportToExcel" buttonTitle="Download Vitals" />
      </a-space> -->
    </a-col>
    </a-row>
  <!-- <a-typography-title :level="3" class="common-sub-heading">Readings</a-typography-title> -->
    <a-table v-if="patientVitalsTable.length > 0" :dataSource="patientVitalsTable" :columns="columns" class="common-table" :pagination="false" :customRow="customRow">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'flagColor'">
          <span :style="{ 'background-color': record?.flagColor }" class="patient-status"></span>
        </template>
        <template v-if="column.dataIndex == 'systolic'">
          <span v-if="record?.isDeleted" class="strike-through">{{ record?.systolic }}</span>
          <span v-else>{{ record?.systolic }}</span>
        </template>
        <template v-if="column.dataIndex == 'diastolic'">
          <span v-if="record?.isDeleted" class="strike-through">{{ record?.diastolic }}</span>
          <span v-else>{{ record?.diastolic }}</span>
        </template>
        <template v-if="column.dataIndex == 'bpm'">
          <span v-if="record?.isDeleted" class="strike-through">{{ record?.bpm }}</span>
          <span v-else>{{ record?.bpm }}</span>
        </template>
        <template v-if="column.dataIndex == 'state'">
          <span v-if="record?.isDeleted && record?.state != '-'" class="strike-through">{{ record?.state }}</span>
          <span v-else>{{ record?.state }}</span>
        </template>
        <template v-if="column.dataIndex == 'actions'">
          <a v-if="!record?.reviewed && rolesPermissionFind(screensPermissions, [530])" href="javascript:void(0)" @click="reviewVitals(record?.id)">Review</a>
          <span v-else>{{ record?.reviewedStatus }}</span>
        </template>
      </template>
    </a-table>
    <div v-else>
      <EmptyTable :text="$t('global.vitalsTable')" />
    </div>
    <a-drawer placement="right" :closable="false" :visible="visibleModal" width="60%">
      <ReviewVitals v-if="reviewVitalsModal" @hideDrawer="onClose" :deviceId="deviceIds.bloodPressureDeviceId" :vitalsId="vitalsId" activeTab="bloodPressure" />
      <VitalDetail v-else-if="vitalDetailsModal && visibleModal" :deviceId="deviceIds.bloodPressureDeviceId" :vitalsId="vitalsId" activeTab="bloodPressure" @hideDrawer="onClose" />
    </a-drawer>
    <Pagination v-if="patientVitalsTable?.length > 0" :meta="vitalsStore?.graphsListMeta" commit="vitals/patientVitalsTable" :endpoint="`patientData/${patientId}/vital`" :params="`&deviceType=${deviceIds.bloodPressureDeviceId}`" loader="vitals/patientVitalsLoader" entity="vitalsList" />
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import EmptyTable from "@/components/administration/clients/EmptyTable";
  import ReviewVitals from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/ReviewVitals";
  import VitalDetail from "@/components/patients/patientDetails/leftPanel/tabs/vitals/modals/VitalDetail";
	import { deviceIds } from "@/config/common";
  import Pagination from "@/components/pagination/Pagination";
  import { useRoute } from 'vue-router';
  import {
    openAction,
  } from '@/commonMethods/commonMethod.js';
  import { rolesPermissionFind } from '@/commonMethods/commonMethod';
  import ExportToExcel from "@/components/common/export-excel/ExportExcel.vue";
  // import { exportExcel } from "@/commonMethods/commonMethod";

  const store = useStore()
  const route = useRoute()
  const visibleModal = ref(false)
  const reviewVitalsModal = ref(false)
  const vitalDetailsModal = ref(false)
  const vitalsId = ref(null)
  const patientId = ref(route.params.udid)
  const screensPermissions = store.getters.screensPermissions

  const vitalsStore = computed(() => {
    return store.state.vitals
  })

  function customRow(record) {
      return {
        onClick: (event) => {
          visibleModal.value = true
          if(event.target.innerHTML == "Review") {
            reviewVitalsModal.value = true
            vitalDetailsModal.value = false
          }
          else if(event.target.innerHTML != "Review") {
            vitalsId.value = record?.id
            store.dispatch('vitals/patientsVitalDetails',{vitalId:record?.id})
            reviewVitalsModal.value = false
            vitalDetailsModal.value = true
          }
        },
      }
  }

  const patientVitalsTable = computed(() => {
    return store.state.vitals.patientVitalsTable
  })

  const reviewVitals = (recordId) => {
    openAction()  // Add Action Name
    vitalsId.value = recordId
    visibleModal.value = true
    vitalDetailsModal.value = false
    reviewVitalsModal.value = true
  }

  const exportToExcel = () => {
    store.dispatch('vitals/downloadVitals', {
      patientId: patientId.value,
      deviceType: deviceIds.bloodPressureDeviceId,
    })
  }

  const onClose = () => {
    visibleModal.value = false
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "takeDate",
      key: "takeDate",
    },
    {
      title: "Time",
      dataIndex: "takeOnlyTime",
      key: "takeOnlyTime",
    },
    {
      title: "Status",
      dataIndex: "flagColor",
      key: "flagColor",
      align:"center",
    },
    {
      title: "Systolic",
      dataIndex: "systolic",
      key: "systolic",
    },
    {
      title: "Diastolic",
      dataIndex: "diastolic",
      key: "diastolic",
    },
    {
      title: "BPM",
      dataIndex: "bpm",
      key: "bpm",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",

    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
    },
  ]
</script>

