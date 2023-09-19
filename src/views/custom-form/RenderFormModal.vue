<template>
<a-modal class="modalH-auto" max-width="1140px" width="60%" :title="customFormData?.viewTemplate?.formName" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :model="formState" ref="formRef" autocomplete="off" layout="vertical" @finish="submitForm">

      <template  v-if="customFormData?.viewTemplate?.type!='stepper'">
        <a-row :gutter="24" v-for="item,i in customFormData?.viewTemplate?.fields" :key="i">
                <a-col :span="24">
                    <div class="form-group">
                        <a-form-item v-if="item?.type!='button' && item?.type!='textarea' && item?.type!='questionnaire' && item?.type!='phone' && item?.type!='email'  && item?.type!='address'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}` }]">
                            <a-input v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" v-if="item?.type!='button'"></a-input>
                        </a-form-item>
                        <a-form-item v-if="item?.type=='phone'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}`,pattern:regex.phoneNumber }]">
                            <a-input v-maska="'###-###-####'" max="12" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" v-if="item?.type!='button'"></a-input>
                        </a-form-item>
                        <a-form-item v-if="item?.type=='email'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}`,type:'email' }]">
                            <a-input @keyup="changedValue" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" />
                        </a-form-item>
                        <a-form-item v-if="item?.type=='textarea'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}` }]">
                            <a-textarea v-model:value="formState[`${item.name}`]" />
                        </a-form-item>
                        <TemplateResponse v-if="item?.type=='questionnaire'" :dataObject="item?.data" :questionForm="questionForm" :templateId="templateId" :clientResponse="clientResponse" @is-visible="emitFunction($event)" :user="userName" :userType="entityType" :fromCustomFrom="true" />
                        
        <template v-if="item?.type=='address'">
                          <a-row :gutter="24">
        <a-col :md="24" :sm="24" :xs="24">
            <div class="form-group" v-for="address in item.data" :key="address.id">
                <a-form-item v-if="address?.name=='Country'" :name="`${address.name}`" :label="`${address.name}`" :rules="[{ required: address?.required==1?true:false, message: 'Please Enter'+' '+`${address?.name}` }]">
                    <GlobalCodeDropDown  v-model:value="formState[`${address.name}`]" :dataId="20" @handleGlobalChange="handleGlobalChange($event,'country')"/>
                </a-form-item>
                <a-form-item v-if="address?.name=='State'" :name="`${address.name}`" :label="`${address.name}`" :rules="[{ required: address?.required==1?true:false, message: 'Please Enter'+' '+`${address?.name}` }]">
                    <GlobalCodeDropDown  v-model:value="formState[`${address.name}`]" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'state')"/>
                </a-form-item>
                <a-form-item v-if="address?.name=='City'" :name="`${address.name}`" :label="`${address.name}`" :rules="[{ required: address?.required==1?true:false, message: 'Please Enter'+' '+`${address?.name}` }]">
                  <a-input v-model:value="formState[`${address.name}`]" :placeholder="address?.properties?.place_holder" v-if="address?.type!='button'"></a-input>
                </a-form-item>
                <a-form-item v-if="address?.name=='ZipCode'" :name="`${address.name}`" :label="`${address.name}`" :rules="[{ required: address?.required==1?true:false, message: 'Please Enter'+' '+`${address?.name}` }]">
                  <a-input v-model:value="formState[`${address.name}`]" :placeholder="address?.properties?.place_holder" v-if="address?.type!='button'"></a-input>
                </a-form-item>
                <a-form-item v-if="address?.name=='Address 1'" :name="`${address.name}`" :label="`${address.name}`" :rules="[{ required: address?.required==1?true:false, message: 'Please Enter'+' '+`${address?.name}` }]">
                  <a-textarea v-model:value="formState[`${address.name}`]" />
                </a-form-item>
                <a-form-item v-if="address?.name=='Address 2'" :name="`${address.name}`" :label="`${address.name}`" :rules="[{ required: address?.required==1?true:false, message: 'Please Enter'+' '+`${address?.name}` }]">
                  <a-textarea v-model:value="formState[`${address.name}`]" />
                </a-form-item>
            </div>
        </a-col>

      
        
    </a-row>
                          
                        </template>
                    </div>
                    <a-form-item v-if="item?.type=='button'" style="float:right">
                            <a-button type="primary" html-type="submit">Submit</a-button>
                        </a-form-item>
                </a-col>

               


        </a-row>
      </template>

      <a-col :md="24" :sm="24" :xs="24" v-if="customFormData?.viewTemplate?.type=='stepper'">
          <div >
        <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
          <div v-if="steps[current].title === 'First'">
            <a-row class="mt-28" :gutter="24" v-for="item,i in customFormData?.viewTemplate?.fields?.first" :key="i">
                <a-col :span="24">
                    <div class="form-group">
                        <a-form-item v-if="item?.type!='button' && item?.type!='textarea' && item?.type!='questionnaire' && item?.type!='phone' && item?.type!='email'  && item?.type!='address'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}` }]">
                            <a-input :type="item.type" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" v-if="item?.type!='button'"></a-input>
                        </a-form-item>
                        <a-form-item v-if="item?.type=='phone'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}`,pattern:regex.phoneNumber }]">
                            <a-input v-maska="'###-###-####'" max="12" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" v-if="item?.type!='button'"></a-input>
                        </a-form-item>
                        <a-form-item v-if="item?.type=='email'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}`,type:'email' }]">
                            <a-input @keyup="changedValue" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" />
                        </a-form-item>
                        <a-form-item v-if="item?.type=='textarea'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}` }]">
                            <a-textarea v-model:value="formState[`${item.name}`]" />
                        </a-form-item>
                        </div>
            </a-col>
            </a-row>
          </div>
          <div v-if="steps[current].title === 'Second'">
            <a-row  class="mt-28"  :gutter="24" v-for="item,i in customFormData?.viewTemplate?.fields?.second" :key="i" >
                <a-col :span="24">
                    <div class="form-group">
                        <a-form-item v-if="item?.type!='button' && item?.type!='textarea' && item?.type!='questionnaire' && item?.type!='phone' && item?.type!='email'  && item?.type!='address'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}` }]">
                            <a-input :type="item.type" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" v-if="item?.type!='button'"></a-input>
                        </a-form-item>
                        <a-form-item v-if="item?.type=='phone'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}`,pattern:regex.phoneNumber }]">
                            <a-input v-maska="'###-###-####'" max="12" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" v-if="item?.type!='button'"></a-input>
                        </a-form-item>
                        <a-form-item v-if="item?.type=='email'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}`,type:'email' }]">
                            <a-input @keyup="changedValue" v-model:value="formState[`${item.name}`]" :placeholder="item?.properties?.place_holder" />
                        </a-form-item>
                        <a-form-item v-if="item?.type=='textarea'" :name="`${item.name}`" :label="`${item.name}`" :rules="[{ required: item?.required==1?true:false, message: 'Please Enter'+' '+`${item?.name}` }]">
                            <a-textarea v-model:value="formState[`${item.name}`]" />
                        </a-form-item>
                        </div>
            </a-col>
            </a-row>
          </div>
        </div>
        <div class="steps-action">
            <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="message.success('Processing complete!')">
                Done
            </a-button>
            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous</a-button>
        </div>
    </div>
        </a-col>
        
    </a-form>
</a-modal>
</template>
<script>
import { computed, reactive, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { regex } from "@/RegularExpressions/regex";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import TemplateResponse from "@/components/administration/questionnaire-template/TemplateResponse";
export default {
  props: {
    dataObject: Object,
  },
  components: {
    TemplateResponse,
    GlobalCodeDropDown
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    // const route = useRoute();
    const formState = reactive({});
    const formRef = ref();
    const propsFormData = reactive(props.dataObject);
    const form = reactive({
      ...formState,
    });
    const questionForm = ref(false);
    const customFormData = computed(() => {
      return store.state.customForm;
    });
    const questionData = ref([]);
    const emitFunction = (event) => {
      
      questionData.value = event;
    };
    watchEffect(() => {
      
    });
    const submitForm = () => {
      questionForm.value = true;

      if (questionData.value?.length > 0) {
        //   let data = {
        //     form_id: propsFormData.value.formUdid,
        //     assigned_udid: propsFormData.value.assignedUdid,
        //     templateId: propsFormData.value.templateId,
        //     values: questionData.value,
        //   };
        //   store.dispatch("saveQuestionnaireFormData", data).then((resp) => {
        //     if (resp == true) {
        //       emit("saveModal", false);
        //       Object.assign(formState, form);
        //     }
        //   });
        // } else {
        let data = {
          form_id: propsFormData.value.formUdid
            ? propsFormData.value.formUdid
            : "",
          assigned_udid: propsFormData.value.assignedUdid
            ? propsFormData.value.assignedUdid
            : "",
          templateId: propsFormData.value.templateId
            ? propsFormData.value.templateId
            : customFormData.value?.viewTemplate?.templateId,
          values: formState,
          questions: questionData.value ? questionData.value : "",
        };
       
        store.dispatch("saveFormData", data).then((resp) => {
          if (resp == true) {
            if (route.params.udid) {
              store.dispatch("assignedForm", route.params.udid);
              store.dispatch("getStepsForms", route.params.udid);
            }
            emit("saveModal", false);
            Object.assign(formState, form);
          }
        });
      } else {
        let data = {
          form_id: propsFormData.value.formUdid,
          assigned_udid: propsFormData.value.assignedUdid,
          templateId: propsFormData.value.templateId
            ? propsFormData.value.templateId
            : customFormData.value?.viewTemplate?.templateId,
          values: formState,
          action: "step",
          // questions:questionData.value?questionData.value:''
        };
  
        store.dispatch("saveFormData", data).then((resp) => {
          if (resp == true) {
            if (route.params.udid) {
              store.dispatch("assignedForm", route.params.udid);
              store.dispatch("getStepsForms", route.params.udid);
            }
            emit("saveModal", false);
            Object.assign(formState, form);
          }
        });
      }
    };

    function closeModal() {
      Object.assign(formState, form);
      formRef.value.resetFields();
      emit("saveModal", false);
    }

    const handleGlobalChange = (data, type) => {
      if (type == "state") {
        formState.State = data;
      }
      if (type == "country") {
        formState.Country = data;
      }
    };

    const current = ref(0);
    const next = () => {
      current.value++;
    };
    const prev = () => {
      current.value--;
    };

    return {
      handleGlobalChange,
      regex,
      propsFormData,
      formRef,
      form,
      formState,
      customFormData,
      submitForm,
      closeModal,
      questionForm,
      emitFunction,
      // stepper
      current,
      steps: [
        {
          title: "First",
          content: "First-content",
        },
        {
          title: "Second",
          content: "Second-content",
        },
      ],
      next,
      prev,
      // end stepper
    };
  },
};
</script>
  
  <style lang="scss" scoped>
span.error {
  color: #ff0000;
}
</style>
  
