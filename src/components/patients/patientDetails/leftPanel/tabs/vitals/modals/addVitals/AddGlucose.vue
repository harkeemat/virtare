<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="bloodGlucoseForm" :label-col="{ span: 24 }" :wrapper-col="wrapperCol" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">{{ props.formTitle }}</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item label="Date" class="required" name="takeDate" :rules="[{ required: true, message: $t('global.required') }]">
                <DateField v-model:value="bloodGlucoseForm.takeDate" :globalDateFormat="globalDateFormat" style="width:100%" :disabledDateData="current => !current || current > dayjs(new Date())" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Time" class="required" name="takeTime" :rules="[{ required: true, message: $t('global.required') }]">
                <TimePicker v-model:value="bloodGlucoseForm.takeTime" :globalTimeFormat="timeFormat" style="width:100%"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Vital Type" class="required" name="vitalType" :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="bloodGlucoseForm.vitalType" :globalCode="vitalsStore.vitalFields" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Value" class="required" name="value" :rules="[{ required: true, message: $t('global.required') }, { pattern: regex.nonDecimalDigits, message: $t('global.nonDecimalDigits') }, { pattern: regex.glucoseRegex, message: $t('global.allowedRangeGlucose') }]">
                <InputNumber v-model:value="bloodGlucoseForm.value" :disabled="false" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Note" name="comment" :rules="[{ required: false }]">
                <Textarea v-model:value="bloodGlucoseForm.comment" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onClose" :name="'Cancel'" />
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="store.state.vitals.buttonLoader" />
    </div>
  </a-form>
</template>

<script setup>
  import {
		computed,
    // defineEmits,
    // defineProps,
    onMounted,
		reactive,
		// ref
  } from 'vue';
  import { useStore } from 'vuex';
  import DateField from "@/components/modals/search/DateField";
  import InputNumber from "@/components/form-fields/InputNumber";
  import SelectBox from "@/components/form-fields/SelectBox";
  import Textarea from "@/components/form-fields/Textarea";
  import TimePicker from "@/components/form-fields/TimePicker";
  import { timeStamp } from '@/commonMethods/commonMethod';
  import { useRoute } from 'vue-router';
  import Button from "@/components/button/Button";
  import dayjs from 'dayjs';
  import { globalDateFormat } from '@/commonMethods/commonMethod';
  import { regex } from "@/RegularExpressions/regex";
  import {
    openAction,
    closeAction,
   } from '@/commonMethods/commonMethod.js';

  const store = useStore()
  const route = useRoute()
  // const vitalType = ref(6)

  const timeFormat = "HH:mm:ss";

  const vitalsStore = computed(() => {
    return store.state.vitals
  })

  const vitalTypeValue = computed(() => {
    return store.state.vitals.vitalTypeValue
  })

  const emit = defineEmits(['hideDrawer'])

  const props = defineProps({
    deviceId: Number,
    formTitle: String,
  })

  const vitalTypes = [{
    type: "",
    value: "",
    name: "",
  }]

  const bloodGlucoseForm = reactive({
    takeDate: '',
    takeTime:'',
    comment: '',
    vitalType: '',
    value: '',
  })

  onMounted(() => {
    openAction()  // Add Action Name
    vitalTypes.length = 0
    store.dispatch('vitals/vitalFields', props.deviceId).then((response) => {
      if(response) {
        vitalsStore.value.vitalFields.map((item) => {
          vitalTypes.push({
            id: item.id,
            type: item.id,
            value: '',
            name: item.name,
          })

          bloodGlucoseForm.vitals.push({
            field: item.field,
            id: item.id,
            value: '',
            name: item.name
          })
        })
      }
    })
  })

  const endParams = computed(() => {
    return store.state.vitals.endParams
  })

  const submitForm = () => {
    let vitalsData = {
      takeTime: timeStamp(bloodGlucoseForm.takeDate+' '+bloodGlucoseForm.takeTime),
      comment: bloodGlucoseForm.comment,
      deviceType: props.deviceId,
      createdType: "Staff",
      deviceInfo: "Web App",
      addType: "Manual",
      vitals: {
        type: bloodGlucoseForm.vitalType,
        value: bloodGlucoseForm.value,
      }
    }

    store.dispatch('vitals/addVitals', {
      patientId: route.params.udid,
      data: vitalsData
    }).then(() => {
      closeAction('uploadVitals')
      store.dispatch("pinNotes", { id: route.params.udid })
      store.dispatch('vitals/patientVitalsTable', {
				patientId: route.params.udid,
				deviceType: props.deviceId,
				activeTab: "glucoseLevels",
        endParams: endParams.value,
			})
      store.dispatch('vitals/patientVitalsGraph', {
				patientId: route.params.udid,
				deviceType: props.deviceId,
				activeTab: "glucoseLevels",
        vitalType: vitalTypeValue.value,
			})
      store.dispatch('patientInformation', route.params.udid)
      store.dispatch("patientNotesList", { id: route?.params?.udid })
      store.commit('vitals/vitalTabs','glucoseLevels')
      onClose()
    })
  };

  const onClose = () => {
    emit('hideDrawer')
  }
 </script>
