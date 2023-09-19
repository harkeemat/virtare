<template>
  <a-form
    ref="formRef"
    class="common-form"
    :model="careTeam"
    :label-col="labelCol"
    @finish="submitForm"
    autocomplete="off"
  >
    <div class="drawerBody">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-typography-title :level="2" class="common-heading">{{
            $t("patient.careTeam.assignCareTeam")
          }}</a-typography-title>
        </a-col>

        <a-col
          :span="24"
          v-if="store.state.clients.careTeamListByClient?.length > 0"
        >
          <a-row :gutter="[48, 16]">
            <a-col :span="24">
              <a-form-item
                class="required"
                label="Care Team"
                name="careTeamId"
                :rules="[{ required: true, message: $t('global.required') }]"
              >
                <a-checkbox-group
                  v-model:value="careTeam.careTeamId"
                  @change="careTeamChange"
                >
                  <a-checkbox
                    v-for="careTeam in store.state.clients.careTeamListByClient"
                    :key="careTeam?.udid"
                    :value="careTeam?.udid"
                    class="custom-checkbox"
                    >{{ careTeam?.name }}</a-checkbox
                  >
                </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                class="required"
                :label="$t('patient.careTeam.nurse')"
                name="nurseId"
                :rules="[{ required: true, message: $t('global.required') }]"
              >
                <SelectBox
                  v-model:value="careTeam.nurseId"
                  :placeholderData="$t('patient.careTeam.nurse')"
                  :globalCode="patientCareTeamRecord?.membersFromCareTeam"
                  :disabled="
                    patientCareTeamRecord?.membersFromCareTeam?.length > 0
                      ? false
                      : true
                  "
                  @changeData="nurseChange('nurse')"
                />
                <ErrorMessage
                  v-if="
                    patientCareTeamRecord?.careTeamError &&
                    !patientCareTeamRecord?.careTeamError?.type
                  "
                  :name="
                    patientCareTeamRecord?.careTeamError?.message
                      ? patientCareTeamRecord?.careTeamError?.message
                      : ''
                  "
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="$t('patient.careTeam.specialist')"
                :name="['specialist', 'specialistId']"
                :rules="[{ required: false, message: $t('global.required') }]"
              >
                <SelectBox
                  v-model:value="careTeam.specialist.specialistId"
                  :placeholderData="$t('patient.careTeam.specialist')"
                  :globalCode="patientCareTeamRecord?.specialistListDrowpDown"
                  :disabled="
                    patientCareTeamRecord?.specialistListDrowpDown?.length > 0
                      ? false
                      : true
                  "
                  @changeData="nurseChange('specialist')"
                />
                <ErrorMessage
                  v-if="
                    patientCareTeamRecord?.careTeamError &&
                    patientCareTeamRecord?.careTeamError?.type
                  "
                  :name="
                    patientCareTeamRecord?.careTeamError?.message
                      ? patientCareTeamRecord?.careTeamError?.message
                      : ''
                  "
                />
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-row
                :gutter="[48, 16]"
                v-if="careTeam?.specialist?.specialistId == 1"
              >
                <a-col :span="24">
                  <div class="form-heading">
                    <a-typography-title :level="3"
                      >Add Specialist</a-typography-title
                    >
                  </div>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    class="required"
                    :label="$t('clients.firstName')"
                    :name="['specialist', 'firstName']"
                    :rules="[
                      { required: true, message: $t('global.required') },
                    ]"
                  >
                    <NameField
                      v-model:value="careTeam.specialist.firstName"
                      :placeholderData="$t('clients.firstName')"
                      :disabled="false"
                      :max="20"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="5" style="padding-right: 9px">
                  <a-form-item
                    :label="$t('clients.middleName')"
                    :name="['specialist', 'middleName']"
                    :rules="[
                      { required: false, message: $t('global.required') },
                    ]"
                  >
                    <NameField
                      v-model:value="careTeam.specialist.middleName"
                      :placeholderData="$t('clients.middleName')"
                      :disabled="false"
                      :max="20"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="7" style="padding-left: 9px">
                  <a-form-item
                    :label="$t('clients.lastName')"
                    :name="['specialist', 'lastName']"
                    :rules="[
                      { required: false, message: $t('global.required') },
                    ]"
                  >
                    <NameField
                      v-model:value="careTeam.specialist.lastName"
                      :placeholderData="$t('clients.lastName')"
                      :disabled="false"
                      :max="20"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('clients.jobTitle')"
                    :name="['specialist', 'title']"
                    :rules="[
                      { required: false, message: $t('global.required') },
                    ]"
                  >
                    <InputFields
                      v-model:value="careTeam.specialist.title"
                      :placeholderData="$t('clients.jobTitle')"
                      :disabled="false"
                      :max="30"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('clients.npi')"
                    name="npi"
                    :rules="[
                      {
                        required: false,
                        message: $t('global.required'),
                        pattern: regex.numeric,
                      },
                    ]"
                  >
                    <InputFields
                      v-model:value="careTeam.specialist.npi"
                      :placeholderData="$t('clients.npi')"
                      :disabled="false"
                      :max="10"
                      v-on:keypress="numbersOnly"
                    />
                    <ErrorMessage
                      v-if="error"
                      :name="error.npi ? error.npi[0] : ''"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('global.specialization')"
                    :name="['specialist', 'specializationId']"
                    :rules="[
                      { required: false, message: $t('global.required') },
                    ]"
                  >
                    <SelectBox
                      v-model:value="careTeam.specialist.specializationId"
                      @focus="focus"
                      :placeholderData="$t('global.specialization')"
                      :globalCode="store.state.specialist.specialists"
                      :notFoundContent="true"
                      :disabled="disabled"
                      @onSearch="search"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :class="emailVal ? 'required' : ''"
                    :label="$t('clients.email')"
                    :name="['specialist', 'email']"
                    :rules="[
                      {
                        required: emailVal,
                        message: emailVal ? $t('global.required') : '',
                      },
                      { type: 'email', message: $t('global.emailInvalid') },
                    ]"
                  >
                    <InputFields
                      v-model:value="careTeam.specialist.email"
                      :placeholderData="$t('clients.email')"
                      @change="emailField()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('clients.phoneNumber')"
                    :name="['specialist', 'phoneNumber']"
                    :class="phoneNumberVal ? 'required' : ''"
                    :rules="[
                      {
                        required: phoneNumberVal,
                        message: phoneNumberVal ? $t('global.required') : '',
                      },
                      {
                        pattern: regex.phoneNumber,
                        message: $t('global.numberInvalid'),
                      },
                    ]"
                  >
                    <!-- <a-input v-model:value="careTeam.specialist.phoneNumber" /> -->
                    <InputFields
                      v-maska="'###-###-####'" max="12"
                      v-model:value="careTeam.specialist.phoneNumber"
                      :placeholderData="$t('clients.phoneNumber')"
                      :disabled="false"
                      v-on:keypress="numbersOnly"
                      @change="phoneNumberField"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('clients.timeZone')"
                    :name="['specialist', 'timeZoneId']"
                    :rules="[
                      { required: false, message: $t('global.required') },
                    ]"
                  >
                    <SelectBox
                      v-model:value="careTeam.specialist.timeZoneId"
                      @focus="focus"
                      :placeholderData="$t('clients.timeZone')"
                      :globalCode="commonRecord?.timeZone"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('clients.faxNumber')"
                    :name="['specialist', 'faxNumber']"
                    :rules="[
                      { required: false, message: $t('global.required') },
                    ]"
                  >
                    <InputFields
                      v-model:value="careTeam.specialist.faxNumber"
                      :placeholderData="$t('clients.faxNumber')"
                      @keypress="numbersOnly"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-col v-else :span="24">
          <span v-if="!store.state.patientsStore.addPatientTabLoader">{{ $t("patient.message.careTeam") }}</span>
        </a-col>
      </a-row>
    </div>
    <div class="drawerFooter">
      <Button
        classData="secondary-btn"
        @click="onClose"
        class=""
        name="Cancel"
      ></Button>
      <Button
        classData="primary-btn"
        :disabled="
          store.state.clients.careTeamListByClient?.length > 0 ? false : true
        "
        html-type="submit"
        :name="'Save'"
        :loading="store.state.common.loading"
      />
    </div>
  </a-form>
  <AddPatientTabsLoader />
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import SelectBox from "@/components/form-fields/SelectBox.vue";
import InputFields from "@/components/form-fields/InputFields.vue";
import NameField from "@/components/form-fields/NameField.vue";
import Button from "@/components/button/Button.vue";
import SpecializationField from "@/components/specialists/SpecializationField";

import { useStore } from "vuex";
import { useRoute } from "vue-router";
import AddPatientTabsLoader from "@/components/patients/AddPatientTabsLoader";
import { regex } from "@/RegularExpressions/regex";
import { numbersOnly } from "@/commonMethods/commonMethod";

const emit = defineEmits(["onClose"]);

const store = useStore();
const patientCareTeamRecord = store.getters.patientCareTeamRecord;
const formRef = ref();
const route = useRoute();
const labelCol = { span: 24 };
const emailVal = ref(true);
const phoneNumberVal = ref(true);
const careTeam = reactive({
  careTeamId: [],
  nurseId: undefined,
  specialist: {
    specialistId: "",
    patientId: route?.params?.udid,
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specializationId:"",
    npi: "",
    specialist_name: "",
    faxNumber: "",
    notes: "",
  },
});
const form = reactive({ ...careTeam });


const patientsStore = store.getters.patientsStore;
const nurseChange = (event) => {
  if (event == "nurse") {
    patientCareTeamRecord.value.careTeamError = null;
  } else {
    patientCareTeamRecord.value.careTeamError = null;
  }
};
const commonRecord = store.getters.commonRecords;
const update = ref(false);
onMounted(async () => {
  commonRecord.value?.commonRecord?.legth > 0 ? "" : store.dispatch("timeZone");
  store.state.clients.careTeamListByClient = [];
  store.commit("addPatientTabLoader", true);
  try {
    store.dispatch("careTeamListByClient", {
      clientId: patientsStore.value?.patientInformation?.clientId,
    });
    store.dispatch("specialistListDrowpDown");
    await store.dispatch("patientsCareTeamDetail", { id: route?.params?.udid });

    if (patientCareTeamRecord.value?.patientsCareTeamDetail?.careTeamId) {
      await store.dispatch("membersFromCareTeam", {
        teamIds:
          patientCareTeamRecord.value?.patientsCareTeamDetail?.careTeamId,
      });
      update.value = true;
      Object.assign(
        careTeam,
        patientCareTeamRecord.value?.patientsCareTeamDetail
      );
    }

    await store.dispatch("specialist/fetchSpecialist");
    store.commit("addPatientTabLoader", false);
  } catch (error) {
    console.warn(error);
  }
});

const search = (value) => {
let isValuePresent = store.state.specialist.specialists.find(({ name }) =>
    new RegExp(value, "i").test(name)
  );
  if (typeof isValuePresent === "undefined")
    careTeam.specialist.specializationId = value;
};


const emailField = () => {
  if (careTeam.specialist.email && !careTeam.specialist.phoneNumber) {
    emailVal.value = true;
    phoneNumberVal.value = false;
    formRef.value.validateFields(["specialist"].phoneNumber);
  } else if (!careTeam.specialist.phoneNumber && !careTeam.specialist.email) {
    emailVal.value = true;
    phoneNumberVal.value = false;
    formRef.value.validateFields(["specialist"].email);
  } else {
    emailVal.value = false;
    phoneNumberVal.value = true;
    formRef.value.validateFields(["specialist"].email);
  }
};
const phoneNumberField = () => {
  if (careTeam.specialist.phoneNumber && !careTeam.specialist.email) {
    emailVal.value = false;
    phoneNumberVal.value = true;
    formRef.value.validateFields(["specialist"].email);
  } else if (!careTeam.specialist.phoneNumber && !careTeam.specialist.email) {
    emailVal.value = false;
    phoneNumberVal.value = true;
    formRef.value.validateFields(["specialist"].email);
  } else {
    emailVal.value = true;
    phoneNumberVal.value = false;
    formRef.value.validateFields(["specialist"].phoneNumber);
  }
};
const careTeamChange = () => {
  store.state.patientsCareTeam.membersFromCareTeam = [];
  careTeam.nurseId = "";
  store.dispatch("membersFromCareTeam", {
    teamIds: careTeam.careTeamId,
  });
};

const submitForm = () => {
  store
    .dispatch("assignCareTeam", {
      update: update.value,
      id: route?.params?.udid,
      data: careTeam,
    })
    .then((res) => {
      if (res) {
        //Refresh careTeam listing after add care team
        update.value = false;
        store.dispatch("patietCareTeamList", { id: route?.params?.udid });
        onClose();
      }
    });
};
const onClose = () => {
  //close form
  store.state.clients.patientsCareTeamDetail = null;
  patientCareTeamRecord.value.careTeamError = null;
  store.state.clients.careTeamListByClient = [];
  store.state.patientsCareTeam.membersFromCareTeam = [];
  store.commit("loading", false);
  formRef.value?.resetFields();
  Object.assign(careTeam, form);
  emit("onClose", false);
};
</script>
<style lang="scss" scoped>
.ant-checkbox-group {
  .custom-checkbox {
    display: flex;
    padding: 9px 0;
    margin: 0;
  }
}
</style>
