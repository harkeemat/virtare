<template>
  <a-form ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,18,'id','name'),'name','udid')" :model="program" scrollToFirstError=true name="basic" autocomplete="off" layout="vertical" @finish="programs" @finishFailed="programFailed">
      <a-row :gutter="24">
        
          <a-col :md="6" :sm="12" :xs="24">
              <div class="form-group">
                  <a-form-item :label="$t('patient.programs.program')" name="program" :rules="[{ required: true, message: $t('patient.programs.program')+' '+$t('global.validation') }]">
                      <ArrayDataSearch :disabled="isEdit==true?true:false" mode="multiple" v-model:value="program.program" :globalCode="patients.programList" @change="changedValue"/>
                      <ErrorMessage v-if="errorMsg" :name="errorMsg.program ? errorMsg.program[0] : ''" />
                  </a-form-item>
              </div>
          </a-col>
          <a-col :md="6" :sm="6" :xs="24">
              <div class="form-group">
                  <a-form-item :label="$t('patient.programs.onboardinScheduledDate')" name="onboardingScheduleDate" :rules="[{ required: true, message: $t('patient.programs.onboardinScheduledDate')+' '+$t('global.validation') }]">
                      <!-- <a-date-picker @change="changedValue('onboardinScheduledDate');addOneYear(program.onboardingScheduleDate)" :disabledDate="d => !d || d.isSameOrAfter(program.dischargeDate)" v-model:value="program.onboardingScheduleDate" :format="globalDateFormat" value-format="YYYY-MM-DD" style="width: 100%" size="large" /> -->
                      <DateField @change="changedValue('onboardinScheduledDate');addOneYear(program.onboardingScheduleDate)" :disabledDateData="current => !current || current < dayjs(program.dischargeDate).subtract(1,'day')" v-model:value="program.onboardingScheduleDate" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" style="width: 100%" size="large"/>
                      <ErrorMessage v-if="errorMsg" :name="errorMsg.onboardingScheduleDate?errorMsg.onboardingScheduleDate[0]:''"/>
                  </a-form-item>
              </div>
          </a-col>

          <a-col :md="6" :sm="6" :xs="24">
              <div class="form-group">
                  <a-form-item label="Renewal Date" name="renewalDate" :rules="[{ required: false, message: 'Renewal Date'+' '+$t('global.validation') }]">
                      <!-- <a-date-picker @change="changedValue()" v-model:value="program.renewalDate" :format="globalDateFormat" :disabledDate="!isEnabledDischargeDate ? d => d : (d => !d || d.isSameOrBefore(program.onboardingScheduleDate))" value-format="YYYY-MM-DD" style="width: 100%" size="large" /> -->
                        <DateField @change="changedValue()" v-model:value="program.renewalDate" :globalDateFormat="globalDateFormat" :disabledDateData=" current => !current || current < dayjs(program.onboardingScheduleDate)" value-format="YYYY-MM-DD" style="width: 100%" size="large" />
                      <ErrorMessage v-if="errorMsg" :name="errorMsg.renewalDate?errorMsg.renewalDate[0]:''" />
                  </a-form-item>
              </div>
          </a-col>
          
          <a-col :md="6" :sm="6" :xs="24">
              <div class="form-group">
                  <a-form-item :label="$t('patient.programs.dischargeDate')" name="dischargeDate" :rules="[{ required: false, message: $t('patient.programs.dischargeDate')+' '+$t('global.validation') }]">
                      <!-- <a-date-picker @change="changedValue()" v-model:value="program.dischargeDate" :format="globalDateFormat" :disabledDate="!isEnabledDischargeDate ? d => d : (d => !d || d.isSameOrBefore(program.onboardingScheduleDate))" value-format="YYYY-MM-DD" style="width: 100%" size="large" /> -->
                        <DateField @change="changedValue()" v-model:value="program.dischargeDate" :globalDateFormat="globalDateFormat" :disabledDateData="current => !current || current < dayjs(program.onboardingScheduleDate)" value-format="YYYY-MM-DD" style="width: 100%" size="large"/>
                      <ErrorMessage v-if="errorMsg" :name="errorMsg.dischargeDate?errorMsg.dischargeDate[0]:''" />
                  </a-form-item>
              </div>
          </a-col>
          <a-col :md="6" :sm="12" :xs="24">
              <div class="form-group">
                  <label>{{$t('global.status')}}</label>
                  <a-radio-group v-model:value="program.status">
                      <a-radio :value="1">{{$t('global.active')}}</a-radio>
                      <a-radio :value="0">{{$t('global.inactive')}}</a-radio>
                  </a-radio-group>
              </div>
          </a-col>
          <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,18,'id','name'),'name','udid')"> </FormBaseComponents>
      </a-row>
      <a-row :gutter="24" class="mb-24">
          <a-col :span="24">
              <a-button type="primary" html-type="submit" style="float:right">{{$t('global.save')}}</a-button>
          </a-col>
      </a-row>
      <a-row :gutter="24" class="mb-24">
          <a-col :span="24"> 
              <a-table class="sortIconTable" :row-selection="{ selectedRowKeys: selectedRow, onChange: rowSelection }" rowKey="id" :columns="columns" :data-source="programsData" :pagination="false" :scroll="{ x: 900 }">
                  <template #action="text" v-if="arrayToObjact(screensPermissions,70)">
                      <!-- <a-tooltip placement="bottom">
                          <a class="icons" @click="editProgram(text.record.id)">
                            <EditOutlined />
                          </a>
                      </a-tooltip> -->
                      <a-tooltip placement="bottom">
                          <a class="icons" @click="deleteProgram(text.record.id)">
                            <DeleteOutlined />
                          </a>
                      </a-tooltip>
                  </template>
              </a-table>
          </a-col>
      </a-row>
  </a-form>
  <Loader />
</template>

<script>
import { defineComponent, reactive, computed, watchEffect, ref } from "vue";
import { 
  // EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import Loader from "../../loader/Loader"
import {
  warningSwal,
  timeStamp,
  arrayToObjact,
  globalDateFormat,
  // dateAndTimeFormate,
  arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod"
import { messages } from "@/config/messages";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
// import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import { useRoute } from "vue-router";
import moment from "moment"
import dayjs from "dayjs"
import DateField from "@/components/modals/search/DateField.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  components: {
    // EditOutlined,
    DeleteOutlined,
    Loader,
    ErrorMessage,
    // GlobalCodeDropDown
    ArrayDataSearch,
    DateField,
    FormBaseComponents
  },
  props: {
    idPatient: {
      type: String
    }
  },
  setup(props, {emit}) {
    const formRef = ref()
    const store = useStore();
    const route = useRoute();
    const patientId = props.idPatient ? reactive(props.idPatient) : route.params.udid;
    const isEnabledDischargeDate = ref(false)
    const selectedRow = ref([])
    const program = reactive({
      program: [],
      onboardingScheduleDate: "",
      dischargeDate: "",
      renewalDate:"",
      status: 1,
    });

    const programDetails = computed(() => {
      return store.state.patients.programDetails
    })

    const rowSelection = (selectedRowKeys, selectedRows) => {
      if(selectedRowKeys?.length<2 && selectedRowKeys?.length>0){
        store.dispatch("programDetails", {
        patientUdid: patientId,
        programId: selectedRowKeys[0],
      }).then(() => {
        Object.assign(program, programDetails.value)
      })
        program.program = selectedRows.map(item=>item.programId) 
          programId.value = selectedRowKeys
          isEdit.value = selectedRowKeys?.length>0?true:false
          return  selectedRow.value = selectedRowKeys
      }else{
        if(selectedRowKeys?.length<1){
          program.onboardingScheduleDate= "",
          program.renewalDate=""
          program.dischargeDate=""
        }
        program.dischargeDate="",
        program.program = selectedRows.map(item=>item.programId) 
          programId.value = selectedRowKeys
          isEdit.value = selectedRowKeys?.length>0?true:false
          return  selectedRow.value = selectedRowKeys
      }
      }

    const addOneYear= (data) =>{
       // here adding next 1 year date
       program.renewalDate = new Date(data); 
       program.renewalDate.setFullYear( program.renewalDate.getFullYear() + 1);
       program.renewalDate.setDate(program.renewalDate.getDate()-1);
       program.renewalDate = moment(program.renewalDate).format('YYYY-MM-DD')
      // end 
    }
    const changedValue = (value) => {
      if(value && value == 'onboardinScheduledDate') {
        isEnabledDischargeDate.value = true
      }
      emit('onChange')
      store.commit('errorMsg', null)
    }

     const isEdit = ref(false)
     const programId = ref([])
     const dateSelect = ref(null)
     const patients = computed(() => {
      return store.state.patients;
    });
     function dateChange() {
       
            dateSelect.value = moment(program.dischargeDate).add(1, 'day')
        }
    watchEffect(() => {
       
      if(props.idPatient) {
       
        store.dispatch("program", patientId);
      }
    })

    const editProgram = (id) => {
      isEnabledDischargeDate.value = true
      store.commit('errorMsg', null)
      isEdit.value = true
      programId.value = id
      store.dispatch("programDetails", {
        patientUdid: patientId,
        programId: id,
      }).then(() => {
        Object.assign(program, programDetails.value)
      })
    }
    
    const programs = () => {
      if(isEdit.value) {
        // program.program = program.program == programDetails.value.program ? programDetails.value.programId : program.program
        store.dispatch("updatePatientProgram", {
          data: {
            program: program.program,
            onboardingScheduleDate: timeStamp(program.onboardingScheduleDate),
            renewalDate: timeStamp(program.renewalDate),
            dischargeDate:program.dischargeDate ? timeStamp(program.dischargeDate) : "",
            status: program.status,
            patientProgram:programId.value
          },
          patientUdid: route.params.udid,
          // programId: programId.value,
        }).then(() => {
          isEdit.value = false
          selectedRow.value = null
          store.dispatch("program", patientId);
          selectedRow.value = null
          emit('onChange', false)
          reset()
          isEnabledDischargeDate.value = false
        });
      }
      else if(patientId != null) {
        store.dispatch("addPatientProgram", {
          data: {
            program: program.program,
            onboardingScheduleDate: timeStamp(program.onboardingScheduleDate),
            renewalDate: timeStamp(program.renewalDate),
            dischargeDate:program.dischargeDate ? timeStamp(program.dischargeDate) : "",
            status: program.status,
          },
          id: patientId,
        }).then(() => {
          store.dispatch("program", patientId);
          emit('onChange', false)
          reset()
          isEnabledDischargeDate.value = false
        });
      }
      else {
        store.dispatch("addPatientProgram", {
          data: {
            program: program.program,
            onboardingScheduleDate: timeStamp(program.onboardingScheduleDate),
            renewalDate: timeStamp(program.renewalDate),
            dischargeDate:program.dischargeDate ? timeStamp(program.dischargeDate) : "",
            status: program.status,
          },
          id: patients.value.addDemographic.id,
        }).then(() => {
          store.dispatch("program", patients.value.addDemographic.id);
          emit('onChange', false)
          reset()
        });
      }
    };

    const columns = computed(() => {
      return store.state.patients.columns;
    });

    const programsData = computed(() => {
      return store.state.patients.program;
    });
    const form = reactive({
      ...program,
    });
    function reset() {
      formRef.value.resetFields();
      Object.assign(program,form)
    }

    function deleteProgram(id) {
      store.commit('errorMsg', null)
      if(patientId != null) {
        warningSwal(messages.deleteWarning).then((response) => {
          if(response==true) {
             store.commit('loadingStatus', true)
            store.dispatch('deleteProgram', {
              id: patientId,
              programID: id
            }).then(() => {
              isEdit.value = false
              programId.value = null
              store.dispatch("program", patientId);
              reset()
            });
          }
        })
      }
      else {
        warningSwal(messages.deleteWarning).then((response)=>{
          if(response==true) {
             store.commit('loadingStatus', true)
            store.dispatch('deleteProgram',{
              id:patients.value.addDemographic.id,
              programID:id
            }).then(() => {
              isEdit.value = false
              programId.value = null
              store.dispatch("program", patients.value.addDemographic.id);
              reset()
            });
          }
        })
      }
    }
    const programFailed = (value) => {
      // errorSwal(messages.fieldsRequired)
      console.log('value',value)
    };

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg
    })
    
    return {
      dayjs,
      isEdit,
      selectedRow,
      programId,
      rowSelection,
      addOneYear,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      changedValue,
      programFailed,
      timeStamp,
      editProgram,
      deleteProgram,
      columns,
      programsData,
      patients,
      program,
      programs,
      errorMsg,
      reset,
      formRef,
      dateChange,
      dateSelect,
      moment,
      globalDateFormat,
      isEnabledDischargeDate,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
