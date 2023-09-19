<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="timelogForm" :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Session</a-typography-title>
          <a-typography-title class="common-sub-heading">Total time spent: {{ totalTimeInSeconds }} Seconds</a-typography-title>
          <!-- <a-typography-title class="common-sub-heading">Time Left: {{ remainingTime }} Seconds</a-typography-title> -->
        </a-col>
      </a-row>
        
      <a-row :gutter="[48, 16]">
        <a-col :span="24" v-for="(timerRow, index) in timelogForm.activitiesLogged" :key="index">
          <a-row :gutter="[48, 16]">
            <a-col :span="10">
              <a-form-item :label="$t('timeLogs.cptCode')" :name="['activitiesLogged', index, 'cptCodeActivityId']" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <SelectBox v-model:value="timerRow.cptCodeActivityId" :globalCode="activitiesList" :disabled="timerRow.isAction ? true : false" />
                <!-- <ErrorMessage v-if="error" :name="error.cptCodeId ? error.cptCodeId[0] : ''" /> -->
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item :label="$t('timeLogs.timeAmount')+' (MM:SS)'" :name="['activitiesLogged', index, 'durations']" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <TimePicker v-model:value="timerRow.durations" :globalTimeFormat="sessionTimeFormat" :disabled="timerRow.cptCodeActivityId == idleActivityId ? true : false" @change="changeTime" type="duration" />
                <!-- <ErrorMessage v-if="error" :name="error.durations ? error.durations[0] : ''" /> -->
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-space class="actions-btn">
                <span  class="row-delete-btn" v-if="timelogForm.activitiesLogged.length > 1 && !timerRow.isAction" @click="removeFields(timerRow)">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="#CC0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>

                </span>
              </a-space>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-space class="actions-btn">
            <span class="add-row-btn" @click="addFields">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#3083F0"/>
                <rect x="7.78357" y="11.3047" width="8.43243" height="1.40541" fill="white"/>
                <rect x="12.7025" y="7.79102" width="8.43243" height="1.40541" transform="rotate(90 12.7025 7.79102)" fill="white"/>
              </svg>
            </span>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <span v-if="timeExceeds || timeBelowTotal" class="timeExceedsText">
        {{ timeBelowTotal ? messages.timeBelowTotal : messages.timeExceeds}} <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.71749 2.89589L1.36499 13.5009C1.23401 13.7277 1.16471 13.9849 1.16398 14.2468C1.16324 14.5087 1.2311 14.7662 1.36081 14.9938C1.49051 15.2213 1.67753 15.4109 1.90327 15.5438C2.129 15.6766 2.38558 15.748 2.64749 15.7509H15.3525C15.6144 15.748 15.871 15.6766 16.0967 15.5438C16.3224 15.4109 16.5095 15.2213 16.6392 14.9938C16.7689 14.7662 16.8367 14.5087 16.836 14.2468C16.8353 13.9849 16.766 13.7277 16.635 13.5009L10.2825 2.89589C10.1488 2.67547 9.96053 2.49323 9.73588 2.36675C9.51124 2.24027 9.25779 2.17383 8.99999 2.17383C8.74218 2.17383 8.48873 2.24027 8.26409 2.36675C8.03944 2.49323 7.85119 2.67547 7.71749 2.89589Z" stroke="#F95932" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 7.22461V10.2246" stroke="#F95932" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 12.75H9.00755" stroke="#F95932" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <a-button @click="onClose" class="secondary-btn"> Cancel </a-button>
      <!-- <a-button class="primary-btn" html-type="submit"> -->
      <a-button class="primary-btn" html-type="submit" :disabled="timeBelowTotal || timeExceeds || disableSubmit">
        Save
      </a-button>
    </div>
    <TimeLogLoader />
  </a-form>
</template>

<script setup>
  import SelectBox from "@/components/form-fields/SelectBox.vue";
  import TimePicker from "@/components/form-fields/TimePicker.vue";
  // import ErrorMessage from "@/components/common/messages/ErrorMessage";
  import { computed, watchEffect, reactive, onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import {
    useRoute,
  } from "vue-router";
  import { messages } from "@/config/messages.js";
  import { hmsToSeconds, minutesToSeconds, secondsToMS, sessionTimeFormat, timeStamp } from "@/commonMethods/commonMethod.js";
  import TimeLogLoader from "@/components/patients/patientDetails/topSection/modals/TimeLogLoader"
import moment from "moment";
  import {
    stopTimer,
   } from '@/commonMethods/commonMethod.js';

  const store = useStore()
  const route = useRoute()

  const emit = defineEmits(['onClose', 'redirectRoute'])
  const props = defineProps({
    onPageLeave: Boolean
  })
  let patientTimeLog = computed(() => {
    return JSON.parse(sessionStorage.getItem('patientTimeLog'))
  })
  let vitalReviewSession = JSON.parse(sessionStorage.getItem('vitalReviewSession'))
  let vitalUploadSession = JSON.parse(sessionStorage.getItem('vitalUploadSession'))
  let chatSession = JSON.parse(sessionStorage.getItem('chatSession'))
  let deviceSetupSession = JSON.parse(sessionStorage.getItem('deviceSetupSession'))
  const totalTimeInSeconds = ref(null)
  const timeBelowTotal = ref(false)
  const timeExceeds = ref(false)
  const sumofTimeAdded = ref(0)
  const remainingTime = ref(0)
  const chatActivityId = ref('')
  const vitalReviewActivityId = ref('')
  const vitalUploadActivityId = ref('')
  const deviceSetupActivityId = ref('')
  const idleActivityId = ref('')
  const disableSubmit = ref(false)

  const timelogForm = reactive({
    activitiesLogged: []
  })

  const patientTimerValue = computed(() => {
    return store.state.patientsStore.patientTimerValue
  })

  const isBillingLogged = computed(() => {
    return store.state.patientsStore.isBillingLogged
  });

  const activitiesList = computed(() => {
    return store.state.cptCodes.activitiesList
  })

  let sumValue = 0
  let sessionLog = []
  onMounted(() => {
    store.dispatch('activitiesList').then(() => {
      activitiesList?.value.map(item => {
        if(item.slugName == 'setup-device') {
          deviceSetupActivityId.value = item.id
        }
        if(item.slugName == 'Vitals-Review') {
          vitalReviewActivityId.value = item.id
        }
        if(item.slugName == 'vital-upload') {
          vitalUploadActivityId.value = item.id
        }
        if(item.slugName == 'Chat-Log') {
          chatActivityId.value = item.id
        }
        if(item.slugName == 'idle') {
          idleActivityId.value = item.id
        }
        timelogForm.activitiesLogged.map(activity => {
          activity.cptCodeActivityId = item.id
        })
      })
      if(chatSession && chatSession.totalTime != 0) {
        sessionLog.push({
          actionId: chatActivityId.value,
          actionName: 'Chat Log',
          timeLogged: secondsToMS(chatSession.totalTime)
        })
      }

      if(vitalReviewSession && vitalReviewSession.totalTime != 0) {
        sessionLog.push({
          actionId: vitalReviewActivityId.value,
          actionName: 'Vitals Review',
          timeLogged: secondsToMS(vitalReviewSession.totalTime)
        })
      }

      if(vitalUploadSession && vitalUploadSession.totalTime != 0) {
        sessionLog.push({
          actionId: vitalUploadActivityId.value,
          actionName: 'Vital Upload',
          timeLogged: secondsToMS(vitalUploadSession.totalTime)
        })
      }

      if(deviceSetupSession && deviceSetupSession.totalTime != 0) {
        sessionLog.push({
          actionId: deviceSetupActivityId.value,
          actionName: 'Setup Device',
          timeLogged: secondsToMS(deviceSetupSession.totalTime)
        })
      }
      
      totalTimeInSeconds.value = hmsToSeconds(patientTimerValue.value)
      sessionLog.map(item => {
        sumValue += minutesToSeconds(item.timeLogged)
      })
      
      sumofTimeAdded.value = sumValue
      if(sumofTimeAdded.value > totalTimeInSeconds.value) {
        timeExceeds.value = true
      }
      else {
        timeExceeds.value = false
      }

      if(totalTimeInSeconds.value > sumofTimeAdded.value) {
        remainingTime.value = totalTimeInSeconds.value-sumofTimeAdded.value
      }
      else if(totalTimeInSeconds.value == sumofTimeAdded.value) {
        remainingTime.value = 0
      }

      if(remainingTime.value > 0) {
        sessionLog.push({
          actionId: idleActivityId.value,
          actionName: 'Idle',
          timeLogged: secondsToMS(remainingTime.value)
        })
      }

      sessionStorage.setItem('patientTimeLog', JSON.stringify(sessionLog))
    
      if(patientTimeLog.value.length > 0) {
        patientTimeLog.value.map(time => {
          timelogForm.activitiesLogged.push({
            isAction: true,
            cptCodeActivityId: time.actionId,
            durations: time.timeLogged,
          })
        })
      }

      if(timelogForm.activitiesLogged.length == 0) {
        timelogForm.activitiesLogged.push({
          isAction: false,
          cptCodeActivityId: '',
          durations: '',
        })
      }
    })
  })

  const timelogFormReactive = reactive({ ...timelogForm })
  
  watchEffect(() => {
    let sumVal = 0
    Object.assign(timelogForm, {
      durations: patientTimerValue.value
    })
    totalTimeInSeconds.value = hmsToSeconds(patientTimerValue.value)
    timelogForm.activitiesLogged.map(item => {
      if(item.durations != '') {
        sumVal += minutesToSeconds(item.durations)
      }
    })
    sumofTimeAdded.value = sumVal
    if(sumofTimeAdded.value > totalTimeInSeconds.value) {
      timeExceeds.value = true
    }
    else {
      timeExceeds.value = false
    }
    if(totalTimeInSeconds.value > sumofTimeAdded.value) {
      timeBelowTotal.value = true
      remainingTime.value = totalTimeInSeconds.value-sumofTimeAdded.value
    }
    else {
      timeBelowTotal.value = false
    }
  })
    
  /**
   * This function is used to update the Idle time for the Patient when:
   * A new Activity field is added
  */
  const addFields = () => {
    let index = timelogForm.activitiesLogged.length-1
    timelogForm.activitiesLogged.splice(index, 0, {
      isAction: false,
      cptCodeActivityId: '',
      durations: '',
    });
  }

  /**
   * This function is called when:
   * An Activity field is Deleted
  */
  const removeFields = item => {
    let index = timelogForm.activitiesLogged.indexOf(item);

    if (index !== -1) {
      timelogForm.activitiesLogged.splice(index, 1);
      updateIdleTime()
    }
  };

  /**
   * This function is used to update the Idle time for the Patient when:
   * A new Activity field is added
   * Time is changed for an Activity field
   * An Activity field is Deleted
  */
  const updateIdleTime = () => {
    let sumVal = 0
    timelogForm.activitiesLogged.map(element => {
      if(element.durations != '' && element.cptCodeActivityId != idleActivityId.value) {
        sumVal += minutesToSeconds(element.durations)
      }
    })
    let timeLeft = totalTimeInSeconds.value - sumVal
    let timeToUpdate = {
      cptCodeActivityId: idleActivityId.value,
      isAction: true,
      durations: secondsToMS(timeLeft)
    }
    if(timeLeft > 0) {
      if(timelogForm.activitiesLogged[timelogForm.activitiesLogged.length-1].cptCodeActivityId == idleActivityId.value) {
        timelogForm.activitiesLogged.splice(timelogForm.activitiesLogged.length-1, 1, timeToUpdate);
      }
      else {
        timelogForm.activitiesLogged.push(timeToUpdate);
      }
    }
    else {
      timelogForm.activitiesLogged.map(item => {
        if(item.cptCodeActivityId == idleActivityId.value) {
          timelogForm.activitiesLogged.splice(timelogForm.activitiesLogged.length-1, 1)
        }
      })
    }
  }

  /**
   * This function is called when:
   * Time is changed for an Activity field
  */
  const changeTime = () => {
    updateIdleTime()
  }

  /**
   * This function is called when:
   * The Modal is closed
  */
  const onClose = () => {
    emit('onClose')
    Object.assign(timelogForm, timelogFormReactive)
  }

  /**
   * This function is called when:
   * The form is submitted
  */
  const submitForm = () => {
    disableSubmit.value = true
    /* let requestData = []
    timelogForm.activitiesLogged.map(item => {
      requestData.push({
        patientId: route.params.udid,
        cptCodeActivityId: item.cptCodeActivityId,
        durations: minutesToSeconds(item.durations),
        activityDate: timeStamp(moment()),
        isManual: 0,
      })
    }) */
    

    /** Data Should be sent to API in below format.
     * Need to Change the above Format later
    */ 

    let requestData = {
      patientId: route.params.udid,
      activityDate: timeStamp(moment()),
      isManual: 0,
      data: []
    }
    timelogForm.activitiesLogged.map(item => {
      requestData.data.push({
        cptCodeActivityId: item.cptCodeActivityId,
        durations: minutesToSeconds(item.durations),
      })
    })
    
    store.dispatch('logBilling', requestData).then(() => {
      sessionStorage.setItem('patientTimeLog', JSON.stringify([]))
      store.dispatch("patientBillingList", route.params.udid);
      if(!props.onPageLeave) {
        stopTimer('notLeavingPage')
        onClose()
      }
      else {
        if(isBillingLogged.value) {
          stopTimer('leavingPage')
          emit('redirectRoute')
        }
      }
      store.state.sendbirdState.utc = null
      store.state.sendbirdState.date = null
      store.state.sendbirdState.newTime = null
      store.state.sendbirdState.loggedTime = null
      store.state.sendbirdState.totalTime = '00:00:00'
    })
  }
  
</script>

<style scoped>
.add-row-btn {
  cursor: pointer;
}
.row-delete-btn {
  cursor: pointer;
  position: relative;
  top: -2px;
  left: -35px;
}
.common-sub-heading {
  position: relative;
  top: -50px;
  font-size: 20px;
}
.timeExceedsText {
  font-size: 16px;
}
</style>