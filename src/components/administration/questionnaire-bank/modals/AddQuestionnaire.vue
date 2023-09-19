<template>
<a-modal width="80%" :class="nested && newQuestion ? 'addQuestionModalWithFooter' : ''" :title="name ? update ? $t('questionnaire.udateQuestionnaire') : $t('questionnaire.addQuestionnaire') +'('+name+')': update ? $t('questionnaire.udateQuestionnaire') : $t('questionnaire.addQuestionnaire')" centered :maskClosable="false" @cancel="closeModal()" :footer="false">
    <a-row :gutter="24" v-if="questionRecord">
        <a-col :sm="16">
            <h3>Question Name: {{questionRecord?.question}}</h3>
        </a-col>
        <a-col :sm="16">
            <h3>Question Type : {{questionRecord?.questionType}}</h3>
        </a-col>
        <a-col :sm="16" v-if="questionRecord?.options.length>0">
            <h3>Option : {{arrayToObjact(questionRecord?.options,optionId).option}}</h3>
        </a-col>
    </a-row>
    <div v-if="questionRecord">
    </div>
    <div class="commonBtn" v-if="nested && !update">
        <a-col :span="24">
            <div class="text-right">
                <a-button type="primary" @click="changeQuestion()">{{newQuestion ? "Add New Question" : "Question Listing"}}</a-button>
            </div>
        </a-col>
    </div>
    <SearchQuestion v-if="nested && newQuestion" :templateRecord="templateRecord" :sectionRecord="sectionRecord" @is-visible-exist="showModal2($event)" temOrSection="Question" :optionId="optionId" :questoinRecord="questionRecord" :scoreTypeAction="scoreTypeAction" :parentQuestion="parentQuestion" :editType="editType" :tempOrSecId="tempOrSecId" />
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,40,'id','name'),'name','udid')" ref="formRef" v-else :model="questionnaire" layout="vertical" @finish="addQuestionnaire">
        <div class="questionnaireMain">
            <a-row :gutter="24">
                <a-col :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('questionnaire.question')" name="question" :rules="[{ required: true, message: $t('questionnaire.question') +' '+$t('global.validation') }]">
                            <a-input v-model:value="questionnaire.question" :placeholder="$t('questionnaire.enterQuestion')" style="width: 100%" size="large" @change="checkChangeInput()" />
                            <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.question[0]:''" />
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div class="form-group">
                        <a-form-item :label="$t('questionnaire.typeOfScore')" name="scoreTypeId" :rules="[{ required: true, message: $t('questionnaire.typeOfScore') +' '+$t('global.validation') }]">
                            <ArrayDataSearch v-model:value="questionnaire.scoreTypeId" :globalCode="scoreTypeData" @change="checkChangeInput();handleGlobalChange($event,'questionnaire.scoreTypeId')" :close="oneTimeRefresh" :disabled="disabled" made="single" />
                            <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.scoreTypeId[0]:''" />
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('questionnaire.type')" name="questionType" :rules="[{ required: true, message: $t('questionnaire.type') +' '+$t('global.validation') }]">
                            <GlobalCodeDropDown v-model:value="questionnaire.questionType" :dataId="78" @handleGlobalChange="handleGlobalChange($event,'questionnaire.questionType')" @change="checkChangeInput()" :close="oneTimeRefresh" :editDataGlobal="questionTypeData" :disabled="disabled" />
                            <ErrorMessage v-if="errorMsg" :name="errorMsg.dataTypeId?errorMsg.dataTypeId[0]:''" />
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('questionnaire.inputType')" name="dataTypeId" :rules="[{ required: true, message: $t('questionnaire.inputType') +' '+$t('global.validation') }]">
                            <ArrayDataSearch v-model:value="questionnaire.dataTypeId" :globalCode="globalData" @checkReturnResponse="handleGlobalChange($event,'questionnaire.dataTypeId')" @change="checkChangeInput" made="single" :disabled="disabled" />
                            <ErrorMessage v-if="errorMsg" :name="errorMsg.dataTypeId?errorMsg.dataTypeId[0]:''" />
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('questionnaire.refrenceImage')" name="refrenceImage" :rules="[{ required: false, message: $t('questionnaire.refrenceImage') +' '+$t('global.validation') }]">
                            <a-input v-model:value="questionnaire.refrenceImage" size="large" type="file" @change="onFileUpload" />
                        </a-form-item>
                    </div>
                </a-col>
                <a-col :sm="12" :xs="24">
                    <div class="form-group questionnairTag">
                        <label> {{$t('questionnaire.tags')}}</label>
                        <a-select ref="select" v-model:value="questionnaire.tags" style="width: 100%" mode="tags" size="large" :placeholder="$t('questionnaire.selectTags')" :getPopupContainer="triggerNode => triggerNode.parentNode">
                        </a-select>
                    </div>
                </a-col>
                <a-col :sm="12" :xs="24">
                    <div class="form-group">
                        <a-checkbox-group v-model:value="questionnaire.checkBox" :options="plainOptions" />
                    </div>
                </a-col>
            </a-row>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,40,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :span="24">
                <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" :disabled="oneTimeSubmit" />
            </a-col>

        </div>

    </a-form>
    <CommonLoader v-if="loader" />
</a-modal>
</template>
<script>
import { ref, reactive, onMounted, computed, watchEffect } from "vue";
import {
  warningSwal,
  arrayToObjact,
  errorSwal,
  customOption,
  arrayToObjectData, formTitleNames
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import { useStore } from "vuex";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch.vue";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import FormButtons from "@/components/common/button/FormButtons";
import CommonLoader from "@/components/loader/CommonLoader";
import SearchQuestion from "@/components/administration/questionnaire-template/modals/SearchQuestion";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  name: "Add Questionnaire",
  emits: ["is-visible"],
  components: {
    GlobalCodeDropDown,
    ErrorMessage,
    ArrayDataSearch,
    FormButtons,
    CommonLoader,
    SearchQuestion,
    FormBaseComponents
  },
  props: {

    templateRecord: Object,
    name: String,
    update: String,
    tempOrSecId: String,
    question: String,
    questionRecord: Object,
    optionId: String,
    nested: Boolean,
    scoreTypeAction: Number,
    parentQuestion: Object,
    editType: String,
    nestedOptionId: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const formRef = ref();
    const loader = ref(false);
    const oneTimeRefresh = ref(false);
    const oneTimeSubmit = ref(false);
    const disabled = ref(false);
    const plainOptions = ["Required", "Capture Image"];
    const questionnaire = reactive({
      question: "",
      dataTypeId: "",
      tags: [],
      checkBox: [],
      refrenceImage: "",
      questionType: "",
      optionAction: "",
      questionnaireTypeId: "",
      scoreTypeId: "",
    });
    const form = reactive({
      ...questionnaire,
    });
    const questionTypeData = ref([]);
    onMounted(() => {
      store.state.questionnaire.addQuestionnaire = null;

      let dataId = props.templateRecord?.questionnaireCustomField?.scoreTypeId
        ? parseInt(props.templateRecord?.questionnaireCustomField?.scoreTypeId)
        : "";
      store.dispatch("commonAction", {
        show: false,
        method: "get",
        data: null,
        id: null,
        commit: "scoreTypeData",
        endPoint: "questionnaire/score/type/71?globalCodeId=" + dataId,
      });
      if (props.update) {

        loader.value = true;
        store.dispatch("detailsQuestionnaire", "/" + props?.update + "?sectionId=" + props?.tempOrSecId + "&templateId=" + props?.templateRecord?.id + "&parentId=" + props?.parentQuestion?.id + "&optionId=" + props?.optionId).then(() => { });
        store.dispatch("commonAction", {
          show: false,
          method: "get",
          data: null,
          id: null,
          commit: "singleGlobalCode",
          endPoint: "globalCode?globalCodeCategoryId=58",
        });
      } else {
        if (props.templateRecord) {
          loader.value = true;

          //questionnaire.scoreTypeId = dataId;
          /// questionnaire.questionType = props.templateRecord.questionnaireCustomField.questionnaireTypeId ? parseInt(props.templateRecord.questionnaireCustomField.questionnaireTypeId) : ''
          store
            .dispatch("commonAction", {
              show: false,
              method: "get",
              data: null,
              id: null,
              commit: "singleGlobalCode",
              endPoint: "questionnaire/dataType/58?globalCodeId=" + dataId,
            })
            .then(() => {
              loader.value = false;
            });
        } else {
          store.dispatch("commonAction", {
            method: "get",
            show: false,
            data: null,
            id: null,
            commit: "singleGlobalCode",
            endPoint: "globalCode?globalCodeCategoryId=58",
          });
        }
      }
      store.dispatch("programList");
    });
    const detailsQuestionnaire = store.getters.detailsQuestionnaire;
    const globalData = store.getters.singleGlobalCode;
    watchEffect(() => {
      if (props.question) {
        questionnaire.question = props.question;
      }
      if (props.update && detailsQuestionnaire.value) {
        disabled.value = true;

        Object.assign(questionnaire, detailsQuestionnaire.value);
        loader.value = true;
        setTimeout(() => {
          questionnaire.questionType =
            detailsQuestionnaire.value.questionTypeId;
          questionTypeData.value = [
            {
              label: detailsQuestionnaire.value?.questionType,
              value: detailsQuestionnaire.value?.questionTypeId,
            },
          ];
          questionnaire.scoreTypeId = detailsQuestionnaire.value
            ?.questionnaireCustomField?.scoreTypeId
            ? parseInt(
              detailsQuestionnaire.value?.questionnaireCustomField
                ?.scoreTypeId
            )
            : "";

          loader.value = false;
        }, 1000);
      }
    });

    const addQuestionnaire = () => {
      oneTimeSubmit.value = true;
      let data = "";
      if (props.optionId) {
        data = {
          optionId: props.nestedOptionId
            ? props.nestedOptionId
            : props.optionId,
          referenceId: props.optionId,
          entityType: "questionOptions",
          editType: props.editType,
          sectionId: props.tempOrSecId,
          templateId: props.templateRecord?.id,
          parent: props.questionRecord?.id,
          parentId: props.parentQuestion?.id,
          question: questionnaire.question,
          dataTypeId: questionnaire.dataTypeId,
          tags: questionnaire.tags,
          duration: null,
          questionType: questionnaire.questionType,
          referenceImage: store.state.patients.uploadFile,
          questionnaireCustomField: {
            scoreTypeId: questionnaire.scoreTypeId,
          },
        };
      } else {
        data = {
          optionId: props.nestedOptionId
            ? props.nestedOptionId
            : props.optionId,
          sectionId: props.tempOrSecId,
          templateId: props.templateRecord?.id,
          editType: props.editType,
          parentId: props.parentQuestion?.id,
          question: questionnaire.question,
          dataTypeId: questionnaire.dataTypeId,
          tags: questionnaire.tags,
          duration: null,
          questionType: questionnaire.questionType,
          referenceImage: store.state.patients.uploadFile,

          questionnaireCustomField: {
            scoreTypeId: questionnaire.scoreTypeId,
          },
        };
      }
      if (props.update) {
        //update question
        store
          .dispatch("updateQuestionnaire", {
            data: data,
            id: props.update,
          })
          .then(() => {
            if (props.templateRecord) {
              store.dispatch("detailsQuestionnaireTemplate", {
                id: props.templateRecord.id,
                data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
              });
            } else {
              store.dispatch(
                "questionnaireList",
                "scoreTypeId=" + props.scoreTypeAction
              );
            }

            emit("is-visible", {
              show: false,
              id: props.tempOrSecId,
            });
            if (store.getters.addQuestionnaire.value) {
              oneTimeSubmit.value = false;
            } else {
              oneTimeSubmit.value = false;
            }
            reset();
          });
      } else {
        // add new question
        store.dispatch("addQuestionnaire", data).then(() => {
          if (
            questionnaire.dataTypeId == 243 ||
            questionnaire.dataTypeId == 244 ||
            (questionnaire.dataTypeId == 242 &&
              questionnaire.scoreTypeId == 333)
          ) {
            let result = customOption(questionnaire);

            if (
              questionnaire.dataTypeId == 242 &&
              questionnaire.scoreTypeId == 333
            ) {
              //add custom fields after add new question
              store
                .dispatch("updateQuestionnaire", {
                  data: result,
                  id: store.getters.addQuestionnaire.value.id,
                })
                .then(() => {
                  afterCallUrl();
                });
            } else {
              // add two options  yes or no
              store
                .dispatch("addOptions", {
                  id: store.getters.addQuestionnaire.value.id,
                  data: result,
                  method: "post"
                })
                .then(() => {
                  afterCallUrl();
                });
            }
          } else {
            afterCallUrl();
          }
        });
      }
    };

    function afterCallUrl() {
      if (props.tempOrSecId && !props.optionId) {
        store.commit("checkChangeInput", false);
        store
          .dispatch("addAssignquestionnaire", {
            data: {
              questionId: [store.getters.addQuestionnaire.value.id],
              id: props.tempOrSecId,
            },
            showPopup: false,
            method: "post",
            id: props.tempOrSecId,
          })
          .then(() => {
            if (props.templateRecord) {
              store.dispatch("detailsQuestionnaireTemplate", {
                id: props.templateRecord.id,
                data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
              });
            }
          });
        oneTimeSubmit.value = false;
      } else {
        if (props.templateRecord) {
          store.dispatch("detailsQuestionnaireTemplate", {
            id: props.templateRecord.id,
            data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
          });
        } else {
          store.dispatch(
            "questionnaireList",
            "scoreTypeId=" + props.scoreTypeAction
          );
        }
      }
      oneTimeSubmit.value = false;
      emit("is-visible", {
        show: false,
        id: props.tempOrSecId,
      });
      reset();
    }
    const showModal2 = () => {
      emit("is-visible", {
        show: false,
        id: props.tempOrSecId,
      });
    };
    const checkChangeInput = () => {
      store.commit("checkChangeInput", true);
    };

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    function reset() {
      Object.assign(questionnaire, form);
      store.state.questionnaire.detailsQuestionnaire = "";
      store.state.patients.uploadFile = "";
      store.state.common.checkChangeInput = "";
      oneTimeRefresh.value = true;
      setTimeout(() => {
        oneTimeRefresh.value = false;
      }, 100);
    }

    function closeModal() {
      if (checkFieldsData.value) {
        emit("is-visible", {
          show: true,
          id: props.tempOrSecId,
        });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("is-visible", {
              show: false,
              id: props.tempOrSecId,
            });
            reset();
            store.commit("checkChangeInput", false);
          } else {
            emit("is-visible", {
              show: true,
              id: props.tempOrSecId,
            });
          }
        });
      } else {
        reset();

        emit("is-visible", {
          show: false,
          id: props.tempOrSecId,
        });
      }
    }
    const handleGlobalChange = (data, type) => {
      if (type == "questionnaire.dataTypeId") {
        questionnaire.dataTypeId = data;
      } else if (type == "questionnaire.questionType") {
        questionnaire.questionType = data;
        let dataId = "";
        if (questionnaire.questionType == 353) {
          dataId = 332;
        } else {
          dataId = questionnaire.scoreTypeId;
        }
        store.dispatch("commonAction", {
          show: false,
          method: "get",
          data: null,
          id: null,
          commit: "singleGlobalCode",
          endPoint: "questionnaire/dataType/58?globalCodeId=" + dataId,
        });
      } else if (type == "questionnaire.questionnaireTypeId") {
        questionnaire.questionnaireTypeId = data;
      } else if (type == "questionnaire.scoreTypeId") {
        questionnaire.dataTypeId = "";
        //
        if (data) {
          questionnaire.scoreTypeId = data;
          let dataId = "";
          if (questionnaire.questionType == 353) {
            dataId = 332;
          } else {
            dataId = questionnaire.scoreTypeId;
          }
          store.dispatch("commonAction", {
            show: false,
            method: "get",
            data: null,
            id: null,
            commit: "singleGlobalCode",
            endPoint: "questionnaire/dataType/58?globalCodeId=" + dataId,
          });
        }
      } else if (type == "questionnaire.action") {
        questionnaire.optionAction = data;
      }
    };
    const onFileUpload = (event) => {
      let doc_file = event.target.files[0];
      if (doc_file.size / 1024 > 5120) {
        Object.assign(questionnaire, {
          referenceImage: "",
        });
        errorSwal("File size should be less than or equal to 5 MB");
        return false;
      }
      if (
        doc_file.type != "image/jpg" &&
        doc_file.type != "image/jpeg" &&
        doc_file.type != "image/tiff" &&
        doc_file.type != "image/tif" &&
        doc_file.type != "image/bmp" &&
        doc_file.type != "image/png" &&
        doc_file.type != "application/pdf"
      ) {
        Object.assign(questionnaire, {
          referenceImage: "",
        });
        errorSwal(
          "Allowed file types are JPG, JPEG, TIFF, TIF, BMP, PNG and PDF only"
        );
        return false;
      }
      let formData = new FormData();
      formData.append("file", doc_file);

      store.dispatch("uploadFile", formData).then(() => {
       
      });
      //isValueChanged.value = true;
    };
    const errorMsg = store.getters.errorMsg.value;
    const newQuestion = ref(false);
    const changeQuestion = () => {
      newQuestion.value = !newQuestion.value;
    };
    return {
      handleGlobalChange,
      questionnaire,
      size: ref("large"),

      addQuestionnaire,
      formRef,
      closeModal,
      checkChangeInput,
      arrayToObjact,
      reset,
      errorMsg,
      oneTimeRefresh,
      globalData,
      loader,
      oneTimeSubmit,
      plainOptions,
      onFileUpload,
      disabled,
      changeQuestion,
      newQuestion,
      showModal2,

      scoreTypeData: store.getters.scoreTypeData,
      questionTypeData,
      formTitleNames,
      arrayToObjectData,
      formData: store.getters.formTitle,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-group label {
  margin: 0 0 8px 0;
}
</style>