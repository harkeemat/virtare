<template>
  <a-table :columns="tableData?.columns" :pagination="false" :data-source="tableData?.customForms" @change="onChange">
      <template #action="{record}">
          <a-tooltip placement="bottom">
              <template #title> 
                  <span>{{'Info'}}</span>
              </template>
              <a class="icons" @click="viewData(record.templateId?record.templateId:record.id,record?.type)">
                  <InfoCircleOutlined />
              </a>
          </a-tooltip>
          <!-- <a-tooltip placement="bottom">
              <template #title>
                  <span>{{'Response'}}</span>
              </template>
              <a class="icons" @click="responseTemplate(record.id)">
                  <FileSearchOutlined />
              </a>
          </a-tooltip> -->
          <a-tooltip placement="bottom">
              <template #title>
                  <span>{{'Assign'}}</span>
              </template>
              <a class="icons" @click="assignTemplate(record.id)">
                  <PlusCircleOutlined />
              </a>
          </a-tooltip>
          <a-tooltip placement="bottom">
              <template #title>
                  <span>{{$t('global.delete')}}</span>
              </template>
              <a class="icons" @click="deleteTemplate(record.id)">
                  <DeleteOutlined  />
              </a>
          </a-tooltip>
  
      </template>
  </a-table>
  <RenderFormModal v-model:visible="formVisible" @saveModal="saveModal($event)" />
  <ResponseFormModal v-model:visible="formResponseVisible" @saveModal="saveModal($event)" />
  <AssignFormModal v-model:visible="assignVisible" @saveModal="saveModal($event)" :formId="formId" />
  <!-- <TemplateResponse v-if="formVisible" :templateId="templateId" :clientResponse="clientResponse" @is-visible="emitFunction($event)" :user="userName" :userType="entityType" :fromCustomFrom="true" /> -->
  </template>

  
<script>
import {
  DeleteOutlined,
  InfoCircleOutlined,
  // FileSearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { computed, defineComponent, ref } from "vue";
import RenderFormModal from "../RenderFormModal.vue";
import ResponseFormModal from "../tables/ResponseFormModal.vue";
import AssignFormModal from "../AssignFormModal.vue";
import { useStore } from "vuex";
// import TemplateResponse from "@/components/administration/questionnaire-template/TemplateResponse";
export default defineComponent({
  components: {
    DeleteOutlined,
    InfoCircleOutlined,
    // FileSearchOutlined,
    RenderFormModal,
    ResponseFormModal,
    PlusCircleOutlined,
    AssignFormModal,
    // TemplateResponse,
  },
  setup() {
    const store = useStore();
    const formVisible = ref(false);
    const formResponseVisible = ref(false);
    const assignVisible = ref(false);
    const questVisible = ref(false)
    const formId = ref()
    const tableData = computed(() => {
      return store.state.customForm;
    });
    const viewData = (id,type) => {
      if(type=='questionnaire'){
        store.dispatch('getTemplateQuestionSection',id).then((resp)=>{
          if(resp==true){
            formVisible.value = true;
          }
        })
      }else{
        store.dispatch("viewTemplate", id).then((resp) => {
          if (resp == true) {
            formVisible.value = true;
            store.state.customForm.getTemplateQuestionSection = null
          }
        });
      }
    };

    const responseTemplate = (id) => {
      store.dispatch("responseTemplate", id).then((resp) => {
        if (resp == true) {
          formResponseVisible.value = true;
        }
      });
    };
    const assignTemplate = (id) => {
      assignVisible.value = true
      formId.value = id
      store.dispatch("programList")
      store.dispatch('groupsList')
      // store.dispatch("assignTemplate", id).then((resp) => {
      //   if (resp == true) {
      //     // 
      //   }
      // });
    };

    const deleteTemplate = (id) => {
      store.dispatch("deleteTemplate", id).then((resp) => {
        if (resp == true) {
          store.dispatch("customForms");
        }
      });
    };

    const saveModal = (value) =>{
      assignVisible.value = value
      formResponseVisible.value = value
      formVisible.value = value
    }

    return {
      questVisible,
      saveModal,
      formId,
      assignTemplate,
      assignVisible,
      formResponseVisible,
      responseTemplate,
      formVisible,
      deleteTemplate,
      viewData,
      tableData,
      onChange: (pagination, filters, sorter, extra) => {
        console.log("params", pagination, filters, sorter, extra);
      },
    };
  },
});
</script>
