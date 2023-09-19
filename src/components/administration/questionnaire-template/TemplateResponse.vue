<template>
<div v-if="clientResponse && !responseSubmit">
    <div class="logo" v-if="!fromCustomFrom">
        <img src="@/assets/images/logo/logo-big.svg" alt="image" />
    </div>
    <h2 class="pageTittle">{{ clientResponse?.questionnaire_template?.templateName}}</h2>
    <div class="templateType" v-if="!fromCustomFrom">
        <div>User Type : <span> {{userTypeId==246 ? 'Staff' : 'Patient'}}</span></div>
        <div>{{userTypeId==246 ? 'Staff ' : 'Patient '}} Name : <span> {{userDetails?.name }}</span></div>
        <div>Template Type : <span> {{clientResponse?.templateType}}</span></div>
    </div>
    <a-form ref="formRef" :model="questionnaireTemplate" layout="vertical" @finish="ansTemplate" @finishFailed="onFinishFailed" v-if="clientResponse?.assignSection?.length>0 && parseInt(clientResponse?.questionnaireCustomField?.responseShow)==1">
        <div class="template" v-for="questionList,index in clientResponse?.assignSection" :key="index">
            <!-- <div v-if="questionList.entityType=='question'">
    
                    <div>
                        <a-typography-title :level="5">{{questionList.question.question}}</a-typography-title>
                        <div class="templateInner">
                            <div v-if="questionList.question.dataTypeId==243">
                                <a-radio-group v-if="questionList.question.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.question.id]">
                                    <a-col :span="24" v-for="(options,index) in questionList.question.options" :key="index">
                                        <div class="questionOutput">
                                            <div class="numbers">{{index+1}}.</div>
                                            <a-radio v-model:value="options.id"></a-radio>
                                            <div class="ml-10 ">
                                                <p>{{ options.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-radio-group>
                            </div>
                            <div v-else-if="questionList.question.dataTypeId==244">
                                <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.question.id]">
                                    <a-col :span="24" v-for="(options,index) in questionList.question.options" :key="index">
                                        <div class="questionOutput">
                                            <div>{{index+1}}.</div>
                                            <a-checkbox class="ml-10 " v-model:checked="options.defaultOption" v-model:value="options.id">
                                            </a-checkbox>
                                            <div class="ml-10 ">
                                                <p>{{ options.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-checkbox-group>
                            </div>
                            <div v-else>
                                <a-col :span="24">
    
                                    <div class="form-group">
                                        <a-form-item name="templateName">
                                            <a-textarea v-model:value="questionnaireTemplate.templateText[questionList.question.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" />
                                            <ErrorMessage v-if="errorMsg" :name="errorMsg.templateText?errorMsg.templateText[0]:''" />
                                        </a-form-item>
    
                                    </div>
                                </a-col>
                            </div>
                        </div>
                    </div>
                </div> -->
            <div class="healthTemplateBox">
                <h4 v-if="questionList"> {{questionList.sectionName}}</h4>
                <div v-if="questionList.questions.length>0">
                    <div v-for="record,index in questionList.questions" :key="index" class="questionTemplatesItems">
                        <a-typography-title :level="5">{{ record.question }}</a-typography-title>
                        <div class="templateInner">
                            <div v-if="record.dataTypeId==243">
                                <a-radio-group v-if="record.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.sectionId+''+record.id]" @change="inputChange">
                                    <a-col :span="24" v-for="option,optionIndex in record.options" :key="optionIndex">
                                        <div class="questionOutput">
                                            <a-radio v-model:value="option.id" @click="nextQuestion(option.id,record,questionList,'parent')"></a-radio>
                                            <div class="ml-10 ">
                                                <p>{{ option.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-radio-group>
                            </div>
                            <div v-else-if="record.dataTypeId==244">
                                <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.sectionId+''+record.id]" @change="inputChange">
                                    <a-col :span="24" v-for="(option,index) in record.options" :key="index">
                                        <div class="questionOutput">
                                            <a-checkbox class="ml-10 " v-model:checked="option.defaultOption" v-model:value="option.id" @click="nextQuestion(option.id,record,questionList,'parent')">
                                            </a-checkbox>
                                            <div class="ml-10 ">
                                                <p>{{ option.option }}</p>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-checkbox-group>
                            </div>
                            <div v-else-if="record.dataTypeId==242">
                                <div class="form-group">
                                    <a-input-number v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.id]" placeholder="Enter number..." :bordered="false" width="100%" @change="inputChange"/>
                                </div>
                            </div>
                            <div v-else class="form-group">
                                <a-textarea v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" @change="inputChange"/>
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.templateText?errorMsg.templateText[0]:''" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div v-else>
                        <div v-for="record,index in questionList.questionSection" :key="index">
                            <a-typography-title :level="5">{{ index+1 +'. '+record.question }}</a-typography-title>
                            <div class="templateInner">
                                <div v-if="record.question.dataTypeId==243">
                                    <a-radio-group v-if="record.question.dataTypeId==243" v-model:value="questionnaireTemplate.radioOption[questionList.sectionId+''+record.question.id]">
                                        <a-col :span="24" v-for="(options,index) in record.question.options" :key="index">
                                            <div class="questionOutput">
                                                <a-radio v-model:value="options.id"></a-radio>
                                                <div class="ml-10 ">
                                                    <p>{{ options.option }}</p>
                                                </div>
                                            </div>
                                        </a-col>
                                    </a-radio-group>
                                </div>
                                <div v-else-if="record.question.dataTypeId==244">
                                    <a-checkbox-group v-model:value="questionnaireTemplate.checkBoxOption[questionList.sectionId+''+record.question.id]">
                                        <a-col :span="24" v-for="(options,index) in record.question.options" :key="index">
                                            <div class="questionOutput">
                                                <a-checkbox class="ml-10 " v-model:checked="options.defaultOption" v-model:value="options.id">
                                                </a-checkbox>
                                                <div class="ml-10 ">
                                                    <p>{{ options.option }}</p>
                                                </div>
                                            </div>
                                        </a-col>
                                    </a-checkbox-group>
                                </div>
                                <div v-else-if="record.question.dataTypeId==241">
                                    <a-col :span="24">
                                        <div class="form-group">
                                            <a-form-item name="templateName">
                                                <a-textarea v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.question.id]" placeholder="Enter Text..." :bordered="false" :rows="2" width="100%" />
                                                <ErrorMessage v-if="errorMsg" :name="errorMsg.templateText?errorMsg.templateText[0]:''" />
                                            </a-form-item>
                                        </div>
                                    </a-col>
                                </div>
                                <div v-else-if="record.question.dataTypeId==242">
                                    <a-col :span="24">
                                        <div class="form-group">
                                            <a-form-item name="templateName">
                                                <a-input-number v-model:value="questionnaireTemplate.templateText[questionList.sectionId+''+record.question.id]" placeholder="Enter number..." :bordered="false" :rows="2" width="100%" />
                                            </a-form-item>
                                        </div>
                                    </a-col>
                                </div>
                            </div>
                        </div>
                    </div> -->
            </div>
        </div>

        <a-col :span="24" v-if="clientResponse && (userDetails.id==userName.user.staffUdid || userDetails.id==userName.user.udid) && userTypeId==246">
            <div class="steps-action mt-28">
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.submit')}}</a-button>
                </a-form-item>
            </div>
        </a-col>
        <a-col :span="24" v-if="userTypeId==247">
            <div class="steps-action mt-28">
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button class="modal-button" type="primary" html-type="submit">{{$t('global.submit')}}</a-button>
                </a-form-item>
            </div>
        </a-col>
    </a-form>
    <div v-else>
        <h3>
            <p v-if="!responseSubmit"><span class="brightRedColor">*</span> {{clientResponse?.questionnaireCustomField?.responseMessage}}</p>
        </h3>
    </div>
    <QuestionnaireLoader />
</div>
<div class="" v-else-if="responseSubmit">
    <div>
        <h3 class="text-center">{{responseSubmit==true ? $t('questionnaire.thankYouMessage') : responseSubmit}} </h3>
        <div> <a v-if="parseInt(clientResponse?.questionnaireCustomField?.responseEdit)==1" @click="editResponse">Edit your response</a></div>
        <div> <a v-if="parseInt(clientResponse?.questionnaireCustomField?.limitResponse)==1" >Submit another response</a></div>
    </div>
</div>
<CommonLoader v-else />
</template>
<script>
import { defineComponent, ref, onMounted, reactive } from "vue";
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader";
import CommonLoader from "@/components/loader/CommonLoader";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

//import TemplateResponseFields from "@/components/administration/questionnaire-template/TemplateResponseFields"
export default defineComponent({
  emits: ["is-visible"],
  name: "Question Template Details",
  components: {
    QuestionnaireLoader,
    CommonLoader,
    //TemplateResponseFields
  },
  props: {
    templateId: String,
    //Use of custom form if true
    fromCustomFrom: Boolean,
    user: Object,
    questionForm: Boolean,
    userType: Number,
    dataObject:Object
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const userName = JSON.parse(localStorage.getItem("auth"));
    const userTypeId = props?.userType
      ? props.userType
      : decodeURIComponent(route?.query?.userType);

    const userDetails = props.user
      ? props.user
      : {
          id: decodeURIComponent(route.query.userId),
          name: decodeURIComponent(route.query.userName),
        };
    const questionnaireTemplate = reactive({
      templateText: [],
      radioOption: [],
      checkBoxOption: [],
    });
    // const from = reactive({
    //     ...questionnaireTemplate
    // })

    const responseSubmit = ref("");
    const udid = props.templateId ? props.templateId : route.params.udid;

    const show = ref(false);
    const clientResponse = props.fromCustomFrom
      ? ref(props.dataObject)
      : store.getters.clientResponse;
    onMounted(() => {
      if (!props.fromCustomFrom) {
        store.dispatch("clientResponse", udid).then(() => {
          if (clientResponse.value.status == "Completed") {
            responseSubmit.value =
              clientResponse.value?.questionnaireCustomField?.submitResponseMessage;
          }
          // if (userTypeId == 247) {
          //     store.dispatch("commonAction", {
          //         show: false,
          //         method: 'get',
          //         data: null,
          //         id: null,
          //         commit: 'fillBy',
          //         endPoint: 'questionnaire/custom/field?parameterKey=allowStaff&questionnaireId=' + udid
          //     })
          // }
          clientResponse.value
            ? clientResponse.value.assignSection.forEach((element) => {
                element.questions.map((records) => {
                  setTimeout(() => {
                    recursiveLoop(records, element);
                  });
                });
              })
            : "";
        });
      }
    });

    const recursiveLoop = async (records, element) => {
      if (records.dataTypeId == 243 || records.dataTypeId == 244) {
        let checkBox = [];
        questionnaireTemplate.templateText[
          element.sectionId + "" + records.id
        ] = "";
        questionnaireTemplate.radioOption[element.sectionId + "" + records.id] =
          "";

        questionnaireTemplate.checkBoxOption[
          element.sectionId + "" + records.id
        ] = [];
        if (records.answerFillUp && records.dataTypeId == 243) {
          questionnaireTemplate.radioOption[
            element.sectionId + "" + records.id
          ] = records.answerFillUp;
        } else if (records.answerFillUp && records.dataTypeId == 244) {
          checkBox = records.answerFillUp;
        }

        records.options
          ? records.options.map((item) => {
              if (
                item.defaultOption == 1 &&
                records.dataTypeId == 243 &&
                !records.answerFillUp
              ) {
                questionnaireTemplate.radioOption[
                  element.sectionId + "" + records.id
                ] = item.id;
              }
              if (
                item.defaultOption == 1 &&
                records.dataTypeId == 244 &&
                !records.answerFillUp
              ) {
                checkBox.push(item.id);
              }
              if (records.dataTypeId == 243) {
                if (
                  item.id == records.answerFillUp ||
                  (item.defaultOption == 1 && !records.answerFillUp)
                ) {
                  if (item.question.length > 0) {
                    var radioIndex = -1;
                    for (var k = 0; k < element.questions.length; k++) {
                      if (element.questions[k].id === records.id) {
                        radioIndex = k;
                        break;
                      }
                    }

                    item.question.map((item) => {
                      item.parentId = records.id;
                      radioIndex++;

                      element.questions.splice(radioIndex, 0, item);
                      recursiveLoop(item, element);
                      //break recursiveLoop(item, element);
                    });
                  }
                }
              } else if (records.dataTypeId == 244) {
                let checkBoxId = records.answerFillUp.find((answerData) => {
                  answerData == item.id;
                });
                if (
                  checkBoxId ||
                  (item.defaultOption == 1 && !records.answerFillUp)
                ) {
                  if (item.question.length) {
                    var index = -1;
                    for (var i = 0; i < element.questions.length; i++) {
                      if (element.questions[i].id === records.id) {
                        index = i;
                        break;
                      }
                    }

                    item.question.map((item) => {
                      item.parentId = records.id;
                      index++;

                      element.questions.splice(index, 0, item);

                      recursiveLoop(item, element);
                    });
                  }
                }
              }
            })
          : "";

        if (checkBox.length > 0) {
          questionnaireTemplate.checkBoxOption[
            element.sectionId + "" + records.id
          ] = checkBox;
        }
      } else {
        if (records.dataTypeId == 242) {
          questionnaireTemplate.templateText[
            element.sectionId + "" + records.id
          ] = records?.answerFillUp ? parseInt(records?.answerFillUp) : "";
        } else {
          questionnaireTemplate.templateText[
            element.sectionId + "" + records.id
          ] = records.answerFillUp;
        }
      }
    };

    const fillBy = store.getters.fillBy;
    const inputChange =() =>{
      if(props.fromCustomFrom){
        let data = submitData()
        emit("is-visible", data)
      }
        
    }
    const ansTemplate = () => {
      let data = submitData();
      
        show.value = false;
        store
          .dispatch("addAssignquestionnaireResponse", {
            data: data,
            id: udid,
            show: true,
          })
          .then(() => {
            if (props.templateId) {
              if (
                clientResponse.value.questionnaireCustomField
                  .submitResponseMessage
              ) {
                responseSubmit.value =
                  clientResponse.value.questionnaireCustomField.submitResponseMessage;
              } else {
                responseSubmit.value = true;
              }

              //reset()
              // emit("is-visible", {
              //     show: false,
              //     id: ''
              // })
              store.dispatch(
                "assignAllTemplates",
                "?referenceId=" + userDetails.id + "&entityType=" + userTypeId
              );
              store.dispatch(
                "questionnaireResponse",
                "?entityType=" +
                  userTypeId +
                  "&referenceId=" +
                  userDetails.id +
                  "&status=complete"
              );
            } else {
              router.push({
                path: "/questionnaireResponse",
              });
            }
          });
      
    };
    const templateDetailsList = store.getters.templateDetailsList;
  

    const editResponse = () => {
      responseSubmit.value = "";
    };
    const nextQuestion = (optionId, question, element, parentOrChild) => {
      let optionRecord = question.options.find((item) => item.id == optionId);
      var index = -1;
      for (var i = 0; i < element.questions.length; i++) {
        if (element.questions[i].id === question.id) {
          index = i;
          break;
        }
      }
      element.questions = element.questions.filter(
        (item) => item.parentId !== question.id
      );
      if (parentOrChild == "parent") {
        if(optionRecord?.question){
        optionRecord?.question.map((item) => {
          item.parentId = question.id;
          index++;

          element.questions.splice(index, 0, item);
          recursiveLoop(item, element);
        }) }
      }
      store.state.questionnaireTemplate.nestedQuestion = [];
      let data = submitData();
      store.dispatch("addAssignquestionnaireResponse", {
        data: data,
        id: udid,
        show: false,
      });
    };
    const submitData = () => {
      let data = [];
      
      clientResponse.value
        ? clientResponse.value.assignSection.forEach((element) => {
            let newRescord = "";
           
            element.questions.map((records) => {
              if (records.dataTypeId == 244) {
                newRescord = {
                  question: records.id,
                  dataType: records.dataTypeId,
                  answer: questionnaireTemplate.checkBoxOption[
                    element.sectionId + "" + records.id
                  ]
                    ? questionnaireTemplate.checkBoxOption[
                        element.sectionId + "" + records.id
                      ]
                    : [],
                  sectionId: element.sectionId,
                };
              } else if (records.dataTypeId == 243) {
                newRescord = {
                  question: records.id,
                  dataType: records.dataTypeId,
                  answer: questionnaireTemplate.radioOption[
                    element.sectionId + "" + records.id
                  ]
                    ? questionnaireTemplate.radioOption[
                        element.sectionId + "" + records.id
                      ]
                    : "",
                  sectionId: element.sectionId,
                };
              } else {
                newRescord = {
                  question: records.id,
                  dataType: records.dataTypeId,
                  answer: questionnaireTemplate.templateText[
                    element.sectionId + "" + records.id
                  ]
                    ? questionnaireTemplate.templateText[
                        element.sectionId + "" + records.id
                      ]
                    : "",
                  sectionId: element.sectionId,
                };
              }
              data.push(newRescord);
            });
          })
        : "";
      return data;
    };
    return {
      udid,
      questionnaireTemplate,
      templateDetailsList,
      ansTemplate,
      value: ref("1"),
      show,

      userName,
      clientResponse,
      fillBy,
      responseSubmit,
      editResponse,
      userTypeId,
      userDetails,
      nextQuestion,
      inputChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.pageTittle {
  text-align: center;
  background: #e3e3e3;
  padding: 15px 0;
  margin: 0;
}

.templateType {
  font-size: 18px;
  padding: 10px 0;
  color: #000;
  text-transform: capitalize;

  span {
    font-weight: 600;
  }
}

.template {
  margin: 15px 0 0;
  border: 1px solid #e3e3e3;
  padding: 15px;

  h4 {
    font-size: 22px;
    margin: 0 0 15px;
  }

  h5.ant-typography {
    margin: 0 0 5px;
  }

  .questionOutput {
    .numbers {
      width: 25px;
    }
  }
}

.questionTemplatesItems {
  margin: 0 0 10px;

  &:last-child {
    margin: 0;
  }

  .form-group {
    .ant-input-number {
      width: 100%;
    }
  }
}

.logo {
  width: 160px;
}
.text-center {
  text-align: center;
  vertical-align: middle;
  align-self: center !important;
  position: relative;
  top: 100px;
  font-size: 22px;
}
</style>
