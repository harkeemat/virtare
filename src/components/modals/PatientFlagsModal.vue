
<template>
<a-modal width="50%" height="500px" :title=" categoryName?categoryName:`${categoryName} Status`" @cancel="closeModal()" :maskClosable="false">
    <a-form ref="formRef" :model="addFlagForm" @finish="submitForm" @finishFailed="onFinishFailed" layout="vertical">
        <a-row :gutter="24" v-if="title!='delete'">
            <a-col :span="24" v-if="flags.length==0 ">
                <a-form-item :label="categoryName" name="flag" :rules="[{ required: true, message: categoryName+' '+$t('global.validation') }]">
                    <ArrayDataSearch v-model:value="addFlagForm.flag" :globalCode="flagsForPatients" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.flag[0] : ''" />
                </a-form-item>
            </a-col>
            <a-col :span="24" v-else>
                  <div class="form-group">
                    <a-form-item :label="$t('common.removalReason')" name="removalReasonId" :rules="[{ required: true, message: $t('common.removalReason')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown v-model:value="addFlagForm.removalReasonId" :dataId="69" @handleGlobalChange="handleGlobalChange($event)" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.removalReasonId[0] : ''" />
                    </a-form-item>
                  </div>
            </a-col>
            <a-col :span="24" v-if="flags.length==0">
                <div class="form-group">
                    <a-form-item :label="$t('common.reason')" name="reason" :rules="[{ required: true, message: $t('common.reason')+' '+$t('global.validation') }]">
                        <a-textarea v-model:value="addFlagForm.reason" allow-clear @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.reason ? errorMsg.reason[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="24" v-else>
                <div class="form-group">
                    <a-form-item :label="$t('common.comment')" name="reason" :rules="[{ required: true, message: $t('common.comment')+' '+$t('global.validation') }]">
                        <a-textarea v-model:value="addFlagForm.reason" allow-clear @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.reason ? errorMsg.reason[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,41,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :span="24">
                <div class="steps-action">
                    <a-button @click="closeModal" class="modal-button">Cancel</a-button>
                    <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.save')}}</a-button>
                </div>

            </a-col>
        </a-row>
        <a-row :gutter="24" v-else>
          <a-col :span="24" >
                  <div class="form-group">
                    <a-form-item :label="$t('common.removalReason')" name="removalReasonId" :rules="[{ required: true, message: $t('common.removalReason')+' '+$t('global.validation') }]">
                        <GlobalCodeDropDown v-model:value="addFlagForm.removalReasonId" :dataId="69" @handleGlobalChange="handleGlobalChange($event)" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.removalReasonId[0] : ''" />
                    </a-form-item>
                  </div>
            </a-col>
          <!-- <a-col :span="24" >
                <a-form-item :label="$t('common.flag')" name="flag" :rules="[{ required: true, message: $t('common.flag')+' '+$t('global.validation') }]">
                    <ArrayDataSearch v-model:value="addFlagForm.flag" :globalCode="flagsForPatients" @change="checkChangeInput()" />
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.flag[0] : ''" />
                </a-form-item>
            </a-col> -->
            <a-col :span="24">
              <a-form-item :label="$t('common.reason')" name="reason" :rules="[{ required: true, message: $t('common.reason')+' '+$t('global.validation') }]">
                    <a-textarea v-model:value="addFlagForm.reason" allow-clear @change="checkChangeInput()" />
                    <!-- <ErrorMessage v-if="errorMsg" :name="errorMsg.reason ? errorMsg.reason[0] : ''" /> -->
                </a-form-item>
            </a-col>
          <a-col :span="24">
                <div class="steps-action">
                    <a-button @click="closeModal" class="modal-button">Cancel</a-button>
                    <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.save')}}</a-button>
                </div>
            </a-col>
        </a-row>

    </a-form>
    <Loader />
</a-modal>
</template>
<script>
import { computed, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Loader from "@/components/loader/Loader";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import {warningSwal ,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import { messages } from "@/config/messages";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
export default {
  components: {
    ArrayDataSearch,
    Loader,
    GlobalCodeDropDown,
    FormBaseComponents
  },
  props: {
    flags: Array,
    title: String,
    flagsId:String,
    categoryId:Number,
    categoryName:String
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const patientUdid = route.params.udid;
    const formRef = ref();

    // const latestFlag = computed(() => {
    //   return store.state.flags.latestFlag
    // })

    const onFinishFailed = (value) => {
            // errorSwal(messages.fieldsRequired);
            console.log("test", value);
        };

    const flagsForPatients = computed(() => {
      return store.state.flags.flagsForPatients;
    });

    const addFlagForm = reactive({
      flag: "",
      reason: "",
      removalReasonId: "",
    });
    const form = reactive({
      ...addFlagForm,
    });

    const submitForm = () => {
      
      if (props?.flags?.length > 0) {
        
        store
          .dispatch("updatePatientFlag", 
          {id:patientUdid,
           data:{flag: props.flags,
            reason: addFlagForm.reason,
            deleteReason: addFlagForm.removalReasonId,}
           })
          .then(() => {
            store.dispatch("patientTimeline", {
              id: route.params.udid,
              type: store.state.patients.tabvalue.join(","),
            }).then(()=>{
              emit("closeModal", {
              modal: "addFlag",
              value: false,
            });
          })
            store.dispatch("patientFlagsList", {patientUdid:patientUdid,catId:props.categoryId}).then(() => {
              /// title.value = latestFlag.value && latestFlag.value != null ? 'Update Flag' : 'Add Flag'
            });
            store.commit("checkChangeInput", false);
            formRef.value.resetFields();
            Object.assign(addFlagForm, form);
            
          });
      } else 
      if (props?.flagsId || props?.flags?.length > 0) {
        store.dispatch('deleteFlag', {
          id:patientUdid,
          flag: props.flags,
          flagId: props.flagsId,
          reason: addFlagForm.reason,
          deleteReason: addFlagForm.removalReasonId
        }).then((resp)=>{
          if(resp==true){
            store.dispatch("patientFlagsList", {patientUdid:patientUdid,catId:props.categoryId})
            store.dispatch("patientTimeline", {
                id: route.params.udid,
                type: store.state.patients.tabvalue.join(","),
              }).then(()=>{
                store.commit("clearFlag",true)
                emit("closeModal", {
                modal: "addFlag",
                value: false,
              })
              })
              store.commit("checkChangeInput", false);
              formRef.value.resetFields();
              Object.assign(addFlagForm, form);
          }
        })
        
      }else {
        store
          .dispatch("addPatientFlag", {
            patientUdid: patientUdid,
            data: addFlagForm,
          })
          .then(() => {
            store.dispatch("patientTimeline", {
              id: route.params.udid,
              type: store.state.patients.tabvalue.join(","),
            }).then(()=>{
              store.commit("clearFlag",true)
            })
            store.dispatch("patientFlagsList", {patientUdid:patientUdid,catId:props.categoryId}).then(() => {});
            store.commit("checkChangeInput", false);
            formRef.value.resetFields();
            Object.assign(addFlagForm, form);
            emit("closeModal", {
              modal: "addFlag",
              value: false,
            });
            
          });
      }
    };

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    function closeModal() {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            formRef.value.resetFields();
            Object.assign(addFlagForm, form);
            emit("closeModal", {
              modal: "addFlag",
              value: false,
            });

            store.commit("checkChangeInput", false);
          } else {
            emit("closeModal", {
              modal: "addFlag",
              value: true,
            });
          }
        });
      }
      emit("closeModal", {
        modal: "addFlag",
        value: false,
      });
      formRef.value.resetFields();
    }
    const handleGlobalChange = (data) => {
      addFlagForm.removalReasonId = data;
    };
    return {
      onFinishFailed,
      handleGlobalChange,
      formRef,
      flagsForPatients,
      addFlagForm,
      submitForm,
      checkChangeInput,
      closeModal,
      removalReason: store.getters.removalReason,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
};
</script>
