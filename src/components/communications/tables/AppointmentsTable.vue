<template>
  <a-row :gutter="24">
    <a-col :sm="24" :xs="24">
      <div class="documentsTab">
      <a-button @click="showAddAppointmentModal()" type="primary">{{ "Add Appointment" }}</a-button>
      <a-table class="sortIconTable" rowKey="id" :columns="appointmentColumns" :data-source="patientAppointmentsList" :pagination="false">
        <template #staff="{record}" >
        <a @click="showStaffModal(record.staff.id)">{{ record.staff.fullName }}</a>
        <!-- <router-link :to="{ name: 'CoordinatorSummary', params: { udid:record.staff.id  }}">{{ record.staff.fullName }}</router-link> -->
    </template>
        <template #flag="{ record }">
          <!-- <Flags :flag="record.flagColor" :data="record" /> -->
          <span>{{record.flagName}}</span>
        </template>
      </a-table>
      </div>
    </a-col>
  </a-row>
  <AddAppointmentModal v-if="addAppointmentVisible" v-model:visible="addAppointmentVisible" :patientId="patientId" :patientName="patientName" @closeModal="closeModal" :isChat="true" />
</template>

<script>
import {
  actionTrack,
  showStaffModal
} from '@/commonMethods/commonMethod';
import {
  computed,
  ref,
  defineAsyncComponent
} from 'vue-demi';
import { useStore } from 'vuex';
// import Flags from "@/components/common/flags/Flags";

export default {
  components: {
    // Flags,
    AddAppointmentModal: defineAsyncComponent(()=>import("@/components/modals/AddAppointment")),
  },
  props: {
    patientId: {
      type: Number
    },
  },
  setup() {
    const store = useStore()
    const addAppointmentVisible = ref(false)
    const patientAppointmentsList = computed(() => {
      return store.state.appointment.patientAppointmentsList
    })
    
    const showAddAppointmentModal = () => {
      addAppointmentVisible.value = true;
    };
    
    const appointmentColumns = [
      {
        title: "Type",
        dataIndex: "appointmentType",
        key: "appointmentType",
      },
      {
        title: "Care Coordinator",
        dataIndex: "staff",
        key: "staff",
        width: "20%",
        slots: {
      customRender: "staff",
    },
      },
      // {
      //   title: "Patient",
      //   dataIndex: "patient",
      //   key: "patient",
      // },
      // {
      //   title: "Date",
      //   dataIndex: "date",
      //   key: "date",
      // },
      // {
      //   title: "Start Time",
      //   dataIndex: "time",
      //   key: "time",
      // },
      {
        title: "Date & Time",
        dataIndex: "dateTime",
        className: "appointment-dateTime",
        key: "dateTime",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        ellipsis: true,
      },
      {
        title: "Priority",
        dataIndex: "flag",
        className: "appointment-flags",
        key: "flag",
        slots: {
          customRender: "flag",
        },
      },
    ];

    const patientDetails = computed(() => {
      return store.state.patients.patientDetails
    })

    const closeModal = () => {
      addAppointmentVisible.value = false
    }
    const patientName = patientDetails.value != null ? patientDetails.value.fullName : ''

    return {
      showStaffModal,
      showAddAppointmentModal,
      addAppointmentVisible,
      appointmentColumns,
      patientAppointmentsList,
      closeModal,
      actionTrack,
      patientName,
    }
  }
}
</script>

<style>
th.appointment-dateTime, td.appointment-dateTime {
  width: 160px !important;
}
th.appointment-flags, td.appointment-flags {
  width: 80px !important;
}
</style>