<template>
<a-modal width="80%" :title="name ? update ? $t('questionnaire.udateOption') : $t('questionnaire.addOption') +'('+name+')': update ? $t('questionnaire.udateOption') : $t('questionnaire.addOption')" centered :maskClosable="false" @cancel="closeModal()" :footer="false">

    <a-row :gutter="24">
        <a-col :sm="16">
            <h3>Question Name: {{questionRecord?.question}}</h3>
        </a-col>
        <a-col :sm="16">

            <h3>Question Type : {{questionRecord?.questionType}}</h3>

        </a-col>
        <a-col :sm="16">

            <h3>Input Type : {{questionRecord?.dataType}}</h3>

        </a-col>
    </a-row>
    <!-- dataTypeId=242 is Single Input, 243 is single choice, 244 is multiple choice and 241 is text area -->
    <!-- scoreTypeId = 332 is  program score,333 is general score and 339 is no Score -->
    <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,46,'id','name'),'name','udid')" ref="formRef" :model="questionnaire" layout="vertical" @finish="addQuestionnaire">
        <div class="questionnaireMain">
            <a-row :gutter="24">
                <a-col :sm="24" class="mt-25" v-if="questionRecord?.dataTypeId==243 || questionRecord?.dataTypeId==244">

                    <a-row :gutter="16" v-for="(lable,index) in questionnaire.lable" :key="lable.key">
                        <a-col :span="5">
                            <div class="form-group">

                                <a-form-item :label="$t('questionnaire.label')" :name="['lable', index, 'value']" :rules="[{ required: true, message: $t('questionnaire.label') +' '+$t('global.validation') }]">
                                    <a-input v-model:value="lable.value" :placeholder="$t('questionnaire.label')" style="width: 100%" size="large" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :span="2" v-if="questionRecord?.questionnaireCustomField?.scoreTypeId==333">
                            <div class="form-group">

                                <a-form-item :label="$t('questionnaire.score')" :name="['lable', index, 'labelScore']" :rules="[{ required: true, message: $t('questionnaire.score') +' '+$t('global.validation') }]">
                                    <a-input-number :min="0" v-model:value="lable.labelScore" placeholder="Score" style="width: 100%" size="large" @change="checkChangeInput();lableScoreGet($event)" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :span="2">

                            <label v-if="index==0" :class="index==0 ? 'd-flex ':''">{{$t('questionnaire.correct')}}</label>

                            <a-checkbox :class="index==0 ? 'mt-20':'mt-40'" v-model:checked="currectSelect[lable.key]" v-if="questionRecord.dataTypeId==244" v-model:value="lable.key" name="default" @change="checkboxChange($event);checkChangeInput();" />

                            <!-- <a-radio-group  v-model:value="questionnaire.answer"> -->
                            <a-checkbox v-else :class="index==0 ? 'mt-20':'mt-40'" v-model:checked="currectSelect[lable.key]" v-model:value="lable.key" @change="radioChange($event,lable.key)"></a-checkbox>
                            <!-- </a-radio-group> -->
                        </a-col>
                        <a-col :span="2">
                            <label v-if="index==0" :class="index==0 ? 'd-flex ':''">{{$t('questionnaire.default')}}</label>

                            <a-checkbox :class="index==0 ? 'mt-20':'mt-40'" v-model:checked="defaultSelect[lable.key]" v-model:value="lable.key" name="default" v-if="questionRecord.dataTypeId==244" @change="checkboxChangeDefault($event);checkChangeInput();" />

                            <a-checkbox v-else :class="index==0 ? 'mt-20':'mt-40'" :value="lable.key" v-model:checked="defaultSelect[lable.key]" @change="radioChangeDefault($event,lable.key)"></a-checkbox>

                        </a-col>
                        <a-col :sm="5" :xs="24" v-if="questionRecord?.questionnaireCustomField?.scoreTypeId==332">
                            <div class="form-group">
                                <a-form-item :label="$t('questionnaire.program')" :name="['lable', index, 'program']" :rules="[{ required: true, message: $t('questionnaire.program') +' '+$t('global.validation') }]">

                                    <ArrayDataSearch v-if="programList" v-model:value="lable.program" :globalCode="programList" @change="checkChangeInput(); programChange($event,lable.key,programList);" mode="multiple" :max-tag-count="2" :maxTagTextLength="3" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :span="2" v-for="(programScores,i) in questionnaire.programId[lable.key]" :key="i">

                            <a-tooltip>
                                <template #title>
                                    <span>{{(arrayToObjact(programList, programScores))?.name}}</span>
                                </template>

                                <div class="form-group">

                                    <a-form-item name="programScores" :rules="[{ required: false, message: $t('questionnaire.question') +' '+$t('global.validation') }]">

                                        <label class="customRequired">{{(arrayToObjact(programList, programScores))?.name.length>3 ?(arrayToObjact(programList, programScores))?.name.substring(0,5)+'...' : (arrayToObjact(programList, programScores))?.name}}</label>
                                        <a-input-number style="width: 100%" size="large" :min="0" v-model:value="questionnaire.programScore[(lable.key+''+programScores)]" :placeholder="(arrayToObjact(programList, programScores))?.name +' Score'" @change="checkChangeInput();lableScoreGet($event,(lable.key+''+programScores))" />
                                        <ErrorMessage v-if="questionnaire.programScore[(lable.key+''+programScores)]==''" :name="questionnaireErrorMsg ? questionnaireErrorMsg[lable.key+''+programScores] :''" />

                                    </a-form-item>
                                </div>
                            </a-tooltip>
                        </a-col>

                        <a-col span="2">
                            <div class="actionBtn">
                                <a class="icons">
                                    <DeleteOutlined v-if="questionnaire.lable.length > 1" :disabled="questionnaire.lable.length === 1" @click="removeLable(lable)" />
                                </a>
                                <a class="icons" v-if="index==(questionnaire.lable.length-1)">
                                    <PlusOutlined @click="addLable" />
                                </a>
                            </div>
                        </a-col>
                    </a-row>

                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="6" v-if="questionRecord?.dataTypeId==242">
                    <div class="form-group" v-if="questionRecord?.questionnaireCustomField?.scoreTypeId==333 || questionRecord?.questionnaireCustomField?.scoreTypeId==332">
                        <label>Correct Value</label>
                        <a-input-number style="width: 100%" size="large" :min="0" @change="checkChangeInput()" v-model:value="questionnaire.correctAnwer" />
                    </div>
                </a-col>
                <a-col :span="6" v-if="questionRecord?.dataTypeId==242">

                    <div class="form-group" v-if="questionRecord.questionnaireCustomField.scoreTypeId==333 || questionRecord?.questionnaireCustomField?.scoreTypeId==332">

                        <label>Correct Value Score</label>
                        <a-input-number :min="0" v-model:value="questionnaire.correctScore" placeholder="Score" style="width: 100%" size="large" />

                    </div>
                </a-col>
                <a-col :span="6" v-if="questionRecord?.dataTypeId==242">

                    <div class="form-group" v-if="questionRecord?.questionnaireCustomField?.scoreTypeId==333 || questionRecord?.questionnaireCustomField?.scoreTypeId==332">

                        <label>Incorrect Value Score</label>
                        <a-input-number :min="0" v-model:value="questionnaire.incorrectScore" placeholder="Score" style="width: 100%" size="large" />

                    </div>
                </a-col>
            </a-row>
            <a-row>

            </a-row>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,46,'id','name'),'name','udid')"> </FormBaseComponents>

            <a-col :span="24">

                <FormButtons @onCancel="closeModal" :disabled="oneTimeSubmit" :submitButton="update ? $t('global.update') : $t('global.save')" />

            </a-col>

        </div>

    </a-form>
    <CommonLoader v-if="loader" />
</a-modal>
</template>
<script>
import { ref, reactive, onMounted, computed, watchEffect } from "vue";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { warningSwal, arrayToObjact, arrayToObjectData, formTitleNames } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import { useStore } from "vuex";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch.vue";
import FormButtons from "@/components/common/button/FormButtons";
import CommonLoader from "@/components/loader/CommonLoader";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  name: "Add Questionnaire",
  emits: ["is-visible"],
  components: {
    PlusOutlined,
    DeleteOutlined,
    // GlobalCodeDropDown,
    ErrorMessage,
    ArrayDataSearch,
    FormButtons,
    CommonLoader,
    FormBaseComponents
  },
  props: {
    questionId: String,
    option: Object,
    name: String,
    update: String,
    question: String,
    questionRecord: Object,
    urlAction: Object,
    parentQuestion: Object,
    editType: String,
    tempOrSecId: String,
    templateRecord: Object,
    nestedOptionId: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const formRef = ref();
    const value = ref("1");
    const value2 = ref("1");
    const loader = ref(false);
    const oneTimeRefresh = ref(false);
    const oneTimeSubmit = ref(false);
    const questionnaire = reactive({
      default: [],
      answer: [],
      lable: [],
      // labelScore: [],
      programId: [],
      programScore: [],
      tags: [],
      optionAction: [],
      correctScore: "",
      incorrectScore: "",
      correctAnwer: "",
      questionnaireCustomField: {
        scoreTypeId: "",
      },
    });
    const form = reactive({
      ...questionnaire,
    });
    const defaultSelect = ref([]);
    const currectSelect = ref([]);
    const disabeldOptions = ref([]);
    const optionUdid = ref([]);
    onMounted(() => {
      store.dispatch("programList");

      if (
        (props.questionRecord.dataTypeId == 244 ||
          props.questionRecord.dataTypeId == 243) &&
        !props.update
      ) {
        addLable();
      } else {
        if (
          props.questionRecord.dataTypeId == 242 &&
          props.questionRecord?.questionnaireCustomField?.scoreTypeId == "333"
        ) {
          questionnaire.correctAnwer = props.questionRecord
            ?.questionnaireCustomField?.correctAnwer
            ? parseInt(
              props.questionRecord?.questionnaireCustomField?.correctAnwer
            )
            : "";
          questionnaire.correctScore = props.questionRecord
            ?.questionnaireCustomField?.correctScore
            ? parseInt(
              props.questionRecord?.questionnaireCustomField?.correctScore
            )
            : "";
          questionnaire.incorrectScore = props.questionRecord
            ?.questionnaireCustomField?.incorrectScore
            ? parseInt(
              props.questionRecord?.questionnaireCustomField?.incorrectScore
            )
            : "";
        }
      }

      if (props.questionRecord) {
        props.questionRecord.options.length > 0
          ? (questionnaire.lable = [])
          : "";

        loader.value = true;
        setTimeout(() => {
          questionnaire.default = [];
          questionnaire.answer = [];
          //
          //questionnaire.labelScore = [];

          props.questionRecord.options.map((item) => {
            setTimeout(() => {
              let date = Date.now();
              optionUdid.value[date] = item.id;
              if (!props.update) {
                disabeldOptions.value[date] = true;
              } else {
                disabeldOptions.value[date] = false;
              }

              if (props.questionRecord.dataTypeId == 243) {
                if (item.defaultOption == 1) {
                  questionnaire.default = date;
                  defaultSelect.value[date] = true;
                } else {
                  defaultSelect.value[date] = false;
                }

                if (item.answer == 1) {
                  questionnaire.answer = date;
                  currectSelect.value[date] = true;
                } else {
                  currectSelect.value[date] = false;
                }
              } else if (props.questionRecord.dataTypeId == 244) {
                if (item.defaultOption == 1) {
                  questionnaire.default.push(date);
                  defaultSelect.value[date] = true;
                } else {
                  defaultSelect.value[date] = false;
                }
                if (item.answer == 1) {
                  questionnaire.answer.push(date);
                  currectSelect.value[date] = true;
                } else {
                  currectSelect.value[date] = false;
                }
              }

              let programs = [];

              item.program.map((record) => {
                programs.push(record.programId);

                questionnaire.programScore[date + "" + record.programId] =
                  record.score;
              });
              questionnaire.lable.push({
                value: item.option,
                labelScore: item?.score?.score,
                program: programs,
                key: date,
              });

              questionnaire.programId[date] = programs;
            }, 100);
          });
          loader.value = false;
        }, 100);
      }
    });

    const globalData = store.getters.singleGlobalCode;
    watchEffect(() => { });

    function programChange(val, index, programList) {
      if (val != undefined) {
        questionnaire.programId[index] = val;
        programList.forEach((data) => {
          var test = questionnaire.programId[index].find(
            (item) => data.id == item
          );
          if (test == "undefined") {
            questionnaire.programScore[index + "" + data.id]
              ? (questionnaire.programScore[index + "" + data.id] = "")
              : "";
          }
        });
      }
    }

    function addLable() {
      questionnaire.lable.push({
        value: "",
        labelScore: "",
        program: [],
        key: Date.now(),
      });
    }
    const questionnaireErrorMsg = computed(() => {
      return store.state.questionnaire.questionnaireErrorMsg;
    });
    const addQuestionnaire = () => {
      store.state.questionnaire.questionnaireErrorMsg = [];
      let validation = false;
      oneTimeSubmit.value = true;
      let data = "";

      if (
        props.questionRecord.dataTypeId == 243 ||
        props.questionRecord.dataTypeId == 244
      ) {
        let lable = [];

        questionnaire.lable.forEach((element) => {
          let programScores = [];

          questionnaire.programId[element.key]
            ? questionnaire.programId[element.key].forEach((items) => {
              if (!questionnaire.programScore[element.key + "" + items]) {
                validation = true;
                store.state.questionnaire.questionnaireErrorMsg[
                  element.key + "" + items
                ] = "Please Fill Score";
              }

              programScores.push({
                programId: items,
                programScore: questionnaire.programScore[
                  element.key + "" + items
                ]
                  ? questionnaire.programScore[element.key + "" + items]
                  : null,
              });
            })
            : "";
          let answer = "";
          let defaultChacked = "";
          if (props.questionRecord.dataTypeId == 243) {
            defaultChacked = questionnaire.default == element.key ? 1 : -1;
            answer = questionnaire.answer == element.key ? 1 : -1;
          } else {
            defaultChacked = questionnaire.default.indexOf(element.key);
            answer = questionnaire.answer.indexOf(element.key);
          }

          let optionId = optionUdid.value.indexOf(element.key);

          let object = {
            id: optionId ? optionUdid.value[element.key] : "",
            dataTypeId: props.questionRecord.dataTypeId,
            labelName: element.value,
            program: programScores,
            labelScore: element.labelScore,
            defaultOption: defaultChacked == -1 ? 0 : 1,
            answer: answer == -1 ? 0 : 1,

          };

          lable.push(object);
        });

        data = {
          optionId: props.nestedOptionId,
          sectionId: props.tempOrSecId,
          templateId: props.templateRecord?.id,
          editType: props?.editType == "template" ? "templateOption" : "questionBankOption",
          parentId: props.parentQuestion?.id,
          //parentObject: props.parentQuestion,
          dataTypeId: props.questionRecord.dataTypeId,
          option: lable,

        };
      } else {
        if (
          props.questionRecord.dataTypeId == 242 &&
          props.questionRecord.questionnaireCustomField.scoreTypeId == "333"
        ) {
          data = {
            optionId: props.nestedOptionId,
            sectionId: props.tempOrSecId,
            templateId: props.templateRecord?.id,
            editType: props?.editType == "template" ? "templateOption" : "questionBankOption",
            parentId: props.parentQuestion?.id,
            //parentObject: props.parentQuestion,
            question: props.questionRecord.question,
            dataTypeId: props.questionRecord.dataTypeId,
            tags: props.questionRecord.tags,
            duration: null,
            questionType: props.questionRecord.questionType,

            questionnaireCustomField: {
              scoreTypeId:
                props.questionRecord.questionnaireCustomField.scoreTypeId,
              correctScore: questionnaire.correctScore,
              incorrectScore: questionnaire.incorrectScore,
              correctAnwer: questionnaire.correctAnwer,
            },
          };
        } else {
          data = {
            optionId: props.nestedOptionId,
            sectionId: props.tempOrSecId,
            templateId: props.templateRecord?.id,
            editType: props?.editType == "template" ? "templateOption" : "questionBankOption",
            parentId: props.parentQuestion?.id,

            // parentObject: props.parentQuestion,
            dataTypeId: props.questionRecord.dataTypeId,
          };
        }
      }

      if (!validation) {
        if (
          props.questionRecord.dataTypeId == 242 &&
          props.questionRecord.questionnaireCustomField.scoreTypeId == "333"
        ) {
          store
            .dispatch("updateQuestionnaire", {
              data: data,
              id: props.questionRecord.id,
            })
            .then(() => {
              store.dispatch(
                props.urlAction.endPoint,
                props.urlAction.param ? props.urlAction.param : ""
              );
              oneTimeSubmit.value = false;
              emit("is-visible", {
                show: false,
                item: props.questionRecord,
              });
              reset();
            });
        } else {
          store
            .dispatch("addOptions", {
              id: props.questionRecord.id,
              data: data,
              method: "put"
            })
            .then(() => {
              store.dispatch(
                props.urlAction.endPoint,
                props.urlAction.param ? props.urlAction.param : ""
              );
              oneTimeSubmit.value = false;
              emit("is-visible", {
                show: false,
                item: props.questionRecord,
              });
              reset();
            });
        }
      } else {
        oneTimeSubmit.value = false;
      }
    };

    const removeLable = (item) => {
      let optionId = optionUdid.value[item.key];

      let index = questionnaire.lable.indexOf(item);
      if (optionId) {
        let optionRecord = props.questionRecord.options.find(
          (item) => item.id == optionId
        );
        let message = messages.deleteWarning;
        if (optionRecord.question.length > 0) {
          message = messages.deleteNestedWarning;
        }
        warningSwal(message).then((response) => {
          if (response == true) {
            store.dispatch("commonAction", {
              show: false,
              method: "delete",
              data: null,
              id: null,
              commit: "singleGlobalCode",
              endPoint:
                "question/options/" +
                optionId +
                "?questionId=" +
                props.questionRecord.id,
            });
            if (index !== -1) {
              questionnaire.lable.splice(index, 1);
            }
          }
        });
      } else {
        if (index !== -1) {
          questionnaire.lable.splice(index, 1);
        }
      }
    };

    const checkChangeInput = () => {
      store.commit("checkChangeInput", true);
    };

    function checkboxChangeDefault(event) {
      if (event.target.checked) {
        questionnaire.default.push(event.target.value);
        defaultSelect.value[event.target.value] = true;
      } else {
        defaultSelect.value[event.target.value] = false;
        let index = questionnaire.default.indexOf(event.target.value);
        questionnaire.default.splice(index, 1);
      }
    }

    function radioChange(event) {
      questionnaire.answer = [];
      currectSelect.value = [];
      if (event.target.checked) {
        questionnaire.answer = event.target.value;
        currectSelect.value[event.target.value] = true;
      } else {
        currectSelect.value[event.target.value] = false;
      }
    }

    function radioChangeDefault(event) {
      //alert(event.target.value)
      questionnaire.default = [];
      defaultSelect.value = [];
      if (event.target.checked) {
        questionnaire.default = event.target.value;
        defaultSelect.value[event.target.value] = true;
      } else {
        defaultSelect.value[event.target.value] = false;
      }
    }

    function checkboxChange(event) {
      if (event.target.checked) {
        questionnaire.answer.push(event.target.value);
        currectSelect.value[event.target.value] = true;
      } else {
        let index = questionnaire.answer.indexOf(event.target.value);
        questionnaire.answer.splice(index, 1);
        currectSelect.value[event.target.value] = false;
      }
    }

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    function reset() {
      Object.assign(questionnaire, form);
      questionnaire.programId = [];
      questionnaire.programScore = [];

      store.state.questionnaire.detailsQuestionnaire = "";
      store.state.common.checkChangeInput = "";
      oneTimeSubmit.value = false;
      oneTimeRefresh.value = true;
      setTimeout(() => {
        oneTimeRefresh.value = false;
      }, 100);
      questionnaire.lable = [];
    }

    function closeModal() {
      if (checkFieldsData.value) {
        emit("is-visible", {
          show: true,

          item: props.questionRecord,
        });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("is-visible", {
              show: false,
              item: props.questionRecord,
            });
            reset();
            store.commit("checkChangeInput", false);
          } else {
            emit("is-visible", {
              show: true,
              item: props.questionRecord,
            });
          }
        });
      } else {
        reset();
        //formRef.value.resetFields();
        emit("is-visible", {
          show: false,
          item: props.questionRecord,
        });
      }
    }
    const handleGlobalChange = (data, type, key = null) => {
      if (type == "questionnaire.scoreTypeId") {
        questionnaire.lable = [];
        questionnaire.programScore = [];
        questionnaire.programId = [];
        questionnaire.programScore = [];
        questionnaire.questionnaireCustomField.scoreTypeId = data;
        store.dispatch("commonAction", {
          show: false,
          method: "get",
          data: null,
          id: null,
          commit: "singleGlobalCode",
          endPoint: "questionnaire/dataType/58?globalCodeId=" + data,
        });
        // if (questionnaire.dataTypeId == 243 || questionnaire.dataTypeId == 244) {
        //     questionnaire.lable.push({
        //         value: "",
        //         key: Date.now(),
        //     });
        // }
      } else if (type == "questionnaire.action") {
        questionnaire.optionAction[key] = data;
      }
    };

    const lableScoreGet = (event, item) => {
      if (!event?.data) {
        //store.state.questionnaire.questionnaireErrorMsg=[]
        store.state.questionnaire.questionnaireErrorMsg[item] =
          "Please Fill Score";
      }
    };
    return {
      handleGlobalChange,
      questionnaire,
      programChange,
      size: ref("large"),

      addLable,
      //questionType,
      addQuestionnaire,
      removeLable,

      formRef,
      value,
      value2,
      closeModal,
      programList: store.getters.programList,
      checkChangeInput,
      arrayToObjact,
      checkboxChange,
      checkboxChangeDefault,
      radioChange,
      radioChangeDefault,
      reset,
      questionnaireErrorMsg,
      oneTimeRefresh,
      globalData,
      loader,
      oneTimeSubmit,
      defaultSelect,
      currectSelect,
      disabeldOptions,
      lableScoreGet,
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

.questionnaireMain {
  .actionBtn {
    padding-top: 38px;

    .anticon {
      font-size: 22px;

      svg {
        font-size: 22px;
      }
    }
  }
}
</style>


