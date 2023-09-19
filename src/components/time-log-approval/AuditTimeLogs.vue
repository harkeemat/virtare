
<template>
<a-modal width="1000px" title="Timelog Approval" :footer="false" :maskClosable="false" @cancel="closeModal()" centered>
    <a-form :model="auditTimeLog" name="auditTimeLog" autocomplete="off" layout="vertical" @finish="updateAuditTime" @finishFailed="auditTimeLogFailed">
        <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('timeLogs.department')" name="categoryId" :rules="[{ required: true, message: $t('timeLogs.department')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown  v-model:value="auditTimeLog.categoryId" size="large" :dataId="27" @handleGlobalChange="handleGlobalChange($event,'auditTimeLog.categoryId'); checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item label="Type" name="typeId" :rules="[{ required: true, message: 'Type'+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown  v-model:value="auditTimeLog.typeId" size="large" :dataId="85" @handleGlobalChange="handleGlobalChange($event,'auditTimeLog.typeId'); checkChangeInput()"/>
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('timeLogs.cptCode')" name="cptCodeId" :rules="[{ required: true, message: $t('timeLogs.cptCode')+' '+$t('global.validation')  }]">
                        <CptCodeAtivitiesDropDown  size="large" v-model:value="auditTimeLog.cptCodeId"  @handleCptCodeChange="handleCptCodeChange($event)" @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <!-- <a-col :sm="24" :md="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('common.flag')" name="flag" :rules="[{ required: true, message: $t('common.flag')+' '+$t('global.validation')  }]">
                        <ArrayDataSearch size="large" v-model:value="auditTimeLog.flag" :globalCode="flagsList" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.flag ? errorMsg.flag[0] : ''" />
                    </a-form-item>
                </div>
            </a-col> -->
            <a-col :sm="24" :md="12" :xs="24" >
                <div class="form-group">
                    <a-form-item :label="$t('timeLogs.timeAmount')" name="timeAmount" :rules="[{ required: true, message: $t('timeLogs.timeAmount')+' '+$t('global.validation')  }]">
                        <a-time-picker v-model:value="auditTimeLog.timeAmount" format="HH:mm:ss" value-format="HH:mm:ss" size="large" style="width: 100%" @change="checkChangeInput()" />
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
            <a-col :sm="24" :md="24" :span="24">
                <ModalButtons :Id="Id" @is_cancel="closeModal"  />
            </a-col>
        </a-row>
    </a-form>
    <Loader />
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
import { getSeconds, warningSwal ,arrayToObjact,secondsToTime } from "@/commonMethods/commonMethod";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import CptCodeAtivitiesDropDown from "@/components/modals/search/CptCodeActivitiesSearch";
import { messages } from "@/config/messages";
// import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
import Loader from "@/components/loader/Loader"
export default defineComponent({
  components: {
    ModalButtons,
    GlobalCodeDropDown,
    // ArrayDataSearch,
    CptCodeAtivitiesDropDown,
    Loader
  },
  props: {
    Id: Array,
    editData:String,
    confirm:Boolean
  },
  setup(props, { emit }) {
    const store = useStore();
    const disabledFlag = ref(false);
    const disabledCptCode = ref(false);
    const disabledMessageType = ref(false);
    const disableButton = ref(true);
    const auditTimeLog = reactive({
      staff: "",
      patient: "",
      timeAmount: "",
      flag: "",
      note: "",
      noteId: "",
      cptCodeId: "",
      categoryId:"",
      typeId: "",
    });

    const timeLogReports = computed(() => {
      return store.state.timeLogApproval.editAuditTimeLogApproval;
    });

    const dateFilter = store.getters.auditTimeLogFilterDates

    const flagsList = computed(() => {
      return store.state.flags.flagsList;
    });

    const updateAuditTime = () => {
      store
        .dispatch("updateAuditTimeLogApproval", {
          data: {
            timeAmount: getSeconds(auditTimeLog.timeAmount),
            flag: auditTimeLog.flag,
            note: auditTimeLog.note,
            noteId: auditTimeLog.noteId,
            cptCode: auditTimeLog.cptCodeId,
            category: auditTimeLog.categoryId,
            status:329,
            id:props.Id
          },
          // id: props.Id,
        })
        .then(() => {
          store.getters.timeLogReports.value.timeLogReportList = "";
           store.dispatch("timeLogApprovalList",dateFilter.value);
           emit("saveAuditTimeLog", {
            close: false,
            isSaved: true
          });
          disableButton.value = true;
        });
    };

    const staffList = computed(() => {
      return store.state.common.staffList;
    });

    onMounted(()=>{
      store.dispatch("flagsList");
      store.dispatch("activeCptCodes");
    })

    watchEffect(() => {
      disabledFlag.value = false;
      disabledCptCode.value = false;
      disabledMessageType.value = false;
      if (props.Id) {
        let temp = {
          timeAmount:secondsToTime(props.editData?.timeAmount),
          typeId:props.editData?.typeId
        }
        Object.assign(auditTimeLog, temp);
      }
    });

    function checkChangeInput() {
        store.commit("checkChangeInput", true)
    }

    
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });
    const closeModal = () => {
      /* emit("saveAuditTimeLog", {
        close: false,
        isSaved: false
      }) */
      if (checkFieldsData.value || props?.confirm) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            store.commit("errorMsg", null);
            store.commit("checkChangeInput", false);
            disableButton.value = true;
            emit("saveAuditTimeLog", {
              close: false,
              isSaved: true
            });
          }
          else {
            disableButton.value = false;
            emit("saveAuditTimeLog", {
              close: true,
              isSaved: false
            });
          }
        });
      }
      else {
        emit("saveAuditTimeLog", {
          close: false,
          isSaved: false
        })
        store.commit("checkChangeInput", false)
      }
    };

    onUnmounted(() => {
      store.commit("errorMsg", null);
    });

    const handleGlobalChange = (data,type) =>{
      if (type == "auditTimeLog.typeId") {
        auditTimeLog.typeId = data;
      }
      if(type == 'auditTimeLog.categoryId'){
        auditTimeLog.categoryId = data
      }
    }

    const handleCptCodeChange = (data) =>{
      auditTimeLog.cptCodeId =data
    }

    return {
      secondsToTime,
      handleCptCodeChange,
      handleGlobalChange,
      disableButton,
      closeModal,
      disabledFlag,
      disabledCptCode,
      disabledMessageType,
      getSeconds,
      updateAuditTime,
      timeLogReports,
      staffList,
      auditTimeLog,
      cptCodesList: store.getters.activeCptCodes,
      timeLogCategories: store.getters.timeLogCategories,
      flagsList,
      checkChangeInput,
      screensPermissions: store.getters.screensPermissions,
      arrayToObjact
    };
  },
});
</script>
