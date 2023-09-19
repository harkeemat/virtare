<template>
  <a-form class="common-form" ref="formRef" :model="siteForm" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-typography-title :level="2" class="common-heading">{{ formHeading }}</a-typography-title>
      <a-row :gutter="[48, 16]">
        <a-col :span="12">
          <a-form-item :label="$t('clients.friendlyName')" class="required" name="friendlyName"
            :rules="[{ required: true, message: $t('global.required') }]">
            <InputFields v-model:value="siteForm.friendlyName" :placeholderData="$t('clients.friendlyName')" />
            <ErrorMessage v-if="people?.errorClients"
              :name="people?.errorClients.friendlyName ? people?.errorClients.friendlyName[0] : ''" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('clients.programs')" class="required" name="programs"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox mode="multiple" v-model:value="siteForm.programs" @focus="focus"
              :placeholderData="$t('clients.programs')" @change="handleChange" v-if="programList"
              :globalCode="people?.clientProgramRecord" entity="programs" :maxLength="12" :maxtag="4" />
            <ErrorMessage v-if="people?.errorClients"
              :name="people?.errorClients.programs ? people?.errorClients.programs[0] : ''" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="$t('clients.siteHead')" class="required" name="siteHeadId"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="siteForm.siteHeadId" @focus="focus" :placeholderData="$t('clients.siteHead')"
              @changeData="siteChange" :globalCode="people?.siteHead" />
            <ErrorMessage v-if="people?.errorClients"
              :name="people?.errorClients.siteHeadId ? people?.errorClients.siteHeadId[0] : ''" />
          </a-form-item>
        </a-col>

      </a-row>
      <a-row :gutter="[48, 16]" v-if="siteForm.siteHeadId === 1">
        <a-col :span="24">
          <div class="form-heading">
            <a-typography-title :level="3">Site Head</a-typography-title>
          </div>
        </a-col>
        <PeoplForm :formObject="siteForm" @toggleCheckbox="toggleCheckbox($event)" :showExternal="showExternal" screen="siteHead" />
      </a-row>
      <a-row :gutter="[48, 16]" style="padding-top: 30px;">
        <a-col :span="12">
          <a-form-item :label="$t('clients.siteLocation')" class="required" name="virtual"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="siteForm.virtual" :placeholderData="$t('clients.state')"
              :globalCode="virtualData" @change="virtualAddress"/>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="siteForm.virtual==2 && people?.addressRecord?.length>1">
          <a-form-item :label="$t('clients.addressDropDown')" :class="siteForm.virtual==2 ? 'required' :''" name="addressValue"
            :rules="[{ required: siteForm.virtual==2 ? true : false, message: $t('global.required') }]">
            <SelectBox v-model:value="siteForm.addressValue" :placeholderData="$t('clients.addressDropDown')"
              :globalCode="people?.addressRecord" @change="addressFill"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="[48, 16]" v-if="(siteForm.virtual==2 ||siteForm?.addressValue == 1 || people?.addressRecord?.length==1) && addressShow">
        <a-col :span="24">
          <div class="form-heading">
            <a-typography-title :level="3">Address</a-typography-title>
            <a-typography-text>Physical address for contractual needs</a-typography-text>
          </div>
        </a-col>
        <Address :formObject="siteForm" />

      </a-row>
      <a-row style="margin-top: 16px;">
        <a-col :span="24">
          <a-form-item :label="$t('clients.comment')" name="comment"
            :rules="[{ required: false, message: $t('global.required') }]">
            <a-textarea v-model:value="siteForm.comment" :rows="2" />
            <ErrorMessage v-if="people?.errorClients"
              :name="people?.errorClients.comment ? people?.errorClients.comment[0] : ''" />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <!-- <a-popconfirm title="Are you sure delete this people?" ok-text="Yes" cancel-text="No">
          <a-button class="delete-btn"> Delete </a-button>
        </a-popconfirm> -->

      <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="loading" />
    </div>
  </a-form>
  <AddClientLoader />
</template>

<script>

import { onMounted, reactive, ref, watchEffect } from "vue";
import InputFields from "@/components/form-fields/InputFields.vue";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import SelectBox from "@/components/form-fields/SelectBox.vue"
import Button from "@/components/button/Button.vue";
import { regex } from "@/RegularExpressions/regex";
import AddClientLoader from "@/components/administration/clients/AddClientLoader.vue";
import ErrorMessage from "@/components/common/messages/ErrorMessage"
import PeoplForm from "@/components/administration/clients/Tabs/addClient/PeopleForm"
import Address from "@/components/administration/clients/Tabs/addClient/Address.vue";
import { arrayToObjectData } from "@/commonMethods/commonMethod"
export default {
  components: {
    InputFields,
    SelectBox,
    Button,
    AddClientLoader,
    ErrorMessage,
    PeoplForm,
    Address
  },
  props: {
    isEdit: Boolean,
    siteUdid: String,
    formHeading: String,
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const formRef = ref()
    const clientId = ref(null)
    const siteId = ref(null)
    const loading = ref(false)
    const addressShow = ref(false)
    const showExternal = ref(false)
    const siteForm = reactive({
      friendlyName: "",
      siteHeadId: "",
      comment: "",
      programs: [],
      virtual: 1,
      addressValue:undefined,
      contactPerson: {
        roleId: undefined,
        timeZoneId: undefined,
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        specializationId: undefined,
        clientId: route?.params?.udid,
        npi:"",
        faxNumber:"",
        type: false,  // true - External, false - Internal
      },
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateId: undefined,
        zipCode: ""
      }

    })
    const address = reactive({ ...siteForm.address })
    const commonRecord = store.getters.commonRecords
    const people = store.getters.clients
    const virtualData = [{ id: 1, name: 'Virtual' }, { id: 2, name: 'Physical' }]
    // const roleAssign = () => {
    //   if (!props.isEdit) {
    //     commonRecord.value?.rolesDropDown.map((item) => {
    //       if (item.name == 'Non System User') {
              // showExternal.value = false
    //         siteForm.contactPerson.roleId = item.udid
    //       }
    //     })
    //   }
    // }
    const editMode = ref(true)
    onMounted(() => {
      
      store.dispatch("siteHead", { id: route?.params?.udid, status: 1 })
      store.dispatch("addressRecord", { clientId: route?.params?.udid})
      store.dispatch("clientProgramRecord", { id: route?.params?.udid }).then(() => {
        if (!props.isEdit) {
          siteForm.programs = []
          people.value?.clientProgramRecord.map((item) => {
            siteForm.programs.push(item.udid)
          })
        }
      })

      if (route.params.udid) {
        clientId.value = route.params.udid
      }
      else if (people.value?.addClient != null) {
        clientId.value = people.value.addClient.value.id
      }
       

    })
    watchEffect(() => {
      siteId.value = props.siteUdid ? props.siteUdid : ref(null)
      if (props.isEdit && people.value?.clientSiteDetails) {
        Object.assign(siteForm, people.value?.clientSiteDetails)
        //edit mode elected choose address show or hide if virtual =2 and edit mode then not show
        if(props?.isEdit && people.value?.clientSiteDetails?.virtual==2){
          //show address fields 
          addressShow.value=true 
          ////hide  choose address drop down 
          editMode.value = false
          siteForm.addressValue =  people.value?.clientSiteDetails?.address?.addressLine1
        }else{
          addressShow.value=false 
          editMode.value = true
        } 
        if (!people.value?.clientSiteDetails?.address) {
          siteForm.address = {
            addressLine1: "",
            addressLine2: "",
            city: "",
            stateId: '',
            zipCode: ""
          }
        }




      }
    })
    const focus = () => {
    };

    const handleChange = () => {
    };

    const submitForm = () => {
      loading.value = true
      let requestData = siteForm
      requestData.contactPerson.phoneNumber = requestData.contactPerson?.phoneNumber.replace(/-/g, '')
      if (props.isEdit) {

        store.dispatch('updateClientSite', {
          clientId: clientId.value,
          siteId: siteId.value,
          data: requestData,
        }).then((res) => {
          loading.value = false
          if (res) {
            onClose()
            if (siteForm.siteHeadId == 1) {
              store.dispatch("peopleList", { clientId: route.params.udid })
            }
            store.dispatch('sitesList', {clientId:clientId.value})
          }
        })
      }
      else {
        store.dispatch('addClientSite', {
          clientId: clientId.value,
          data: requestData,
        }).then((res) => {
          loading.value = false
          if (res) {
            if (siteForm.siteHeadId == 1) {
              store.dispatch("peopleList", { clientId: route.params.udid })
            }
            onClose()
            store.dispatch('sitesList', {clientId:clientId.value})
          }
        })
      }
    }
    const contactPerson = reactive({ ...siteForm.contactPerson })
    const siteChange = () => {
      if (siteForm.siteHeadId === 1) {
        store.dispatch("rolesDropDown",1).then(() => {
        //roleAssign()
      })
        Object.assign(siteForm.contactPerson, contactPerson)
      }
    }
    
    const form = reactive({ ...siteForm })
    const onClose = () => {
      loading.value = false
      formRef.value ? formRef.value?.resetFields() : ''
      Object.assign(siteForm, form)
      store.state.clients.clientSiteDetails = null
      emit('onClose', false)
    };


    //Choose from existing address then filled address and also show address fields 
    const addressFill = () =>{
      if(siteForm?.addressValue!=1){
      let obj = arrayToObjectData(people.value?.addressRecord,siteForm?.addressValue,'addressLine1')
      Object.assign(siteForm.address, obj)
      addressShow.value = true
      }else{
        addressShow.value = true
        Object.assign(siteForm.address, address)
      }
    }
    const virtualAddress = () =>{
      siteForm.addressValue = undefined
      //if SITE LOCATION change then auto address field null
      if(siteForm.virtual==1){

      Object.assign(siteForm.address, address)
       }
       //if change site location then editeble mode change
       editMode.value = true
       addressShow.value = false
    }

    const toggleCheckbox = (value) => {
      if(value == 'Non System User') {
        showExternal.value = false
        //siteForm.type = true
      }
      else {
        showExternal.value = true
        //siteForm.type = false
      }
    }

    return {
      onClose,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      focus,
      toggleCheckbox,
      showExternal,
      handleChange,
      siteForm,
      submitForm,
      programList: store.getters.programList,
      commonRecord,
      people,
      siteChange,
      formRef,
      regex,
      loading,
      virtualData,
      addressFill,
      arrayToObjectData,
      virtualAddress,
      editMode,
      addressShow
    };
  },
};
</script>

