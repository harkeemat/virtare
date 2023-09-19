<template>

  <div class="patient-timer">
    <a-typography-text v-if="patientTimerValue != null" class="timerValue">{{ patientTimerValue }}</a-typography-text>
    <a-spin :indicator="loaderIndicator" v-else class="timerValue" />
    <!-- <a-typography-text>00:00:00</a-typography-text> -->

    <!-- Pause Button -->
    <a-button v-if="patientTimerStatus == 'running'" @click="pausePatientTimer" :disabled="resumeTime">
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14V0H12V14H8ZM0 14V0H4V14H0Z" fill="#3083F0" />
      </svg>
    </a-button>

    <!-- Start/Play Button -->
    <a-button v-if="patientTimerStatus != 'running'" @click="resumePatientTimer" :disabled="resumeTime" >
      <svg width="19" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20V0H2.14669V20H0ZM6.2254 20L20 10L6.2254 0V20ZM8.37209 15.2083V4.79167L15.5635 10L8.37209 15.2083Z"
          fill="#3083F0" />
      </svg>
    </a-button>

    <!-- Save Button -->
    <a-button @click="savePatientTime" :disabled="false">

      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.55556 14.2222V8.88889H12.4444V14.2222H14.2222V4.29156L11.7084 1.77778H1.77778V14.2222H3.55556ZM0.888889 0H12.4444L16 3.55556V15.1111C16 15.3469 15.9064 15.573 15.7397 15.7397C15.573 15.9064 15.3469 16 15.1111 16H0.888889C0.653141 16 0.427048 15.9064 0.260349 15.7397C0.0936505 15.573 0 15.3469 0 15.1111V0.888889C0 0.653141 0.0936505 0.427048 0.260349 0.260349C0.427048 0.0936505 0.653141 0 0.888889 0ZM5.33333 10.6667V14.2222H10.6667V10.6667H5.33333Z"
          fill="#3083F0" />
      </svg>

    </a-button>
  </div>
  <!-- <a-button class="round-btn">
    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 16V0L19 8L0 16ZM2 13L13.85 8L2 3V6.5L8 8L2 9.5V13ZM2 13V3V9.5V13Z" fill="#3083F0" />
    </svg>
  </a-button> -->

  <a-drawer placement="right" :closable="false" v-if="visibleTimeLogForm" :visible="visibleTimeLogForm" width="60%">
    <TimeLogForm @onClose="closeTimeLogModal" :onPageLeave="false" />
  </a-drawer>
</template>

<script>
import { computed, watchEffect, ref, onBeforeUnmount, onMounted } from 'vue';
import { useStore } from 'vuex';
import TimeLogForm from "@/components/patients/patientDetails/topSection/modals/TimeLogForm";
import { startTimer, pauseTimer, resumeTimer, stopTimer, saveTime } from "@/services/patientTimer/services/patientTimer.js";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

export default {
  components: {
    TimeLogForm,
  },
  setup() {
    const store = useStore()
    const visibleTimeLogForm = ref(false)
    const timerStart = ref(true)
    const resumeTime = ref(false)
    const patientTimerStatus = computed(() => {
      return store.state.patientsStore.patientTimerStatus
    });

    const logBillingStatus = computed(() => {
      return store.state.patientsStore.logBillingStatus
    });

    const patientInfoSuccess = computed(() => {
      return store.state.patientsStore.patientInfoSuccess
    });

    const patientTimerValue = computed(() => {
      return store.state.patientsStore.patientTimerValue
    });

    // const patientsLoaderStatus = computed(() => {
    //   return store.state.patientsStore.patientsLoaderStatus;
    // })

    onMounted(() => {
      timerStart.value = true
    })

    const timerRuning = () => {
      if (patientTimerStatus.value == '' && patientInfoSuccess.value && timerStart.value) {
        startTimer('isNull')
      }
      if(logBillingStatus.value) {
        stopTimer()
        startTimer('isNull')
      }
    }

    watchEffect(() => {
      timerRuning()  
    })

    const closeTimeLogModal = () => {
      visibleTimeLogForm.value = false
      if (patientTimerStatus.value == '') {
        startTimer('isNull')
      }
      else {
        resumeTimer()
      }
    }

    onBeforeUnmount(() => {
      timerStart.value = false
      store.commit('patientTimerStatus', '')
      timerRuning()
      stopTimer()
    })

    const pausePatientTimer = () => {
      resumeTime.value = true
      pauseTimer()
      setTimeout(()=>{
        resumeTime.value = false
      },1000)
      
    }
    const resumePatientTimer = () => {
        resumeTime.value = true
        resumeTimer()
        setTimeout(()=>{
        resumeTime.value = false
        },1000)
    }
    const savePatientTime = () => {
      saveTime()
      visibleTimeLogForm.value = true
    }
    
    const loaderIndicator = h(LoadingOutlined, {
      style: {
        fontSize: '24px',
      },
      spin: true,
    });

    return {
      pausePatientTimer,
      resumePatientTimer,
      savePatientTime,
      patientTimerStatus,
      visibleTimeLogForm,
      closeTimeLogModal,
      patientTimerValue,
      resumeTime,
      loaderIndicator,
    }
  }

}
</script>

<style>
.timerValue {
  text-align: center;
  width: 110px;
}
</style>