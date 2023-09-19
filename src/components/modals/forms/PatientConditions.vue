<template>
  <a-form ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,21,'id','name'),'name','udid')" :model="conditions" name="basic" scrollToFirstError=true autocomplete="off" layout="vertical" @finish="submitForm">
    <a-row :gutter="24" class="mb-24">
   
      <a-col :md="24" :sm="24" :xs="24" :xl="12">
        <div class="form-group">
          <a-form-item :label="$t('patient.patientConditions')" name="condition" :rules="[{ required: true, message: $t('patient.patientConditions')+' '+$t('global.validation') }]">
            <ConditionCodeDropDown listHeight="400" :targetRecords="patientConditionsList" :editDataCondition="editDataCondition"  v-model:value="conditions.condition" @handleConditionChange="handleConditionChange($event)" @change="changedValue" mode="multiple" :disabled="isConditionEdit" :close="close"/>
            <ErrorMessage class="error" v-if="errorMsg" :name="errorMsg.condition?errorMsg.condition[0]:''" />
          
          </a-form-item>
        </div>
      </a-col>
      <a-col :md="8" :sm="6" :xs="24" :xl="6">
        <div class="form-group">
          <a-form-item :label="$t('global.startDate')" name="startDate" :rules="[{ required: true, message: $t('global.startDate')+' '+$t('global.validation') }]">
            <!-- <a-date-picker @change="changedValue('startDate')" v-model:value="conditions.startDate" :format="globalDateFormat" value-format="YYYY-MM-DD" :disabledDate="d => !d || d.isSameOrAfter(dateSelect)" style="width: 100%" size="large" /> -->
              <DateField @change="changedValue('startDate')" v-model:value="conditions.startDate" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :disabledDateData="current => !current || current > dayjs(dateSelect).subtract(0,'day')" style="width: 100%" size="large" />
            <ErrorMessage v-if="errorMsg" :name="errorMsg.startDate?errorMsg.startDate[0]:''" />
          </a-form-item>
        </div>
      </a-col>
      <a-col :md="8" :sm="6" :xs="24" :xl="6">
        <div class="form-group">
          <a-form-item :label="$t('global.endDate')" name="endDate" :rules="[{ required: false, message: $t('global.endDate')+' '+$t('global.validation') }]">
            <!-- <a-date-picker @change="changedValue()" :disabled="currentDate==conditions.startDate" v-model:value="conditions.endDate" :format="globalDateFormat" :disabledDate="d => !d || d.isSameOrBefore(moment().subtract(1,'days'))" value-format="YYYY-MM-DD" style="width: 100%" size="large" /> -->
              <DateField @change="changedValue()" :disabled="currentDate==conditions.startDate" v-model:value="conditions.endDate" :globalDateFormat="globalDateFormat" :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" value-format="YYYY-MM-DD" style="width: 100%" size="large"/>
            <ErrorMessage v-if="errorMsg" :name="errorMsg.endDate?errorMsg.endDate[0]:''" />
          </a-form-item>
        </div>
      </a-col>
      <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,21,'id','name'),'name','udid')"> </FormBaseComponents>
      <a-col :span="24">
        <a-button type="primary" html-type="submit" style="float:right">{{$t('global.save')}}</a-button>
      </a-col>
    </a-row>
    
  </a-form>

  <ConditionsTable @editCondition="editCondition" />
</template>

<script>
import ConditionsTable from '@/components/patients/data-table/ConditionsTable';
import { reactive, computed, ref, watchEffect, onMounted } from 'vue-demi';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
// import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import ConditionCodeDropDown from "@/components/modals/search/ConditionSearch.vue";
import { 
  timeStampLocal,
  globalDateFormat,
  arrayToObjectData,formTitleNames
} from '@/commonMethods/commonMethod';
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import moment from "moment"
import dayjs from 'dayjs';
import DateField from "@/components/modals/search/DateField.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
  components: {
    ConditionsTable,
    // GlobalCodeDropDown,
    ConditionCodeDropDown,
    ErrorMessage,
    DateField,
    FormBaseComponents
  },
  props: {
    idPatient: {
      type: String
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const conditionUdid = ref(null)
    const formRef = ref()
    const isEnabledEndDate = ref(false)
    const close = ref(false)
    const currentDate = moment().format("YYYY-MM-DD");

    const patientId = props.idPatient ? props.idPatient : route.params.udid

    const conditions = reactive({
      condition: [],
      startDate: "",
      endDate: "",
    });

    const form = reactive({ ...conditions })
    
    watchEffect(() => {
      store.dispatch('healthConditions')
    })

    onMounted(() => {

      store.dispatch('patientConditions', patientId);
    })

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg;
    });

    const isConditionEdit = computed(() => {
      return store.state.patients.isConditionEdit;
    });
    
    const conditionDetails = computed(() => {
      return store.state.patients.conditionDetails;
    });
    
    const healthConditions = computed(() => {
      return store.state.patients.healthConditions;
    });
    

    const changedValue = (value) => {
      store.commit("errorMsg", null);
      if(value && value == 'startDate') {
        isEnabledEndDate.value = true
      }
      emit('onChange')
    }

    const editCondition = (value) => {
      isEnabledEndDate.value = true
      Object.assign(conditions, value)
      conditionUdid.value = value.id
    }

    const submitForm = () => {
      
      if(!isConditionEdit.value) {
        const patientConditions = {
          condition: conditions.condition,
          startDate: timeStampLocal(conditions.startDate),
          endDate: conditions.endDate ? timeStampLocal(conditions.endDate) : '',
        };
        store.dispatch("addCondition", {
          data: patientConditions,
          id: patientId,
        })
        .then(() => {
          if(!errorMsg.value){
            close.value = true
          store.dispatch("patientConditions", patientId);
          reset()
          isEnabledEndDate.value = false
          setTimeout(()=>{
          close.value = false
          },100)
          
          }
        });
      }
      else {
        const patientConditions = {
          condition: conditions.condition,
          startDate: timeStampLocal(conditions.startDate),
          endDate: conditions.endDate ? timeStampLocal(conditions.endDate) : '',
        };
        store.dispatch("updateCondition", {
          data: patientConditions,
          patientUdid: patientId,
          conditionUdid: conditionUdid.value ? conditionUdid.value : conditionDetails.value.id,
        })
        .then(() => {
          close.value = true
          store.commit('isConditionEdit', false)
          store.dispatch("patientConditions", patientId);
          reset()
          isEnabledEndDate.value = false
          setTimeout(()=>{
          close.value = false
          },100)
        });
      }
     
    };

    function reset() {
      formRef.value.resetFields()
      Object.assign(conditions, form)    
    }

    const handleConditionChange = (val) => {
      store.commit("errorMsg", null);
            conditions.condition = val;
        };

    const editDataCondition = computed(() => {
      return store.state.patients.editConditionDetails;
    });

    const patientConditionsList = computed(() => {
      return store.state.patients.patientConditions
    })

    return {
      dayjs,
      patientConditionsList,
      currentDate,
      editDataCondition,
      handleConditionChange,
      formRef,
      conditions,
      healthConditions,
      errorMsg,
      submitForm,
      changedValue,
      editCondition,
      isConditionEdit,
      globalDateFormat,
      isEnabledEndDate,
      close,
      moment,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    }
  }
}
</script>