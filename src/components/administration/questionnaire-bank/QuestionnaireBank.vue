<template>
 <div>
     <div class="common-bg">
         <div class="questionnaireMain">
             <a-row :gutter="20">
                 <a-col :span="24" v-if="arrayToObjact(screensPermissions, 441)">
                     <h2 class="pageTittle">
                         {{$t('questionnaire.questionnaireBank')}}
                         <div class="commonBtn">
                             <a-button type="primary"  @click="showModal({show:true,id:''})">Add New Question</a-button>
                         </div>
                     </h2>
                 </a-col>

                 <a-col :sm="16" :xs="24" class="mb-24">
                     <SearchField endPoint="question" commit="questionnaireList" :otherParam="'&scoreTypeId='+buttonResult.id" />
                 </a-col>
                 <a-col :sm="8" v-if="buttonResult.name" class="mb-24">
                     <a-dropdown class="button">
                         <template #overlay>
                             <a-menu>
                                 <a-menu-item v-for="questionType in globalData" :key="questionType.id" @click="handleMenuClick(questionType)">

                                     {{questionType?.name}}
                                 </a-menu-item>

                             </a-menu>
                         </template>
                         <a-button>
                             {{buttonResult?.name}}

                         </a-button>
                     </a-dropdown>
                 </a-col>
                 <a-col :span="24">
                     <div v-if="questionnaireList">
                         <Question :question="questionnaireList" v-if="questionnaireList.length>0" :edit="true" type="question" :optionSetting="true" :deleteShow="true" @delete="deleteQuestion($event)" :urlAction="{endPoint:'questionnaireList',param:'scoreTypeId=' +buttonResult.id}" :assignQuestion="[]" :scoreTypeAction="buttonResult?.id" editType="question"/>
                     </div>

                 </a-col>

             </a-row>
         </div>
     </div>
     <QuestionnaireLoader />
 </div>
 <AddQuestionnaire v-model:visible="visible" @is-visible="showModal($event)" v-if="visible" :scoreTypeAction="buttonResult.id" />
</template>

<script>
import { ref, defineAsyncComponent, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

import SearchField from "@/components/common/input/SearchField";
import Question from "@/components/administration/questionnaire-bank/common/Question";
import { arrayToObjact } from "@/commonMethods/commonMethod";
import { useRoute } from 'vue-router';
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader";
export default {
  components: {
    AddQuestionnaire: defineAsyncComponent(() =>
      import(
        "@/components/administration/questionnaire-bank/modals/AddQuestionnaire"
      )
    ),

    QuestionnaireLoader,
    SearchField,
    Question,
  },
  setup() {
    const visible = ref(false);

    const store = useStore();
    const id = ref("");
    const questionRecord = ref("");
    const questionId = ref("");
    const optionVisible = ref(false);
    //const questionnaireList =  ref(JSON.parse(localStorage.getItem("question")))
    //localStorage.removeItem('question');
    const showModal = (e) => {
      visible.value = e.show;
      id.value = e.id;
      // questionnaireList.value =  JSON.parse(localStorage.getItem("question"))
    };
    const showOptionModal = (e) => {
      questionId.value = e.id;
      questionRecord.value = e.item;
      optionVisible.value = e.show;
    }

    const visible2 = ref(false);
    const showModal2 = () => {
      visible2.value = true;
    }
    const questionnaireList = store.getters.questionnaireList;
    const meta = store.getters.questionMeta;
    const globalData = store.getters.tabGlobalCode;
     const route = useRoute()
    let record = [];
    const buttonResult = ref({
      name: "",
      id: "",
    });
    onMounted(() => {
      
      store.commit("questionnaireLoadingStatus",true)
      store
        .dispatch("commonAction", {
          show: false,
          method: "get",
          data: null,
          id: null,
          commit: "tabGlobalCode",
          endPoint: "globalCode?globalCodeCategoryId=71",
        })
        .then(() => {
          globalData.value.map((item, index) => {
            if (index == 0) {
              buttonResult.value.id = item?.id;
              buttonResult.value.name = item?.name;
            }})
          store
            .dispatch(
              "questionnaireList",
              "scoreTypeId=" + buttonResult.value?.id
            )
            .then(() => {
              
              setTimeout(() => {
                window.addEventListener("scroll", () => {
                  if(route.name == "QuestionnaireBank") {
                  if (questionnaireList.value.length > 0) {
                    //var tableContent = document.getElementsByClassName("templateAction")[0]
                    const { scrollTop, scrollHeight, clientHeight } =
                      document.documentElement;
                    const finalPercentage = Math.round(
                      ((scrollTop + clientHeight) / scrollHeight) * 100
                    );

                    if (finalPercentage === 100) {
                     
                      let current_page = meta.value?.current_page + 1;
                      if (current_page <= meta.value?.total_pages && meta.value) {
                        store.state.questionnaire.questionMeta = ''
                        record = questionnaireList.value;
                        store.commit("questionnaireLoadingStatus",true)
                        store
                          .dispatch(
                            "questionnaireList",
                            "page=" +
                              current_page +
                              store.getters.searchTable.value +
                              "&scoreTypeId=" +
                              buttonResult.value.id
                          )
                          .then(() => {
                            loadMoredata();
                          });
                      }
                    }
                  }
                  }
                });
              }, 1000);
              
            });
            //store.commit("questionnaireLoadingStatus",false)
           
        });

    });

      function loadMoredata() {
        const newData = questionnaireList.value;
        newData.forEach((element) => {
          record.push(element);
        });
        store.state.questionnaire.questionnaireList = record;
        store.commit("questionnaireLoadingStatus",false)
        //questionnaireList.value = record;
      }
    onUnmounted(() => {
      store.state.questionnaire.questionnaireList = [];
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    const handleMenuClick = (e) => {
      buttonResult.value.id = e.id;
      buttonResult.value.name = e.name;
      store.commit("questionnaireLoadingStatus",true)
      store.dispatch(
        "questionnaireList",
        "scoreTypeId=" + buttonResult.value.id
      ).then(()=>{
store.commit("questionnaireLoadingStatus",false)
      })
    };

    return {
      showModal,
      visible,

      id,
      visible2,
      showModal2,
      optionVisible,
      showOptionModal,
      questionRecord,
      questionId,
      questionnaireList,
      globalData,
      screensPermissions:store.getters.screensPermissions,
      handleMenuClick,
      buttonResult,
      arrayToObjact
    };
  },
};
</script>

<style scoped>
.button {
  width: 50%;
  height: 40px;
}
</style>
