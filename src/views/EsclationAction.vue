<template>
  <div class="loginWrapper">
    <div class="logIn">
      <div class="loginInner">
        <a-row>
          <a-col :xs="24" :md="12">
            <div class="leftWrapper">
              <div>
                <div class="logo">
                  <img src="@/assets/images/logo/logo-big.svg" alt="image" />
                </div>
                <img
                  class="rightImg"
                  src="@/assets/images/circle.png"
                  alt="image"
                />
              </div>
            </div>
          </a-col>
          <a-col :md="12">
            <div class="rightWrapper">
              <!-- <img
                class="rightImg"
                src="@/assets/images/curve.png"
                alt="image"
              /> -->
                            <Loader v-if="isLoading" />
              <a-form
                class="common-form"
                ref="formRef"
                @finish="checkRefId"
                :model="checkUdid"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                autocomplete="off"
                v-else-if="!state.alerts.isIdCorrect"
              >
                <a-row :gutter="[48, 16]">
                  <a-col :span="24">
                    <a-typography-textphoneNumber
                      >Please enter your reference number to complete the
                      action.
                    </a-typography-textphoneNumber>
                  </a-col>
                  <a-col :lg="24" :md="24">
                    <a-form-item
                      class="required"
                      :rules="[
                        { required: true, message: $t('global.required') },
                      ]"
                      name="reference_no"
                      :label="$t('alerts.udid')"
                    >
                      <InputFields
                        v-model:value="checkUdid.reference_no"
                        :placeholderData="$t('alerts.udid')"
                        @keyup="clearRefVal"
                      />
                      <ErrorMessage
                        v-if="state.alerts.refError"
                        :name="state.alerts.refError"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="24" class="text-right">
                    <a-button
                      class="primary-btn"
                      html-type="submit"
                      :loading="state.alerts.checkingRef"
                      :disabled="state.alerts.checkingRef"
                    >
                      {{ $t("alerts.btnTxt") }}
                    </a-button>
                  </a-col>
                </a-row>
              </a-form>
              <a-form
                class="common-form"
                ref="formRef"
                @finish="submitForm"
                :model="formData"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                autocomplete="off"
                v-else-if="
                  state.alerts.isIdCorrect && !state.alerts.actionTaken
                "
              >
                <a-typography-title :level="2" class="common-heading">
                  {{ $t("alerts.alert") }}
                </a-typography-title>

                <a-row :gutter="[48, 16]">
                  <a-col :lg="24" :md="24">
                    <a-form-item
                      :label="$t('alerts.name')"
                      class="required"
                      :rules="[
                        { required: true, message: $t('global.required') },
                      ]"
                      name="contactId"
                    >
                      <InputFields
                        :placeholderData="$t('alerts.name')"
                        v-model:value="formData.contactId"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :lg="24" :md="24" :xs="24">
                    <a-form-item
                      :label="$t('alerts.action')"
                      class="required"
                      :rules="[
                        { required: true, message: $t('global.required') },
                      ]"
                      name="actionStatus"
                    >
                      <SelectBox
                        :placeholderData="$t('alerts.action')"
                        :globalCode="state.alerts.actions"
                        :maxLength="12"
                        :maxtag="4"
                        :notFoundContent="true"
                        v-model:value="formData.actionStatus"
                      />
                      <!-- <ErrorMessage v-if="error.notes" :name="error.notes[0]" /> -->
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item
                      :label="$t('alerts.actionNotes')"
                      name="actionNote"
                    >
                      <a-textarea
                        :rows="4"
                        :placeholder="`${$t('alerts.notes')}...`"
                        v-model:value="formData.actionNote"
                      />
                      <!-- <ErrorMessage v-if="error" :name="error?.insurance?.insuranceName ? error?.insurance?.insuranceName[0] : ''" /> -->
                    </a-form-item>
                  </a-col>
                  <a-col :span="24" class="text-right">
                    <a-button
                      class="primary-btn"
                      html-type="submit"
                      :loading="state.alerts.genratingAction"
                      :disabled="state.alerts.actionTaken"
                    >
                      {{ $t("alerts.btnTxt") }}
                    </a-button>
                  </a-col>
                </a-row>
              </a-form>
              <thank-you
                message="For taking action"
                v-else-if="state.alerts.actionTaken && state.alerts.isIdCorrect"
              />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  // defineEmits,
  watchEffect,
  onMounted,
  onUnmounted,
  ref,
  computed,
  watch,
} from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue";
import WelcomeScreen from "@/components/common/Welcome";
import Loader from "@/components//Loader";
import InputFields from "@/components/form-fields/InputFields.vue";
import ThankYou from "@/components/alerts/Thankyou";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const { dispatch, state, commit } = useStore();
const { params } = useRoute();

const formData = reactive({
  // patientId: params.udid,
  // sendTo: [],
  // type: "",
  // reason: "",
  // notes: "",
  actionNote: "",
  actionStatus: "",
  contactId: "",
});

const checkUdid = reactive({
  reference_no: "",
});

// const isAction = ref(true);
const isLoading = ref(false);

const labelCol = { span: 24 };
const columns = [
  {
    title: "Name",
    dataIndex: "createdName",
    key: "name",
  },
  {
    title: "Action",
    dataIndex: "actionStatus",
    key: "action",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Notes",
    dataIndex: "actionNote",
    key: "actionNote",
  },
];

const isCreated = computed(() => state.alerts.isCreated);
const emit = defineEmits(["hideDrawer"]);

const checkRefId = async () => {
  dispatch("alerts/checkRefId", checkUdid);
};

const clearRefVal = () => {
  if (state.alerts.refError !== "") commit("alerts/refError", "");
};

watch(isCreated, (status) => {
  if (status) emit("hideDrawer");
});

watch(params,newId => {
  console.log(newId)
})

/** adding value for action screen.  */
watchEffect(() => {
  if (!state.alerts.isEscLoading) {
    for (const key in formData) {
      if (key != "actionNote") formData[key] = state.alerts.escalation[key];
    }
  }
});

onMounted(async () => {
  isLoading.value = true;
  commit("alerts/actionTaken", false);
  if (params.id)
    await dispatch("alerts/checkUrlReff", {
      reference_no: params.id,
    });
  else commit("alerts/isIdCorrect", false);
  // if (params.id)
  //   await dispatch("alerts/fetchPeople", state.alerts?.escalation?.patientId);
  // await dispatch("alerts/carePeopleList", params.id);

  await dispatch("alerts/fetchType");
  await dispatch("alerts/fetchActionStatus");
  isLoading.value = false;
});

onUnmounted(() => {});

const submitForm = () => {
  dispatch("alerts/externalActionPlan", {
    contactId: formData.contactId,
    actionNote: formData.actionNote,
    actionStatus: formData.actionStatus,
    id: state.alerts.reff_id,
  });
};
</script>

<style lang="scss" scoped>
// .new-patient-heading {
//   margin-bottom: 74px;

//   .common-heading.ant-typography {
//     margin-bottom: 7px;
//   }
// }
// .common-form {
//   padding: 25px 50px;
// }
@import "@/assets/scss/variable.scss";
.leftWrapper {
  h3 {
    font-size: 18px;
    text-align: justify !important;
    position: relative;
    margin: 0 0 30px;

    &::before {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      height: 2px;
      background-color: $primary-color;
      width: 50px;
    }
  }
}
</style>

