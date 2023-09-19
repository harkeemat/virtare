<template>
  <a-modal max-width="1000px" width="80%" :title="'WorkFlow Configuration : '+workflowTitle" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form ref="formRef" :model="workflowConfigurationForm" layout="vertical" @finish="submitForm" autocomplete="off" style="margin-top:20px" v-if="workflowColumns.length > 0" >
      
      <a-row :gutter="24" v-for="(item, index) in workflowConfigurationForm.configurationColumns" :key="item.id">
        <a-col :span="7">
          <a-form-item label="Criteria" :name="['fieldId', index, 'fieldId']" :rules="[{ required: false, message: 'Criteria'+' '+$t('global.validation') }]">
            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="item.fieldId" style="width: 100%" size="large" @focus="focus" placeholder="Choose Operator">
              <a-select-option v-for="column in workflowColumns" :key="column.id" :value="column.id">{{column.title}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        
        <a-col :span="7">
          <a-form-item label="Operator" :name="['operator', index, 'operator']" :rules="[{ required: false, message: 'Operator'+' '+$t('global.validation') }]">
            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="item.operator" style="width: 100%" size="large" @focus="focus" @change="handleChange" placeholder="Choose Operator">
              <a-select-option v-for="operator in workflowColumns[index].operator" :key="operator.id" :value="operator.id">{{operator.operator}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="7" v-if="workflowColumns[index].value.length > 0">
          <a-form-item label="Value" :name="['value', index, 'value']" :rules="[{ required: false, message: 'Value'+' '+$t('global.validation') }]">
            <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" mode="multiple" v-model:value="item.value" style="width: 100%" size="large" @focus="focus" @change="handleChange" placeholder="Choose Value">
              <a-select-option v-for="value in workflowColumns[index].value" :key="value.id" :value="value.id">{{value.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="7" v-else>
          <a-form-item label="Value" :name="['value', index, 'value']" :rules="[{ required: false, message: 'Value'+' '+$t('global.validation') }]">
            <a-input v-model:value="item.value" size="large" placeholder="Enter Count" />
          </a-form-item>
        </a-col>

        <a-col :span="3">
          <span class="roundBtn"><PlusCircleOutlined @click="addFields" /></span>
          <span class="roundBtn"><DeleteOutlined v-if="workflowConfigurationForm.configurationColumns && workflowConfigurationForm.configurationColumns.length > 1 && index > 0" @click="removeFields(index)" /></span>
        </a-col>
      </a-row>
      
      <a-col :span="24">
        <div class="steps-action">
          <a-button type="primary" html-type="submit">{{$t('global.save')}}</a-button>
        </div>
      </a-col>

    </a-form>

    <div v-else>
      <Alert :text="'Please add Criteria for this Workflow'" type="error" :closable="false" :isPin="false" />
    </div>
    
  </a-modal>
</template>


<script>
import { computed, reactive, ref, watchEffect } from 'vue-demi'
import { useStore } from 'vuex'
import {
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import Alert from "@/components/common/Alert/Alert";

export default {
  components: {
    PlusCircleOutlined,
    DeleteOutlined,
    Alert,
  },
  props: {
    workflowId: {
      type: Number,
    },
    workflowTitle: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const columnOperators = ref([])
    const columnValues = ref([])

    const workflowConfigurationForm = reactive({
      configurationColumns: [{
        fieldId: '',
        operator: "",
        value: [],
      }],
    })

    const workflowCriteriaDetails = computed(() => {
      return store.state.workflow.workflowCriteriaDetails
    })

    watchEffect(() => {
      if(workflowCriteriaDetails.value.length > 0) {
        workflowConfigurationForm.configurationColumns = workflowCriteriaDetails.value
      }
    })

    const workflowColumns = computed(() => {
      return store.state.workflow.workflowColumns
    })

    const closeModal = () => {
      emit('closeModal')
    }
    
    const addFields = () => {
      workflowConfigurationForm.configurationColumns.push({
        fieldId: '',
        operator: "",
        value: [],
      });
    }

    const removeFields = (index) => {
      if(index !== -1) {
        workflowConfigurationForm.configurationColumns.splice(index, 1);
      }
    };

    const submitForm = () => {
      let data = {
        id: props.workflowId,
        criteria: JSON.stringify(workflowConfigurationForm.configurationColumns)
      }
      store.dispatch('addWorkflowCriteria', data).then(() => {
        emit('closeModal')
      })
    }

    return {
      workflowConfigurationForm,
      workflowColumns,
      closeModal,
      addFields,
      removeFields,
      columnOperators,
      columnValues,
      submitForm,
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