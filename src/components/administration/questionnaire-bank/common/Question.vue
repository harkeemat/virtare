<template>
<!-- 
<draggable v-model="item" @clone="change($event)" v-if="type!='single'">
    <template v-slot:item="{item}" > -->

<a-collapse :class="nested?'nested' : ''" v-model:activeKey="activeKey" expand-icon-position="right" v-if="type!='single' && type=='question'">

    <a-collapse-panel :class="searchQuestion ?'checkBox' :''" v-for="item,index in question" :key="index" :header="nested ? nestedIndex +'.' + (index+1)+'. ' +item.question : (index+1)+'. ' +item.question">

        <Option :optionList="item" :scoreType="templateRecord ? scoreType :item.questionnaireCustomField" :questionRecord="item" :searchQuestion="searchQuestion" :urlAction="urlAction" :scoreTypeAction="scoreTypeAction" :temOrSection="temOrSection" :templateRecord="templateRecord" :nestedIndex="index+1" :parentQuestion="parentQuestion?parentQuestion :item " :optionSetting="optionSetting" :clone="clone" :deleteShow="deleteShow" :edit="edit" :editType="editType" :tempOrSecId="tempOrSecId" />
        <template #extra v-if="searchQuestion && questionCheckBox?.checkBox">

            <div>
                <a-checkbox @click="handleClick" v-if="!nested" v-model:checked="questionCheckBox.checkBox[item.id]" :value="item.id" @change="checkboxChange($event)"></a-checkbox>
            </div>
        </template>
        <template #extra v-else>
            <a-tooltip placement="topLeft" v-if="item.questionTypeId==353" @click="handleClick">
                <template #title>
                    <span>{{item.questionType}}</span>
                </template>
                <a class="icons pluse">

                    <span><img class="picture-loader" src="@/assets/images/Question.svg" /></span>
                </a>
            </a-tooltip>

            <a-tooltip placement="topLeft" v-if="optionSetting && ((item.dataTypeId==242 &&item.questionnaireCustomField.scoreTypeId==333) || (item.dataTypeId==244 || item.dataTypeId==243) && (arrayToObjact(screensPermissions, 444) || arrayToObjact(screensPermissions, 440)))" @click="showOptionModal({show:true,id:'fdfdfd',item:item},$event)">
                <template #title>
                    <span>Option Settings</span>
                </template>
                <a class="icons pluse">
                    <SettingTwoTone />
                </a>
            </a-tooltip>
            <a-tooltip placement="topLeft" @click="cloneFunction(item.id,$event)" v-if="clone && arrayToObjact(screensPermissions, 448)">
                <template #title>
                    <span>Clone</span>
                </template>
                <a class="icons">
                    <DiffTwoTone /></a></a-tooltip>
            <a-tooltip placement="topLeft" @click="editQuestion({id:item.id,show:true},$event)" v-if="edit && (arrayToObjact(screensPermissions, 442) || arrayToObjact(screensPermissions, 432))">
                <template #title>
                    <span>Edit Question</span>
                </template>
                <a class="icons">
                    <EditOutlined /></a></a-tooltip>
            <a-tooltip placement="topLeft" v-if="deleteShow && (arrayToObjact(screensPermissions, 443) || arrayToObjact(screensPermissions, 431))">
                <template #title v-if="!item.isAssign">
                    <span>Delete Question</span>
                </template>
                <template #title v-else>
                    <span>{{messages.deleteAssignQuestion}} </span>
                </template>
                <a class="icons" v-if="!item.isAssign">
                    <DeleteOutlined @click="deleteQuestion(item,$event)" /></a>
                <a class="icons" v-else>

                    <DeleteOutlined /></a></a-tooltip>

        </template>
    </a-collapse-panel>
</a-collapse>
<a-collapse :class="nested?'nested' : ''" v-model:activeKey="activeKey" expand-icon-position="right" v-else>

    <a-collapse-panel v-for="item,index in question" :key="index" :header="nested ? nestedIndex +'.' + (index+1)+'. '  +item.question.question: (index+1)+'. '  +item.question.question" :urlAction="urlAction">

        <Option :optionList="item.question" v-if="temOrSection=='section'" :scoreType="scoreType" :questionRecord="item.question" type="section" :urlAction="urlAction" :temOrSection="temOrSection" :templateRecord="templateRecord" :scoreTypeAction="scoreTypeAction" :nestedIndex="index+1" :templateData="templateData" :parentQuestion="parentQuestion" :optionSetting="optionSetting" :clone="clone" :deleteShow="deleteShow" :edit="edit" :editType="editType" :tempOrSecId="tempOrSecId" />
        <Option :optionList="item" v-else :scoreType="scoreType" :questionRecord="item.question" type="section" :temOrSection="temOrSection" :templateRecord="templateRecord" :scoreTypeAction="scoreTypeAction" :nestedIndex="index+1" :parentQuestion="parentQuestion" :optionSetting="optionSetting" :clone="clone" :deleteShow="deleteShow" :edit="edit" :editType="editType" :tempOrSecId="tempOrSecId" />
        <template #extra>
            <a-tooltip placement="topLeft" v-if="item.question.questionTypeId==353" @click="handleClick">
                <template #title>
                    <span>{{item.question.questionType}}</span>
                </template>
                <a class="icons pluse">

                    <span><img class="picture-loader" src="@/assets/images/Question.svg" /></span>
                </a>
            </a-tooltip>
            <a-tooltip placement="topLeft" v-if="optionSetting && ((arrayToObjact(screensPermissions, 444) || arrayToObjact(screensPermissions, 440)) &&item.question.dataTypeId==244 || item.question.dataTypeId==243 || (item.question.dataTypeId==242 && item.question.questionnaireCustomField.scoreTypeId!=339))">
                <template #title>
                    <span>Option Settings</span>
                </template>
                <a class="icons pluse">
                    <SettingTwoTone @click="showOptionModal({show:true,id:'fdfdfd',item:item.question},$event);" />
                </a>
            </a-tooltip>
            <a-tooltip placement="topLeft" @click="cloneFunction({id:item.question.id,show:true},$event)" v-if="clone && arrayToObjact(screensPermissions, 444)">
                <template #title>
                    <span>Clone Question</span>
                </template>
                <a class="icons">
                    <DiffTwoTone /></a></a-tooltip>
            <a-tooltip placement="topLeft" @click="editQuestion({id:item.question.id,show:true},$event)" v-if="edit && (arrayToObjact(screensPermissions, 442) || arrayToObjact(screensPermissions, 432))">
                <template #title>
                    <span>Edit Question</span>
                </template>
                <a class="icons">
                    <EditOutlined /></a></a-tooltip>
            <a-tooltip placement="topLeft" v-if="deleteShow && (arrayToObjact(screensPermissions, 443) || arrayToObjact(screensPermissions, 431))" @click="deleteQuestion(item,$event)">
                <template #title>
                    <span>Delete</span>
                </template>
                <a class="icons">
                    <DeleteOutlined /></a></a-tooltip>

        </template>
    </a-collapse-panel>
</a-collapse>

<!-- </template>
</draggable> -->
<!-- <a-collapse v-model:activeKey="activeKey" expand-icon-position="left" v-else-if="type=='single'">
    <a-collapse v-model:activeKey="activeKey" expand-icon-position="right">
        <a-collapse-panel :header="temOrSection=='section' ? question.question.question : question.question">
            <Option :optionList="question.question" v-if="temOrSection=='section'" :scoreType="scoreType" />
            <Option :optionList="question" v-else :scoreType="scoreType" />
            <template #extra>
                <EditOutlined @click="showModal1" v-if="edit" />
                <DeleteOutlined /></template>
        </a-collapse-panel>
    </a-collapse>
</a-collapse> -->

<AddQuestionnaire v-model:visible="visible3" @is-visible="editQuestion($event)" v-if="visible3" :temOrSection="temOrSection" :tempOrSecId="tempOrSecId" :update="questionId" :templateData="templateData" :nested="nested" :templateRecord="templateRecord" :scoreTypeAction="scoreTypeAction" :editType="editType" :parentQuestion="parentQuestion ? parentQuestion : questionRecord" :nestedOptionId="nestedOptionId" />
<AddOption v-model:visible="optionVisible" @is-visible="showOptionModal($event)" v-if="optionVisible" :questionRecord="questionRecord" :urlAction="urlAction" :scoreTypeAction="scoreTypeAction" :parentQuestion="parentQuestion ? parentQuestion : questionRecord" :editType="editType" :templateRecord="templateRecord" :nestedOptionId="nestedOptionId" :tempOrSecId="tempOrSecId"/>
</template>
<script>
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  reactive,
  defineAsyncComponent,
} from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  DiffTwoTone,
  SettingTwoTone,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { messages } from "@/config/messages";
import { warningSwal, arrayToObjact } from "@/commonMethods/commonMethod";
//import Draggable from "vue3-draggable";
export default defineComponent({
  name: "Question Template Details",
  emits: ["delete","deleteQuestion"],
  components: {
    SettingTwoTone,
    DeleteOutlined,
    EditOutlined,
    Option: defineAsyncComponent(() =>
      import("@/components/administration/questionnaire-bank/common/Options")
    ),
    DiffTwoTone,
    AddQuestionnaire: defineAsyncComponent(() =>
      import(
        "@/components/administration/questionnaire-bank/modals/AddQuestionnaire"
      )
    ),
    AddOption: defineAsyncComponent(() =>
      import("@/components/administration/questionnaire-bank/modals/AddOption")
    ),
  },
  props: {
    type: String,
    question: Array,
    edit: Boolean,
    temOrSection: String,
    scoreType: Object,
    clone: Boolean,
    deleteShow: Boolean,
    optionSetting: Boolean,
    templateData: Object,
    urlAction: Object,
    searchQuestion: Boolean,
    assignQuestion: Array,
    nested: Boolean,
    scoreTypeAction: Number,
    templateRecord: Object,
    nestedIndex: Number,
    parentQuestion: Object,
    editType: String,
    tempOrSecId: String,
    nestedOptionId: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const visible3 = ref(false);
    const activeKey = ref([-1]);
    const questionId = ref("");
    const showModal1 = () => {
      visible3.value = true;
    };

    const item = props.question ? reactive(props.question) : [];
    const questionCheckBox = props.assignQuestion ? reactive(props.assignQuestion) : ''
    
    onMounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    onUnmounted(() => {
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });
    const change = () => {
    };
    const cloneFunction = (id, event) => {
      questionId.value = id.id;
      visible3.value = id.show;
      if (event) {
        event.stopPropagation();
      }
    };
    const editQuestion = (id, event) => {
      questionId.value = id.id;
      visible3.value = id.show;
      if (event) {
        event.stopPropagation();
      }
    };
    const deleteQuestion = (id, event) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          var index = item.findIndex(function (o) {
            return o.id === id.id;
          });
          item.splice(index, 1);

          store
            .dispatch("commonAction", {
              method: "delete",
              data: null,
              id: id.id,
              commit: null,
              endPoint: props.nested
                ? "question"
                : props.temOrSection == "section"
                ? "question/section"
                : "question",
            })
            .then(() => {
              
                emit("deleteQuestion");
            
            });
        }
      });
      if (event) {
        event.stopPropagation();
      }
    };
    const questionRecord = ref("");

    const optionVisible = ref(false);
    const showOptionModal = (e, event) => {
      questionRecord.value = e.item;
      optionVisible.value = e.show;
      if (event) {
        event.stopPropagation();
      }
    };
    const checkboxChange = (event) => {
      emit("checkboxChange", event);
    };
    // const checkChangeInput = (event) => {
    //     emit("checkChangeInput", event)
    // }
    const handleClick = (event) => {
      event.stopPropagation();
    };

    return {
      activeKey,
      visible3,
      showModal1,
      value: ref(1),
      value2: ref(1),
      item,
      change,
      cloneFunction,
      questionId,
      editQuestion,
      deleteQuestion,
      optionVisible,
      showOptionModal,
      questionRecord,
      questionCheckBox,
      checkboxChange,
      arrayToObjact,
      handleClick,
      screensPermissions: store.getters.screensPermissions,
      messages,

      //checkChangeInput
    };
  },
});
</script>

<style lang="scss" scoped>
.nested {
  width: 100%;
  padding: 5px 0 0 20px;
}
</style>
