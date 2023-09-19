<template>
<div v-if="optionList.dataTypeId==244 || optionList.dataTypeId==243 && scoreType" class="templateAnswere">
    <div class="defaultCorrect" v-if="questionRecord && !scoreType.questionnaireTypeId && optionList.options.length>0">
        <span class="options options-60">Option</span>
        <span class="checkBoxTitle">Default </span>
        <span class="checkBoxTitle">Correct</span>
        <span class="program" v-if="parseInt(questionRecord.questionnaireCustomField.scoreTypeId)==332 || parseInt(scoreType?.scoreTypeId)==332">Program</span>
        <span class="score" v-if="parseInt(questionRecord.questionnaireCustomField.scoreTypeId)!=339 || parseInt(scoreType?.scoreTypeId)!=339">Score</span>
    </div>
    <div class="defaultCorrect" v-else-if="scoreType?.questionnaireTypeId && optionList?.options.length>0">
        <span class="options options-60">Option</span>
        <span class="checkBoxTitle">Default </span>
        <span class="checkBoxTitle" v-if="parseInt(scoreType?.questionnaireTypeId)==338">Correct</span>
        <span class="program" v-if="parseInt(questionRecord?.questionnaireCustomField?.scoreTypeId)==332 || parseInt(scoreType?.scoreTypeId)==332">Program</span>
        <span class="score" v-if="parseInt(questionRecord?.questionnaireCustomField?.scoreTypeId)!=339 || parseInt(scoreType?.scoreTypeId)!=339">Score</span>
    </div>
    <div class="defaultCorrect" v-else>
        <span class="options options-60" v-if="optionList?.options?.length>0">Option</span>
        <span class="checkBoxTitle" v-if="optionList?.options?.length>0">Default </span>
        <span class="checkBoxTitle" v-if="optionList?.options?.length>0">Correct</span>
        <span class="program" v-if="parseInt(questionRecord?.questionnaireCustomField?.scoreTypeId)==332 && optionList?.options?.length>0">Program</span>
        <span class="score" v-if="parseInt(questionRecord?.questionnaireCustomField?.scoreTypeId)!=339 && optionList?.options?.length>0">Score</span>
    </div>
    <div v-for="(options,index) in optionList.options" :key="index" class="questionOutputItem">
        <div class="questionOutput">
            <div :class="parseInt(scoreType.questionnaireTypeId)==337 || parseInt(questionRecord.questionnaireCustomField.scoreTypeId)==339 ? 'options-60' :parseInt(questionRecord.questionnaireCustomField.scoreTypeId)==332 ? 'options-60' :  'options-60'">
                <a-tooltip placement="topLeft">
                    <template #title>
                        <span>Option</span>
                    </template>
                    <strong>{{ options.option}}</strong></a-tooltip>
            </div>
            <a-tooltip placement="topLeft" v-if="optionList.dataTypeId==244">
                <template #title>
                    <span>Default</span>
                </template>
                <a-checkbox :checked="returnFunction(options.defaultOption)" @click="changeCheckBox" disabled>
                </a-checkbox>
            </a-tooltip>
            <a-tooltip placement="topLeft" v-else>
                <template #title>
                    <span>Default</span>
                </template>
                <a-radio-group v-model:value="options.id" @click="changeCheckBox">
                    <a-radio :value="options.defaultOption==1 ? options.id : ''" disabled></a-radio>
                </a-radio-group>
            </a-tooltip>
            <a-tooltip class="" placement="topLeft" v-if="optionList.dataTypeId==244 &&  parseInt(scoreType.questionnaireTypeId)!=337">
                <template #title>
                    <span>Correct</span>
                </template>
                <a-checkbox :checked="returnFunction(options.answer)" disabled>
                </a-checkbox>
            </a-tooltip>
            <a-tooltip placement="topLeft" v-else-if="parseInt(scoreType.questionnaireTypeId)!=337">
                <template #title>
                    <span>Correct</span>
                </template>
                <a-radio-group v-model:value="options.id" @click="changeCheckBox">
                    <a-radio :value="options.answer==1 ? options.id : ''" disabled></a-radio>
                </a-radio-group>
            </a-tooltip>
            <div class="program" v-if="parseInt(questionRecord.questionnaireCustomField.scoreTypeId)==332 || parseInt(scoreType?.scoreTypeId)==332">
                <div v-for="(program,i) in options.program" :key="i">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{program.program}}</span>
                        </template>
                        {{program.program.length>3 ?program.program.substring(0,5)+'...' : program.program}}
                    </a-tooltip>
                </div>
            </div>
            <div class="score" v-if="parseInt(questionRecord.questionnaireCustomField.scoreTypeId)==332 || parseInt(scoreType?.scoreTypeId)==332">
                <div v-for="(program,i) in options.program" :key="i">
                    <a-tooltip placement="topLeft">
                        <template #title>
                            <span>Program Score</span>
                        </template>
                        <div>{{program.score? program.score : 0}}</div>
                    </a-tooltip>
                </div>
            </div>
            <div class="score" v-if="parseInt(questionRecord.questionnaireCustomField.scoreTypeId)==333">
                <a-tooltip placement="topLeft">
                    <template #title>
                        <span>Score</span>
                    </template>{{options.score ? options.score.score: ''}}</a-tooltip>
            </div>
            <div>
                <!-- searchQuestion is only for search question screen  -->
                <span class="actionButton" v-if="!searchQuestion && questionRecord?.questionTypeId==353">
                    <a-tooltip placement="topLeft">
                        <template #title>
                            <span>Add Question</span>
                        </template>
                        <a class="icons pluse" @click="nested({show:true,id:options?.id})" v-if="questionRecord?.questionTypeId==353">
                            <PlusOutlined class="pluse" style="margin: auto;" /></a>
                    </a-tooltip>
                    <!-- <a-tooltip placement="topLeft">
                        <template #title>
                            <span>Delete Option</span>
                        </template>
                        <a class="icons" @click="deleteOption(options.id)">
                            <DeleteOutlined style="margin: auto;" /></a>
                    </a-tooltip> -->
                </span>
            </div>
            <Question :scoreType="scoreType" :question="options.question" v-if="options?.question?.length>0"  type="question"  @delete="deleteQuestion($event)" :searchQuestion="searchQuestion" :nested="true" :urlAction="urlAction" :scoreTypeAction="scoreTypeAction" :temOrSection="temOrSection" :templateRecord="templateRecord" :nestedIndex="nestedIndex" :templateData="templateData" :parentQuestion="parentQuestion ? parentQuestion : questionRecord" :optionSetting="optionSetting" :clone="clone" :deleteShow="deleteShow" :edit="edit" :editType="editType" :tempOrSecId="tempOrSecId" :nestedOptionId="options.id"/>
        </div>
    </div>
</div>
<div v-else-if="optionList?.dataTypeId==242  && questionRecord?.questionnaireCustomField?.scoreTypeId==333">

    <div v-if="questionRecord?.questionnaireCustomField?.scoreTypeId==333">
        <p>Correct answer : {{questionRecord?.questionnaireCustomField.correctAnwer ?  questionRecord?.questionnaireCustomField.correctAnwer : 0}}</p>
        <p> Correct answer score : {{questionRecord?.questionnaireCustomField.correctScore ? questionRecord?.questionnaireCustomField.correctScore : 0}}</p>
        <p> Incorrect answer score : {{questionRecord?.questionnaireCustomField.incorrectScore ? questionRecord?.questionnaireCustomField.incorrectScore :0}} </p>
    </div>
</div>

<div v-else>
    <a-input-number v-if="questionRecord?.dataTypeId==242" style="width: 100%" size="large" :min="0" disabled placeholder="Please enter number" />
    <a-input v-if="questionRecord?.dataTypeId==241" placeholder="Please enter text" style="width: 100%" size="large" disabled />
</div>
<AddQuestionnaire v-model:visible="visible" @is-visible="nested($event)" v-if="visible" :optionId="optionId" :questionRecord="questionRecord" :nested="true" :temOrSection="temOrSection" :templateRecord="templateRecord" :scoreTypeAction="scoreTypeAction" :parentQuestion="parentQuestion ? parentQuestion : questionRecord" :editType="editType" :tempOrSecId="tempOrSecId"/>
<AddOption v-model:visible="optionVisible" @is-visible="editClick($event)" v-if="optionVisible" :questionRecord="questionRecord" :urlAction="urlAction" :update="true" :option="optionId" :parentQuestion="parentQuestion ? parentQuestion : questionRecord" :editType="editType" :temOrSection="temOrSection" :tempOrSecId="tempOrSecId" :templateRecord="templateRecord"/>
</template>
<script>
import { defineAsyncComponent, defineComponent, ref, reactive } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { messages } from "@/config/messages";
import { warningSwal } from "@/commonMethods/commonMethod";
import { useStore } from "vuex";
export default defineComponent({
  name: "Question Options",
  components: {
    //DeleteOutlined,
    PlusOutlined,

    //DeleteOutlined,
    //EditOutlined,
    AddOption: defineAsyncComponent(() =>
      import("@/components/administration/questionnaire-bank/modals/AddOption")
    ),
    Question: defineAsyncComponent(() =>
      import("@/components/administration/questionnaire-bank/common/Question")
    ),
    AddQuestionnaire: defineAsyncComponent(() =>
      import(
        "@/components/administration/questionnaire-bank/modals/AddQuestionnaire"
      )
    ),
  },
  props: {
    optionList: Object,
    scoreType: Object,
    questionRecord: Object,
    type: String,
    searchQuestion: Boolean,
    urlAction: Object,
    scoreTypeAction: Number,
    temOrSection: String,
    templateRecord: Object,
    nestedIndex: Number,
    templateData: Object,
    parentQuestion:Object,
    clone: Boolean,
    deleteShow: Boolean,
    optionSetting:Boolean,
    edit:Boolean,
    editType:String,
    tempOrSecId:String
  },
  setup(props) {
    const value = ref("");
    const value2 = ref("");
    const store = useStore();
    const questionnaire = reactive({
      lable: [],
      labelScore: [],
    });
    const optionId = ref("");

    questionnaire.lable.push({
      value: "",
      key: Date.now(),
    });

    function returnFunction(value) {
      return value == 1 ? true : false;
    }
    const visible = ref(false);

    function nested(id) {
      optionId.value = id.id;
      visible.value = id.show;
    }
    const optionVisible = ref(false);

    const editClick = (event) => {
      optionId.value = event.id;
      optionVisible.value = event.show;
    };
    const deleteOption = (event) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          store
            .dispatch("commonAction", {
              show: false,
              method: "delete",
              data: null,
              id: null,
              commit: "singleGlobalCode",
              endPoint:
                "question/options/" +
                event +
                "?questionId=" +
                props.questionRecord.id,
            })
            .then(() => {
              if (props.scoreTypeAction) {
                store.dispatch(
                  "questionnaireList",
                  "scoreTypeId=" + props.scoreTypeAction
                );
              } else {
                store.dispatch(
                  props.urlAction.endPoint,
                  props.urlAction.param ? props.urlAction.param : ""
                );
              }
            });
        }
      });
    };
    const changeCheckBox = () => {
    };
    return {
      value,
      value2,
      returnFunction,
      questionnaire,
      nested,
      visible,
      optionId,
      editClick,
      deleteOption,
      optionVisible,
      changeCheckBox,
    };
  },
});
</script>

<style lang="scss">
.questionOutputItem {
  position: relative;
  padding: 0 0 20px;
  .ant-collapse {
    .ant-collapse {
      .ant-collapse-item {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: -12px;
          top: 23px;
          width: 20px;
          background: #999;
          height: 1px;
        }
      }
    }
  }
  &:last-child {
    padding: 0;
  }

  &::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 26px;
    bottom: 4px;
    background-color: #999;
    width: 1px;
  }
}

.addQuestionAddition {
  .form-group {
    .ant-row {
      display: block;

      .ant-form-item-label > label {
        margin: 0 !important;
        height: 30px;
      }
    }
  }
}
.options {
  width: 20%;
}
.templateAnswere {
  .program {
    width: 10%;
  }

  .score {
    width: 5%;
    text-align: center;
  }

  .defaultCorrect {
    display: flex;
    align-items: flex-start;
    margin: 0 0 5px;

    .checkBoxTitle {
      width: 5%;
      text-align: center;
    }

    span {
      font-weight: 600;
    }
  }

  .questionOutput {
    .ant-radio-group {
      width: 5%;
      margin: 0;
      text-align: center;
    }
    .options-70 {
      min-width: 5%;
      max-width: 15%;
    }
    .ant-checkbox-wrapper {
      width: 5%;
      margin: 0 50px 0 0;
    }

    .options-80 {
      width: 80%;
    }

    .options-60 {
      width: 20%;
    }

    .options-40 {
      width: 40%;
    }

    .actionButton {
      display: inline-flex;
      gap: 10px;
      margin: -3px 0 0 15px;
    }
  }
}
</style>
