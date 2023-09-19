<template>
<a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,9,'id','name'),'name','udid')" :model="contact" ref="formRest" scrollToFirstError=true name="basic"  autocomplete="off" layout="vertical" @finish="addContacts" @finishFailed="contactDataFailed">
    <a-row :gutter="24">
        <a-col :md="12" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation')  }]">
                    <NameField v-model:value="contact.firstName" size="large" name="firstName" @change="checkChangeInput()" :max="20"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="12" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                  <NameField v-model:value="contact.middleName" size="large" @change="checkChangeInput()" :max="20"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="12" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                  <NameField v-model:value="contact.lastName" size="large" @change="checkChangeInput()" :max="20"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.lastName?errorMsg.lastName[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <a-col :md="12" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(), type: 'email' }]">
                    <a-input v-model:value="contact.email" placeholder="test@test.com" size="large" @blur="emailChange()" @change="checkChangeInput()"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.email?errorMsg.email[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        
        <a-col :md="12" :sm="12" :xs="24">
            <div class="form-group">
                <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                      <a-input v-maska="'###-###-####'" max="12" @change="checkChangeInput()" v-model:value="contact.phoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%"/>
                    <ErrorMessage v-if="errorMsg" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
                </a-form-item>
            </div>
        </a-col>
        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,9,'id','name'),'name','udid')"> </FormBaseComponents>
    </a-row>
    <a-row :gutter="24" class="mb-24">
        <a-col :span="24" v-if="paramId">
        <a-button  html-type="reset" style="margin-right: 8px" @click="reset()">{{$t('global.clear')}}</a-button>
        <a-button type="primary" html-type="submit">{{$t('global.save')}}</a-button>
        </a-col>
        <a-col :span="24" v-else>
            <a-button type="primary" html-type="submit" :disabled="formButton" style="float:right">{{$t('global.save')}}</a-button>
        </a-col>
    </a-row>
    <a-row :gutter="24" v-show="!paramId">
        <a-col :span="24">
            <ContactTable :Id="Id" @editFormOpen="editFormOpen" />
            <Loader />
        </a-col>
    </a-row>
</a-form>
</template>

<script>
import { defineComponent, reactive, ref, computed,watchEffect } from "vue";
import { useStore } from "vuex";
import { regex } from "@/RegularExpressions/regex";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import Loader from "@/components/loader/Loader";
import {
} from "@ant-design/icons-vue";
import {
  arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod";
import ContactTable from "../../care-coordinator/tables/ContactTable.vue";
// import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import NameField from "@/components/form-fields/NameField.vue"
export default defineComponent({
  components: {
    // PhoneNumber,
    Loader,
    ErrorMessage,
    ContactTable,
    FormBaseComponents,
    NameField
  },
  props:{
    paramId:String,
    clearData:Boolean
  },
  setup(props,{emit}) {
    const store = useStore();
    const formRest =ref()
    const contact = reactive({
      firstName: "",
      lastName: "",
      email: "",
      middleName:"",
      phoneNumber: "",
      
    });
    const formButton = ref(false);
   
   
    function addContacts() {
      formButton.value = true;
      let phone = contact.phoneNumber
      store.dispatch("addContacts", {
        id: props.paramId?props.paramId:staffs.value.addStaff.id,
        data: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          middleName:contact.middleName,
          phoneNumber: phone.replace(/-/g,''),
        },
      });
      setTimeout(() => {
        if(staffs.value.closeModal==true){
          
          store.dispatch("staffContactList", props.paramId?props.paramId:staffs.value.addStaff.id);
          reset()
          store.state.careCoordinator.errorMsg=''
          emit("saveModal")
      }
      formButton.value = false;
      }, 2000);
    }
    const staffs = computed(() => {
      return store.state.careCoordinator;
    });

    const Id = staffs.value.addStaff?staffs.value.addStaff.id:''

     const form = reactive({
      ...contact,
    });
    function reset(){
      formRest.value.resetFields();
      Object.assign(contact,form)
    }
    watchEffect(()=>{
    if(props.clearData==true){
      Object.assign(contact,form)
    }
    if(staffs.value.clearStaffFormValidation){
      formRest.value.resetFields();
    }
    })
    function editFormOpen(){
      Object.assign(contact,form)
      formRest.value.resetFields();
    }
    function checkChangeInput(){
      store.commit('checkChangeInput',true)
    }
    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg;
    });

    function emailChange(){
        errorMsg.value.email?errorMsg.value.email[0]=null:''
    }
    return {
      editFormOpen,
      formRest,
      checkChangeInput,
      reset,
      Id,
      addContacts,
      contact,
      size: ref("large"),
      staffs,
      regex,
      errorMsg,
      emailChange,
      bindProps: store.state.common.bindProps,
      formButton,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
