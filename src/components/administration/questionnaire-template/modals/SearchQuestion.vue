
<template>
    <a-form ref="formRef" :model="assignQuestion" layout="vertical" @finish="addAssignQuestion">

        <div class="addQuestionBody">
        <a-row gutter="20">
            <a-col :span="20">
                <SearchField commit="allQuestionnaireListing" placeholder="Question Search...." v-model:value="questionName" endPoint="question" :otherParam="'&scoreTypeId='+questionType+'&limit=all'" />
            </a-col>
            <a-col :span="24">
                <a-checkbox v-model:checked="checked" @change="checkBox($event)" class="allCheck">All Check</a-checkbox>
            </a-col>
            <a-col :span="24">
                <div class="questionnaireMain checkBoxCollapse mt-28" v-if="questionnaireList.length>0">
                        <Question :searchQuestion="true" :assignQuestion="assignQuestion" :question="questionnaireList" v-if="questionnaireList.length>0" :nested="false" :edit="false" type="question" :deleteShow="false" @delete="deleteQuestion($event)" :urlAction="{endPoint:'questionnaireList',param:null}" @checkboxChange="checkboxChange($event)" />
                </div>
            </a-col>          
        </a-row>
        </div>
        <FormButtons v-if="questionnaireList.length>0" @onCancel="closeModal"  :submitButton="update ? $t('global.update') : $t('global.save')" />

    </a-form>
    <!-- <AddQuestionnaire v-model:visible="visible1" v-if="visible1" @is-visible="showModal($event)" :name="temOrSection=='section' ? sectionName  : sectionRecord.templateName" :tempOrSecId="sectionRecord.questionnaireSection.id" :templateRecord="templateRecord" temOrSection="section"  :question="questionName"/> -->

    <QuestionnaireLoader />

</template>
<script>
import { defineAsyncComponent, defineComponent, ref, onMounted, reactive, watchEffect, computed,} from "vue";
import { useStore } from "vuex";
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader";
import SearchField from "@/components/common/input/SearchField";
//import Option from "@/components/administration/questionnaire-bank/common/Options"
import FormButtons from "@/components/common/button/FormButtons";
import { warningSwal } from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import { API_ENDPOINTS } from '@/config/apiConfig';
export default defineComponent({
  emits: ["is-visible-exist"],
  components: {
    QuestionnaireLoader,
    // AddQuestionnaire: defineAsyncComponent(() => import("@/components/administration/questionnaire-bank/modals/AddQuestionnaire")),
    Question: defineAsyncComponent(() =>
      import("@/components/administration/questionnaire-bank/common/Question")
    ),
    SearchField,
    //Option,
    FormButtons,
  },
  props: {
    sectionRecord: Object,
    temOrSection: String,
    templateRecord: Object,
    sectionName: String,
    optionId: String,
    questoinRecord: Object,
    parentQuestion:Object,
    editType:String,
    tempOrSecId:String
  },

  setup(props, { emit }) {
    const store = useStore();

    const assignQuestion = reactive({
      questionId: [],
      checkBox: [],
    });
    // const form = reactive({
    //     ...assignQuestion
    // })
    const templateDetailsList = reactive(props.sectionRecord);
    const questionnaireList = store.getters.allQuestionnaireListing;
    const templateSectionDetailsList = store.getters.sectionDetailsList;
    const questionName = ref();
    const questionType = ref();
    const checked = ref(false);
    onMounted(() => {
      questionType.value = props.templateRecord
        ? props.templateRecord.questionnaireCustomField.scoreTypeId
        : props.questoinRecord?.questionnaireCustomField.scoreTypeId;
        store.commit("questionnaireLoadingStatus",true)
     store.dispatch("commonAction", {
          show: false,
          method: "get",
          data: null,
          id: null,
          commit: "allQuestionnaireListing",
          endPoint: API_ENDPOINTS['questionnaire']+"?scoreTypeId=" + questionType.value+'&limit=all',
        }).then(() => {
          if (props.temOrSection == "section") {
            store
              .dispatch(
                "templateSectionDetailsList",
                props.sectionRecord.questionnaireSection.id
              )
              .then(() => {
                selectRecords();
              });
          } else {
            selectRecords();
          }
        });
    });
    function selectRecords() {
      if (props.templateRecord && templateSectionDetailsList.value && !props.optionId) {
        assignQuestion.questionId = [];
        assignQuestion.checkBox = [];

         templateSectionDetailsList.value.questionSection.length > 0
           ? templateSectionDetailsList.value.questionSection.forEach(
              (element) => {
                var index = questionnaireList.value.find(
                  (a) => a.id === element.question.id
                );
                if (index) {
                  assignQuestion.checkBox[element.question.id] = true;
                  assignQuestion.questionId.push(element.question.id);
                }
                store.commit("questionnaireLoadingStatus",false)
              }
            )
          : store.commit("questionnaireLoadingStatus",false);
      } else if (props.optionId) {
        props.questoinRecord.options.map((items) => {
          if (items.id == props.optionId) {
            
            items.question.length > 0
              ? items.question.map((result) => {
                  var index = questionnaireList.value.find(
                    (a) => a.id === result.id
                  );
                  
                  if (index) {

                    assignQuestion.checkBox[result.id] = true;
                    assignQuestion.questionId.push(result.id);

                  } else {
                    assignQuestion.checkBox[result.id] = false;
                  }
                  store.commit("questionnaireLoadingStatus",false)
                })
                
                 
              : store.commit("questionnaireLoadingStatus",false);
              
          }
        });
      }
      //  else {
      //     if (props.sectionRecord && questionnaireList.value.length > 0) {
      //         props.sectionRecord.questionnaireQuestion ? props.sectionRecord.questionnaireQuestion.forEach(element => {
      //             if (element.entityType == "question") {
      //                 var index = questionnaireList.value.find(a => a.id === element.question.id)
      //                 if (index) {
      //                     assignQuestion.checkBox[index.id] = true
      //                     assignQuestion.questionId.push(index.id)
      //                 }
      //             }
      //         }) : ''
      //     }
      // }
    }
    watchEffect(() => {});
    const checkBox = (event) => {
      checked.value = event.target.checked;
      if (event.target.checked) {
        questionnaireList.value.map((item) => {
          assignQuestion.questionId.push(item.id);
          assignQuestion.checkBox[item.id] = true;
        });
      } else {
        questionnaireList.value.map((item) => {
          assignQuestion.checkBox[item.id] = false;
        });
        assignQuestion.questionId = [];
      }
    };
    function checkboxChange(event) {
      if (event.target.checked) {
        assignQuestion.questionId.push(event.target.value);
        //assignQuestion.questionId.push(event.target.value)
        assignQuestion.checkBox[event.target.value] = true;
      } else {
        let index = assignQuestion.questionId.indexOf(event.target.value);
        assignQuestion.questionId.splice(index, 1);
        assignQuestion.checkBox[event.target.value] = false;
      } //
    }
    const handleChange = () => {
      
    };

    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const visible1 = ref(false);
    const id = ref("");
    const showModal = (e) => {
      if (store.getters.addQuestionnaire.value && e.show == false) {
        assignQuestion.checkBox[store.getters.addQuestionnaire.value.id] = true;
        assignQuestion.questionId.push(store.getters.addQuestionnaire.value.id);
      }

      visible1.value = e.show;
      id.value = e.id;
    };

    const addAssignQuestion = () => {
      if (props.optionId) {
        let questions = getUnique(assignQuestion.questionId);
        let data = [];
        questions.map((items) => {
          data.push({
            parentId:props.parentQuestion?.id,
            optionId: props.optionId,
            questionId: items,
            
          });
        });

        store
          .dispatch("assignNestedQuestion", {
            data: {templateId:props.templateRecord?.id ? props.templateRecord?.id :'',
            sectionId:props.tempOrSecId,
            editType:props.editType,
            data:data},

            method: "post",
            showPopup: true,
          })
          .then(() => {
            if (props.templateRecord) {
          store.dispatch("detailsQuestionnaireTemplate", {
            id: props.templateRecord?.id,
            data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
          });
        } else {
          store.dispatch(
            "questionnaireList",
            "scoreTypeId=" + questionType.value
          );
        }
            emit("is-visible-exist", {
              show: false,

              id: "",
            });
            reset();
            store.commit("checkChangeInput", false);
          });
      } else {

        store
          .dispatch("addAssignquestionnaire", {
            data: {
              questionId: getUnique(assignQuestion.questionId),
            },
            id: props.sectionRecord?.questionnaireSection?.id,
            temOrSection: props.temOrSection,
            method: "put",
            showPopup: true,
          })
          .then(() => {
            if (store.state.common.successMsg) {
              
              store.dispatch("detailsQuestionnaireTemplate", {
                id: props.templateRecord?.id,
                data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
              });

              emit("is-visible-exist", {
                show: false,
                templateOrSection: props.temOrSection,
                id: "",
              });
              reset();
              store.commit("checkChangeInput", false);
            }
          });
      }
    };

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    function reset() {
      assignQuestion.questionId = [];
      assignQuestion.checkBox = [];
      //Object.assign(assignQuestion, form)
    }
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });
    function closeModal() {
      if (checkFieldsData.value) {
        emit("is-visible-exist", {
          show: true,
          templateOrSection: props.temOrSection,
          id: props.sectionRecord,
        });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            store.state.common.successMsg = "";
            emit("is-visible-exist", {
              show: false,
              templateOrSection: props.temOrSection,
              id: props.sectionRecord,
            });
            reset();
            store.commit("checkChangeInput", false);
          } else {
            emit("is-visible-exist", {
              show: true,
              templateOrSection: props.temOrSection,
              id: props.sectionRecord,
            });
          }
        });
      } else {
        reset();
        store.commit("checkChangeInput", false);
        store.state.common.successMsg = "";
        emit("is-visible-exist", {
          show: false,
          templateOrSection: props.temOrSection,
          id: props.sectionRecord,
        });
      }
    }

    function getUnique(array) {
      var uniqueArray = [];

      // Loop through array values
      for (let i = 0; i < array.length; i++) {
        if (uniqueArray.indexOf(array[i]) === -1) {
          uniqueArray.push(array[i]);
        }
      }
      return uniqueArray;
    }
    return {
      addAssignQuestion,
      assignQuestion,
      checkboxChange,
      filterOption,

      handleChange,
      showModal,
      visible1,

      id,
      questionnaireList,
      templateDetailsList,
      closeModal,
      checkChangeInput,
      activeKey: ref(1),
      questionName,
      questionType,
      checkBox,
      checked,
    };
  },
});
</script>
