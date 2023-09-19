<template>
  <a-modal width="50%" :title="editWorkflowAction != null ? 'Edit Workflow Action: '+editWorkflowAction.workflowActionName : 'Add Workflow Action'" centered :footer="false" :maskClosable="false" @cancel="closeModal">
    <a-form :model="groupEditActions" layout="vertical" ref="formRef"  autocomplete="off" name="groupEditActions" scrollToFirstError=true @finish="submitForm" @finishFailed="onFinishFailed">
      <a-row :gutter="24">
        <a-col :span="24">
          <div class="form-group">
            <a-form-item label="Action" name="workFlowActionId" :rules="[{ required: true, message: 'Action'+' '+$t('global.validation')  }]">
              <GlobalCodeDropDown :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="groupEditActions.workFlowActionId" :dataId="55" @handleGlobalChange="handleGlobalChange($event, 'groupEditActions.workFlowActionId'); action(groupEditActions.workFlowActionId); checkChangeInput()" />
            </a-form-item>
          </div>
        </a-col>

        <a-col :span="24" v-if="workflow.actionsField">
          <div class="form-group">
            <a-row :gutter="24">
              <a-col :sm="8" :xs="24">
                <a-form-item label="Action Type" name="workFlowEventOffsetFieldId" :rules="[{ required: true, message: 'Action Type'+' '+$t('global.validation')  }]" style="width:100%">
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" ref="select" style="width: 100%" size="large" v-model:value="groupEditActions.workFlowEventOffsetFieldId">
                    <a-select-option v-for="offset in actionsOffset" :key="offset.id" :value="offset.id">{{ offset.title }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :xs="24" >
                <a-form-item label="Start" name="executionOffsetType" :rules="[{ required: true, message: 'Start Action'+' '+$t('global.validation')  }]">
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" ref="select" style="width: 100%" size="large" v-model:value="groupEditActions.executionOffsetType">
                    <a-select-option value="+">After</a-select-option>
                    <a-select-option value="-">Before </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :xs="24">
                <a-form-item label="Days" name="executionOffsetDays" :rules="[{ required: true, message: 'Days'+' '+$t('global.validation')  }]">
                  <a-input v-model:value="groupEditActions.executionOffsetDays" placeholder="Days" size="large" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-col>

        <a-col :span="24" v-for="(colm,i) in workflow.actionsField" :key="i">
          <div class="form-group">
            <a-form-item :label="colm.title" :name="['actionsField',i]" :rules="[{ required: colm.type=='DropDown' ? false : true, message: colm.title+' '+$t('global.validation')  }]">
              <a-textarea v-if="colm.type=='TextArea'" v-model:value="groupEditActions.actionsField[i]" />
              <DateField v-else-if="colm.type=='Date'" :disabledDateData="d => !d || d.isBefore(moment().subtract(1,'days'))" v-model:value="groupEditActions.actionsField[i]" :globalDateFormat="globalDateFormat" :value-format="globalDateFormat" :size="size" style="width: 100%" />
              <CustomFormsDropdownSearch v-else-if="colm.type=='DropDown'" @handleCustomFormChange="handleCustomFormChange($event)" v-model:value="groupEditActions.actionsField[i]" />
              <a-input v-else v-model:value="groupEditActions.actionsField[i]" />
            </a-form-item>
          </div>
        </a-col>

        <a-col :span="24">
          <div class="steps-action">
            <a-button html-type="reset" style="margin-right: 8px" @click="reset()">{{$t('global.clear')}}</a-button>
            <a-button type="primary" html-type="submit">{{$t('global.save')}}</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <Loader/>

  </a-modal>
</template>

<script>
import { reactive, ref, computed, watchEffect } from "vue";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch";
import { useStore } from "vuex";
import moment from "moment";
import { timeStamp, globalDateFormat } from "@/commonMethods/commonMethod";
import Loader from "@/components/loader/Loader.vue";
import DateField from "@/components/modals/search/DateField.vue";
import { dateOnlyFormat } from '@/commonMethods/commonMethod';
import CustomFormsDropdownSearch from '@/components/modals/search/CustomFormsDropdownSearch';
import { useRoute } from 'vue-router';

export default {
  name: "WorkFlowGroupAction",
  components: {
    GlobalCodeDropDown,
    Loader,
    DateField,
    CustomFormsDropdownSearch,
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const actionId = ref(null)
    const isEdit = ref(false)
    const groupEditActions = reactive({
      workFlowActionId: "",
      executionOffsetDays: "",
      workFlowEventOffsetFieldId: "",
      executionOffsetType: "",
      actionsField: [],
    })
    const groupEditActionsForm = reactive({ ...groupEditActions })
    const formRef = ref()

    const editWorkflowAction = computed(() => {
      return store.state.workflow.editWorkflowAction
    })

    function reset() {
      formRef.value.resetFields()
      Object.assign(groupEditActions, groupEditActionsForm)
      groupEditActions.actionsField = []
    }
    const globalCode = computed(() => {
      return store.state.common;
    })
    const workflow = computed(() => {
      return store.state.workflow;
    })

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    function action(id) {
      actionId.value = id
      store.dispatch("actionsField", {
        workflowId: route.params.workflowUdid,
        actionId: id,
      })
    }

    function submitForm() {
      let data = [];
      if(editWorkflowAction.value != null) {
        editWorkflowAction.value.actionsField.map((item, i) => {
          let valueSelected = null;
          if (workflow.value.actionsField[i]?.type == "Date") {
            valueSelected = timeStamp(item);
          }
          else {
            valueSelected = item;
          }
          data.push({
            id: workflow.value.actionsField[i].id,
            value: valueSelected,
            type: workflow.value.actionsField[i].type
          })
        })
        store.dispatch("updateAction", {
          data: {
            workFlowActionId: groupEditActions.workFlowActionId,
            executionOffsetDays: groupEditActions.executionOffsetDays,
            workFlowEventOffsetFieldId: groupEditActions.workFlowEventOffsetFieldId,
            executionOffsetType: groupEditActions.executionOffsetType,
            actionsField: data,
          },
          workflowId: route.params.workflowUdid,
          actionId: editWorkflowAction.value.id,
        }).then((response) => {
          if(response == true) {
            store.dispatch("actionsList", {
              workflowId: route.params.workflowUdid,
              actionId: editWorkflowAction.value.id,
            })
            emit('closeModal')
            groupEditActions.actionsField = []
            store.state.workflow.actionsField = null
            store.commit('editWorkflowAction', null)
          }
        })
      }
      else {
        groupEditActions.actionsField.map((item, i) => {
          let valueSelected = null;
          if (workflow.value.actionsField[i]?.type == "Date") {
            valueSelected = timeStamp(item);
          }
          else {
            valueSelected = item;
          }
          data.push({
            id: workflow.value.actionsField[i].id,
            value: valueSelected,
            type: workflow.value.actionsField[i].type
          })
        })
        store.dispatch("addActions", {
          data: {
            workFlowActionId: groupEditActions.workFlowActionId,
            executionOffsetDays: groupEditActions.executionOffsetDays,
            workFlowEventOffsetFieldId: groupEditActions.workFlowEventOffsetFieldId,
            executionOffsetType: groupEditActions.executionOffsetType,
            actionsField: data,
          },
          workflowId: route.params.workflowUdid
        }).then((response) => {
          if(response == true) {
            store.commit('editWorkflowAction', null)
            store.dispatch("actionsList", {
              workflowId: route.params.workflowUdid,
            })
            emit('closeModal')
            groupEditActions.actionsField = []
            store.state.workflow.actionsField = null
          }
        })
      }
    }

    function onFinishFailed(value) {
      console.error("editGroupAction", value);
    }

    watchEffect(() => {
      if(editWorkflowAction.value != null) {
        groupEditActions.workFlowActionId = editWorkflowAction.value.workFlowActionId
        groupEditActions.executionOffsetDays = editWorkflowAction.value.executionOffsetDays
        groupEditActions.workFlowEventOffsetFieldId = editWorkflowAction.value.workFlowEventOffsetFieldId
        groupEditActions.executionOffsetType = editWorkflowAction.value.executionOffsetType

        if(workflow.value.actionsField?.length > 0) {
          let valueSelected = [];
          editWorkflowAction.value.actionsField.map((item, i) => {
            if (workflow.value.actionsField[i].type == "Date") {
              valueSelected.splice(i, 0, dateOnlyFormat(item.fieldValue));
            }
            else {
              valueSelected.splice(i, 0, item.fieldValue);
            }
          })
          groupEditActions.actionsField = valueSelected
        }
      }
      
      store.dispatch("actionsOffset", route.params.workflowUdid)
      if(props.actionId) {
        store.dispatch("actionsList",{
          workflowId: route.params.workflowUdid,
        })
      }
    })

    const actionsOffset = computed(() => {
      return store.state.workflow.actionsOffset
    })

    const handleGlobalChange = (data, type) => {
      if (type == "groupEditActions.workFlowActionId") {
        groupEditActions.workFlowActionId = data;
      }
    }

    const editAction = (value) => {
      isEdit.value = value
    }

    const closeModal = () => {
      store.commit('actionsField', null)
      store.commit('editWorkflowAction', null)
      Object.assign(groupEditActions, groupEditActionsForm)
    }

    const handleCustomFormChange = (id) => {
      groupEditActions.actionsField.push(id)
    }

    return {
      editWorkflowAction,
      handleCustomFormChange,
      actionsOffset,
      moment,
      timeStamp,
      submitForm,
      globalDateFormat,
      onFinishFailed,
      workflow,
      action,
      checkChangeInput,
      formRef,
      reset,
      groupEditActions,
      globalCode,
      size: ref("large"),
      handleGlobalChange,
      actionId,
      editAction,
      closeModal,
    }
  }
}
</script>

<style scoped>
.table {
  margin-top: 20px;
}
</style>
