<template>
  <a-form ref="formRef" class="common-form" :model="device" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Device</a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item class="required" :label="$t('patient.devices.deviceType')" name="deviceName"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="device.deviceName" @focus="focus" :placeholderData="$t('global.specialization')"
                  :globalCode="common?.deviceType" @change="deviceChange" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="required" :label="$t('patient.devices.manufacturer')" name="manufacturer"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="device.manufacturer" @focus="focus"
                  :placeholderData="$t('patient.devices.manufacturer')" :globalCode="common?.manufacturer"
                  @change="manufacturerChange" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('patient.devices.serialNo')" class="required" name="inventoryId"
                :rules="[{ required: true, message: $t('global.required') }]">
                <!-- <a-input v-model:value="peopleForm.phoneNumber" /> -->
                <SelectBox v-model:value="device.inventoryId" @focus="focus"
                  :placeholderData="$t('patient.devices.serialNo')" :globalCode="deviceRecord?.serialNo" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="common.loading" />
    </div>
  </a-form>
</template>
<script>
import { reactive, ref } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { numbersOnly } from '@/commonMethods/commonMethod';
import Button from "@/components/button/Button.vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
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
      "deviceName": undefined,
      "manufacturer": undefined,
      "inventoryId": undefined
    })
    const form = reactive({ ...device })
    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };
    const deviceChange = () => {
      if (device.manufacturer && device.deviceName) {
        store.state.device.serialNo = []
        store.dispatch("serialNo", { "manufactureId": device.manufacturer, "deviceId": device.deviceName })
        device.inventoryId = ''
      }
    }
    const manufacturerChange = () => {
      if (device.manufacturer && device.deviceName) {
        //Get serial number from device name and manufacture
        store.state.device.serialNo = []
        store.dispatch("serialNo", { "manufactureId": device.manufacturer, "deviceId": device.deviceName })
        device.inventoryId = ''
      }
    }
    const submitForm = () => {
      store.dispatch("addPatientInventory", { id: route?.params?.udid, data: { "inventoryId": device?.inventoryId } }).then((res) => {
        if (res) {
          //Refresh device listing after add inventory 
          store.dispatch("deviceList", { id: route?.params?.udid })
          onClose()
        }
      })
    }
    const onClose = () => {
      //close form
      store.state.device.serialNo = []
      store.commit('loading', false)
      formRef.value?.resetFields();
      Object.assign(device, form)
      emit('onClose', false)
    };
    return {
      formRef,
      common,
      deviceRecord,
      focus,
      handleChange,
      numbersOnly,
      device,
      labelCol: { span: 24 },
      onClose,
      deviceChange,
      manufacturerChange,
      submitForm
    };
  },
};
</script>
