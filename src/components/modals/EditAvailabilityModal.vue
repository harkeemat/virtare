<template>
  <a-modal  width="40%" title="Edit Availability" centered :footer="false" @cancel="closeModal()">
    <a-form :model="editAvailabilityForm" ref="formRest" :footer="null" autocomplete="off" layout="vertical" @finish="submitForm">
      <a-row :gutter="24">
        <a-col :span="12">
          <div class="form-group">
            <a-form-item :label="$t('global.startTime')" name="startTime" :rules="[{ required: true, message: $t('global.startTime')+' '+$t('global.validation') }]">
              <a-time-picker use12-hours :disabledHours="() => disableHours" format="hh:mm A" v-model:value="editAvailabilityForm.startTime" value-format="HH:mm"  @change="checkChangeInput(); getTime('startTime')" @openChange="startTimechange"/>
              <ErrorMessage v-if="errorMsg" :name="errorMsg.startTime ? errorMsg.startTime[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="form-group">
            <a-form-item :label="$t('global.endTime')" name="endTime" :rules="[{ required: true, message: $t('global.endTime')+' '+$t('global.validation') }]">
              <a-time-picker v-model:value="editAvailabilityForm.endTime" :disabledHours="() => disableHours" use12-hours format="hh:mm A" value-format="HH:mm"  @change="checkChangeInput(); getTime('endTime')" @openChange="endTimechange" />
              <ErrorMessage v-if="errorMsg" :name="errorMsg.endTime ? errorMsg.endTime[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
      </a-row>
      <a-col :span="17">
        <a-button type="primary" html-type="submit" :disabled="button ? false : true" style="float:right">{{$t('global.update')}}</a-button>
      </a-col>
    </a-form>
    <Loader />
  </a-modal>
</template>
<script>
import { computed, watchEffect, reactive, ref, onUnmounted } from "vue-demi";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  timeStamp,
  // timeStampFormate,
  disableHours,
  errorSwal,
} from "../../commonMethods/commonMethod";
import moment from "moment";
import Loader from "@/components/loader/Loader";
import { messages } from "@/config/messages";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import dayjs from 'dayjs';

export default {
  props: {
    isAvailabilityEdit: {
      type: Number,
    },
  },
  components: {
    Loader,
    ErrorMessage,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const paramId = route.params.udid;
    const formRef = ref();
    const button = ref(true);
    var isEdit = reactive(props.isAvailabilityEdit);

    const availabilityDetails = computed(() => {
      return store.state.careCoordinator.availabilityDetails;
    });

    const editAvailabilityForm = reactive({
      startTime: "",
      endTime: "",
    });

    const addStaff = computed(() => {
      return store.state.careCoordinator.addStaff;
    });

    watchEffect(() => {
      if (isEdit) {
        Object.assign(editAvailabilityForm, availabilityDetails.value);
      }
    });

    function endTimechange(e) {
      if (e && !editAvailabilityForm.endTime) {
        const m = dayjs();
        m.set({
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        editAvailabilityForm.endTime = m;
      }
      if (!e) {
        if (typeof editAvailabilityForm.endTime == "object") {
          editAvailabilityForm.endTime = "";
        }
      }
    }

    function startTimechange(e) {
      if (e && !editAvailabilityForm.startTime) {
        const m = dayjs();
        m.set({
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        });

        editAvailabilityForm.startTime = m;
      }
      if (!e) {
        if (typeof editAvailabilityForm.startTime == "object") {
          editAvailabilityForm.startTime = "";
        }
      }
    }

    const form = reactive({
      ...editAvailabilityForm,
    });

    const submitForm = () => {
      isEdit = false;
      button.value = false;
      let startTime = timeStamp(
        moment().format("MM/DD/YYYY") +
          " " +
          editAvailabilityForm.startTime +
          ":00"
      );
      let endTime = timeStamp(
        moment().format("MM/DD/YYYY") +
          " " +
          editAvailabilityForm.endTime +
          ":00"
      );
      const data = {
        startTime: startTime,
        endTime: endTime,
      };
      if (startTime === endTime || startTime > endTime) {
        errorSwal(messages.startTimeAndEndTime);
        button.value = true;
      } else {
        store
          .dispatch("updateAvailability", {
            id: addStaff.value ? addStaff.value.id : route.params.udid,
            availabilityId: availabilityDetails.value.id,
            data: data,
          })
          .then((resp) => {
            if (resp == true) {
              emit("closeModal");
              Object.assign(editAvailabilityForm, form);
              store.dispatch(
                "availabilityList",
                addStaff.value ? addStaff.value.id : route.params.udid
              );
            } else {
              button.value = true;
            }
          });
      }
    };

    function getTime() {
      // if (event == "startTime") {
      //   let timeSelect = timeStamp(moment().format("MM/DD/YYYY") + " " +editAvailabilityForm.startTime +":00");
      //   if (timeStampFormate(timeSelect, "HH:00") < "08:00" || timeStampFormate(timeSelect, "HH:00") > "20:00") {
      //     editAvailabilityForm.startTime = "";
      //   }
      // } else {
      //   let timeSelect = timeStamp(moment().format("MM/DD/YYYY") +" " +editAvailabilityForm.endTime +":00");
      //   if (timeStampFormate(timeSelect, "HH:00") < "08:00" ||timeStampFormate(timeSelect, "HH:00") > "20:00") {
      //     editAvailabilityForm.endTime = "";
      //   }
       
      // }

        let startTime =
          moment().format("MM/DD/YYYY") + " " + editAvailabilityForm.startTime + ":00";
        let endTime =
          moment().format("MM/DD/YYYY") + " " + editAvailabilityForm.endTime + ":00";
        let minutes = moment(endTime).diff(moment(startTime), "minutes");
        if (minutes < 30) {
          editAvailabilityForm.endTime = "";
        }
    }

    function checkChangeInput() {
      store.commit("errorMsg", null);
      store.commit("checkChangeInput", true);
    }

    const checkChangedInput = computed(() => {
      return store.state.common.checkChangeInput;
    });

    const closeModal = () => {
      emit("closeModal", checkChangedInput.value);
    };

    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg;
    });
    onUnmounted(() => {
      store.commit("errorMsg", null);
    });
    return {
      errorMsg,
      endTimechange,
      startTimechange,
      button,
      disableHours,
      checkChangeInput,
      addStaff,
      formRef,
      editAvailabilityForm,
      paramId,
      submitForm,
      getTime,
      closeModal,
    };
  },
};
</script>
