<template>
  <Loader v-if="isLoading || state.alerts.isEscLoading" />
  <a-form
    class="common-form"
    ref="formRef"
    @finish="submitForm"
    :model="formData"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    autocomplete="off"
  >
    <div class="drawerBody">
      <a-row :gutter="[48, 16]">
        <a-col :span="12">
          <a-typography-title :level="2" class="common-heading">{{
            $t("alerts.alert")
          }}</a-typography-title>
        </a-col>
        <a-col :span="12" class="text-right">
          <a-button
            class="secondary-btn"
            v-if="
              state.alerts.isAction &&
              state.alerts.pdfLink &&
              !state.alerts?.escalation?.isInternal
            "
            type="link"
            :href="state.alerts.pdfLink"
            target="_blank"
          >
            {{ $t("alerts.pdfBtn") }}
          </a-button>
        </a-col>

        <a-col :span="24">
          <a-checkbox
            v-model:checked="formData.isInternal"
            @change="onisInternalChanged"
            :disabled="state.alerts.isAction"
            >{{ $t("alerts.isInternal") }}</a-checkbox
          >
        </a-col>
        <a-col :span="24">
          <a-form-item
            :label="$t('alerts.people')"
            :class="formData.isInternal ? '' : 'required'"
            :rules="[
              {
                required: !formData.isInternal,
                message: $t('global.required'),
              },
            ]"
            name="sendTo"
          >
            <a-select
              :placeholderData="$t('alerts.people')"
              v-model:value="formData.sendTo"
              mode="multiple"
              :max-tag-text-length="300"
              :notFoundContent="true"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              :disabled="formData.isInternal || state.alerts.isAction"
              :options="state.alerts.people"
              :max-tag-count="10"
              :filterOption="filterOption"
              show-search
            >
              <template #option="{label,type }">
                  <img
                    src="@/assets/images/icons/Specialist.svg"
                    class="dropdown-img"
                    :alt="type"
                    v-if="type === 'Out'"
                  />
                  <img
                    src="@/assets/images/icons/Nurse.svg"
                    :alt="type"
                    v-if="type === 'In'"
                    class="dropdown-img"
                  />
                  {{ label }}
             </template>
              <template
                #tagRender="{label, closable, onClose, option }"
              >
                <a-tag
                  :closable="closable"
                  style="margin-right: 3px"
                  @close="onClose"
                >
                  <img
                    src="@/assets/images/icons/Specialist.svg"
                    class="dropdown-img"
                    :alt="option?.type"
                    v-if="option?.type === 'Out'"
                  />
                  <img
                    src="@/assets/images/icons/Nurse.svg"
                    :alt="option?.type"
                    v-if="option?.type === 'In'"
                    class="dropdown-img"
                  />
                  {{ label }}
                </a-tag>
              </template>
            </a-select>
            <p style="margin-top: 2px" v-if="!state.alerts.isAction">
              <b style="margin-left: 1px">Note</b>: Disable option doesn't have
              email.
            </p>
            <ErrorMessage v-if="error.sendTo" :name="error.sendTo[0]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="$t('alerts.type')"
            class="required"
            :rules="[{ required: true, message: $t('global.required') }]"
            name="type"
          >
            <SelectBox
              :placeholderData="$t('alerts.type')"
              :maxLength="12"
              :maxtag="4"
              :globalCode="state.alerts.type"
              v-model:value="formData.type"
              :notFoundContent="true"
              :disabled="state.alerts.isAction"
            />
            <ErrorMessage v-if="error.type" :name="error.type[0]" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label="$t('alerts.reason')"
            :class="required_field('notes') ? 'required' : ''"
            :rules="[
              {
                required: required_field('notes'),
                message: $t('global.required'),
              },
            ]"
            name="reason"
          >
            <InputFields
              :placeholderData="$t('alerts.reason')"
              v-model:value="formData.reason"
              :disabled="state.alerts.isAction"
              @change="required_field('notes')"
            />
            <ErrorMessage v-if="error.reason" :name="error.reason[0]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            :label="$t('alerts.notes')"
            :class="required_field('reason') ? 'required' : ''"
            :rules="[
              {
                required: required_field('reason'),
                message: $t('global.required'),
              },
            ]"
            name="notes"
          >
            <a-textarea
              :rows="4"
              :placeholder="`${$t('alerts.notes')}...`"
              v-model:value="formData.notes"
              :disabled="state.alerts.isAction"
              @change="required_field('reason')"
              :maxlength="200"
            />
            <ErrorMessage v-if="error.notes" :name="error.notes[0]" />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="state.alerts.isAction">
          <a-row :gutter="[48, 16]">
            <a-col :span="24">
              <div class="form-heading">
                <a-typography-title :level="3">Action</a-typography-title>
                <a-typography-textphoneNumber
                  >Action taken by care team</a-typography-textphoneNumber
                >
              </div>
              <div v-if="state.alerts.histories.length > 0">
                <div class="form-heading">
                  <a-typography-textphoneNumber
                    >History</a-typography-textphoneNumber
                  >
                </div>
                <a-table
                  :dataSource="state.alerts.histories"
                  :columns="columns"
                  :pagination="false"
                />
              </div>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="$t('alerts.action')"
                class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
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
                :rules="[{ required: false, message: $t('global.required') }]"
                name="actionNote"
              >
                <a-textarea
                  :rows="4"
                  :placeholder="`${$t('alerts.notes')}...`"
                  v-model:value="formData.actionNote"
                  :maxlength="200"
                />
                <!-- <ErrorMessage v-if="error" :name="error?.insurance?.insuranceName ? error?.insurance?.insuranceName[0] : ''" /> -->
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div
      class="drawerFooter"
      :class="
        state.alerts.isAction && state.alerts.escalation.status !== 'Closed'
          ? `justifyBet`
          : ''
      "
    >
      <a-popconfirm
        :title="`Are you sure close this ${$t('alerts.alert')} ?  `"
        ok-text="Yes"
        cancel-text="No"
        @confirm="closeAlert"
        @cancel="cancel"
      >
        <Button
          v-if="
            state.alerts.isAction && state.alerts.escalation.status !== 'Closed'
          "
          classData="secondary-btn"
          :name="$t('alerts.closeAlert')"
        />
      </a-popconfirm>
      <a-space>
        <a-button class="secondary-btn" @click="emit('hideDrawer')">
          Cancel
        </a-button>
        <a-button
          v-if="!state.alerts.closeAlert"
          class="primary-btn"
          html-type="submit"
          :loading="state.alerts.isCreating"
          :disabled="disabledBtn"
        >
          {{ $t("alerts.btnTxt") }}
        </a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script setup>
import {
  reactive,
  // defineEmits,
  onMounted,
  onUnmounted,
  watchEffect,
  ref,
  computed,
  watch,
} from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue";
import Loader from "@/components//Loader";
import InputFields from "@/components/form-fields/InputFields.vue";
import { useStore } from "vuex";
import Button from "@/components/button/Button.vue";
import { useRoute } from "vue-router";
const { dispatch, state, commit } = useStore();
const { params } = useRoute();
const disabledBtn = ref(true);
const formRef = ref();
const formData = reactive({
  patientId: params.udid,
  sendTo: [],
  type: "",
  reason: "",
  notes: "",
  actionNote: "",
  isInternal: false,
  actionStatus: "",
});

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
    title: "Note",
    dataIndex: "actionNote",
    key: "actionNote",
  },
];

const isCreated = computed(() => state.alerts.isCreated);
const error = computed(() => state.alerts.createError);
const emit = defineEmits(["hideDrawer"]);
const closing = ref(false);
const test = ref(10);

watch(isCreated, (status) => {
  if (status) emit("hideDrawer");
});

/** check on field  */
const required_field = (value) => {
  if (formData[value] == "") {
    formRef.value?.clearValidate(value);
    return true;
  } else if (formData[value] != "") return false;
  else if (formData.reason != "" && formData.notes != "") return false;
};

/** adding value for action screen.  */
watchEffect(() => {
  if (!state.alerts.isEscLoading && state.alerts.isAction) {
    for (const key in formData) {
      if (key != "actionNote") formData[key] = state.alerts.escalation[key];
    }
    disabledBtn.value = state.alerts.escalation.status === "Closed";
  } else {
    disabledBtn.value = false;
  }
});

const filterOption = (input,option) => {
 return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const onisInternalChanged = (e) => {
  formData.sendTo = [];
  if (e.target.checked) {
    state.alerts?.people?.map((item) => {
      !item.disabled && item.type == "In"
        ? formData.sendTo.push(item.value)
        : "";
    });
  } else {
    formData.sendTo = [];
  }
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    dispatch("alerts/fetchType"),
    dispatch(
      "alerts/fetchPeople",
      state.alerts.escalation?.patientId
        ? state.alerts.escalation?.patientId
        : params.udid
    ),
  ]);
  if (state.alerts.isAction) await dispatch("alerts/fetchActionStatus");

  isLoading.value = false;
});

onUnmounted(() => {
  commit("alerts/isAction", false);
  commit("alerts/isCreated", false);
  commit("alerts/createError", {});
  commit("alerts/escalation", {});
  commit("alerts/escaltionId", "");
  commit("alerts/pdfLink", "");
  commit("alerts/closeAlert", "");
  isLoading.value = false;
});
const closeAlert = async () => {
  closing.value = true;
  await dispatch("alerts/closeAlert", { id: state.alerts?.escalation?.udid });
  closing.value = false;
};
const submitForm = () => {
  if (state.alerts.isAction)
    dispatch("alerts/takeAction", {
      actionNote: formData.actionNote,
      actionStatus: formData.actionStatus,
      patientId: params.udid,
    });
  else dispatch("alerts/create", formData);
};

const titleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
</script>

<style lang="scss" scoped>
.new-patient-heading {
  margin-bottom: 74px;

  .common-heading.ant-typography {
    margin-bottom: 7px;
  }
}

.dropdown-img {
  margin-right: 1%;
}
</style>
