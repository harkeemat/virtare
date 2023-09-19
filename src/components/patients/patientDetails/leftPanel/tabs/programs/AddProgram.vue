<template>
  <Loader v-if="programLoading" />
  <a-form class="common-form" ref="programForm" @finish="submitForm" :model="formState" :label-col="labelCol"
    :wrapper-col="wrapperCol" autocomplete="off">
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">Add Program </a-typography-title>
        </a-col>
        <a-col :span="24">
          <a-row :gutter="[48, 16]">
            <a-col :span="12">
              <a-form-item :label="$t('programs.program')" class="required" name="programId"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="formState.programId" @change="() => delete error.programId"
                  :disabled="programLoading" :placeholderData="$t('programs.program')"
                  :globalCode="store.state.clients.clientProgramRecord" entity="programs" :maxLength="12" :maxtag="4" />
                <ErrorMessage v-if="error.programId" :name="error.programId[0]" />
              </a-form-item>
            </a-col>
            <a-col :span="12"></a-col>
            <a-col :span="12">
              <a-form-item :label="$t('programs.consentedDate')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" name="consentedDate">
                <DateField :disabledDateData="featureDate" v-model:value="formState.consentedDate"
                  :globalDateFormat="globalDateFormat" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('programs.billingStartDate')" name="billingStartDate">
                <DateField  v-model:value="formState.billingStartDate"
                  :globalDateFormat="globalDateFormat" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <a-button class="secondary-btn" @click="{emit('onClose'); delete error.programId}">Cancel</a-button>
      <a-button class="primary-btn" html-type="submit"
        :loading="store.state.patientProgram.patientProgram.isLoading">Save</a-button>
    </div>
  </a-form>

</template>

<script setup>
import {  reactive, onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Loader from './Loader.vue'
import { globalDateFormat, featureDate } from '@/commonMethods/commonMethod';

/** component import  */
import SelectBox from "@/components/form-fields/SelectBox.vue";
import DateField from "@/components/modals/search/DateField.vue";
const emit = defineEmits(['onClose'])
const props = defineProps(['programId'])
const store = useStore()
const route = useRoute()

const formState = reactive({
  programId: '',
  consentedDate: '',
  billingStartDate: '',
  patientId: route.params.udid
})

const programLoading = ref(true);
const labelCol = { span: 24 }
const programAdded = computed(() => store.state.patientProgram.patientProgramAdded)
const error = computed(() => store.state.patientProgram.patientProgram.error)

const submitForm = () => {
  store.dispatch('createPatientProgram', formState).then(() => {
    if(!props?.programId && store.state.patientProgram.patientPrograms.length === 0){
    store.dispatch("patientInformation", route.params.udid)
  }
    if(programAdded.value){
    store.dispatch("fetchPatientProgram", route.params.udid)
  }
  
  })
  
}

watch(programAdded, (status) => {
  if (status)
  {
    emit('onClose')
  }
})

onMounted(async () => {
  const id = store.state.patientsStore.patientInformation.clientId
  programLoading.value = true;
  try {
    await store.dispatch("clientProgramRecord", { id })
    if(props?.programId){
    await store.dispatch("detailsPatientsProgram",{patientId:route.params.udid,id:props?.programId})
    Object.assign(formState,store.state.patientProgram.patientProgramDetail)
    }
  } catch (error) {
    console.log(error)
  }
  programLoading.value = false;
});

onUnmounted(() => {
  store.commit("patientProgramAdded", false);
})

</script>
