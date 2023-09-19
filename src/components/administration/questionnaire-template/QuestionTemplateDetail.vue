<template>
<div class="common-bg">
    <div class="questionnaireMain">
        <a-row :gutter="24">
            <a-col :span="24" v-if="detailsQuestionnaireTemplate">
                <h2 class="pageTittle">

                    <span class="title toCapitalFirst" >{{ detailsQuestionnaireTemplate?.templateName }}</span>
                    <div class="commonBtn">
                        <a-button class="btn primaryBtn ml-10 buttonWtIcon" v-if="detailsQuestionnaireTemplate?.questionnaireQuestion.length>0" @click="assignToUser({id:detailsQuestionnaireTemplate?.id,show:true})">Assign To</a-button>
                        <!-- <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal2(true)">Search Question<SearchOutlined/></a-button> -->
                        <!-- <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal2(true)">Search Section</a-button> -->
                        <!-- <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showSection({show:true,id:detailsQuestionnaireTemplate.id,templateOrSection:'template'})">Add Section
                            <PlusOutlined />
                        </a-button> -->
                        <!-- <a-button class="btn primaryBtn ml-10 buttonWtIcon" @click="showModal({show:true,id:detailsQuestionnaireTemplate.id,templateOrSection:'template'})">Add Question
                            <PlusOutlined />
                        </a-button> -->

                        <a-button @click="goBack" class="btn primaryBtn">Back</a-button>

                    </div>
                </h2>

            </a-col>
        </a-row>
        <a-row v-if="detailsQuestionnaireTemplate">
            <a-col :span=12>
                <div class="templateType">
                    <div v-if="detailsQuestionnaireTemplate?.questionnaireCustomField.userType">{{$t('questionnaire.associated')}} : <span> {{detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate?.questionnaireCustomField?.userType :''}}</span></div>

                    <div v-if="detailsQuestionnaireTemplate?.questionnaireCustomField?.noOfDays">{{$t('questionnaire.tillEnd')}} : <span> {{detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate?.questionnaireCustomField?.noOfDays : ''}} &nbsp;Days</span></div>
                    <div v-if="detailsQuestionnaireTemplate?.questionnaireCustomField?.scoreType">Score Type : <span> {{detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate?.questionnaireCustomField?.scoreType :''}}</span></div>
                    <div v-if="detailsQuestionnaireTemplate?.questionnaireCustomField?.questionnaireTypeId">Template Type : <span> {{detailsQuestionnaireTemplate?.questionnaireCustomField?.questionnaireType}}</span></div>

                </div>
            </a-col>
            <a-col :span="12">

                <div class="templateType right">
                    <div v-if="detailsQuestionnaireTemplate?.templateType">{{$t('questionnaire.categoryType')}}: <span> {{detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate?.templateType :''}}</span></div>
                    <div v-if="detailsQuestionnaireTemplate?.questionnaireCustomField?.slotType">{{$t('questionnaire.questionOrder')}} : <span> {{detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate?.questionnaireCustomField?.slotType :''}}</span></div>
                    <div v-if="detailsQuestionnaireTemplate?.questionnaireCustomField?.maxQuestionPerDay">{{$t('questionnaire.questionPerDay')}} : <span> {{detailsQuestionnaireTemplate ? detailsQuestionnaireTemplate?.questionnaireCustomField?.maxQuestionPerDay :''}}</span></div>
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="24" v-if="detailsQuestionnaireTemplate">
            <a-col :span="24">
                <div class="customeTemplate">
                    <div v-for="item,index in detailsQuestionnaireTemplate?.questionnaireQuestion" :key="index">
                        <div :class="activeSection?.item ? activeSection?.item?.questionnaireSection?.id ==item?.questionnaireSection?.id ?  'healthTemplateBox activeSection' : 'healthTemplateBox' :''"  @click="changeSectionId(item,sectionNames.sectionName[item.questionnaireSection.id])">
                            <div class="healthTemplateHeader">
                                <h4>Section {{index+1}} of {{detailsQuestionnaireTemplate?.questionnaireQuestion.length}} </h4>
                            </div>
                            <div class="healthTemplateBoxInner">
                                <div class="healthTemplateBoxInnerHeader">
                                </div>
                                <div class="form-group">
                                    <a-input v-model:value="sectionNames.sectionName[item.questionnaireSection.id]" style="width: 100%" size="large" @blur="editSection(item?.questionnaireSection?.id,item)" />
                                </div>
                                <Question :question="item?.questionnaireSection?.questionSection" temOrSection="section"  type="multiple" :scoreType="detailsQuestionnaireTemplate?.questionnaireCustomField" :clone="false" :deleteShow="detailsQuestionnaireTemplate?.isAssign ? false :true" :edit="detailsQuestionnaireTemplate?.isAssign ? false :true" @deleteQuestion="deleteQuestion()" :templateData="detailsQuestionnaireTemplate" :urlAction="{endPoint:'detailsQuestionnaireTemplate',param:{id: udid,data:'questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId'}}" :tempOrSecId="item.questionnaireSection.id" :templateRecord="detailsQuestionnaireTemplate" :optionSetting="detailsQuestionnaireTemplate?.isAssign ? false :true" editType="template"/>
                            </div>
                            <!-- </div>  -->
                        </div>
                    </div>
                    <div class="templateAction">
                        <a-tooltip placement="leftTop" v-if="arrayToObjact(screensPermissions, 434) && !detailsQuestionnaireTemplate?.isAssign">
                            <template #title>
                                <span>Add Question</span>
                            </template>
                            <a class="icons" @click="showQuestion({show:true,id:activeSection?.item,templateOrSection:'section',name:activeSection?.name})">
                                <PlusOutlined />
                            </a>
                        </a-tooltip>
                        <a-tooltip placement="leftTop" v-if="arrayToObjact(screensPermissions, 435) && !detailsQuestionnaireTemplate?.isAssign">
                            <template #title>
                                <span>Select Question</span>
                            </template>
                            <a class="icons" @click="showModal2({show:true,id:activeSection?.item,templateOrSection:'section',name:activeSection?.name})">
                                <AppstoreAddOutlined />
                            </a>
                        </a-tooltip>
                        <a-tooltip placement="leftTop" v-if="arrayToObjact(screensPermissions, 436) && !detailsQuestionnaireTemplate?.isAssign">
                            <template #title>
                                <span>Add Section</span>
                            </template>
                            <a class="icons" @click="addSection()">
                                <PicCenterOutlined /></a>
                        </a-tooltip>
                        <a-tooltip placement="leftTop" v-if="arrayToObjact(screensPermissions, 439)">
                            <template #title>
                                <span>Settings</span>
                            </template>
                            <a class="icons" @click="showSetting({show:true,id:''})">
                                <SettingTwoTone /></a>
                        </a-tooltip>
                        <a-tooltip placement="leftTop" v-if="arrayToObjact(screensPermissions, 437) && !detailsQuestionnaireTemplate?.isAssign">
                            <template #title>
                                <span>Duplicate Section</span>
                            </template>
                            <a class="icons" @click="duplicateSection(activeSection?.item)">
                                <CopyOutlined /></a>
                        </a-tooltip>
                        <a-tooltip placement="leftTop" v-if="arrayToObjact(screensPermissions, 438) && !detailsQuestionnaireTemplate?.isAssign">
                            <template #title>
                                <span>Delete Section</span>
                            </template>
                            <a class="icons" v-if="detailsQuestionnaireTemplate?.questionnaireQuestion.length>1" @click="deleteSection(activeSection?.item?.questionnaireSection?.id)">
                                <DeleteOutlined /></a>
                        </a-tooltip>
                    </div>
                </div>
                <!-- </draggable>  -->
            </a-col>
        </a-row>
    </div>
    <AddQuestionnaire v-model:visible="visible2" v-if="visible2" @is-visible="showQuestion($event)" :name="activeSection?.name" :tempOrSecId="activeSection?.item?.questionnaireSection?.id" :templateRecord="detailsQuestionnaireTemplate" />
    <!--modals-->
    <!-- <AddQuestionnaire v-if="visible2" v-model:visible="visible2" @is-visible="showModal($event)" :templateId="templateId" :temOrSection="templateOrSection" :name="name" /> -->
    <!-- <AssignSection v-if="settingVisible" v-model:visible="settingVisible" @is-visible="showSection($event)" :update="true" /> -->
    <a-modal width="80%" v-model:visible="visible1" class="addQuestionModalWithFooter toCapitalFirst" :title="activeSection?.name" centered :maskClosable="false" :footer="false">
        <SearchQuestion v-if="visible1" v-model:visible="visible1" :sectionRecord="activeSection.item" @is-visible-exist="showModal2($event)" temOrSection="section" :templateRecord="detailsQuestionnaireTemplate" :sectionName="activeSection?.name" />
    </a-modal>
    <!---->
    <AssignToUser v-if="assignToUserVisible" v-model:visible="assignToUserVisible" @is-visible="assignToUser($event)" :tempId="assignToUserId" />
    <Setting v-model:visible="settingVisible" @is-visible="showSetting($event)" v-if="settingVisible" :templateRecord="detailsQuestionnaireTemplate" :templateId="detailsQuestionnaireTemplate?.id" />
</div>
<QuestionnaireLoader />
</template>
<script>
import { defineComponent, defineAsyncComponent,ref, onMounted,onUnmounted, computed, reactive, watchEffect} from "vue";
import {  PlusOutlined, DeleteOutlined, CopyOutlined, PicCenterOutlined, SettingTwoTone, AppstoreAddOutlined} from "@ant-design/icons-vue";
import SearchQuestion from "@/components/administration/questionnaire-template/modals/SearchQuestion";
import Question from "@/components/administration/questionnaire-bank/common/Question";
import QuestionnaireLoader from "@/components/loader/QuestionnaireLoader";
//import AssignSection from "@/components/administration/questionnaire-template/modals/AssignSection"
import AssignToUser from "@/components/administration/questionnaire-template/modals/AssignToUser";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
//import Draggable from "vue3-draggable"
import { messages } from "@/config/messages";
import { warningSwal ,arrayToObjact} from "@/commonMethods/commonMethod";
// import CreateSection from "@/components/administration/template-section/modals/CreateSection";
export default defineComponent({
  name: "Question Template Details",
  components: {
    AddQuestionnaire: defineAsyncComponent(() =>
      import(
        "@/components/administration/questionnaire-bank/modals/AddQuestionnaire"
      )
    ),
    Setting: defineAsyncComponent(() =>
      import(
        "@/components/administration/questionnaire-template/modals/Setting"
      )
    ),
    SearchQuestion,
    PlusOutlined,
    Question,
    QuestionnaireLoader,
    // AssignSection,
    AssignToUser,
    AppstoreAddOutlined,
    CopyOutlined,
    DeleteOutlined,
    SettingTwoTone,
    PicCenterOutlined,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const assignToUserId = ref("");
    const udid = route.params.udid;
    const templateId = ref("");
    const templateOrSection = ref("");
    const assignToUserVisible = ref(false);
    const sectionRecord = ref("");
    const visible2 = ref(false);
    const id = ref("");
    const name = ref("");
    const activeSection = ref("");

    const sectionNames = reactive({
      sectionName: [],
    });
    ///back button
    function goBack() {
      router.go(-1);
    }
    const showModal = (e) => {
      templateId.value = e.id;
      templateOrSection.value = e.templateOrSection;
      id.value = e.id;
      visible2.value = e.show;
    };
    const settingVisible = ref(false);
    const detailsQuestionnaireTemplate = computed(() => {
      return store.state.questionnaireTemplate.detailsQuestionnaireTemplate;
    });
    const questionnaireCustomField = ref("");
    const visible1 = ref(false);
    const showModal2 = (e) => {
      visible1.value = e.show;
    };
    const showQuestion = (e) => {
      visible2.value = e.show;
    };
    const showSetting = (e) => {
      if (e.id) {
        questionnaireCustomField.value = e.questionnaireCustomField;
      }
      settingVisible.value = e.show;
    };

    const apiRefresh = ref(true);
    watchEffect(() => {
      if (detailsQuestionnaireTemplate.value && apiRefresh.value) {
        activeSectionGet();
      }

      if (detailsQuestionnaireTemplate.value) {
        setTimeout(() => {
          window.addEventListener("scroll", (event) => {
            var tableContent =
              document.getElementsByClassName("templateAction")[0];

            if (tableContent) {
              setTimeout(() => {
                tableContent.style.top =
                  event.target.defaultView.scrollY + 50 + "px";
              }, 100);
            }
          });
        }, 1000);
      }
    });
    function activeSectionGet() {
      detailsQuestionnaireTemplate.value.questionnaireQuestion.map(
        (item, index) => {
          if (index == 0 && !activeSection.value) {
            activeSection.value = {
              item: item,
              name: item.questionnaireSection.sectionName,
            };
          }
          sectionNames.sectionName[item.questionnaireSection.id] =
            item.questionnaireSection.sectionName;
        }
      );
    }
    onMounted(() => {
      store
        .dispatch("detailsQuestionnaireTemplate", {
          id: udid,
          data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
        })
        .then(() => {});

      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    onUnmounted(() => {
      store.state.questionnaireTemplate.detailsQuestionnaireTemplate = "";
      store.dispatch("searchTable", "&search=");
      store.dispatch("orderTable", {
        data: "&orderField=&orderBy=",
      });
    });

    const assignToUser = (id) => {
      assignToUserId.value = id.id;

      assignToUserVisible.value = id.show;
    };

    function showSectionQeustionModal(event) {
      templateId.value = event.id;
      templateOrSection.value = event.templateOrSection;
      name.value = event.name;
      visible2.value = event.show;
    }

    function changeReocrd() {
    }

    function deleteSection(id) {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
          // var index = data.value.findIndex(function (o) {
          //     return o.id === id;
          // })
          store.dispatch("deleteQuestionnaireTemplateSection", id).then(() => {
            store
              .dispatch("detailsQuestionnaireTemplate", {
                id: udid,
                data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
              })
              .then(() => {
                //data.value.splice(index, 1)
                activeSection.value = "";
                activeSectionGet();
              });
          });
        }
      });
    }
    const changeSectionId = (id, name) => {
      activeSection.value = { item: id, name: name };
    };
    const editSection = (id, record) => {
      activeSection.value = {
        item: record,
        name: sectionNames.sectionName[id],
      };

      apiRefresh.value = false;
      store
        .dispatch("updateQuestionnaireTemplateSection", {
          data: {
            sectionName: sectionNames.sectionName[id],
          },
          id: id,
          show: false,
        })
        .then(() => {
          apiRefresh.value = false;
        });
    };
    const addSection = () => {
      sectionCreateOrAssign(null, "sectionAdd");
    };

    function sectionCreateOrAssign(data, type) {
      store.commit("loadingTableStatus", true);
      store
        .dispatch("addQuestionnaireTemplateSection", {
          data: {
            sectionName:
              type == "duplicate"
                ? data.questionnaireSection.sectionName
                : "Section",
          },
          show: false,
        })
        .then(() => {
          if (store.state.common.successMsg) {
            store
              .dispatch("sectionAssignToTemplate", {
                id: udid,
                
                sectionId: [
                  store.getters.questionnaireTemplateSection.value.id,
                ],
                method: "post",
                showPopup: false,
              })
              .then(() => {
                if (type == "duplicate") {
                  let id = [];
                  data.questionnaireSection.questionSection.map((item) => {
                    id.push(item.question.id);
                  });
                  store
                    .dispatch("addAssignquestionnaire", {
                      data: {
                        questionId: id,
                      },
                      templateId: detailsQuestionnaireTemplate.value?.id,
                      currentSectionId:data?.questionnaireSection?.id,
                      id: store.getters.questionnaireTemplateSection.value.id,
                      temOrSection: "section",
                      method: "post",
                      showPopup: true,
                    })
                    .then(() => {
                      store.state.common.successMsg = "";
                      store
                        .dispatch("detailsQuestionnaireTemplate", {
                          id: udid,
                          data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
                        })
                        .then(() => {
                          apiRefresh.value = true;
                          store.commit("loadingTableStatus", false);
                        });
                    });
                } else {
                  store.state.common.successMsg = "";
                  store
                    .dispatch("detailsQuestionnaireTemplate", {
                      id: udid,
                      data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
                    })
                    .then(() => {
                      apiRefresh.value = true;
                      store.commit("loadingTableStatus", false);
                    });
                }
              });
          }
        });
    }
    const duplicateSection = (data) => {
      let record = "";
      store.commit("questionnaireLoadingStatus", true);
      detailsQuestionnaireTemplate.value.questionnaireQuestion.map((item) => {
        if (item.questionnaireSection.id == data.questionnaireSection.id) {
          record = item;
        }
      });

      sectionCreateOrAssign(record, "duplicate");
    };
    const deleteQuestion = () => {
              //activeSection.value = "";
              store.dispatch("detailsQuestionnaireTemplate", {
                id: udid,
                data: "questionnaireFields=questionnaireTypeId,slotTypeId,scoreTypeId,userTypeId",
              });
           
          //data.value.splice(index, 1)
        
     
    };

    return {
      changeReocrd,
      visible2,
      showModal,
      visible1,
      showModal2,
      udid,
      detailsQuestionnaireTemplate,
      value: ref(1),
      value2: ref(1),
      showSetting,
      settingVisible,
      assignToUserVisible,
      assignToUser,
      assignToUserId,
      showSectionQeustionModal,
      templateOrSection,
      templateId,
      name,
      goBack,
      sectionRecord,
      deleteSection,
      sectionNames,
      activeSection,
      changeSectionId,
      editSection,
      addSection,
      duplicateSection,
      deleteQuestion,
      questionnaireCustomField,
      showQuestion,
      arrayToObjact,
      screensPermissions:store.getters.screensPermissions,
    };
  },
});
</script>

<style lang="scss" scoped>
.healthTemplateBox {
  margin: 0 0 20px;

  &.activeSection {
    .healthTemplateHeader {
      position: relative;

      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 5px;
        background-color: #585454;
      }

      h4 {
        margin: 0 0 10px;
        background-color: #585454;
        display: inline-block;
        padding: 10px;
        margin: 0;
        color: #fff;
        border-radius: 10px 10px 0 0;
      }
    }

    .healthTemplateBoxInner {
      &::before {
        content: "";
        position: absolute;
        left: -1px;
        top: -1px;
        bottom: 0;
        width: 5px;
        background-color: #585454;
        border-radius: 0 0 0 5px;
      }
    }
  }

  .healthTemplateHeader {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 5px;
      background-color: #d9d9d9;
    }

    h4 {
      margin: 0 0 10px;
      background-color: #d9d9d9;
      display: inline-block;
      padding: 10px;
      margin: 0;
      color: #111;
      border-radius: 10px 10px 0 0;
    }

    .buttonWtIcon {
      position: absolute;
      right: 8px;
      // top: 13px;
      // font-size: 18px;
    }
  }

  .healthTemplateBoxInner {
    padding: 15px;
    border-radius: 0 0 5px 5px;
    border: 1px solid #e3e3e3;
    position: relative;

    .healthTemplateBoxInnerHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 15px;
    }
  }
}

.pageTittle {
  display: flex;
  align-items: center;

  span.title {
    text-transform: capitalize;
    display: inline-block;
    width: 40%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .commonBtn {
    position: initial;
    width: 60%;
    display: inline-flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;

    .ant-btn {
      display: inline-flex;

      .anticon {
        margin-top: 1px;
      }
    }
  }
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
    > div {
      width: 25px;
    }
  }
}

.right {
  text-align: right;
}

.customeTemplate {
  position: relative;
  padding-right: 80px;

  .templateAction {
    position: absolute;
    right: 0;
    top: 30px;
    background-color: #f9f9f9;
    border-radius: 8px;
    .icons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .anticon {
      display: block;
      padding: 15px;
      font-size: 18px;
      cursor: pointer;
      border-bottom: 1px solid #e3e3e3;

      &:last-child {
        border: none;
      }
    }
  }
}
</style>
