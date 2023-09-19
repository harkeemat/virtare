<template>
  <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,10,'id','name'),'name','udid')" :model="availability" ref="formRest" scrollToFirstError="true" name="basic"  autocomplete="off" layout="vertical" @finish="addAvailability" @finishFailed="availabilityDataFailed">
    <a-row :gutter="24">
      <a-col :md="12" :sm="12" :xs="24">
        <div class="form-group">
          <a-form-item :label="$t('global.startTime')" name="startTime" :rules="[{ required: true, message: $t('global.startTime')  + ' ' + $t('global.validation'), }]">
            <a-time-picker use12-hours :disabledHours="() => disableHours" format="hh:mm A" v-model:value="availability.startTime" value-format="HH:mm" @change="checkChangeInput(); getTime('startTime');" @openChange="startTimechange" />
            <ErrorMessage v-if="errorMsg" :name="errorMsg.startTime ? errorMsg.startTime[0] : ''" />
          </a-form-item>
        </div>
      </a-col>
      <a-col :md="12" :sm="12" :xs="24">
        <div class="form-group">
          <a-form-item :label="$t('global.endTime')" name="endTime" :rules="[{ required: true, message: $t('global.endTime') + ' ' + $t('global.validation') }]">
            <a-time-picker v-model:value="availability.endTime" :disabledHours="() => disableHours" use12-hours format="hh:mm A" value-format="HH:mm" @change="checkChangeInput();getTime('endTime')" @openChange="endTimechange" />
            <ErrorMessage v-if="errorMsg" :name="errorMsg.endTime ? errorMsg.endTime[0] : ''" />
          </a-form-item>
        </div>
      </a-col>
      <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,10,'id','name'),'name','udid')"> </FormBaseComponents>
    </a-row>
    <a-row :gutter="24" class="mb-24">
      <a-col :span="24" v-if="paramId" >
        <a-button html-type="reset" style="margin-right: 8px" @reset="reset()" @click="reset()">{{ $t("global.clear") }}</a-button>
        <a-button type="primary" html-type="submit" :disabled="button ? false : true">{{ $t("global.save") }}</a-button>
      </a-col>
      <a-col :span="24" v-else>
        <a-button type="primary" html-type="submit" :disabled="button ? false : true" style="float:right">{{ $t("global.save") }}</a-button>
      </a-col>
    </a-row>
  </a-form>
  <a-row :gutter="24" v-show="!paramId">
    <a-col :span="24">
      <AvailabilityTable :Id="Id" />
      <Loader />
    </a-col>
  </a-row>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  onUnmounted,
  watchEffect,
} from "vue";
// import { DeleteOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import Loader from "@/components/loader/Loader";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import AvailabilityTable from "../../care-coordinator/tables/AvailabilityTable.vue";
import moment from "moment";
import {
  timeStamp,
  errorSwal,
  disableHours,
  arrayToObjectData,
  formTitleNames
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import dayjs from "dayjs";
export default defineComponent({
  components: {
    // EditOutlined,
    // DeleteOutlined,
    Loader,
    ErrorMessage,
    AvailabilityTable,
    FormBaseComponents
  },
  props: {
    paramId: String,
    clearData: Boolean,
  },
  setup(props, { emit }) {
    const store = useStore();
    const formRest = ref();
    const availability = reactive({
      startTime: "",
      endTime: "",
    });
    const button = ref(true);
    const staffs = computed(() => {
      return store.state.careCoordinator;
    });

    function endTimechange(e) {
      if (e && !availability.endTime) {
        const m = dayjs();
        m.set({
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        availability.endTime = m;
      }
      if (!e) {
        if (typeof availability.endTime == "object") {
          availability.endTime = "";
        }
      }
    }

    function startTimechange(e) {
      if (e && !availability.startTime) {
        const m = dayjs();
        m.set({
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        availability.startTime = m;
      }
      if (!e) {
        if (typeof availability.startTime == "object") {
          availability.startTime = "";
        }
      }
    }

    function addAvailability() {
      button.value = false;
      let startTime = timeStamp(
        moment().format("MM/DD/YYYY") + " " + availability.startTime + ":00"
      );
      let endTime = timeStamp(
        moment().format("MM/DD/YYYY") + " " + availability.endTime + ":00"
      );

      // if (moment(moment().format('MM/DD/YYYY') + ' ' + availability.startTime+ ':00', 'DD-MM-YYYY HH:mm:ss').valueOf()=== moment(moment().format('MM/DD/YYYY') + ' ' + availability.endTime+ ':00', 'DD-MM-YYYY HH:mm:ss').valueOf() || moment(moment().format('MM/DD/YYYY') + ' ' + availability.startTime+ ':00', 'DD-MM-YYYY HH:mm:ss').valueOf() > moment(moment().format('MM/DD/YYYY') + ' ' + availability.endTime+ ':00', 'DD-MM-YYYY HH:mm:ss').valueOf()) {
      //     errorSwal(messages.startTimeAndEndTime)
      //     button.value = true
      // }
      if (
        parseInt(startTime) > parseInt(endTime) ||
        parseInt(startTime) === parseInt(endTime)
      ) {
        errorSwal(messages.startTimeAndEndTime);
        button.value = true;
      } else {
        store
          .dispatch("addAvailability", {
            id: props.paramId ? props.paramId : staffs.value.addStaff.id,
            data: {
              startTime: startTime,
              endTime: endTime,
            },
          })
          .then(() => {
            if (staffs.value.closeModal == true) {
              button.value = true;
              store.dispatch(
                "availabilityList",
                props.paramId ? props.paramId : staffs.value.addStaff.id
              );
              reset();
              emit("saveModal");
              button.value = true;
            } else {
              if (errorMsg.value) {
                button.value = true;
              }
            }
          });
      }
    }

    const Id = staffs.value.addStaff ? staffs.value.addStaff.id : "";

    const form = reactive({
      ...availability,
    });

    function reset() {
      formRest.value.resetFields();
      Object.assign(availability, form);
    }

    watchEffect(() => {
      if (props.clearData == true) {
        Object.assign(availability, form);
      }
      if (staffs.value.clearStaffFormValidation) {
        formRest.value.resetFields();
      }
    });
    onUnmounted(() => {
      store.commit("errorMsg", null);
    });

    function checkChangeInput() {
      store.commit("errorMsg", null);
      store.commit("checkChangeInput", true);
    }

    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg;
    });

    function getTime() {
      if (availability.endTime && availability.startTime) {
        let startTime =
          moment().format("MM/DD/YYYY") + " " + availability.startTime + ":00";
        let endTime =
          moment().format("MM/DD/YYYY") + " " + availability.endTime + ":00";
        let minutes = moment(endTime).diff(moment(startTime), "minutes");
        if (minutes < 30) {
          availability.endTime = "";
        }
      }
    }
    return {
      getTime,
      formRest,
      checkChangeInput,
      reset,
      Id,
      staffs,
      addAvailability,
      availability,
      size: ref("large"),
      errorMsg,
      button,
      disableHours,

      startTimechange,
      endTimechange,
      formData:store.getters.formTitle,
      arrayToObjectData,
      formTitleNames
    };
  },
});
</script>
