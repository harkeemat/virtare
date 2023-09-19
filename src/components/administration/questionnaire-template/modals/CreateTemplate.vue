<template>
<a-modal width="80%" :title="update ? 'Edit Template' : 'Create Template'" centered :maskClosable="false" @cancel="closeModal()" :footer="false">
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,38,'id','name'),'name','udid')" ref="formRef" :model="questionnaireTemplate" layout="vertical" @finish="update ? updateTemplate() : addTemplate()">
        <a-row :gutter="16">
            <a-col :span="24">
                <div class="form-group">
                    <a-form-item :label="$t('questionnaire.templateName')" name="templateName" :rules="[{ required: true, message: $t('questionnaire.templateName') +' '+$t('global.validation') }]">
                        <a-input v-model:value="questionnaireTemplate.templateName" :placeholder="$t('questionnaire.entertemplateName')" style="width: 100%" size="large" @change="checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.templateName[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.categoryType')" name="templateTypeId" :rules="[{ required: true, message: $t('questionnaire.categoryType') +' '+$t('global.validation') }]">
                        <GlobalCodeDropDown v-model:value="questionnaireTemplate.templateTypeId" :dataId="57" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.templateTypeId')" @change="checkChangeInput();getType()" :editDataGlobal="dataGlobal" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.templateTypeId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="12" v-if="categoryType.length>0">
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.actionType')" name="actionType" :rules="[{ required: true, message: $t('questionnaire.actionType') +' '+$t('global.validation') }]">
                        <ArrayDataSearch :globalCode="categoryType" v-model:value="questionnaireTemplate.actionType" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.actionType')" @change="checkChangeInput();actionTypeChange()" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.actionType?errorMsg.actionType[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :span="12" v-if="actionData.length>0">
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.action')" name="action" :rules="[{ required: true, message: $t('questionnaire.action') +' '+$t('global.validation') }]">
                        <ArrayDataSearch :globalCode="actionData" v-model:value="questionnaireTemplate.action" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.action')" @change="checkChangeInput()" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.action[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :span="12">
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.templateType')" name="questionnaireTypeId" :rules="[{ required: true, message: $t('questionnaire.templateType') +' '+$t('global.validation') }]">
                        <GlobalCodeDropDown v-model:value="questionnaireTemplate.questionnaireTypeId" :dataId="73" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.questionnaireTypeId')" @change="checkChangeInput()" :disabled="edit" :editDataGlobal="questionnaireTypeData" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.questionnaireTypeId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :span="12">
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.associated')" name="user" :rules="[{ required: true, message: $t('questionnaire.associated') +' '+$t('global.validation') }]">
                        <GlobalCodeDropDown v-model:value="questionnaireTemplate.user" :dataId="70" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.user')" @change="checkChangeInput()" :close="oneTimeRefresh" :editDataGlobal="userData"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.user[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <!-- <a-col :span="6">
                <div class="form-group">
                    <a-form-item :label="$t('questionnaire.numberOfQuestion')" name="numberOfQuestion" :rules="[{ required: false, message: $t('questionnaire.numberOfQuestion') +' '+$t('global.validation') }]">
                        <a-input-number size="large" :min="1" @change="checkChangeInput()" v-model:value="questionnaireTemplate.numberOfQuestion" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.numberOfQuestion[0]:''" />
                    </a-form-item>
                </div>
            </a-col> -->

            <a-col :span="questionnaireTemplate.slotTypeId==336 ? 6 :12">
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.questionOrder')" name="slotTypeId" :rules="[{ required: false, message: $t('questionnaire.questionOrder') +' '+$t('global.validation') }]">
                        <GlobalCodeDropDown v-model:value="questionnaireTemplate.slotTypeId" :dataId="72" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.slotTypeId')" @change="checkChangeInput()" :editDataGlobal="questionOrderData" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.slotTypeId[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="6" v-if="questionnaireTemplate.slotTypeId==336">
                <div class="form-group">
                    <a-form-item :label="$t('questionnaire.questionPerDay')" name="perDay" :rules="[{ required: questionnaireTemplate.slotTypeId==336 ?true :false, message: $t('questionnaire.questionPerDay') +' '+$t('global.validation') }]">
                        <a-input-number size="large" :min="1" @change="checkChangeInput()" v-model:value="questionnaireTemplate.perDay" /> &nbsp;&nbsp;Days
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.perDay[0]:''" />
                    </a-form-item>
                </div>

            </a-col>
            <a-col :sm="12" :xs="24" v-if="edit">
                <!-- <div class="form-group">
                    <a-form-item :label="'Is Score ?'" name="to" >
                        <div :disabled="edit" class="btn toggleButton" :class="toggleTo ? 'active':''">
                            <span class="btn-content">Yes</span>
                        </div>
                        <div :disabled="edit" class="btn toggleButton" :class="toggleTo ? '':'active'">
                            <span class="btn-content">No</span>
                        </div>

                    </a-form-item>
                </div> -->
                <div class="form-group">

                    <a-form-item :label="$t('questionnaire.typeOfScore')" name="typeOfScore" :rules="[{ required: false, message: $t('questionnaire.typeOfScore') +' '+$t('global.validation') }]">
                        <ArrayDataSearch :globalCode="globalData" v-model:value="questionnaireTemplate.typeOfScore" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.typeOfScore')" @change="checkChangeInput()" :disabled="edit" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.typeOfScore[0]:''" />
                    </a-form-item>
                </div>

            </a-col>
            <a-col :sm="4" :xs="24" v-else>
                <div class="form-group">
                    <a-form-item :label="'Is Score ?'" name="to">
                        <div :disabled="edit" class="btn toggleButton" :class="toggleTo ? 'active':''" @click="buttonToggle(); checkChangeInput()">
                            <span class="btn-content">Yes</span>
                        </div>
                        <div :disabled="edit" class="btn toggleButton" :class="toggleTo ? '':'active'" @click="buttonToggle(); checkChangeInput()">
                            <span class="btn-content">No</span>
                        </div>

                    </a-form-item>
                </div>

            </a-col>

            <a-col :span="8" v-if="!edit">
                <div class="form-group">

                    <a-form-item v-if="toggleTo" :label="$t('questionnaire.typeOfScore')" name="typeOfScore" :rules="[{ required: false, message: $t('questionnaire.typeOfScore') +' '+$t('global.validation') }]">
                        <ArrayDataSearch :globalCode="globalData" v-model:value="questionnaireTemplate.typeOfScore" @handleGlobalChange="handleGlobalChange($event,'questionnaireTemplate.typeOfScore')" @change="checkChangeInput()" :disabled="edit" :close="oneTimeRefresh" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.typeOfScore[0]:''" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :span="12">
                <div class="form-group questionnairTag">
                    <a-form-item :label="$t('questionnaire.tags')" name="tags">
                        <a-select ref="select" v-model:value="questionnaireTemplate.tags" style="width: 100%" @focus="focus" @change="handleChange" mode="tags" size="large" :placeholder="$t('questionnaire.selectTags')" :getPopupContainer="triggerNode => triggerNode.parentNode">
                            <a-select-option v-for="item,index in questionnaireTemplate.tags" :key="index" :value="item">{{item}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>

            </a-col>
            <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('questionnaire.tillEnd')" name="day" :rules="[{ required: questionnaireTemplate.slotTypeId==336 ?true :false, message: $t('questionnaire.days') +' '+$t('global.validation') }]">
                        <a-input-number size="large" :min="1" @change="checkChangeInput();valid(questionnaireTemplate.day);" v-model:value="questionnaireTemplate.day" /> &nbsp;&nbsp;Days
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.question?errorMsg.day[0]:''" />
                    </a-form-item>
                </div>

            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,38,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :span="24">
                <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" :disabled="disabled" />
            </a-col>
        </a-row>
        <QuestionnaireLoader />
    </a-form>

</a-modal>
</template>
<script>
import {
  ref,
  reactive,
  defineComponent,
  computed,
  watchEffect,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { warningSwal,arrayToObjectData,formTitleNames } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import FormButtons from "@/components/common/button/FormButtons";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
  emits: ["is-visible"],
  components: {
    QuestionnaireLoader,
    GlobalCodeDropDown,
    ErrorMessage,
    FormButtons,
    ArrayDataSearch,
    FormBaseComponents
  },
  props: {
    update: String,
    cloneId: String,
    edit: Boolean,
  },

  setup(props, { emit }) {
    const store = useStore();
    const formRef = ref();
    const oneTimeRefresh = ref(false);
    const toggleTo = ref(false);
    const scoreData = ref([]);

    const questionnaireTemplate = reactive({
      templateName: "",
      templateTypeId: "",
      tags: [],
      user: "",
      day: "",
      perDay: "",
      actionType: "",
      action: "",
      questionnaireTypeId: "",
      slotTypeId: "",
      // numberOfQuestion: '',
      typeOfScore: 339,
    });
    const disabled = ref(false);
    const form = reactive({
      ...questionnaireTemplate,
    });
    const detailsQuestionnaireTemplate =
      store.getters.detailsQuestionnaireTemplate;
    const globalData = ref([]);
    const dataGlobal = ref([]);
    const questionnaireTypeData = ref([])
    const userData = ref([])
    const questionOrderData = ref([])
    onMounted(() => {
      store.state.questionnaireTemplate.categoryType = [];
      store.state.questionnaireTemplate.actionData = [];

      if (props.cloneId) {
        store.dispatch("detailsQuestionnaireTemplate", {
          id: props.cloneId,
         data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
        });
      }
      store
        .dispatch("commonAction", {
          method: "get",
          show: false,
          data: null,
          id: null,
          commit: "singleGlobalCode",
          endPoint: "globalCode?globalCodeCategoryId=71",
        })
        .then(() => {
          store.getters.singleGlobalCode.value.map((item) => {
            if (item.id != 339 && !props.edit) {
              globalData.value.push(item);
            } else {
              props.edit ? globalData.value.push(item) : "";
            }
          });
        });
    });
    watchEffect(() => {
      if (props.update || props.cloneId) {
        if (detailsQuestionnaireTemplate.value) {
          store
            .dispatch("commonAction", {
              method: "get",
              show: false,
              data: null,
              id: null,
              commit: "categoryType",
              endPoint:
                "questionnaire/globalCode/list/" +
                detailsQuestionnaireTemplate.value.templateTypeId,
            })
            .then(() => {
              let actionId = detailsQuestionnaireTemplate.value
                ?.questionnaireCustomField?.globalType
                ? parseInt(
                    detailsQuestionnaireTemplate.value?.questionnaireCustomField
                      ?.globalType
                  )
                : "";
              if (actionId) {
                questionnaireTemplate.actionType = actionId;
                store
                  .dispatch("commonAction", {
                    method: "get",
                    show: false,
                    data: null,
                    id: null,
                    commit: "actionData",
                    endPoint: "questionnaire/globalCode/list/" + actionId,
                  })
                  .then(() => {
                    questionnaireTemplate.action = detailsQuestionnaireTemplate
                      .value?.questionnaireCustomField?.globalAction
                      ? parseInt(
                          detailsQuestionnaireTemplate.value
                            ?.questionnaireCustomField?.globalAction
                        )
                      : "";
                  });
              }
            });

          Object.assign(
            questionnaireTemplate,
            detailsQuestionnaireTemplate.value
          );
          dataGlobal.value = [
            {
              label: detailsQuestionnaireTemplate.value?.templateType,
              value: detailsQuestionnaireTemplate.value?.templateTypeId,
            },
          ];
           questionnaireTypeData.value = [
            {
              label: detailsQuestionnaireTemplate.value?.questionnaireCustomField?.questionnaireType,
              value: parseInt(
                  detailsQuestionnaireTemplate.value?.questionnaireCustomField?.questionnaireTypeId
                ),
            },
          ];
          userData.value = [{
              label: detailsQuestionnaireTemplate.value?.questionnaireCustomField?.userType,
              value: parseInt(
                  detailsQuestionnaireTemplate.value?.questionnaireCustomField?.userTypeId
                ),
            },]
            questionOrderData.value = [{
              label: detailsQuestionnaireTemplate.value?.questionnaireCustomField?.slotType,
              value: parseInt(
                  detailsQuestionnaireTemplate.value?.questionnaireCustomField?.slotTypeId
                ),
            },]
          if (
            parseInt(
              detailsQuestionnaireTemplate.value.questionnaireCustomField
                .scoreTypeId
            ) != 339
          ) {
            toggleTo.value = true;
          }
          if (props.cloneId) {
            questionnaireTemplate.templateName = "";
          }
          questionnaireTemplate.templateTypeId =
            detailsQuestionnaireTemplate.value.templateTypeId;
          questionnaireTemplate.questionnaireTypeId =
            detailsQuestionnaireTemplate.value?.questionnaireCustomField?.questionnaireTypeId
              ? parseInt(
                  detailsQuestionnaireTemplate.value?.questionnaireCustomField?.questionnaireTypeId
                )
              : "";
          questionnaireTemplate.day = detailsQuestionnaireTemplate.value?.questionnaireCustomField?.noOfDays
            ? parseInt(
                detailsQuestionnaireTemplate.value?.questionnaireCustomField?.noOfDays
              )
            : "";
          questionnaireTemplate.user = detailsQuestionnaireTemplate.value?.questionnaireCustomField?.userTypeId
            ? parseInt(
                detailsQuestionnaireTemplate.value?.questionnaireCustomField?.userTypeId
              )
            : "";
          questionnaireTemplate.slotTypeId = detailsQuestionnaireTemplate.value?.questionnaireCustomField?.slotTypeId
            ? parseInt(
                detailsQuestionnaireTemplate.value?.questionnaireCustomField?.slotTypeId
              )
            : "";
          questionnaireTemplate.typeOfScore = detailsQuestionnaireTemplate.value?.questionnaireCustomField?.scoreTypeId
            ? parseInt(
                detailsQuestionnaireTemplate.value?.questionnaireCustomField?.scoreTypeId
              )
            : "";
          questionnaireTemplate.perDay = detailsQuestionnaireTemplate.value?.questionnaireCustomField?.maxQuestionPerDay
            ? parseInt(
                detailsQuestionnaireTemplate.value?.questionnaireCustomField?.maxQuestionPerDay
              )
            : "";
          ///dataGlobal.value = detailsQuestionnaireTemplate.value.editdata
        } else {
          Object.assign(questionnaireTemplate, form);
        }
      }
    });
    const dataReturn = (record) => {
      let data = "";
      data = {
        templateName: record.templateName,
        templateTypeId: record.templateTypeId,
        tags: record.tags,

        questionnaireCustomField: {
          questionnaireTypeId: record.questionnaireTypeId,
          noOfDays: record.day,
          userTypeId: record.user,
          //"noOfQuestion": record.numberOfQuestion,
          slotTypeId: record.slotTypeId,
          scoreTypeId: record.typeOfScore,
          showScore: toggleTo.value,
          responseShow: true,
          responseMessage: "This form no longer accepting response",
          responseEdit: false,
          responseAddress: false,
          submitResponseMessage: "Thank You",
          progressBar: false,
          requiredFields: false,
          limitResponse: false,
          maxQuestionPerDay: record.perDay,
          globalType: record.actionType,
          globalAction: record.action,
        },
      };
      return data;
    };

    const addTemplate = () => {
      disabled.value = true;
      store.commit("questionnaireLoadingStatus", true);
      let data = dataReturn(questionnaireTemplate);

      store.dispatch("addQuestionnaireTemplate", data).then(() => {
        if (store.state.common.successMsg) {
          if (props.cloneId) {
            detailsQuestionnaireTemplate.value
              ? detailsQuestionnaireTemplate.value.questionnaireQuestion.forEach(
                  (element) => {
                    if (element.entityType != "question") {
                      let id = [];
                      element.questionnaireSection.questionSection.map(
                        (item) => {
                          id.push(item.question.id);
                        }
                      );
                      store
                        .dispatch("addQuestionnaireTemplateSection", {
                          data: {
                            sectionName:
                              element.questionnaireSection.sectionName,
                          },
                          show: false,
                        })
                        .then(() => {
                          if (store.state.common.successMsg) {
                            store.dispatch("addAssignquestionnaire", {
                              data: {
                                questionId: id,
                                id: store.getters.questionnaireTemplateSection
                                  .value.id,
                              },
                              method: "post",
                              id: store.getters.questionnaireTemplateSection
                                .value.id,
                              temOrSection: "section",
                              showPopup: false,
                            });

                            store
                              .dispatch("sectionAssignToTemplate", {
                                id: store.getters.addQuestionnaireTemplate.value
                                  .id,
                                sectionId: [
                                  store.getters.questionnaireTemplateSection
                                    .value.id,
                                ],
                                method: "post",
                                showPopup: false,
                              })
                              .then(() => {
                                store.state.common.successMsg = "";
                              });
                          }
                        });
                    }
                  }
                )
              : "";
            store.dispatch("questionnaireTemplateList");
            disabled.value = false;
            store.commit("questionnaireLoadingStatus", false);
          } else {
            store
              .dispatch("addQuestionnaireTemplateSection", {
                data: {
                  sectionName: "Section 1",
                },
                show: false,
              })
              .then(() => {
                if (store.state.common.successMsg) {
                  disabled.value = false;
                  store.commit("questionnaireLoadingStatus", false);
                  store
                    .dispatch("sectionAssignToTemplate", {
                      id: store.getters.addQuestionnaireTemplate.value.id,
                      sectionId: [
                        store.getters.questionnaireTemplateSection.value.id,
                      ],
                      method: "post",
                      showPopup: false,
                    })
                    .then(() => {
                      store.dispatch("questionnaireTemplateList");
                    });
                } else {
                  disabled.value = false;
                  store.commit("questionnaireLoadingStatus", false);
                }
              });
          }
          emit("is-visible", {
            show: false,
            id: props.update,
          });
          reset();

          oneTimeRefresh.value = true;
          setTimeout(() => {
            oneTimeRefresh.value = false;
          }, 100);
        }
      });
    };
    const updateTemplate = () => {
      let data = dataReturn(questionnaireTemplate);
      store
        .dispatch("updateQuestionnaireTemplate", {
          data: data,
          id: props.update,
          show: true,
        })
        .then(() => {
          if (store.state.common.successMsg) {
            emit("is-visible", {
              show: false,
              id: "",
            });
            reset();
            store.dispatch("questionnaireTemplateList");
          }
        });
    };

    function reset() {
      store.state.patients.errorMsg = "";
      store.commit("checkChangeInput", false);
      Object.assign(questionnaireTemplate, form);
      questionnaireTemplate.tags = [];
      disabled.value = false;
      store.state.questionnaireTemplate.detailsQuestionnaireTemplate = "";
    }

    function closeModal() {
      if (checkFieldsData.value) {
        emit("is-visible", {
          show: true,
          id: props.update,
        });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("is-visible", {
              show: false,
              id: props.update,
            });
            reset();
            disabled.value = false;
            oneTimeRefresh.value = true;
            setTimeout(() => {
              oneTimeRefresh.value = false;
            }, 100);
          } else {
            emit("is-visible", {
              show: true,
              id: props.update,
            });
          }
        });
      } else {
        reset();
        oneTimeRefresh.value = true;
        setTimeout(() => {
          oneTimeRefresh.value = false;
        }, 100);
        formRef.value.resetFields();
        disabled.value = false;
        emit("is-visible", {
          show: false,
          id: props.update,
        });
      }
    }

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }
    const errorMsg = store.getters.errorMsg.value;
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });
    const handleGlobalChange = (data, type) => {
      if (type == "questionnaireTemplate.templateTypeId") {
        questionnaireTemplate.templateTypeId = data;
      } else if (type == "questionnaireTemplate.user") {
        questionnaireTemplate.user = data;
      } else if (type == "questionnaireTemplate.questionnaireTypeId") {
        questionnaireTemplate.questionnaireTypeId = data;
      } else if (type == "questionnaireTemplate.slotTypeId") {
        questionnaireTemplate.slotTypeId = data;
      } else if (type == "questionnaireTemplate.typeOfScore") {
        questionnaireTemplate.typeOfScore = data;
      } else if (type == "questionnaireTemplate.actionType") {
        questionnaireTemplate.actionType = data;
      } else if (type == "questionnaireTemplate.action") {
        questionnaireTemplate.action = data;
      }
    };
    const options = ref([]);
    const handleChange = () => {
      options.value = [];
      questionnaireTemplate.tags.map((item) => {
        options.value.push({
          value: item,
          label: item,
        });
      });

      
    };

    function buttonToggle() {
      toggleTo.value = !toggleTo.value;
      if (!toggleTo.value) {
        questionnaireTemplate.typeOfScore = 339;
      } else {
        questionnaireTemplate.typeOfScore = "";
      }

      // taskForm.assignedName = [];
    }
    const getType = () => {
      store.state.questionnaireTemplate.categoryType = [];
      store.state.questionnaireTemplate.actionData = [];
      store.dispatch("commonAction", {
        method: "get",
        show: false,
        data: null,
        id: null,
        commit: "categoryType",
        endPoint:
          "questionnaire/globalCode/list/" +
          questionnaireTemplate.templateTypeId,
      });
    };
    const actionTypeChange = () => {
      store.state.questionnaireTemplate.actionData = [];
      store.dispatch("commonAction", {
        method: "get",
        show: false,
        data: null,
        id: null,
        commit: "actionData",
        endPoint:
          "questionnaire/globalCode/list/" + questionnaireTemplate.actionType,
      });
    };
    function valid(elem) {
      var RegExp = new RegExp(/^\d*\.?\d*$/);
      if (!RegExp.test(elem)) {
        questionnaireTemplate.day = "";
      }
    }
    return {
      handleChange,
      options,
      questionnaireTemplate,
      addTemplate,
      closeModal,
      checkChangeInput,
      checkFieldsData,
      errorMsg,
      formRef,
      updateTemplate,
      disabled,
      oneTimeRefresh,
      reset,
      handleGlobalChange,
      dataGlobal,
      buttonToggle,
      toggleTo,
      scoreData,
      globalData,
      getType,
      categoryType: store.getters.categoryType,
      actionData: store.getters.actionData,
      actionTypeChange,
      valid,
      questionnaireTypeData,
      userData,
      questionOrderData,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
    };
  },
});
</script>

<style lang="scss" scoped>
.toggleButton {
  &.active {
    background: #1890ff !important;
    border-color: #1890ff !important;
    color:#fff;
  }
}
</style>

