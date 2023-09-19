<template>
<a-modal width="1000px" title="Add Time Logs" zIndex="1050" centered @cancel="onCloseModal()" :maskClosable="false" :footer="false">
    <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,26,'id','name'),'name','udid')"> </FormBaseComponents>
      <a-form layout="vertical" class="form" ref="formRef" :model="addTimeLogForm" @finish="submitForm" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,26,'id','name'),'name','udid')">
          <a-row :gutter="24">
              <a-col :sm="12" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.department')" name="category" :rules="[{ required: true, message: $t('timeLogs.department')+' '+$t('global.validation')  }]">
                          <GlobalCodeDropDown v-model:value="addTimeLogForm.category" :dataId="27" @handleGlobalChange="handleGlobalChange($event,'addTimeLogForm.category'); changedValue()" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="24" :xs="24" :lg="12" v-if="patientIdParam == null">
                  <div class="form-group">
                      <a-form-item :label="$t('common.patient')" name="patientId" :rules="[{ required: true, message: $t('common.patient')+' '+$t('global.validation')  }]">
                        <PatientDropDown :editDataPatient="editDataPatient" v-model:value="addTimeLogForm.patientId" @handlePatientChange="handlePatientChange($event);changedValue()" :close="closeValue" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="12" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.loggedBy')" name="loggedBy" :rules="[{ required: true, message: $t('timeLogs.loggedBy')+' '+$t('global.validation')  }]">
                        <StaffDropDown :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="addTimeLogForm.loggedBy" @handleStaffChange="handleStaffChange($event, 'loggedBy'); changedValue()" :isDisabled="patientIdParam != null" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="12" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.performedBy')" name="performedBy" :rules="[{ required: true, message: $t('timeLogs.performedBy')+' '+$t('global.validation')  }]">
                        <StaffDropDown :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="addTimeLogForm.performedBy" @handleStaffChange="handleStaffChange($event, 'performedBy'); changedValue()" :isDisabled="patientIdParam != null" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="12" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.date')" name="date" :rules="[{ required: true, message: $t('timeLogs.date')+' '+$t('global.validation')  }]">
                            <DateField @change="changedValue" :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" v-model:value="addTimeLogForm.date" :size="size" style="width: 100%" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :disabled="patientIdParam != null" />
                          </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="12" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.timeAmount')" name="timeAmount" :rules="[{ required: true, message: $t('timeLogs.timeAmount')+' '+$t('global.validation')  }]">
                          <a-time-picker @change="changedValue" v-model:value="addTimeLogForm.timeAmount" format="HH:mm:ss" :size="size" style="width: 100%" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="12" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.cptCode')" name="cptCode" :rules="[{ required: true, message: $t('timeLogs.cptCode')+' '+$t('global.validation')  }]">
                          <CptCodeAtivitiesDropDown v-model:value="addTimeLogForm.cptCode"  @handleCptCodeChange="handleCptCodeChange($event); changedValue()" />
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="24" :xs="24" :lg="patientIdParam == null ? 12 : 24">
                  <div class="form-group">
                      <a-form-item label="Priority" name="flag" :rules="[{ required: false, message: $t('common.flag')+' '+$t('global.validation')  }]">
                          <ArrayDataSearch @change="changedValue" v-model:value="addTimeLogForm.flag" :globalCode="flagsList" :getPopupContainer="triggerNode => triggerNode.parentNode"/>
                      </a-form-item>
                  </div>
              </a-col>

              <a-col :sm="24" :xs="24">
                  <div class="form-group">
                      <a-form-item :label="$t('timeLogs.note')" name="note" :rules="[{ required: false, message: $t('timeLogs.note')+' '+$t('global.validation')  }]">
                          <a-textarea @change="changedValue" v-model:value="addTimeLogForm.note" size="large" style="width: 100%" />
                      </a-form-item>
                  </div>
              </a-col>

              <ErrorMessage v-if="errorMsg" :name="errorMsg?.message" />

              <a-col :span="24">
                <FormButtons @onCancel="onCloseModal()" :submitButton="update ? $t('global.update') : $t('global.save')" />
              </a-col>
          </a-row>
      </a-form>
   
    <Loader />
</a-modal>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, watchEffect ,defineAsyncComponent} from "vue";
import { useStore } from "vuex";
import {
  timeStampLocal,
  getSeconds,
  globalDateFormat,
  formTitleNames,
  arrayToObjectData,
} from "@/commonMethods/commonMethod";
import { useRoute } from "vue-router";
import moment from "moment";
import dayjs from 'dayjs';
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import Loader from "@/components/loader/Loader";
import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue"
import PatientDropDown from "@/components/modals/search/PatientDropdownSearch.vue"
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import CptCodeAtivitiesDropDown from "@/components/modals/search/CptCodeActivitiesSearch";
import FormButtons from "@/components/common/button/FormButtons";
import DateField from "@/components/modals/search/DateField.vue";
export default defineComponent({
  props: {
    patient: Number
  },
  components: {
    ErrorMessage,
    DateField,
    GlobalCodeDropDown,
    Loader,
    StaffDropDown,
    PatientDropDown,
    ArrayDataSearch,
    CptCodeAtivitiesDropDown,
    FormButtons,
    FormBaseComponents:defineAsyncComponent(() =>
      import("@/components/modals/FormBaseComponents")
    ),
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const formRef = ref();
    const dateSelect = ref(moment().add(1, "day"));
    const loggedInUserDetails = JSON.parse(localStorage.getItem("auth"));
    const patientIdParam = ref(route.params.udid);

    const staffList = computed(() => {
      return store.state.common.allStaffList;
    });

    const timeLogCategories = computed(() => {
      return store.state.common.timeLogCategories;
    });

    const errorMsg = computed(() => {
            return store.state.careCoordinator.errorMsg;
        });

    const editDataPatient = computed(() => {
      return store.state.escalations.editEscalationPatient;
    });

    const addTimeLogForm = reactive({
      category: "",
      loggedBy: loggedInUserDetails.user.staff.fullName,
      performedBy: loggedInUserDetails.user.staff.fullName,
      patientId: "",
      date: dayjs(),
      timeAmount: "",
      cptCode: "",
      flag: "",
      note: "",
    });

    const form = reactive({
      ...addTimeLogForm,
    });

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    })

    const changedValue = () => {
      store.commit('checkChangeInput', true)
    };
    onMounted(()=>{
      store.dispatch("flagsList")
    })
    function onCloseModal() {
      emit("closeModal", true);
      if(checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("closeModal", false);
            Object.assign(addTimeLogForm, form);
            store.commit('checkChangeInput', false)
          }
          else {
            emit("closeModal", true);
          }
        });
      }
      else {
        emit("closeModal", false);
        formRef.value.resetFields();
        store.commit('checkChangeInput', false)
      }
    }

    const loggedInUserId = ref(loggedInUserDetails.user.staffUdid);

    watchEffect(() => {
      
      Object.assign(addTimeLogForm, {
        loggedBy: loggedInUserDetails.user.staff.fullName != null ? loggedInUserDetails.user.staff.fullName : "",
        performedBy: loggedInUserDetails.user.staff.fullName != null ? loggedInUserDetails.user.staff.fullName : "",
        date: dayjs(),
      });
    });

    const datefilter = store.getters.auditTimeLogFilterDates

    const cptCodesList = computed(() => {
      return store.state.common.activeCptCodes;
    });

    const flagsList = computed(() => {
      return store.state.flags.flagsList;
    });

    const handleClear = () => {
      formRef.value.resetFields();
      Object.assign(addTimeLogForm, form);
    };

    const submitForm = () => {
      const patient = patientIdParam.value ? patientIdParam.value : addTimeLogForm.patientId
      const time = dayjs(addTimeLogForm.timeAmount).format('HH:mm:ss')
      const timeAmount = getSeconds(time);
      const data = {
        category: addTimeLogForm.category,
        loggedBy: loggedInUserId.value ? loggedInUserId.value : addTimeLogForm.loggedBy,
        performedBy: loggedInUserId.value ? loggedInUserId.value : addTimeLogForm.performedBy,
        date: timeStampLocal(addTimeLogForm.date),
        timeAmount: timeAmount,
        cptCode: addTimeLogForm.cptCode,
        flag: addTimeLogForm.flag,
        note: addTimeLogForm.note,
        isAutomatic: false,
      };
      store.dispatch("addTimeLog", {
        id: patient,
        data: data,
      }).then((resp) => {
        if(resp==true){
          if(route.name == 'PatientSummary'){
          store.dispatch("latestNotes", patient);
          store.dispatch("patientTimeline", {
                      id: patient,
                      type: store.state.patients.tabvalue,
                  });
        }
        store.dispatch("timeLogReportList",datefilter.value);
        store.dispatch("latestTimeLog", patient);
        emit("closeModal", false);
        formRef.value.resetFields();
        Object.assign(addTimeLogForm, form);
        }
        
      });
    };

    const handleStaffChange = (val, user) => {
      if(user == 'loggedBy') {
        addTimeLogForm.loggedBy = val;
      }
      else {
        addTimeLogForm.performedBy = val;
      }
    };

    const handleGlobalChange = (data,type) =>{
      if(type =='addTimeLogForm.category'){
        addTimeLogForm.category = data
      }
    }
    
    const handleCptCodeChange = (data) => {
      addTimeLogForm.cptCode =data
    }
    
    const handlePatientChange = (data) => {
   
      addTimeLogForm.patientId =data
    }

    return {
      errorMsg,
      handlePatientChange,
      handleCptCodeChange,
      handleGlobalChange,
      globalDateFormat,
      size: ref("large"),
      handleClear,
      formRef,
      dayjs,
      submitForm,
      addTimeLogForm,
      staffList,
      timeLogCategories,
      cptCodesList,
      checkFieldsData,
      changedValue,
      onCloseModal,
      flagsList,
      dateSelect,
      handleStaffChange,
      patientIdParam,
      editDataPatient,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,

    };
  },
});
</script>
