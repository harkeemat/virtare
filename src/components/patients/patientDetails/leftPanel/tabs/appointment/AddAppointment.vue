<template>
  <a-form ref="formRef" class="common-form" :model="appointmentForm" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-typography-title :level="2" class="common-heading">{{ isEdit ? 'Appointment Status' : "Add Appointment" }} </a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12" v-if="isEdit">
              <a-form-item class="required" :label="$t('appointmentCalendar.addAppointment.status')" name="status"
                :rules="[{ required: false, message: $t('global.required') }]">
                <a-select v-model:value="appointmentForm.status" @focus="focus"
                  :placeholderData="$t('appointmentCalendar.addAppointment.status')" :options="state.patientsAppointment?.appointmentDetial?.appoinmentStatus==null || state.patientsAppointment?.appointmentDetial?.appoinmentStatus==0 ? pendingStatus : status"
                  />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item class="required" label="Staff" name="contactId"
                :rules="[{ required: true, message: $t('global.required') }]">
                <a-select
                  
                  v-model:value="appointmentForm.contactId"
                  :notFoundContent="true"
                  :options="state.alerts.people"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  :disabled="isEdit"
                />
                <ErrorMessage v-if="state?.patientsAppointment?.patientAppointment?.error.contactId" :name="state?.patientsAppointment?.patientAppointment?.error?.contactId[0]" />
              </a-form-item>
            </a-col>
             <a-col :span="12">
              <a-form-item :label="$t('appointmentCalendar.addAppointment.startDate')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="startDate">
                <DateField :disabledDateData="current => !current || current < dayjs().subtract(0,'day')" v-model:value="appointmentForm.startDate" :globalDateFormat="globalDateFormat" :size="size" :disabled="isEdit"/>
                <ErrorMessage v-if="state?.patientsAppointment?.patientAppointment?.error.startDate" :name="state?.patientsAppointment?.patientAppointment?.error?.startDate[0]" />
              </a-form-item>
            </a-col> 
            <a-col :span="12">
              <a-form-item class="required" :label="$t('appointmentCalendar.addAppointment.typeOfVisit')" name="appointmentType"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="appointmentForm.appointmentType" @focus="focus"
                  :placeholderData="$t('appointmentCalendar.addAppointment.typeOfVisit')" :globalCode="state?.patientsAppointment?.appointmentType"
                  @change="deviceChange" :disabled="isEdit"/>
                  <ErrorMessage v-if="state?.patientsAppointment?.patientAppointment?.error?.appointmentType" :name="state?.patientsAppointment?.patientAppointment?.error?.appointmentType[0]" />
              </a-form-item>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                  <a-form-item class="required" :label="$t('global.startTime')" name="startTime" :rules="[{ required: true, message: $t('global.required') }]">
                        <!-- <a-time-picker :disabled="isEdit"  format="hh:mm A" v-model:value="appointmentForm.startTime" :size="size" style="width: 100%"  /> -->
                        <TimePicker :value="appointmentForm.startTime" globalTimeFormat="hh:mm A" style="width:100%" :disabled="isEdit" />
                        <ErrorMessage v-if="state?.patientsAppointment?.patientAppointment?.error.startTime" :name="state?.patientsAppointment?.patientAppointment?.error?.startTime[0]" />
                    </a-form-item>
                </div>
            </a-col>
            
            <a-col :span="12">
              <a-form-item  :label="$t('appointmentCalendar.addAppointment.priority')" name="priority"
                :rules="[{ required: false, message: $t('global.required') }]">
                <SelectBox v-model:value="appointmentForm.priority" @focus="focus"
                  :placeholderData="$t('appointmentCalendar.addAppointment.priority')" :globalCode="state?.patientsAppointment?.appointmentPriority"
                  :disabled="isEdit"/>
                  <ErrorMessage v-if="state?.patientsAppointment?.patientAppointment?.error?.priority" :name="state?.patientsAppointment?.patientAppointment?.error?.priority[0]" />
              </a-form-item>
            </a-col>
            
            <a-col :span="24">
              <a-form-item :label="$t('patient.medical.note')" :class="appointmentForm.status==2?'required':''" name="cancellationNote"
                :rules="[{ required: appointmentForm.status==2 ?true :false, message: $t('global.required') }]">
                <Textarea v-model:value="appointmentForm.cancellationNote" :disabled="appointmentForm.status==2?false:true"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter" >
        <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
        <Button :disabled="state.patientsAppointment?.appointmentDetial?.appoinmentStatus==(3||4) ? true : false" classData="primary-btn" html-type="submit" :name="'Save'"
           :loading="state.patientsAppointment.patientLoading" />
    </div>
  </a-form>
</template>
<script setup>
import { watchEffect, reactive, ref, onMounted, onUnmounted, watch, computed } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue";
import Button from "@/components/button/Button.vue";
import { useStore } from "vuex";
import DateField from "@/components/modals/search/DateField.vue";
import { useRoute } from "vue-router";
import Textarea from "@/components/form-fields/Textarea";
import { globalDateFormat,globalTimeFormat } from '@/commonMethods/commonMethod';
import dayjs from 'dayjs';
import TimePicker from "@/components/form-fields/TimePicker";
const emit = defineEmits(["onClose"])
const props = defineProps(['isEdit'])
    const formRef = ref();
    const {dispatch,state,getters,commit} = useStore();
    const { params } = useRoute();
    const appointmentForm = reactive({
      startDate: "",
      contactId:"",
      appointmentType: "",
      cancellationNote: "",
      patientId:params.udid?params.udid:'',
      startTime:"",
      status:"",
      priority:''
    })
    const status = [{value:3,label:"Attended",disabled:false},{value:4,label:"Not Attended",disabled:false},{value:1,label:"Accepted",disabled:true},{value:2,label:"Rejected",disabled:true}]
    const pendingStatus = [{value:1,label:"Accepted",disabled:false},{value:2,label:"Rejected",disabled:false},{value:3,label:"Attended",disabled:true},{value:4,label:"Not Attended",disabled:true}]
    onMounted(()=>{
     // commit('loading', true)
      dispatch("alerts/fetchPeople", params.udid)
      dispatch("patientsAppointment/appointmentType")
      dispatch("patientsAppointment/appointmentPriority")
    })
    const form = reactive({ ...appointmentForm });
    watchEffect(()=>{
      if(props.isEdit){
       Object.assign(appointmentForm,state.patientsAppointment?.appointmentDetial)
      }
    })
    const submitForm = () => {  
      if(props.isEdit){
        dispatch("patientsAppointment/appointmentStatusUpdate",{patientId:params.udid,id:state.patientsAppointment?.appointmentDetial?.key,data:{appoinmentStatus:appointmentForm.status,cancellationNote:appointmentForm.cancellationNote}})
      }else{
      dispatch("patientsAppointment/createPatientAppointment",appointmentForm)
      }
    };
    const patientAppointmentAdded = computed(() => state.patientsAppointment.patientAppointmentAdded);
    watch(patientAppointmentAdded,(status) =>{
      status ? onClose():''
    })
    const onClose = () => {
      formRef.value?.resetFields();
      Object.assign(appointmentForm, form);
      emit("onClose", false);
    };
  onUnmounted(()=>{
    commit("patientsAppointment/patientAppointmentError",'')
    state.patientsAppointment.appointmentDetial = null
  })
    const labelCol = { span: 24 }
    const screensPermissions =  getters.screensPermissions
</script>

