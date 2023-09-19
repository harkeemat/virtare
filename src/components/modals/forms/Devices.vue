<template>
  <a-form ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,17,'id','name'),'name','udid')" scrollToFirstError=true :model="device" name="basic" autocomplete="off" layout="vertical" @finish="addDevice" @finishFailed="deviceFailed">
    <a-row :gutter="24">
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('patient.devices.deviceType')" name="deviceType" :rules="[{ required: true, message: $t('patient.devices.deviceType')+' '+$t('global.validation') }]">
                    <GlobalCodeDropDown v-model:value="device.deviceType" :dataId="22" @handleGlobalChange="handleGlobalChange($event); handleInventory($event); onChange()"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.deviceType?errorMsg.deviceType[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item  :label="$t('patient.devices.inventory')" name="inventory" :rules="[{ required: true, message: $t('patient.devices.inventory')+' '+$t('global.validation') }]">
                    <InventoryGlobalCodeDropDown :disabled="patients.inventoryList.length==0 || device.deviceType==''" v-model:value="device.inventory" :globalCode="patients.inventoryList" @change="handleChange(device.inventory); onChange()"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.deviceType?errorMsg.deviceType[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('patient.devices.modelNo')" name="modelNumber" :rules="[{ required: false, message: $t('patient.devices.modelNo')+' '+$t('global.validation') }]">
                    <div >
                        <a-input size="large" @change="onChange()"  v-model:value="device.modelNumber"  disabled />
                    </div>
                    
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.modelNumber?errorMsg.modelNumber[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="8" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('patient.devices.MACAddress')" name="macAddress" :rules="[{ required: false, message: $t('patient.devices.MACAddress')+' '+$t('global.validation') }]">
                    <div >
                        <a-input size="large" @change="onChange()" v-model:value="device.macAddress"  disabled />
                    </div>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.macAddress?errorMsg.macAddress[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,17,'id','name'),'name','udid')"> </FormBaseComponents>
    </a-row>
    <a-row :gutter="24" class="mb-24">
      <a-col :span="24">
        <a-button type="primary" html-type="submit" style="float:right">{{$t('global.save')}}</a-button>
      </a-col>
    </a-row>
  </a-form>
  <a-row :gutter="24" class="mb-24">
    <a-col :span="24">
      <a-table class="sortIconTable" rowKey="id" :columns="deviceColumns" :data-source="deviceData" :pagination="false" :scroll="{ x: 900 }">
        <template #active="{record}" >
          <a-switch v-model:checked="record.status" @change="changeStatus(record.id, $event)" :disabled="!arrayToObjact(screensPermissions,102)"/>
        </template>
        <template #action="text" v-if="arrayToObjact(screensPermissions,73)">
          <a class="icons" @click="deleteDevice(text.record.id)">
            <DeleteOutlined />
          </a>
        </template>
      </a-table>
      <Loader />
    </a-col>
  </a-row>
</template>

<script>
import { defineComponent, reactive, computed, ref, watchEffect,onUnmounted } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import Loader from "../../loader/Loader";
import { warningSwal, arrayToObjact,arrayToObjectData,formTitleNames} from "../../../commonMethods/commonMethod";
import { messages } from "../../../config/messages";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import InventoryGlobalCodeDropDown from "@/components/modals/search/InventoryGlobalCodeSearch.vue"
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  components: {
    DeleteOutlined,
    Loader,
    ErrorMessage,
    GlobalCodeDropDown,
    InventoryGlobalCodeDropDown,
    FormBaseComponents
  },
  props: {
    idPatient: {
      type: Number
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const patientId = reactive(props.idPatient);
    const status = ref([]);
    const device = reactive({
      inventory: "",
      deviceType: "",
      modelNumber: "",
      macAddress: "",
      // deviceTime: "",
      // serverTime: "",
    });
    const form = reactive({ ...device })
    const formRef = ref();

    watchEffect(() => {
      if(patientId != null) {
        store.dispatch("devices", patientId);
      }
    })

    const addDevice = () => {
      if(patientId != null) {
        store.dispatch("addDevice", {
          data: device,
          id: patientId,
        }).then(() => {
          formRef.value.resetFields();
          Object.assign(device, form)
          store.dispatch("devices", patientId);
        });
      }
      else {
        store.dispatch("addDevice", {
          data: device,
          id: patients.value.addDemographic.id,
        });
        formRef.value.resetFields();
        Object.assign(device, form)
        setTimeout(() => {
          store.dispatch("devices", patients.value.addDemographic.id);
        }, 2000);
      }
    };

    const globalCode = computed(() => {
      return store.state.common;
    });
    const deviceData = computed(() => {
      return store.state.patients.devices;
    });

    const deviceColumns = computed(() => {
      return store.state.patients.devicesColumns;
    });
    const patients = computed(() => {
      return store.state.patients;
    });

    function deleteDevice(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          if(patientId != null) {
            store.dispatch("deleteDevice", {
              id: patientId,
              deviceId: id,
            }).then(() => {
              store.dispatch("devices", patientId);
            });
          }
          else {
            store.dispatch("deleteDevice", {
              id: patients.value.addDemographic.id,
              deviceId: id,
            }).then(() => {
              store.dispatch("devices", patients.value.addDemographic.id);
            });
          }
        }
      });
    }

    const changeStatus = (id, status) => {
      
      store.dispatch("changeStatus", {
        id: patientId,
        inventoryId: id,
        status: status
      });
    }

    function handleInventory(id) {
      store.dispatch("inventoryList", { isAvailable: 1, deviceType: id });
      device.inventory = null;
      device.modelNumber = null,
      device.macAddress = null
    }
    // const deviceFailed = () => {
    //     errorSwal(messages.fieldsRequired)
    // };

    function handleChange(id) {
      let temp = arrayToObjact(patients.value.inventoryList,id)
      device.modelNumber = temp.modelNumber,
      device.macAddress = temp.macAddress
    }

    onUnmounted(()=>{
      store.commit('errorMsg',null)
    })

    const onChange = () => {
      emit('onChange')
    }

    const handleGlobalChange = (data) =>{
      device.deviceType = data
    }

    return {
      handleGlobalChange,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      handleChange,
      // deviceFailed,
      handleInventory,
      changeStatus,
      status,
      warningSwal,
      deleteDevice,
      patients,
      device,
      addDevice,
      globalCode,
      deviceData,
      deviceColumns,
      errorMsg:patients.value.errorMsg,
      formRef,
      onChange,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
