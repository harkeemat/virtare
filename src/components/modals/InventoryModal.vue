<template>
  <a-modal width="800px" :title="isAdd ? 'Edit Inventory' :'Add Inventory'" :footer="false" @cancel="closeModal()" centered :maskClosable="false">
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,34,'id','name'),'name','udid')" ref="formRef" :model="inventoryForm" layout="vertical" @finish="submitForm" @finishFailed="submitFormFailed">
      <a-row :gutter="24">
        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('inventory.deviceType')" name="deviceType" :rules="[{ required: true, message: $t('inventory.deviceType')+' '+$t('global.validation')  }]">
                <GlobalCodeDropDown v-model:value="inventoryForm.deviceType" :dataId="22" @handleGlobalChange="onSelectOption($event); handleGlobalChange($event); checkChangeInput()" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('inventory.modelNumber')" name="deviceModelId" :rules="[{ required: true, message: $t('inventory.modelNumber')+' '+$t('global.validation')  }]">
                <ArrayDataSearch :disabled="!inventoryForm.deviceType"   v-model:value="inventoryForm.deviceModelId" :globalCode="deviceModalsList" @change="checkChangeInput()"/>
            </a-form-item>
          </div>
        </a-col>

        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.macAddress')+'/'+$t('global.serialNumber')" name="to">
              <div class="btn toggleButton" :class="toggleTo ? '' : 'active'" @click="buttonToggle(); checkChangeInput()">
                <span class="btn-content">{{ $t('global.macAddress') }}</span>
              </div>
              <div class="btn toggleButton" :class="toggleTo ? 'active' : ''" @click="buttonToggle(); checkChangeInput()">
                <span class="btn-content">{{ $t('global.serialNumber') }}</span>
              </div>
            </a-form-item>
          </div>
        </a-col>

        <a-col :sm="12" :xs="24">
          <div class="form-group" v-if="!toggleTo">
            <a-form-item :label="$t('inventory.macAddress') " name="macAddress" :rules="[{ required: true, message: $t('inventory.macAddress')+' '+$t('global.validation')  }]">
              <a-input v-model:value="inventoryForm.macAddress" size="large" @change="checkChangeInput()"/>
            </a-form-item>
          </div>
          <div class="form-group" v-if="toggleTo">
            <a-form-item :label="$t('inventory.serialNumber')" name="serialNumber" :rules="[{ required: true, message: $t('inventory.serialNumber')+' '+$t('global.validation')  }]">
              <a-input  v-model:value="inventoryForm.serialNumber" size="large" @change="checkChangeInput()"/>
            </a-form-item>
          </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,34,'id','name'),'name','udid')"> </FormBaseComponents>

        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('inventory.activeStatus')" name="isActive">
              <a-switch @change="checkChangeInput()" v-model:checked="inventoryForm.isActive" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :sm="24" :span="24">
          <FormButtons @onCancel="closeModal"  :submitButton="update ? $t('global.update') : $t('global.save')" />
        </a-col>
      </a-row>
      <Loader />
    </a-form>
  </a-modal>
</template>
<script>
import { ref, reactive, computed, watchEffect } from "vue";
import { useStore } from "vuex"
import FormButtons from "@/components/common/button/FormButtons";
import Loader from "@/components/loader/Loader"
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import {
	warningSwal,
  arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import {
	messages
} from "../../config/messages";
export default {
  components: {
    FormButtons,
    Loader,
    GlobalCodeDropDown,
    ArrayDataSearch,
    FormBaseComponents
  },
  props: {
    isAdd: {
      type: Boolean
    }
  },
  setup(props, {emit}) {
    const store = useStore()
    const checked = ref([false]);
    const formRef = ref()
    const toggleTo = ref(false);

    function buttonToggle() {
      toggleTo.value = !toggleTo.value;
    }

    const inventory = computed(() => {
      return store.state.inventory;
    })
    
    const inventoryForm = reactive({
      deviceType: '',
      deviceModelId: '',
      serialNumber: '',
      macAddress: '',
      isActive: true,
    });
    
    const inventoryTypes = computed(() => {
      return store.state.common.deviceType;
    })

    watchEffect(() => {
     
      if(inventory.value.inventoryDetails){
      if(props.isAdd) {
        Object.assign(inventoryForm, inventory.value.inventoryDetails);
       // inventoryForm.deviceModelId= inventory.value.inventoryDetails.modelNumber
      }
      }
    })
   
    const deviceModalsList = computed(() => {
      return store.state.inventory.deviceModalsList
    });

    const onSelectOption = (value) => {
      inventoryForm.deviceModelId = null
      store.dispatch('deviceModalsList', value)
    };
    
    const submitForm = () => {
      if(props.isAdd) {
				//Object.assign(inventoryForm, form)
        store.dispatch('updateInventory', {id: inventoryForm.id, data: inventoryForm}).then(() => {
          store.dispatch('inventoriesList')

          emit('is-visible', false);
        })
      }
      else {
        store.dispatch('addInventory', inventoryForm).then(() => {
          store.dispatch('inventoriesList')
          emit('is-visible', false);
        })
      }
      handleCancel();
      store.commit('checkChangeInput', false)
    }
     
    const submitFormFailed = () =>{
      
    }

    function checkChangeInput() {
			store.commit('checkChangeInput', true)
		}

		const checkFieldsData = computed(() => {
			return store.state.common.checkChangeInput;
		})
    const form = reactive({ ...inventoryForm })
    const handleCancel = () => {
				formRef.value.resetFields();
				Object.assign(inventoryForm, form)
				//emit('is-visible', false);
		};



    function closeModal() {
      emit("is-visible", true)
			if (checkFieldsData.value) {
				warningSwal(messages.modalWarning).then((response) => {
					if (response == true) {
						handleCancel();
						emit("is-visible", false);
            Object.assign(inventoryForm, form)
						store.commit('checkChangeInput', false)
					} else {
						emit("is-visible", true);
					}
				});
			}
			else {
				formRef.value.resetFields();
        emit("is-visible", false)
        Object.assign(inventoryForm, form)
			}
		}
    const handleGlobalChange = (data) =>{
      inventoryForm.deviceType = data
    }
    return {
      submitFormFailed,
      handleGlobalChange,
      inventoryForm,
      submitForm,
      handleCancel,
      size: ref("large"),
      checked,
      onSelectOption,
      inventoryTypes,
      deviceModalsList,
      closeModal,
      checkFieldsData,
			checkChangeInput,
      formRef,
      buttonToggle,
      toggleTo,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
    };
  },
};
</script>

<style>
.ant-modal-footer {
    display: none;
}

.toggleButton {
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 6px 16px;
    display: inline-block;
    cursor: pointer;
    width: fit-content;
}

.toggleButton.active {
    background-color: #777;
    color: #fff;
}
</style>