<template>
  <div class="drawerBody">
    <a-typography-title :level="2" class="common-heading">{{ isEdit? 'Edit Inventory': 'Add Inventory' }}</a-typography-title>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" class="common-form"
      :id="arrayToObjectData(formData, arrayToObjectData(formTitleNames, 34, 'id', 'name'), 'name', 'udid')"
      ref="formRef" :model="inventoryForm" layout="vertical" @finish="submitForm" >
      <a-row :gutter="[48, 16]">
        <a-col :span="12">
          <a-form-item label="Manufacture Name" class="required" name="manufactureId"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="inventoryForm.manufactureId" :globalCode="manufacturer"
                @handleGlobalChange="onSelectOption($event); handleGlobalChange($event); checkChangeInput()" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Network" class="required" name="networkId"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="inventoryForm.networkId" :globalCode="connectivity"
                @handleGlobalChange="onSelectOption($event); handleGlobalChange($event); checkChangeInput()" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
            <a-form-item :label="$t('inventory.deviceType')"  class="required" name="deviceTypeId"
              :rules="[{ required: true, message: $t('global.required') }]">
              <SelectBox v-model:value="inventoryForm.deviceTypeId" :globalCode="deviceType"
                @handleGlobalChange="onSelectOption($event); handleGlobalChange($event); checkChangeInput()" />
            </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('patient.devices.serialNo') + '/' + $t('patient.devices.MACAddress')"  class="required" name="serialNumber"
            :rules="[{ required: true, message: $t('global.required') }]">
            <InputFields v-model:value="inventoryForm.serialNumber" size="large" @change="checkChangeInput();serialNumberChnage()" />
            <ErrorMessage v-if="inventoryError" :name="
            inventoryError?.serialNumber
                    ? inventoryError?.serialNumber
                    : ''" />
          </a-form-item>
        </a-col>
      </a-row>
      <FormBaseComponents
        :formId="arrayToObjectData(formData, arrayToObjectData(formTitleNames, 34, 'id', 'name'), 'name', 'udid')">
      </FormBaseComponents>
      <a-button class="hidden" id="submit" html-type="submit" />
    </a-form>
  </div>
  <div class="drawerFooter">
    <Button classData="secondary-btn"  @click="onClose" name="Cancel"/>
    <Button classData="primary-btn"  @click="submitdata" :name="'Save'" :loading="common.loading"/>
  </div>
</template>

<script>
import { reactive, computed, ref, watchEffect } from 'vue-demi';
import { arrayToObjectData, formTitleNames } from "@/commonMethods/commonMethod";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { useStore } from 'vuex';
import InputFields from "@/components/form-fields/InputFields.vue";
import Button from "@/components/button/Button.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  emits: ["is-visible"],
  components: {
    SelectBox,
    InputFields,
    Button,
    FormBaseComponents

  },
  props: {
    isEdit: {
      type: Boolean
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const formRef = ref()
    const inventoryForm = reactive({
      deviceType: '',
      deviceTypeId: '',
      manufacture: '',
      manufactureId: '',
      networkId:'',
      serialNumber: '',
      macAddress: '',
      isActive: true,
    });
    const deviceType = computed(() => {
      return store.state.common.deviceType
    })
    const inventory = computed(() => {
      return store.state.inventory;
    })
    const deviceModalsList = computed(() => {
      return store.state.inventory.deviceModalsList
    });
    const inventoryError = computed(() => {
      return store.state.inventory.inventoryError
    });
    const manufacturer = computed(()=>{
      return store.state.common.manufacturer
    })
    const serialNumberChnage = () =>{
      store.state.inventory.inventoryError = ''
    }
    const connectivity = computed(()=>{
      return store.state.common.connectivity
    })
    const submitdata = () => {
      let buuton = document.getElementById("submit")
      buuton.click()
    }
    const submitForm = () => {
      if (props.isEdit) {
        //Object.assign(inventoryForm, form)
        store.dispatch('updateInventory', { id: inventoryForm.id, record: inventoryForm }).then((res) => {
          if(res){
            store.dispatch('inventoriesList')
            onClose();
          }
        })
      }
      else {
        store.dispatch('addInventory', inventoryForm).then((res) => {
          if(res){
            store.dispatch('inventoriesList')
            onClose();
          }
        })
      }
      store.commit('checkChangeInput', false)
    }
    watchEffect(() => {
      if (inventory.value.inventoryDetails) {
        if (props.isEdit) {
          Object.assign(inventoryForm, inventory.value.inventoryDetails);

        }
      }
    })
    const form = reactive({ ...inventoryForm })
    const handleCancel = () => {
      formRef.value?.resetFields();
      Object.assign(inventoryForm, form)
      //emit('is-visible', false);
    };
    const handleGlobalChange = (data) => {
      inventoryForm.deviceType = data
    }
    function checkChangeInput() {
      ///store.commit('checkChangeInput', true)
    }
    const onClose = () => {
      emit('is-visible', false);
      handleCancel()
    }
    const common = store.getters.commonRecords
    return {
      arrayToObjectData,
      formTitleNames,
      formData: store.getters.formTitle,
      inventoryForm,
      submitForm,
      deviceModalsList,
      handleGlobalChange,
      deviceType,
      checkChangeInput,
      submitdata,
      onClose,
      manufacturer,
      connectivity,
      inventoryError,
      formRef,
      serialNumberChnage,
      labelCol: {
        span: 20,
      },
      common,
      wrapperCol: {
        span: 20,
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}


</style>

