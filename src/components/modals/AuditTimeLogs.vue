
<template>
<a-modal width="1000px" title="Edit Audit Time Log" :footer="false" :maskClosable="false" @cancel="closeModal()" centered>
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')" :model="auditTimeLog" name="auditTimeLog" autocomplete="off" layout="vertical" @finish="updateAuditTime" @finishFailed="auditTimeLogFailed">
        <a-row :gutter="24">
            <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('timeLogs.category')" name="categoryId" :rules="[{ required: true, message: $t('timeLogs.category')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown :disabled="disabledCategory" v-model:value="auditTimeLog.categoryId" size="large" :dataId="27" @handleGlobalChange="handleGlobalChange($event,'auditTimeLog.categoryId'); checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('timeLogs.cptCode')" name="cptCodeId" :rules="[{ required: true, message: $t('timeLogs.cptCode')+' '+$t('global.validation')  }]">
                        <CptCodeAtivitiesDropDown size="large" v-model:value="auditTimeLog.cptCodeId"  @handleCptCodeChange="handleCptCodeChange($event)" @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.priority')" name="flag" :rules="[{ required: true, message: $t('tasks.tasksModal.priority')+' '+$t('global.validation')  }]">
                        <ArrayDataSearch size="large" v-model:value="auditTimeLog.flag" :globalCode="flagsList" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.flag[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :md="12" :xs="24" >
                <div class="form-group">
                    <a-form-item :label="$t('timeLogs.timeAmount')" name="timeAmount" :rules="[{ required: true, message: $t('timeLogs.timeAmount')+' '+$t('global.validation')  }]">
                        <a-time-picker v-model:value="auditTimeLog.timeAmount" :disabled="arrayToObjact(screensPermissions,410) ? false : true" format="HH:mm:ss" value-format="HH:mm:ss" size="large" style="width: 100%" @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :md="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('timeLogReport.note')" name="note" :rules="[{ required: false, message: $t('timeLogReport.note')+' '+$t('global.validation') }]">
                        <a-textarea v-model:value="auditTimeLog.note" allow-clear @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,45,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :sm="24" :md="24" :span="24">
                <ModalButtons :Id="Id" @is_cancel="closeModal" :disableButton="disableButton" />
            </a-col>
        </a-row>
    </a-form>
</a-modal>
</template>
<script>
import {
  defineComponent,
  reactive,
  computed,
  watchEffect,
  ref,
  onUnmounted,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import ModalButtons from "@/components/common/button/ModalButtons";
import { getSeconds, warningSwal ,arrayToObjact,arrayToObjectData,formTitleNames } from "@/commonMethods/commonMethod";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import CptCodeAtivitiesDropDown from "@/components/modals/search/CptCodeActivitiesSearch";
import { messages } from "../../config/messages";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";

import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  components: {
    ModalButtons,
    GlobalCodeDropDown,
    ArrayDataSearch,
    CptCodeAtivitiesDropDown,
    FormBaseComponents
  },
  props: {
    Id: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const disabledFlag = ref(false);
    const disabledCptCode = ref(false);
    const disabledCategory = ref(false);
    const disableButton = ref(true);
    const auditTimeLog = reactive({
      staff: "",
      patient: "",
      timeAmount: "",
      flag: "",
      note: "",
      noteId: "",
      cptCodeId: "",
      categoryId: "",
    });

    const timeLogReports = computed(() => {
      return store.state.timeLogReport.editAuditTimeLog;
    });

   
    const datefilter = store.getters.auditTimeLogFilterDates

    const flagsList = computed(() => {
      return store.state.flags.flagsList;
    });


    const updateAuditTime = () => {
      store
        .dispatch("updateAuditTimeLog", {
          data: {
            timeAmount: getSeconds(auditTimeLog.timeAmount),
            flag: auditTimeLog.flag,
            note: auditTimeLog.note,
            noteId: auditTimeLog.noteId,
            cptCode: auditTimeLog.cptCodeId,
            category: auditTimeLog.categoryId,
          },
          id: props.Id,
        })
        .then(() => {
          store.getters.timeLogReports.value.timeLogReportList = "";
          store.dispatch(
            "timeLogReportList",datefilter.value
            
          );
          emit("saveAuditTimeLog");
          disableButton.value = true;
        });
    };

    const staffList = computed(() => {
      return store.state.common.staffList;
    });

    // const patients = computed(() => {
    //   return store.state.common.allPatientsList;
    // });

    onMounted(()=>{
      store.dispatch("flagsList");
      store.dispatch("activeCptCodes");
    })

    watchEffect(() => {
      disabledFlag.value = false;
      disabledCptCode.value = false;
      disabledCategory.value = false;
      if (props.Id) {
        if (timeLogReports.value) {
          if (timeLogReports.value.flag != "") {
            disabledFlag.value = true;
          }
          if (timeLogReports.value.cptCodeId != "") {
            disabledCptCode.value = true;
          }
          if (timeLogReports.value.categoryId != "") {
            disabledCategory.value = true;
          }
        }
        Object.assign(auditTimeLog, timeLogReports.value);
      }
    });

    function checkChangeInput() {
      if(timeLogReports.value.note.trim() != auditTimeLog.note.trim() || timeLogReports.value.flag != auditTimeLog.flag || timeLogReports.value.timeAmount != auditTimeLog.timeAmount || timeLogReports.value.categoryId != auditTimeLog.categoryId || timeLogReports.value.cptCodeId != auditTimeLog.cptCodeId){
        disableButton.value = false
        store.commit("checkChangeInput", true)
      }else{
        disableButton.value = true
        store.commit("checkChangeInput", false)
      }
    }

    
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });
    const closeModal = () => {
      emit("saveAuditTimeLog", true)
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("saveAuditTimeLog", false);
            store.commit("errorMsg", null);
            store.commit("checkChangeInput", false);
            disableButton.value = true;
          } else {
            emit("saveAuditTimeLog", true);
            disableButton.value = false;
          }
        });
      }
      else {
        emit("saveAuditTimeLog", false)
        store.commit("checkChangeInput", false)
      }
    };

    onUnmounted(() => {
      store.commit("errorMsg", null);
    });

    const handleGlobalChange = (data,type) =>{
      if (type == "auditTimeLog.categoryId") {
        auditTimeLog.categoryId = data;
      }
    }

    const handleCptCodeChange = (data) =>{
      auditTimeLog.cptCodeId =data
    }

    return {
      handleCptCodeChange,
      handleGlobalChange,
      disableButton,
      closeModal,
      disabledFlag,
      disabledCptCode,
      disabledCategory,
      getSeconds,
      updateAuditTime,
      timeLogReports,
      staffList,
      auditTimeLog,
      // patients,
      cptCodesList: store.getters.activeCptCodes,
      timeLogCategories: store.getters.timeLogCategories,
      flagsList,
      checkChangeInput,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
