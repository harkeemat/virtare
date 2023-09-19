<template>
  <TimelineView v-if="buttonId == 1" className="thumbDesc patientTimeline" />
  <CarePlanView v-if="buttonId == 2" />
  <PatientVitalsView v-if="buttonId == 3" />
  <EscalationView :patientId="patientId" v-if="buttonId == 4" />
  <div class="summary-tabs" v-if="buttonId == 5">
      <a-tabs v-model:activeKey="activeKey1">
          <a-tab-pane key="1" tab="Assigned Questionnare">
              <!-- AppointmentTable Table -->
              <QuestionnaireTemplate :patientId="patientId" :userId="patientId" :entityType="247" />
              <!-- <Loader /> -->
          </a-tab-pane>
          <a-tab-pane key="2" tab="Complete Questionnare">
              <!-- PatientTable Table -->
              <QuestionnaireResult v-if="buttonId == 5" :userId="patientId" :entityType="247" />
          </a-tab-pane>
      </a-tabs>
  </div>

  <div class="summary-tabs" v-if="buttonId == 6">
      <a-tabs v-model:activeKey="activeKey1">
          <a-tab-pane key="1" tab="Assigned Form">
            <a-table :columns="customFormData?.columns" :pagination="false" :data-source="customFormData?.assignedForm" @change="onChange" >
        <template #action="{record}" >
            <a-tooltip placement="bottom" v-if="record?.filled_status==0">
            <template #title>
                <span>{{'Info'}}</span>
            </template>
            <a class="icons" @click="viewData(record.templateId?record.templateId:record.formUdid,record?.type,record)">
              <InfoCircleOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom" v-else>
            <template #title>
                <span>{{'Info'}}</span>
            </template>
            <a class="icons" disabled>
              <InfoCircleOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom" v-if="record?.filled_status==1">
            <template #title>
                <span>{{'Response'}}</span>
            </template>
            <a class="icons"  @click="responseTemplate(record.formUdid)">
              <FileSearchOutlined />
            </a>
        </a-tooltip>
        <a-tooltip placement="bottom" v-else>
            <template #title>
                <span>{{'Response'}}</span>
            </template>
            <a class="icons" disabled>
              <FileSearchOutlined />
            </a>
        </a-tooltip>
        <!-- <a-tooltip placement="bottom">
            <template #title>
                <span>{{$t('global.delete')}}</span>
            </template>
            <a class="icons" @click="deleteTemplate(record.id)">
                <DeleteOutlined  />
            </a>
        </a-tooltip> -->
    </template>
    </a-table>
          </a-tab-pane>
          
      </a-tabs>
  </div>
  <!-- Pending Task  -->
  <div class="summary-tabs" v-if="buttonId == 7">
    <a-timeline class="defaultTimeline" >
      <a-timeline-item v-for="item in customFormData?.getStepsForms" :key="item.id">
        <template #dot>
          <FileSyncOutlined v-if="item.process=='process'"/>
          <FileDoneOutlined  v-if="item.process=='completed'" />
          <FieldTimeOutlined v-if="item.process=='pending'" class="disabled"/>
        </template>
        <a href="javascript:void(0)"  v-if="item.process=='pending'" class="disabled">{{item.formName}}</a>  
        <a href="javascript:void(0)" @click="viewData(item.formUdid,null,item)" v-if="item.process=='process'" >{{item.formName}}</a>
        <a href="javascript:void(0)" @click="responseTemplate(item.formUdid)" v-if="item.process=='completed'" >{{item.formName}}</a>
        <p class="date">{{dateAndTimeFormate(item.assignDate,globalDateFormat)}}</p>
      </a-timeline-item>
    </a-timeline>
  </div>
  <RenderFormModal  v-if="formVisible" v-model:visible="formVisible" @saveModal="saveModal($event)" :dataObject="dataObject"/>
  <ResponseFormModal v-model:visible="formResponseVisible" @saveModal="saveModal($event)" />
  <!-- end pending task -->
  <TableLoader v-if="!loaderStatus" />
  <!-- <Loader/> -->
  <!-- <TimelineLoader/> -->
  </template>

<script>
import TimelineView from "@/components/patients/patientSummary/PatientTimeline";
import CarePlanView from "@/components/patients/patientSummary/views/CarePlanView";
import PatientVitalsView from "@/components/patients/patientSummary/views/PatientVitalsView";
import EscalationView from "@/components/escalations/Escalation";
import TableLoader from "@/components/loader/TableLoader";
// import Loader from "@/components/loader/Loader"
import QuestionnaireTemplate from "@/components/common/questionnaire/Questionnaire";
import QuestionnaireResult from "@/components/common/questionnaire/QuestionnaireResult";
// import TimelineLoader from "@/components/loader/TimelineLoader"
import { onMounted, ref,computed, defineComponent,defineAsyncComponent, reactive } from "vue";
import { useRoute } from 'vue-router';
import {
  // DeleteOutlined,
  InfoCircleOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
  FileSyncOutlined,
  FieldTimeOutlined
  // PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { 
  globalDateFormat,
  dateAndTimeFormate 
} from '@/commonMethods/commonMethod';
import { useStore } from "vuex";
export default defineComponent({
  components: {
    FieldTimeOutlined,
    FileSyncOutlined,
    FileDoneOutlined,
    TimelineView,
    CarePlanView,
    PatientVitalsView,
    EscalationView,
    TableLoader,
    // Loader,
    // TimelineLoader,
    QuestionnaireTemplate,
    QuestionnaireResult,
    InfoCircleOutlined,
    FileSearchOutlined,
    RenderFormModal:defineAsyncComponent(()=>import('@/views/custom-form/RenderFormModal.vue')),
    ResponseFormModal:defineAsyncComponent(()=>import('@/views/custom-form/tables/ResponseFormModal.vue'))
  },
  props: {
    buttonId: Number,
    patientId: String,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const current = ref(0);
    const formVisible = ref(false)
    const dataObject = reactive({})
    const formResponseVisible = ref(false)
    const loaderStatus = computed(() => {
        return store.state.common.loadingTimelineStatus;
      });

    onMounted(() => {
      store.commit("loadingTimelineStatus", true);
    });
    const customFormData = computed(()=>{
        return store.state.customForm
    })

    const viewData = (id,type,data) => {
      // if(type=='questionnaire'){
        // store.dispatch('getTemplateQuestionSection',id).then((resp)=>{
        //   if(resp==true){
        //     dataObject.value = data
        //     formVisible.value = true;
        //   }
        // })
      // }else{
        store.dispatch("viewTemplate", id).then((resp) => {
        if (resp == true) {
          dataObject.value = data
          formVisible.value = true;
          store.state.customForm.getTemplateQuestionSection = null
        }
      });
      // }
      
    };

    const saveModal = (value) =>{
      formVisible.value = value
      store.commit('assignedForm',null)
    }

    const responseTemplate = (id) => {
      let data = {
        formId:id,
        patientId:route.params.udid
      }
      store.dispatch("responseTemplate", data).then((resp) => {
        if (resp == true) {
          formResponseVisible.value = true;
        }
      });
    };
    
  
    return {
      current,
      formResponseVisible,
      responseTemplate,
      dataObject,
      saveModal,
      formVisible,
      viewData,
      customFormData,
      loaderStatus,
      activeKey1: ref("1"),
      globalDateFormat,
      dateAndTimeFormate
    };
  },
});
</script>
<style lang="scss">
  .summary-tabs {
    .ant-timeline  {
      .ant-timeline-item {
        padding: 0 0 30px;
        &:last-child {
          .ant-timeline-item-content {
            border: none;
            padding-bottom: 0;
          }
        }
        .ant-timeline-item-head  {
          span {
            font-size: 25px;
            &.disabled {
              color: #999!important;
            }
          }
        }
        .ant-timeline-item-content {
          margin:0 0 0 35px;
          border-bottom: 1px solid #e1e1e1;
          padding-bottom: 10px;
          a {
            font-size: 20px;
            line-height: 20px;
            &.disabled {
              color: #999!important;
              cursor: not-allowed;
            }
          }
          .date {
            color: #999;
          }
        }
      }
    }
  }
</style>