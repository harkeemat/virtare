<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="manualTimeForm" :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Add Manual Time</a-typography-title>
        </a-col>
      </a-row>
        
      <a-row :gutter="[48, 16]">
        <a-col :span="24" :key="index">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('timeLogs.cptCode')" name="cptCodeActivityId" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <SelectBox v-model:value="manualTimeForm.cptCodeActivityId" :globalCode="activitiesList" :disabled="false" @changeData="handleChange($event)" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('timeLogs.timeAmount')+' (MM:SS)'" name="durations" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <TimePicker v-model:value="manualTimeForm.durations" :globalTimeFormat="sessionTimeFormat" :disabled="false" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label="$t('timeLogs.note')" name="note" class="required" :rules="[{ required: true, message: $t('global.required') }]" :disabled="false">
                <Textarea v-model:value="manualTimeForm.note" :disabled="false" />
              </a-form-item>
            </a-col>
          </a-row>
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
import TimePicker from "@/components/form-fields/TimePicker.vue";
import TimeLogLoader from "@/components/patients/patientDetails/topSection/modals/TimeLogLoader"
import { useStore } from 'vuex';
import {
  useRoute,
} from "vue-router";
import { computed, onMounted, reactive } from "vue";
import { sessionTimeFormat } from "@/commonMethods/commonMethod.js";
import { minutesToSeconds, timeStamp } from "@/commonMethods/commonMethod";
import moment from "moment";

const store = useStore()
const route = useRoute()

const emit = defineEmits(['hideDrawer'])

const manualTimeForm = reactive({
  cptCodeActivityId: '',
  durations: '',
  note: '',
})

const manualTimeFormReactive = reactive({ ...manualTimeForm })

const activitiesList = computed(() => {
  return store.state.cptCodes.activitiesList
})

onMounted(() => {
  store.dispatch('activitiesList')
})

const submitForm = () => {
  let requestData = [{
    patientId: route.params.udid,
    cptCodeActivityId: manualTimeForm.cptCodeActivityId,
    durations: minutesToSeconds(manualTimeForm.durations),
    note: manualTimeForm.note,
    activityDate: timeStamp(moment()),
    isManual: 1,
  }]
  hideDrawer()
  store.dispatch('logBilling', requestData).then(() => {
    store.dispatch("patientBillingList", route.params.udid);
  })
}

const handleChange = (value) => {
  manualTimeForm.cptCodeActivityId = value
}

const hideDrawer = () => {
  emit('hideDrawer')
  Object.assign(manualTimeForm, manualTimeFormReactive)
}

</script>