<template>
  <a-form ref="formRef" class="common-form" :model="device" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Assign Device</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-typography-text class="common-tag-line error">{{ device?.errorMessage ? device?.errorMessage :
            '' }}</a-typography-text>
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item label="DEVICE TYPE ">
                <a-input value="Glucometer" disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.devices.serialNo') + '/' + $t('patient.devices.MACAddress')" :name="['Glucose', 'inventoryId']"
                :rules="[{ required: false, messdeviceage: $t('global.required') }]">
                <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
                <SelectBox v-model:value="device.Glucose.inventoryId" @focus="focus"
                  :placeholderData="$t('patient.devices.serialNo')" :notFoundContent="true"
                  :globalCode="deviceRecord?.serialNo?.Gluscose" @change="handelChange"
                  @onSearch="search($event,'Gluscose')"
                  :disabled="device.glucoseDisabled" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="DEVICE TYPE ">
                <a-input value="Oximeter" disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.devices.serialNo') + '/' + $t('patient.devices.MACAddress')" :name="['Oximeter', 'inventoryId']"
                :rules="[{ required: false, message: $t('global.required') }]">
                <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
                <SelectBox v-model:value="device.Oximeter.inventoryId" @focus="focus"
                  :placeholderData="$t('patient.devices.serialNo')" :notFoundContent="true"
                  :globalCode="deviceRecord?.serialNo?.Oximeter"
                  @onSearch="search($event,'Oximeter')"
                  :disabled="device.oximeterDisabled" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="DEVICE TYPE ">
                <a-input value="Blood Pressure" disabled></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.devices.serialNo') + '/' + $t('patient.devices.MACAddress')" :name="['bloodPressure', 'inventoryId']"
                :rules="[{ required: false, message: $t('global.required') }]">
                <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
                <SelectBox v-model:value="device.bloodPressure.inventoryId" @focus="focus"
                  :placeholderData="$t('patient.devices.serialNo')" :notFoundContent="true"
                  :globalCode="deviceRecord?.serialNo?.bloodPressure"
                  @onSearch="search($event,'bloodPressure')"
                  @change="handelChange"
                  :disabled="device.bloodPressureDisabled" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="common.loading"
        :disabled="device.glucoseDisabled && device.bloodPressureDisabled && device.oximeterDisabled ? true : false" />
    </div>
  </a-form>
</template>
<script>
import { onMounted, reactive, ref } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { numbersOnly } from '@/commonMethods/commonMethod';
import Button from "@/components/button/Button.vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { messages } from "@/config/messages";
import {
  openAction,
  closeAction,
  } from '@/commonMethods/commonMethod.js';
  
export default {
  emits: ['onClose'],
  components: {
    SelectBox,
    Button
  },
  setup(props, { emit }) {
    const store = useStore()
    const common = store.getters.commonRecords
    const deviceRecord = store.getters.deviceRecord
    const formRef = ref()
    const route = useRoute()
    const focus = () => {
      console.log("focus");
    };
    const device = reactive({
      glucoseDisabled: ref(false),
      oximeterDisabled: ref(false),
      bloodPressureDisabled: ref(false),
      errorMessage: '',
      Glucose: {
        "inventoryId": undefined
      },
      Oximeter: {
        "inventoryId": undefined
      },
      bloodPressure: {
        "inventoryId": undefined
      },
    })
    const form = reactive({ ...device })
    onMounted(() => {
      openAction()
      store.dispatch("serialNo")
      if (deviceRecord.value?.deviceList?.length > 0) {
        deviceRecord.value?.deviceList.map((item) => {
          if (item.deviceType == 'Blood Pressure' && !item.archive) {
            device.bloodPressureDisabled = true
            device.bloodPressure.inventoryId = item?.serialNumber
          } else if (item.deviceType == 'Oximeter' && !item.archive) {
            device.Oximeter.inventoryId = item?.serialNumber
            device.oximeterDisabled = true
          } else if (item.deviceType == 'Glucose' && !item.archive) {
            device.glucoseDisabled = true
            device.Glucose.inventoryId = item?.serialNumber
          }
        })
      }
    })

    const submitForm = () => {
      if ((device.bloodPressure.inventoryId && !device.bloodPressureDisabled) || (device.Oximeter.inventoryId && !device.oximeterDisabled) || (device.Glucose.inventoryId && !device.glucoseDisabled)) {
        store.dispatch("addPatientInventory", {
          id: route?.params?.udid, data: {
            "bloodPressue": device?.bloodPressureDisabled ? '' : device.bloodPressure.inventoryId,
            "oximeter": device?.oximeterDisabled ? '' : device.Oximeter.inventoryId,
            "glucose": device?.glucoseDisabled ? '' : device.Glucose.inventoryId
          }
        }).then((res) => {
          if (res) {
            closeAction('deviceSetup')
            //Refresh device listing after add inventory
            store.dispatch("deviceList", { id: route?.params?.udid }).then(() => {
              store.commit('patientVitalsEnabled', true)
              store.commit('patientTabsEnabled', true)
            })
            onClose()
          }
        })
      } else {
        device.errorMessage = messages?.deviceError
      }
    }
    const onClose = () => {
      //close form
      store.state.device.serialNo = []
      store.commit('loading', false)
      formRef.value?.resetFields();
      Object.assign(device, form)
      emit('onClose', false)
    };

    const search = () => {
      //search = (value,selectBoxName)
    //   device.errorMessage = ''
    //   /** check searched value present is in list */
    //   if (selectBoxName == 'Gluscose') {
    //   let isValuePresent = deviceRecord.value?.serialNo?.Gluscose?.find(({name}) => new RegExp(value,'i').test(name));
    //   if(typeof isValuePresent === 'undefined'){
    //   device.Glucose.inventoryId = value;
    //   }
    // } 
    // else if (selectBoxName == 'Oximeter') {
    //   let isValuePresent = deviceRecord.value?.serialNo?.Oximeter?.find(({name}) => new RegExp(value,'i').test(name));
    //   if(typeof isValuePresent === 'undefined')
    //   device.Oximeter.inventoryId = value;
    // } else {
    //   let isValuePresent = deviceRecord.value?.serialNo?.bloodPressure?.find(({name}) => new RegExp(value,'i').test(name));
    //   if(typeof isValuePresent === 'undefined')
    //   device.bloodPressure.inventoryId = value;
    // }
  }
  
    const handelChange = () => {
      device.errorMessage = ''
    }
    return {
      formRef,
      common,
      deviceRecord,
      focus,
      numbersOnly,
      device,
      labelCol: { span: 24 },
      onClose,
      //arrayToObject,
      // deviceChange,
      // manufacturerChange,
      submitForm,
      messages,
      handelChange,
      search
    };
  },
};
</script>
