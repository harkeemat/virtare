
<template>
<a-modal max-width="1140px" width="100%" :title="cptId ? 'Edit CPT Codes' : 'Add CPT Codes'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form ref="formRef" :model="cptCodeForm" layout="vertical" @finish="submitForm" @finishFailed="onFinishFailed">
        <a-row :gutter="24">
            <a-col :sm="12" :xs="24">
                <div class="form-group">

                    <a-form-item :label="$t('global.service')" name="serviceId" :rules="[{ required: true, message: $t('global.service') +' '+$t('global.service')+' '+$t('global.validation')  }]">
                      
                        <ArrayDataSearch v-if="cptCodesGetters.service" v-model:value="cptCodeForm.serviceId" :globalCode="cptCodesGetters.service" @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.serviceId?errorMsg.serviceId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item label="CPT Code" name="name" :rules="[{required: true,message:'CPT Code ' +$t('global.validation'),},]">
                        <a-input v-model:value="cptCodeForm.name" size="large" @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.name ? errorMsg.name[0] : ''" />
                    </a-form-item>
                </div>

            </a-col>
            <a-col :sm="6" :xs="24">
                <div class="form-group">
                    <a-form-item label="Billing Amount" name="billingAmout" :rules="[{required: true,message:'Billing Amount ' +$t('global.validation'),},]">
                        <a-input-number v-model:value="cptCodeForm.billingAmout" :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\$\s?|(,*)/g, '')" size="large" style="width: 100%" @change="checkChangeInput()"/>
                       
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.billingAmout ? errorMsg.billingAmout[0] : ''" />
                    </a-form-item>
                </div>

            </a-col>
            <a-col :sm="6" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.duration') +' '+$t('global.time')" name="durationId" :rules="[{ required: true, message: $t('global.duration') +' '+$t('global.time')+' '+$t('global.validation')  }]">
                       
                        <GlobalCodeDropDown  v-model:value="cptCodeForm.durationId" :dataId="31" @handleGlobalChange="handleGlobalChange($event)" @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.durationId?errorMsg.durationId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item label="Description" name="description" :rules="[{required: true,message:'Description ' +$t('global.validation')}]">
                        <a-textarea v-model:value="cptCodeForm.description" placeholder="Message" allow-clear @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.description ? errorMsg.description[0] : ''" />
                    </a-form-item>
                </div>
               
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <label>Active/Inactive</label>
                    <a-switch v-model:checked="cptCodeForm.isActive" @change="UpdateStatus($event)" />
                </div>
            </a-col>
            <a-col :span="24">

                <div class="steps-action">
                    <ModalButtons @is_click="reset" isReset="true" :disabled="formButton" :Id="cptId" />
                </div>
            </a-col>
        </a-row>
    </a-form>
    <Loader />
</a-modal>
</template>
<script>
import { ref, reactive, watchEffect,computed } from "vue";
import { useStore } from "vuex";
import ModalButtons from "@/components/common/button/ModalButtons";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import Loader from "@/components/loader/Loader";
import { warningSwal } from "./../../commonMethods/commonMethod";
import { messages } from "./../../config/messages";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";

export default {
  components: {
    ModalButtons,
    Loader,
    ErrorMessage,
    GlobalCodeDropDown,
    ArrayDataSearch
  },
  props: {
    cptId: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const checked = ref([false]);
    const formRef = ref(false);
    
    const cptCodeForm = reactive({
      serviceId: "",
      name: "",
      providerId: 1,
      billingAmout: "",
      description: "",
      durationId: "",
      isActive: true,
    });
    const onFinishFailed = () => {
      //
    };
    const cptCodesGetters = store.getters.cptRecords;

    function UpdateStatus(event) {
      cptCodeForm.isActive = event;
    }
    const formButton = ref(false);
    const durationList = store.getters.commonRecords.value;
    watchEffect(() => {

      if (props.cptId) {
        store.commit("loadingStatus", true);
        if (cptCodesGetters.value.cptCodeDetails) {
          Object.assign(cptCodeForm, cptCodesGetters.value.cptCodeDetails);
          store.commit("loadingStatus", false);
        }
        
      }
    });
    const submitForm = () => {
      
      if (props.cptId) {
        store.dispatch("updateCptCode", {
          data: cptCodeForm,
          id: props.cptId,
        }).then(()=>{
          store.dispatch("cptCodesList");
        })
      } else {
        formButton.value = store.dispatch("addCptCode", cptCodeForm).then(()=>{
          store.dispatch("cptCodesList");
        })
      }
      store.commit('checkChangeInput', false)
      reset();
      
      emit("is-visible", false);
    };
    const form = reactive({
      ...cptCodeForm,
    });

    function reset() {
      
      Object.assign(cptCodeForm, form);
      formRef.value.resetFields();
      formButton.value = false;
    }
    function checkChangeInput() {
			store.commit('checkChangeInput', true)
		}

		const checkFieldsData = computed(() => {
			return store.state.common.checkChangeInput;
		})
    function closeModal() {
      emit("is-visible", true)
      if (checkFieldsData.value) {
				warningSwal(messages.modalWarning).then((response) => {
					if (response == true) {
            reset();
            emit("is-visible", false);
						
						store.commit('checkChangeInput', false)
					} else {
					
            emit("is-visible", true);
						
						store.commit('checkChangeInput', true)
					}
				});
			}
			else {
				reset()
        emit("is-visible", false)
			}
      
    }
    const handleGlobalChange = (data) =>{
      cptCodeForm.durationId = data
    }
    return {
      handleGlobalChange,
      formButton,
      size: ref("large"),
      checked,
      cptCodeForm,
      cptCodesGetters,
      onFinishFailed,
      UpdateStatus,
      durationList,
      submitForm,
      formRef,
      reset,
      closeModal,
    
      checkChangeInput,
    };
  },
};
</script>
