<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="manualTimelogForm" :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Add Manual Time</a-typography-title>
        </a-col>
      </a-row>
        
      <a-row :gutter="[48, 16]">
        <a-col :span="24" v-for="(timerRow, index) in manualTimelogForm.activitiesLogged" :key="index">
          <a-row :gutter="[48, 16]">
            <a-col :span="7">
              <a-form-item :label="$t('timeLogs.cptCode')" :name="['activitiesLogged', index, 'cptCodeActivityId']" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <SelectBox v-model:value="timerRow.cptCodeActivityId" :globalCode="activitiesList" :disabled="false" />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item :label="$t('timeLogs.activityDate')" :name="['activitiesLogged', index, 'activityDate']" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <DateField v-model:value="timerRow.activityDate" :globalDateFormat="globalDateFormat" :disabled="false" />
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item :label="$t('timeLogs.timeAmount')+' (MM:SS)'" :name="['activitiesLogged', index, 'durations']" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <TimePicker v-model:value="timerRow.durations" type="duration" :globalTimeFormat="sessionTimeFormat" :disabled="false" />
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-space class="actions-btn">
                <span  class="row-delete-btn" v-if="manualTimelogForm.activitiesLogged.length > 1" @click="removeFields(timerRow)">
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
          <a-form-item :label="$t('timeLogs.note')" name="note" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
            <Textarea v-model:value="manualTimelogForm.note" :disabled="false" />
          </a-form-item>
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
      <a-button @click="hideDrawer" class="secondary-btn"> Cancel </a-button>
      <a-button class="primary-btn" html-type="submit"> Save </a-button>
    </div>
    <TimeLogLoader />
  </a-form>
</template>

<script setup>
  import SelectBox from "@/components/form-fields/SelectBox.vue";
  import Textarea from "@/components/form-fields/Textarea.vue";
  import DateField from "@/components/modals/search/DateField.vue";
  import TimePicker from "@/components/form-fields/TimePicker.vue";
  import { computed, reactive, onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from "vue-router";
  import { globalDateFormat, minutesToSeconds, sessionTimeFormat, timeStamp } from "@/commonMethods/commonMethod.js";
  import TimeLogLoader from "@/components/patients/patientDetails/topSection/modals/TimeLogLoader"
  import moment from "moment";

  const store = useStore()
  const route = useRoute()

  const emit = defineEmits(['hideDrawer'])

  const manualTimelogForm = reactive({
    activitiesLogged: [],
    note: ''
  })

  const activitiesList = computed(() => {
    return store.state.cptCodes.activitiesList
  })

  onMounted(() => {
    store.dispatch('activitiesList').then(() => {
      if(manualTimelogForm.activitiesLogged.length == 0) {
        manualTimelogForm.activitiesLogged.push({
          cptCodeActivityId: '',
          activityDate: '',
          durations: '',
        })
      }
    })
  })
    
  const addFields = () => {
    manualTimelogForm.activitiesLogged.push({
      cptCodeActivityId: '',
      activityDate: '',
      durations: '',
    });
  }

  const removeFields = item => {
    let index = manualTimelogForm.activitiesLogged.indexOf(item);
    if (index !== -1) {
      manualTimelogForm.activitiesLogged.splice(index, 1);
    }
  };

  const hideDrawer = () => {
    emit('hideDrawer')
  }

  const submitForm = () => {
    hideDrawer()
    /* let requestData = []
    manualTimelogForm.activitiesLogged.map(item => {
      requestData.push({
        patientId: route.params.udid,
        cptCodeActivityId: item.cptCodeActivityId,
        durations: minutesToSeconds(item.durations),
        activityDate: timeStamp(moment()),
        isManual: 1,
        note: manualTimelogForm.note,
      })
    }) */

    let requestData = {
      patientId: route.params.udid,
      isManual: 1,
      note: manualTimelogForm.note,
      data: []
    }
    manualTimelogForm.activitiesLogged.map(item => {
      requestData.data.push({
        cptCodeActivityId: item.cptCodeActivityId,
        activityDate: timeStamp(item.activityDate+' '+moment().format('HH:mm:ss')),
        durations: minutesToSeconds(item.durations),
      })
    })

    store.dispatch('logBilling', requestData)
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
</style>