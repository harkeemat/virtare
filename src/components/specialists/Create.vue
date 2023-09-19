<template>
  <Loader v-if="state.specialists.loadingDetails || loading" />
  <div ref="formDiv">
    <a-form class="common-form" ref="formRef" @finish="submitForm" :model="specialist" :label-col="{ span: 24 }"
      :wrapper-col="wrapperCol" autocomplete="off">
      <div class="drawerBody">
        <a-row :gutter="[48, 16]">
          <a-col :span="24">
            <a-typography-title :level="2" class="common-heading">{{
              details.hasOwnProperty("firstName")
              ? details.Isnetwork == 1
                ? `Staff`
                : `Specialist`
              : `New Specialist`
            }}
            </a-typography-title>
          </a-col>

          <a-col :span="12">
            <a-form-item class="required" :label="$t('clients.firstName')" name="firstName"
              :rules="[{ required: true, message: $t('global.required') },{...whiteSpace,message:$t('global.noSpace')}]">
              <NameField v-model:value="specialist.firstName" :placeholderData="$t('clients.firstName')"
                :disabled="disabled" :max="20" />
            </a-form-item>
          </a-col>
          <a-col :span="5" style="padding-right: 9px">
            <a-form-item :label="$t('clients.middleName')" name="middleName"
              :rules="[{ required: false, message: $t('global.required') },{...whiteSpace,message:$t('global.noSpace')}]">
              <NameField v-model:value="specialist.middleName" :placeholderData="$t('clients.middleName')"
                :disabled="disabled" :max="20" />
            </a-form-item>
          </a-col>
          <a-col :span="7" style="padding-left: 9px">
            <a-form-item :label="$t('clients.lastName')" name="lastName"
              :rules="[{ required: false, message: $t('global.required') },{...whiteSpace,message:$t('global.noSpace')}]">
              <NameField v-model:value="specialist.lastName" :placeholderData="$t('clients.lastName')"
                :disabled="disabled" :max="20" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('clients.jobTitle')" name="title"
              :rules="[{ required: false, message: $t('global.required') },{...whiteSpace,message:$t('global.noSpace')}]">
              <InputFields v-model:value="specialist.title" :placeholderData="$t('clients.jobTitle')" :disabled="disabled"
                :max="30" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('clients.npi')" name="npi" @keypress="numbersOnly" :rules="[
              {
                required: false,
                message: $t('global.required'),
              },
            ]">
              <InputFields v-model:value="specialist.npi" :placeholderData="$t('clients.npi')" :disabled="disabled"
                :max="10" v-on:keypress="numbersOnly" />
              <ErrorMessage v-if="error" :name="error.npi ? error.npi[0] : ''" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('global.specialization')" :name="['specializationId']"
              :rules="[{ required: false, message: $t('global.required') }]">
              <SelectBox :globalCode="state.specialist.specialists" v-model:value="specialist.specializationId"
                :maxLength="12" :maxtag="4" :notFoundContent="true" :disabled="disabled" @onSearch="search" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :class="emailVal ? 'required' : ''" :label="$t('clients.email')" name="email" :rules="[
              {
                required: emailVal,
                message: emailVal ? $t('global.required') : '',
              },
              { type: 'email', message: $t('global.emailInvalid') },
            ]">
              <InputFields v-model:value="specialist.email" :placeholderData="$t('clients.email')" @change="emailField()"
                :disabled="(disabled || (state.specialist.isEdit &&  details.email !== ''))" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('clients.phoneNumber')" name="phoneNumber" :class="phoneNumberVal ? 'required' : ''"
              :rules="[
                {
                  required: phoneNumberVal,
                  message: phoneNumberVal ? $t('global.required') : '',
                },
                {
                  pattern: regex.phoneNumber,
                  message: $t('global.numberInvalid'),
                },
              ]">
              <InputFields v-maska="'###-###-####'" v-model:value="specialist.phoneNumber" max="12"
                :placeholderData="$t('clients.phoneNumber')" :disabled="disabled" v-on:keypress="numbersOnly"
                @change="phoneNumberField" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('clients.timeZone')" name="timeZoneId"
              :rules="[{ required: false, message: $t('global.required') }]">
              <SelectBox v-model:value="specialist.timeZoneId" @focus="focus" :placeholderData="$t('clients.timeZone')"
                :globalCode="timezons" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="details.Isnetwork === 2 || state.specialist.isStaff">
            <a-form-item :label="$t('clients.faxNumber')" name="faxNumber"
              :rules="[{ required: false, message: $t('global.required') }]">
              <InputFields v-model:value="specialist.faxNumber" :placeholderData="$t('clients.faxNumber')"
                :disabled="disabled" @keypress="numbersOnly" :max="10" />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="details.Isnetwork === 1">

            <a-form-item label="Role(s)" v-if="state.common?.rolesDropDown?.length > 0 && !disabled">
              <div class="filterBy">

                <a-dropdown :trigger="['click']">
                  <template #overlay>
                    <a-menu class="filterMenu">
                      <a-checkbox-group v-model:value="roles" @change="handleChange" :disabled="!rolesPermissionFind(state.screenPermissions?.screensPermissions, [541])">
                        <a-checkbox class="custom-checkbox" v-for="role in state.common?.rolesDropDown" :key="role.udid"
                          :value="role.name"
                          :disabled="arrayToObjectData(details.role, role.udid, 'udid', 'isPrimary')">{{ role.name
                          }}</a-checkbox>
                      </a-checkbox-group>
                    </a-menu>
                  </template>
                  <a-button>
                    Assign role
                    <CaretDownOutlined />
                  </a-button>
                </a-dropdown>
                <a-tag v-for="role, index in roles" :key="index" @close="handleClose(role)"
                  :closable="!arrayToObjectData(details.role, role, 'name', 'isPrimary') && rolesPermissionFind(state.screenPermissions?.screensPermissions, [541])">
                  {{ role }}
                </a-tag>
              </div>
            </a-form-item>
          </a-col>

          <!-- <a-form-item :label="$t('clients.role')" class="required" name="roleId"
                :rules="[{ required: true, message: $t('global.required') }]">
                <SelectBox v-model:value="specialist.roleId" :placeholderData="$t('clients.role')"
                  :globalCode="state.common?.rolesDropDown" />
              </a-form-item> -->
          <a-col :span="12" v-if="details.Isnetwork === 1 && (!roles.includes('Non System User') || roles?.length >1) && !disabled">
            <a-form-item label=" `" name="type">
              <a-checkbox v-model:checked="specialist.type">Staff</a-checkbox>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="(details.Isnetwork && details.Isnetwork === 2 && state.specialist.isEdit) ||
            !state.specialist.isEdit
            ">
            <a-form-item :label="$t('clients.notes')" name="notes"
              :rules="[{ required: false, message: $t('global.required') }]">
              <a-textarea :rows="4" :placeholder="`${$t('clients.notes')}...`" v-model:value="specialist.notes"
                :disabled="disabled" />
            </a-form-item>
            <!-- <a-row :gutter="[48, 16]">
                <a-col :span="4" :style="{ margintTop: '3px' }" v-if="details.network">
                  <a-typography-text
                    class="label"
                    :style="{
                      fontFamily: 'tt_hoves_pro_trialdemibold',
                      marginTop: '2px',
                    }"
                    >Number of Patients<span>:</span
                    >{{ details.patientCount }}</a-typography-text
                  >
                </a-col>
              </a-row> -->
          </a-col>
          <a-col :span="12" class="patientNumber" v-if="(details.network && !disabled)">
            <a-typography-text class="label">Number of Patients<span> : </span></a-typography-text>

            <a-typography-link v-if="details.patientCount > 0" @click="patientsCall">{{ details.patientCount }}</a-typography-link>

            <a-typography-text v-else >{{ details.patientCount }}</a-typography-text>


          </a-col>
        </a-row>

        <!-- Patient(s) -->

      </div>
      <div :class="['drawerFooter', state.specialist.isEdit && rolesPermissionFind(state.screenPermissions?.screensPermissions, [542]) ? 'justifyBet' : '']">
        <a-popconfirm v-if="rolesPermissionFind(state.screenPermissions?.screensPermissions, [542])" :title="`Are you sure delete this specialist ?`" ok-text="Yes" cancel-text="No"
          @confirm="deleteSpecialist">
          <a-button class="delete-btn"
            v-if="state.specialist.isEdit && !disabled && details.Isnetwork === 2">Delete</a-button>
        </a-popconfirm>
        <a-space>
          <a-button class="secondary-btn" @click="emit('hideDrawer')">
            Cancel
          </a-button>
          <a-button class="primary-btn" html-type="submit" :loading="isLoading" :disabled="disabled" v-if="!disabled">
            Save
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { regex } from "@/RegularExpressions/regex";
import NameField from "@/components/form-fields/NameField.vue";
import SelectBox from "@/components/form-fields/SelectBox.vue";
import InputFields from "@/components/form-fields/InputFields.vue";
import SpecializationField from "@/components/specialists/SpecializationField";
import { numbersOnly, arrayToObjectData ,rolesPermissionFind} from "@/commonMethods/commonMethod";
import { useStore } from "vuex";
import Loader from "@/components//Loader";
import { useRouter } from "vue-router";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import {whiteSpace} from '@/commonMethods/commonMethod';
const router = useRouter()
const route = useRoute();
const disabled = ref(route.name === "PatientDetails");
const emit = defineEmits(["hideDrawer"]);
const formRef = ref(null);
const emailVal = ref(true);
const phoneNumberVal = ref(true);
const { state, commit, dispatch, getters } = useStore();
const isLoading = ref(false);
const loading = ref(false);
const isComplete = computed(() => state.specialist.isComplete);
const timezons = computed(() => getters?.commonRecords.value?.timeZone);
const details = computed(() => state.specialist.member);


const specialist = reactive({
  specialistId: "",
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  specializationId: "",
  npi: "",
  specialist_name: "",
  faxNumber: "",
  notes: "",
  timeZoneId: "",
  type: true,
  role: []

});
const roles = ref([])
const showNotes = ref(true);

const emailField = () => {
  if (specialist.email && !specialist.phoneNumber) {
    emailVal.value = true;
    phoneNumberVal.value = false;
    formRef.value.validateFields("phoneNumber");
  } else if (!specialist.phoneNumber && !specialist.email) {
    emailVal.value = true;
    phoneNumberVal.value = false;
    formRef.value.validateFields("email");
  } else {
    emailVal.value = false;
    phoneNumberVal.value = true;
    formRef.value.validateFields("email");
  }
};

const phoneNumberField = () => {
  if (specialist.phoneNumber && !specialist.email) {
    emailVal.value = false;
    phoneNumberVal.value = true;
    formRef.value.validateFields("email");
  } else if (!specialist.phoneNumber && !specialist.email) {
    emailVal.value = false;
    phoneNumberVal.value = true;
    formRef.value.validateFields("email");
  } else {
    emailVal.value = true;
    phoneNumberVal.value = false;
    formRef.value.validateFields("phoneNumber");
  }
};

const submitForm = async () => {

  isLoading.value = true;
  if (details.value.hasOwnProperty("firstName"))
    await dispatch("specialist/edit", {
      ...specialist,
      editId: details.value.udid,
    });
  else await dispatch("specialist/create", specialist);
  isLoading.value = false;
};

const search = (value) => {
  let isValuePresent = state.specialist.specialists.find(({ name }) =>
    new RegExp(value, "i").test(name)
  );
  if (typeof isValuePresent === "undefined")
    specialist.specializationId = value;
};

const deleteSpecialist = async () => {
  await dispatch("specialist/delete");
};

watch(isComplete, (status) => {
  if (status) emit("hideDrawer");
});

watch(details, (detail) => {
  if (detail.hasOwnProperty("firstName")) {
    showNotes.value = false
    emailVal.value = false;
    phoneNumberVal.value = detail.phoneNumber !== '';
    for (const key in detail) specialist[key] = detail[key];
  }
});


onMounted(async () => {
  loading.value = true;
  dispatch("timeZone");
  dispatch("rolesDropDown")
  await dispatch("specialist/fetchSpecialist");
  if (state.specialist.isEdit && state.specialist.specialistId != null) {
    // await dispatch("specialistSummary", state.specialist.specialistId);
    await dispatch(
      "specialist/fetchSpecialistById",
      state.specialist.specialistId
    );
    specialist.role = []
    details.value?.role?.map((item) => {
      roles.value.push(item.name)
      specialist.role.push(item.id)
    })
  }
  loading.value = false;
  showNotes.value = true;
});

onUnmounted(() => {
  commit("specialist/isEdit", false);
  commit("specialist/isComplete", false);
  commit("specialist/specialistId", null);
  commit("specialist/isStaff",false);
  commit("specialist/member", {});
  loading.value = false;
});

//Open patients listing page with staff name and id
const patientsCall = () => {
  router.push({
    name: 'PatientsList',
    query: {
      name: details.value?.firstName,
      staffId: details.value?.udid
    }
  })
}
//multipale role select assign for staff

const handleClose = removedTag => {
  const tags = roles.value.filter(tag => tag !== removedTag);
  roles.value = tags;
  roleModification()
};
const handleChange = () => {
  roleModification()
};
const roleModification = async () => {
  let record = []
  state.common?.rolesDropDown.map((item) => {
    if (roles.value.includes(item.name)) {
      record.push(item.id)
    }
  })
  specialist.role = record
  //await store.dispatch("addRoleStaff", { staffId: props?.staffId, data: { roles: record } })
  //store.dispatch("staffs")

}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variable.scss';

.filterBy {
  justify-content: flex-start;
  flex-wrap: wrap;

  .ant-btn {
    border: 1px solid $border-color-2;
    border-radius: 4px;
    height: 36px;
    font-size: 14px;
    line-height: 18px;
    color: $black-color;
    text-transform: uppercase;
    font-family: $font-family-semi-bold;
    padding: 0px 28px 0 10px;
    .anticon {
      background: $border-color-2;
      border-radius: 0px 4px 4px 0px;
      width: 18px;
      color: $border-color-1;
      height: 100%;

      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 12px;
      }
    }
  }
}



    .filterMenu {
      width: 100%;
      overflow: auto;
      height: 300px;
    }
.patientNumber{
  font-family: $font-family-semi-bold;
  margin-top: 12px;
  a {
    font-size: 22px;
  }
}
</style>
