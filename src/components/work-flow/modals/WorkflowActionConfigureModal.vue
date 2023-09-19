<template>
  <a-modal max-width="1000px" width="50%" :title="'Configure Action : '+editWorkflowAction.workflowActionName" centered :footer="false" :maskClosable="false" @cancel="closeModal">
    <a-form ref="formRef" :model="actionConfigurationForm" layout="vertical" @finish="submitForm" autocomplete="off" style="margin-top:20px" v-if="customFormFields.length > 0" >

      <a-row :gutter="24">  
        <a-col :span="24">
          <a-form-item :label="'Criteria Name'" name="criteriaName" :rules="[{ required: true, message: 'Criteria Name'+' '+$t('global.validation') }]">
            <a-input v-model:value="actionConfigurationForm.criteriaName" size="large" placeholder="Enter Name" />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-row :gutter="24" v-for="(configurationColumn, index) in actionConfigurationForm.configurationColumns" :key="configurationColumn.id">
        
        <a-col :span="7">
          <a-form-item :label="'Field'" name="fieldId" :rules="[{ required: false, message: 'Field'+' '+$t('global.validation') }]">
            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="configurationColumn.fieldId" style="width: 100%" size="large" @focus="focus" placeholder="Choose Field">
              <a-select-option v-for="field in customFormFields" :key="field.id" :value="field.id">{{field.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="7">
          <a-form-item label="Operator" name="Operator" :rules="[{ required: false, message: 'Operator'+' '+$t('global.validation') }]">
            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="configurationColumn.operator" style="width: 100%" size="large" @focus="focus" @change="handleChange" placeholder="Choose Operator">
              <!-- <a-select-option value="981cae91-fd30-40b7-8332-08415c70ccc4">Less Than</a-select-option> -->
              <a-select-option value="306871c2-d8a5-4cef-a51f-86262d667324">Equal To</a-select-option>
              <!-- <a-select-option value="8ba44287-7bca-46df-b741-629a15da218f">Greater Than</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="7">
          <a-form-item label="Value" name="Value" :rules="[{ required: false, message: 'Value'+' '+$t('global.validation') }]">
            <a-input v-model:value="configurationColumn.value" size="large" placeholder="Enter Count" />
          </a-form-item>
        </a-col>

        <a-col :span="3">
          <span class="roundBtn"><PlusCircleOutlined @click="addFields" /></span>
          <span class="roundBtn"><DeleteOutlined v-if="actionConfigurationForm.configurationColumns && actionConfigurationForm.configurationColumns.length > 1 && index > 0" @click="removeFields(index)" /></span>
        </a-col>
        
      </a-row>
      
      <a-col :span="24">
        <div class="steps-action">
          <a-button type="primary" html-type="submit">{{$t('global.save')}}</a-button>
        </div>
      </a-col>
    </a-form>
  </a-modal>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue-demi'
import { useStore } from 'vuex'
import {
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useRoute } from 'vue-router';

export default {
  components: {
    PlusCircleOutlined,
    DeleteOutlined,
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    // const customFormId = ref(null)

    const editWorkflowAction = computed(() => {
      return store.state.workflow.editWorkflowAction
    })

    const customFormDetails = computed(() => {
      return store.state.workflow.customFormDetails
    })

    const actionConfigurationForm = reactive({
      criteriaName: "",
      configurationColumns: [{
        fieldId: '',
        operator: "",
        value: [],
      }],
    })

    const customFormFields = ref([])

    onMounted(() => {
      editWorkflowAction.value.actionsField.map(field => {
        if(editWorkflowAction.value.workflowActionName == "Custom Form") {
          // customFormId.value = JSON.parse(field.fieldValue).fieldValue
          store.dispatch('customFormDetails', field.fieldValue).then(() => {
            customFormDetails.value.fields.map(formField => {
              customFormFields.value.push(formField)
            })
          })
        }
      })
    })

    const closeModal = () => {
      emit('closeModal')
    }

    const submitForm = () => {
      let data = {
        workflowId: route.params.workflowUdid,
        actionId: route.params.actionUdid,
        criteria: actionConfigurationForm.configurationColumns
        // criteria: JSON.stringify(actionConfigurationForm)
      }
      /* store.dispatch('addWorkflowCriteria', data).then(() => {
        emit('closeModal')
      }) */
    }
    
    const addFields = () => {
      actionConfigurationForm.configurationColumns.push({
        fieldId: '',
        operator: "",
        value: [],
      });
    }

    const removeFields = (index) => {
      if(index !== -1) {
        actionConfigurationForm.configurationColumns.splice(index, 1);
      }
    };

    return {
      editWorkflowAction,
      closeModal,
      customFormDetails,
      actionConfigurationForm,
      customFormFields,
      submitForm,
      addFields,
      removeFields,
    }
  }
}
</script>

<style>
.roundBtn .anticon {
  font-size: 25px;
  margin-right: 10px;
  height: 40px;
  color: #1D8FFB;
  position: relative;
  top: 40px;
}
.roundBtn .anticon-delete {
  color: #dc3545;
}
</style>