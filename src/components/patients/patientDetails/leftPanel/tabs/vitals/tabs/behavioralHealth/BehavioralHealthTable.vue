<template>
  <a-typography-title :level="3" class="common-sub-heading">Readings</a-typography-title>
    <a-table v-if="patientVitalsTable.length > 0" :dataSource="dataSource" :columns="columns" class="common-table" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'status'">
          <span v-if="record?.flagName == 'Critical'" class="status-deleted-circle" :title="record?.flagName"></span>
          <span v-else-if="record?.flagName == 'Moderate'" class="status-suspended-circle" :title="record?.flagName"></span>
          <span v-else-if="record?.flagName == 'WNL'" class="status-active-circle" :title="record?.flagName"></span>
          <span v-else class="status-grey-circle" title="WNL"></span>
        </template>
        <!-- <template v-if="column.dataIndex == 'actions'">
          <a href="javascript:void(0)">Review</a>
        </template> -->
      </template>
    </a-table>
    <div v-else>
      <EmptyTable :text="$t('global.vitalsTable')" />
    </div>
</template>

<script setup>
  // import { computed } from 'vue';
  // import { useStore } from 'vuex';
  import EmptyTable from "@/components/administration/clients/EmptyTable";
  
  // const store = useStore()

  /* const patientVitalsTable = computed(() => {
    return store.state.vitals.patientVitalsTable
  }) */
  const patientVitalsTable = []

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
      dataIndex: "status",
      key: "status",
      align:"center",
    },
    {
      title: "Glucose",
      dataIndex: "glucose",
      key: "glucose",
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