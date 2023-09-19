<template>
  <a-form class="common-form" ref="formRef" @finish="submitForm" :model="oxygenSaturationForm" :label-col="{ span: 24 }" :wrapper-col="wrapperCol" >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">{{ props.formTitle }}</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item label="Date" class="required" name="takeDate" :rules="[{ required: true, message: $t('global.required') }]">
                <DateField v-model:value="oxygenSaturationForm.takeDate" :globalDateFormat="globalDateFormat" style="width:100%" :disabledDateData="current => !current || current > dayjs(new Date())" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Time" class="required" name="takeTime" :rules="[{ required: true, message: $t('global.required') }]">
                <TimePicker v-model:value="oxygenSaturationForm.takeTime" :globalTimeFormat="timeFormat" style="width:100%"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" v-for="field,index in oxygenSaturationForm.vitals" :key="field.id" :value="field.id">
              <a-form-item :class="field.name == 'SPO2' ? 'required' : ''" :label="field.name == 'SPO2' ? field.name+' (%)' : field.name" :id="field.id" :name="['vitals', index, 'value']" :rules="[{ required: field.name == 'SPO2' ? true : false, message: $t('global.required') }, { pattern: regex.nonDecimalDigits, message: $t('global.nonDecimalDigits') }, { pattern: field.name == 'SPO2' ? regex.percentageRegex : regex.BPRegex, message: field.name == 'SPO2' ? $t('global.allowedRangePercentage') : $t('global.allowedRangeBP') }]">
                <InputNumber v-model:value="field.value" :disabled="false" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Note" name="comment" :rules="[{ required: false }]">
                <Textarea v-model:value="oxygenSaturationForm.comment" />
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
		reactive
  } from 'vue';
  import { useStore } from 'vuex';
  import DateField from "@/components/modals/search/DateField";
  import InputNumber from "@/components/form-fields/InputNumber";
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

  const timeFormat = "HH:mm:ss";

  const vitalsStore = computed(() => {
    return store.state.vitals
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

  const oxygenSaturationForm = reactive({
    takeDate: '',
    takeTime:'',
    comment: '',
    vitals:[],
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

          oxygenSaturationForm.vitals.push({
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
      takeTime: timeStamp(oxygenSaturationForm.takeDate+' '+oxygenSaturationForm.takeTime),
      comment: oxygenSaturationForm.comment,
      deviceType: props.deviceId,
      createdType: "Staff",
      deviceInfo: "Web App",
      addType: "Manual",
      vitals: {}
    }

    vitalsStore.value.vitalFields.map(field => {
      oxygenSaturationForm.vitals.map(vital => {
        let vitalName = (vital.name).toLowerCase()
        let fieldName = (field.name).toLowerCase()
        if(vitalName == fieldName) {
          vitalsData.vitals[fieldName] = vital.value
        }
      })
    })

    store.dispatch('vitals/addVitals', {
      patientId: route.params.udid,
      data: vitalsData
    }).then(() => {
      closeAction('uploadVitals')
      store.dispatch("pinNotes", { id: route.params.udid })
      store.dispatch('vitals/patientVitalsTable', {
				patientId: route.params.udid,
				deviceType: props.deviceId,
				activeTab: "oxygenLevels",
        endParams: endParams.value,
			})
      store.dispatch('vitals/patientVitalsGraph', {
				patientId: route.params.udid,
				deviceType: props.deviceId,
				activeTab: "oxygenLevels",
			})
      store.dispatch('patientInformation', route.params.udid)
      store.dispatch("patientNotesList", { id: route?.params?.udid })
      store.commit('vitals/vitalTabs','oxygenLevels')
      onClose()
    })
  };

  const onClose = () => {
    emit('hideDrawer')
  }
 </script>
