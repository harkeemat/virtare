
import store from '@/store/index'
import { pauseTimer as timerPause } from "@/services/sendBirdChat/services/trackActivity.js";
import { computed, ref } from 'vue';

const patientTimerStatus = computed(() => {
  return store.state.patientsStore.patientTimerStatus
});

const timerStatus = computed(() => {
  return store.state.sendbirdState.timerStatus;
});

const chatTimerValue = computed(() => {
  return store.state.sendbirdState.chatTimerValue;
});

// Countdown Timer
const elapsedTime = ref(0)
const timer = ref(undefined)
const formattedElapsedTime = computed(() => {
  const date = new Date(null);
  date.setSeconds(elapsedTime.value / 1000);
  const utc = date.toUTCString();
  return utc.substr(utc.indexOf(":") - 2, 8);
})

export const startTimer = (status) => {
  if(status == 'isNull') {
    clearInterval(timer.value);
    elapsedTime.value = 0;
  }
  timer.value = setInterval(() => {
    elapsedTime.value += 1000;
    store.commit('patientTimerStatus', 'running');
    store.commit('patientTimerValue', formattedElapsedTime.value)
  }, 1000)
}

export const pauseTimer = () => {
  store.commit('wantToChat', false)
  timerPause(timerStatus.value, chatTimerValue.value)
  if (patientTimerStatus.value != 'paused') {
    clearInterval(timer.value);
    store.commit('patientTimerStatus', 'paused')
  }
}

export const resumeTimer = () => {
  if (patientTimerStatus.value != 'running') {
    startTimer()
  }
}

export const stopTimer = () => {
  store.commit('patientTimerStatus', 'stopped')
  clearInterval(timer.value);
  elapsedTime.value = 0
  store.commit('logBillingStatus', false)
}

export const saveTime = () => {
  clearInterval(timer.value);
  store.commit('patientTimerStatus', 'paused')
}

export const resetTimer = () => {
  store.commit('patientTimerStatus', 'stopped')
  store.commit('patientTimerValue', null)
  clearInterval(timer.value);
  elapsedTime.value = 0
}