<template>
  <a-modal max-width="1000px" width="60%" :title="update ? 'Edit WorkFlow' : 'Create WorkFlow'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :model="eventDetails" ref="formRef" name="eventDetails"  autocomplete="off" scrollToFirstError=true layout="vertical" @finish="submitForm" @finishFailed="onFinishFailed">
      <a-row :gutter="24">
        
        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item label="Event" name="eventId" :rules="[{ required: true, message: 'Event' +' '+$t('global.validation')  }]">
              <WorkflowEventsDropdownSearch v-model:value="eventDetails.eventId" @handleEventChange="handleEventChange($event)" @change="checkChangeInput()" :disabled="update"/>
            </a-form-item>
          </div>
        </a-col>
        
        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item label="WorkFlow Name" name="title" :rules="[{required: true,message:'Title ' +$t('global.validation'),},]">
              <a-input v-model:value="eventDetails.title" size="large" style="width: 100%"/>
            </a-form-item>
          </div>
        </a-col>

        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.startDate')" name="startDate" :rules="[{ required: true, message: $t('global.startDate')+' '+$t('global.validation')  }]">
              <DateField   :disabledDateData="d => !d || d.isBefore(moment().subtract(1,'days'))" v-model:value="eventDetails.startDate" :globalDateFormat="globalDateFormat" :value-format="globalDateFormat" :size="size" style="width: 100%" @change="checkChangeInput(); changeDate()" />
            </a-form-item>
          </div>
        </a-col>

        <a-col :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.endDate')" name="endDate" :rules="[{ required: false, message: $t('global.endDate')+' '+$t('global.validation')  }]">
              <DateField   :disabledDateData="d => !d || d.isBefore(moment().subtract(1,'days'))" v-model:value="eventDetails.endDate" :globalDateFormat="globalDateFormat" :value-format="globalDateFormat" :size="size" style="width: 100%" @change="checkChangeInput(); changeDate()" />
            </a-form-item>
          </div>
        </a-col>

        <a-col :span="24">
          <div class="form-group">
            <a-form-item label="Description" name="description" :rules="[{required: false,message:'Description ' +$t('global.validation'),},]">
              <a-textarea :rows="4" v-model:value="eventDetails.description" />
            </a-form-item>
          </div>
        </a-col>

        <a-col :span="24">
          <div class="steps-action" v-if="update">
            <a-button type="primary" html-type="submit">{{$t('global.update')}}</a-button>
          </div>
          <div class="steps-action" v-else>
            <a-button html-type="reset"  style="margin-right: 8px" @click="reset()">{{$t('global.clear')}}</a-button>
            <a-button type="primary" html-type="submit">{{$t('global.save')}}</a-button>
          </div>
        </a-col>

      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import { reactive, ref, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import WorkflowEventsDropdownSearch from "@/components/modals/search/WorkflowEventsDropdownSearch";
import {
  timeStamp,
  endTimeAdd,
  warningSwal,
  globalDateFormat,
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import moment from "moment";
import DateField from "@/components/modals/search/DateField.vue";
export default {
  name: "CreateWorkFlow",
  components: {
    WorkflowEventsDropdownSearch,
    DateField
  },
  props: {
    update: {
      type: Boolean
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const eventDetails = reactive({
      workflowEventId: 225,
      eventId: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    const formRef = ref();

    const editWorkflow = computed(() => {
      return store.state.workflow.editWorkflow;
    });

    const submitForm = () => {
      eventDetails.startDate = timeStamp(
        endTimeAdd(moment(eventDetails.startDate))
      );
      eventDetails.endDate = timeStamp(
        endTimeAdd(moment(eventDetails.endDate))
      );
      if(props.update) {
        store.dispatch("updateWorkFlow", {
          data: eventDetails,
          id: editWorkflow.value.id,
        }).then((response) => {
          if (response == true) {
            emit("saveModal", false);
            store.dispatch("workflowList");
          }
        });
      }
      else {
        store.dispatch("addWorkFlow", eventDetails).then((response) => {
          if (response == true) {
            emit("saveModal", false);
            store.dispatch("workflowList");
          }
        });
      }
    }

    const onFinishFailed = (value) => {
      console.log(value);
    }

    const reset = ()  => {
      formRef.value.resetFields();
    }

    const checkChangeInput = ()  => {
      store.commit("checkChangeInput", true);
    }

    const changeDate = ()  => {
      if (moment(eventDetails.startDate) > moment(eventDetails.endDate)) {
        eventDetails.endDate = "";
      }
    }

    const form = reactive({ ...eventDetails });

    const globalCode = computed(() => {
      return store.state.common;
    });

    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput; 
    });

    const closeModal = () => {
      if (checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("saveModal", false);
            Object.assign(eventDetails, form);
            store.state.common.checkChangeInput = false;
          } else {
            emit("saveModal", true);
          }
        });
      }
      else {
        Object.assign(eventDetails, form);
        formRef.value.resetFields();
      }
    }

    watchEffect(() => {
      if(!props.update) {
        Object.assign(eventDetails, form);
      }
      else {
        Object.assign(eventDetails, editWorkflow.value);
      }
      store.dispatch("workflowEvents");
      store.dispatch("workflowList");
    });

    const handleEventChange = (value) => {
      eventDetails.eventId = value;
    }

    return {
      globalDateFormat,
      checkFieldsData,
      closeModal,
      moment,
      changeDate,
      globalCode,
      checkChangeInput,
      formRef,
      onFinishFailed,
      submitForm,
      reset,
      size: ref("large"),
      eventDetails,
      events: store.getters.events,
      editWorkflow,
      handleEventChange,
    };
  },
};
</script>