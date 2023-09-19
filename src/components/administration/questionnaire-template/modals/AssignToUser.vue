<template>
<a-modal width="80%" :title="detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate.templateName:''" centered :maskClosable="false" @cancel="closeModal()" :footer="false">

    <a-form ref="formRef" :model="userAssign" layout="vertical" @finish="assignTemplate" v-if="detailsQuestionnaireTemplate">
        <a-row :gutter="16">

            <a-col :sm="12" :xs="24" v-if="parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==330 || parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==350">
                <div class="form-group">

                    <a-form-item :label="$t('tasks.tasksModal.patient')" name="patientsId" :rules="[{ required: validation, message: $t('tasks.tasksModal.patient')+' '+$t('global.validation')  }]">
                        <PatientDropDown mode="multiple" v-model:value="userAssign.patientsId" @handlePatientChange="handlePatientChange($event)" :close="closeValue" :editDataPatient="patientName" :max-tag-count="2" :maxTagTextLength="3" />

                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" v-if="parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==331 || parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==350">
                <div class="form-group">
                    <a-form-item :label="$t('global.careCoodinator')" name="staffId" :rules="[{ required: validation, message: $t('global.careCoodinator')+' '+$t('global.validation')  }]">

                        <StaffDropDown mode="multiple" v-model:value="userAssign.staffId" @handleStaffChange="handleStaffChange($event)" :close="closeValue" :editDataStaff="staffName" :max-tag-count="2" :maxTagTextLength="3" />

                    </a-form-item>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col :sm="4" :xs="24" v-if="parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==330 || parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==350">
                <div class="form-group">
                    <a-checkbox :class="index==0 ? 'mt-20':'mt-40'" :defaultChecked="userAssign.allPatients" v-model:chacked="userAssign.allPatients" @change="allPatient($event);">{{$t('questionnaire.selectAllPatients')}}</a-checkbox>

                </div>
            </a-col>
            <a-col :sm="4" :xs="24">
                <div class="form-group" v-if="userAssign.patientsId.length>0">
                    <a-checkbox :class="index==0 ? 'mt-20':'mt-40'" :defaultChecked="userAssign.staffResponse" v-model:chacked="userAssign.staffResponse"  @change="checkChangeInput(); staffValue($event);">{{$t('questionnaire.toBeFilledByStaff')}}</a-checkbox>

                </div>
            </a-col>
            <a-col :sm="4" :xs="24">
                <div class="form-group" v-if="userAssign.patientsId.length>0">
                    <a-checkbox :class="index==0 ? 'mt-20':'mt-40'" :defaultChecked="userAssign.patientResponse" v-model:chacked="userAssign.patientResponse" @change="checkChangeInput(); checkValue($event);">{{$t('questionnaire.toBeFilledBy')}}</a-checkbox>

                </div>
            </a-col>
            <a-col :sm="8" :xs="24" v-if="parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==331 || parseInt(detailsQuestionnaireTemplate.questionnaireCustomField.userTypeId)==350">
                <div class="form-group">
                    <a-checkbox :class="index==0 ? 'mt-20':'mt-40'" :defaultChecked="userAssign.allStaff" v-model:chacked="userAssign.allStaff" @change="allStaff($event);">{{$t('questionnaire.selectAllStaff')}}</a-checkbox>
                </div>
            </a-col>

            <a-col :span="24">
                <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
            </a-col>
        </a-row>

    </a-form>
    <QuestionnaireLoader />
</a-modal>
</template>
<script>
import {
  ref,
  reactive,
  defineComponent,
  computed,
  onMounted,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader";
import FormButtons from "@/components/common/button/FormButtons";
import PatientDropDown from "@/components/modals/search/PatientDropdownSearch.vue";
import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue";
export default defineComponent({
  name: "Assign To User",
  emits: ["is-visible"],
  components: {
    QuestionnaireLoader,
    FormButtons,
    PatientDropDown,
    StaffDropDown,
  },
  props: ["tempId"],

  setup(props, { emit }) {
    const store = useStore();
    const formRef = ref();
    const validation = ref(true);
    const patientName = ref([]);
    const staffName = ref([]);
    const userAssign = reactive({
      type: "",
      patientsId: [],
      staffId: [],
      patientResponse: false,
      staffResponse:true,
      allStaff: false,
      allPatients: false,
    });

    const form = reactive({
      ...userAssign,
    });

    function checkValue(event) {
      userAssign.patientResponse = event.target.checked;
    }
    function staffValue(event) {
      userAssign.staffResponse = event.target.checked;
    }

    function allPatient(event) {
      userAssign.allPatients = event.target.checked;

      if (
        userAssign.patientsId.length > 0 ||
        userAssign.staffId.length > 0 ||
        userAssign.allPatients == true ||
        userAssign.allStaff == true
      ) {
        validation.value = false;
      } else {
        validation.value = true;
      }
    }

    function allStaff(event) {
      userAssign.allStaff = event.target.checked;

      if (
        userAssign.patientsId.length > 0 ||
        userAssign.staffId.length > 0 ||
        userAssign.allPatients == true ||
        userAssign.allStaff == true
      ) {
        validation.value = false;
      } else {
        validation.value = true;
      }
    }
    onMounted(() => {
      store
        .dispatch("commonAction", {
          method: "get",
          show: false,
          data: null,
          id: null,
          commit: "userAssignList",
          endPoint: "assign/user/" + props.tempId,
        })
        .then(() => {
          const userAssignList = store.getters.userAssignList;

          userAssignList.value.map((item) => {
            if (item.entityType == 247) {
              patientName.value.push({
                value: item.userId,
                label: item.userName,
                profilePhoto: "",
              });
              userAssign.patientsId.push(item.userId);
            } else {
              staffName.value.push({
                value: item.userId,
                label: item.userName,
                profilePhoto: "",
              });
              userAssign.staffId.push(item.userId);
            }
          });
        });
    });

    watchEffect(() => {
      if (
        userAssign.patientsId.length > 0 ||
        userAssign.staffId.length > 0 ||
        userAssign.allPatients ||
        userAssign.allPatients
      ) {
        validation.value = false;
      } else {
        validation.value = true;
      }

    });

    const assignTemplate = () => {
      let data = [];
      if (userAssign.patientsId.length > 0 || userAssign.staffId.length > 0) {
        userAssign.patientsId.length > 0
          ? userAssign.patientsId.map((item) => {
              data.push({
                questionnaireTemplateId: props.tempId,
                entityType: 247,
                referenceId: item,
                allPatients: userAssign.allPatients,
                questionnaireCustomField: {
                  allowStaff: userAssign.staffResponse,
                  allowPatient:userAssign.patientResponse,
                },
              });
            })
          : "";
        userAssign.staffId.length > 0
          ? userAssign.staffId.map((item) => {
              data.push({
                questionnaireTemplateId: props.tempId,
                entityType: 246,
                referenceId: item,
                allStaff: userAssign.allStaff,
              });
            })
          : "";
      }
      if (userAssign.allPatients || userAssign.allStaff) {
        data.push({
          questionnaireTemplateId: props.tempId,
          entityType: 246,
          allStaff: userAssign.allStaff,
        });
        data.push({
          questionnaireTemplateId: props.tempId,
          allPatients: userAssign.allPatients,
          entityType: 247,
        });
      }
      // data.push({
      //    "allStaff": userAssign.allStaff,
      //    "allPatients": userAssign.allPatients,
      // })
      store.dispatch("assignToUser", data).then(() => {
        if (store.state.common.successMsg) {
          emit("is-visible", {
            show: false,
            id: props.tempId,
          });
        }
      });
    };
    const handleStaffChange = (val) => {
      userAssign.staffId = val;
    };

    const handlePatientChange = (val) => {
      userAssign.patientsId = val;
    };

    function reset() {
      store.state.patients.errorMsg = "";
      store.commit("checkChangeInput", false);
      Object.assign(userAssign, form);
    }

    function closeModal() {
      if (checkFieldsData.value) {
        emit("is-visible", {
          show: true,
          id: props.tempId,
        });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("is-visible", {
              show: false,
              id: props.tempId,
            });
            reset();
          } else {
            reset();
            emit("is-visible", {
              show: true,
              id: props.tempId,
            });
          }
        });
      } else {
        formRef.value.resetFields();

        emit("is-visible", {
          show: false,
          id: props.tempId,
        });
      }
    }

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }
    const errorMsg = store.getters.errorMsg;
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    return {
      closeModal,
      checkChangeInput,
      checkFieldsData,
      errorMsg,
      formRef,
      reset,
      userAssign,
      assignTemplate,
      handleStaffChange,
      handlePatientChange,
      validation,
      detailsQuestionnaireTemplate: store.getters.detailsQuestionnaireTemplate,
      checkValue,
      allStaff,
      allPatient,
      patientName,
      staffName,
      staffValue,
     
    };
  },
});
</script>

<style>
.ant-modal-footer {
  display: none;
}



.toggleButton.active {
  background-color: #777;
  color: #fff;
}
</style>

