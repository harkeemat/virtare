<template>
  <a-form class="common-form" ref="formRef" :model="careTeamForm" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm" >
    <div class="drawerBody">
      <a-typography-title :level="2" class="common-heading">{{ formHeading }}</a-typography-title>
      <a-row :gutter="[48, 16]" v-if="formType == 'careTeam'">
        <a-col :span="12">
          <a-form-item :label="$t('clients.name')" class="required" name="name"
            :rules="[{ required: true, message: $t('global.required') },{...alphanumeric,message:$t('global.alphanumeric')}]">
            <InputFields v-model:value="careTeamForm.name" :placeholderData="$t('clients.name')" :disabled="false" :max="35" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('clients.site')" class="required" name="siteId"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="careTeamForm.siteId" :placeholderData="$t('clients.site')" @focus="focus"
              @change="handleChange('careTeamForm.siteId')" :globalCode="people?.sitesListDropdown"><template #suffixIcon>
                <CaretDownOutlined />^
              </template></SelectBox>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('clients.teamHead')" class="required" name="teamHeadId"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="careTeamForm.teamHeadId" entity="careTeamMeamMember"
              :placeholderData="$t('clients.teamHead')" @focus="focus" @change="handleChange('teamHead', $event)"
              :globalCode="people?.siteHead"><template #suffixIcon>
                <CaretDownOutlined />^
              </template></SelectBox>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('clients.programs')" class="required" name="programs"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox mode="multiple" v-model:value="careTeamForm.programs" @focus="focus"
              :placeholderData="$t('clients.programs')" @change="handleChange" :maxLength="12"
              :globalCode="people?.siteProgramsList" entity="programs" :maxtag="4" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="[48, 16]" v-if="careTeamForm.teamHeadId==1">
        <a-col :span="24">
          <div class="form-heading">
            <a-typography-title :level="3">Add New Head</a-typography-title>
            <a-typography-text>Information of new member</a-typography-text>
          </div>
        </a-col>
        <PeoplForm :formObject="careTeamForm" @toggleCheckbox="toggleCheckbox($event)" :showExternal="showExternal" screen="careTeamHead" />
      </a-row>
    </div>
    <div class="drawerFooter">
      <a-button @click="onClose" class="secondary-btn"> Cancel </a-button>
      <a-button class="primary-btn" html-type="submit" :loading="loading"> Save </a-button>
    </div>
  </a-form>
<AddClientLoader />
</template>

<script>
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { watchEffect, reactive, ref, onMounted, defineAsyncComponent } from "vue";
import { useStore } from 'vuex';
import InputFields from "@/components/form-fields/InputFields.vue";
import SelectBox from "@/components/form-fields/SelectBox.vue"
import { useRoute } from 'vue-router';
import AddClientLoader from "@/components/administration/clients/AddClientLoader.vue";
import {alphanumeric} from '@/commonMethods/commonMethod';

export default {
  props: {
    formHeading: String,
    isEdit: Boolean,
    formType: String,
  },
  components: {
    CaretDownOutlined,
    InputFields,
    SelectBox,
    AddClientLoader,
    PeoplForm: defineAsyncComponent(() =>
      import("@/components/administration/clients/Tabs/addClient/PeopleForm")
    ),
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const loading = ref(false)
    const formRef = ref()
    const showExternal = ref(false)
    const careTeamForm = reactive({
      name: "",
      siteId: undefined,
      teamHeadId: undefined,
      programs: [],
      clientId: route.params.udid,
      contactPerson: {
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        specializationId: undefined,
        roleId: undefined,
        timeZoneId: undefined,
        npi:"",
        faxNumber:"",
        type: false,  // true - External, false - Internal
      }
    })

    const careTeamFormReactive = reactive({ ...careTeamForm })

    const people = store.getters.people


    const common = store.getters.commonRecords;
    // const roleAssign = () => {
    //   if (!props.isEdit) {
    //     common.value?.rolesDropDown.map((item) => {
    //       if (item.name == 'Non System User') {
              // showExternal.value = false
    //         careTeamForm.roleId = item.udid
    //       }
    //     })
    //   }
    // }

    onMounted(() => {
      if (!props.isEdit) {
        //this call in care team table so if update then not dispatch
        store.dispatch("siteHead", {
          id: route?.params?.udid,
          status: ''
        })
      }
      store.dispatch("sitesListDropdown", route?.params?.udid)


    })

    watchEffect(() => {
      if (props.isEdit && people.value?.careTeamDetails) {
        Object.assign(careTeamForm, people.value?.careTeamDetails)
      }
    })

    const focus = () => {
    };

    const contactPerson = reactive({ ...careTeamForm.contactPerson })
    const handleChange = (text) => {
      if (text == 'teamHead') {
        if (careTeamForm?.teamHeadId == 1) {
          store.dispatch('rolesDropDown',1).then(() => {
            //roleAssign()
          })
        }
        Object.assign(careTeamForm.contactPerson, contactPerson)
      }
      if (text == "careTeamForm.siteId") {
        store.dispatch("siteProgramsList", careTeamForm?.siteId).then(() => {
          careTeamForm.programs = []
          people.value?.siteProgramsList.map((item) => {
            careTeamForm.programs.push(item.udid)
          })
        })
      }
    };

    const onClose = () => {
      loading.value = false
      formRef.value ? formRef.value?.resetFields() : ''
      emit('onClose', false)
      Object.assign(careTeamForm, careTeamFormReactive)
      store.state.clients.siteHead = []
    }

    const submitForm = () => {
      loading.value = true
        careTeamForm.contactPerson.phoneNumber = careTeamForm.contactPerson?.phoneNumber.replace(/-/g, '')

      if (props.isEdit) {
        store.dispatch('updateCareTeam', {
          careTeamId: people.value?.careTeamDetails?.udid,
          data: careTeamForm,
        }).then((res) => {
          loading.value = false
          if (res) {
            onClose()
            store.dispatch('careTeamListByClient', {clientId:route?.params?.udid}).then(() => {
            })
          }

        })
      }
      else {
        store.dispatch('addCareTeam', careTeamForm).then((res) => {
          loading.value = false
          if (res) {

            store.dispatch('careTeamListByClient', {clientId:route?.params?.udid}).then(()=>{
              onClose()
            })
          }

        })
      }
      store.dispatch("sitesList", {clientId:route.params.udid})
      store.dispatch("peopleList", { clientId: route?.params?.udid })
    }

    const toggleCheckbox = (value) => {
      if(value == 'Non System User') {
        showExternal.value = false
        //careTeamForm.type = true
      }
      else {
        showExternal.value = true
        //careTeamForm.type = false
      }
    }

    return {
      toggleCheckbox,
      showExternal,
      formRef,
      submitForm,
      people,
      careTeamForm,
      onClose,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      programs: ref("p1"),
      teamHead: ref("h1"),
      focus,
      handleChange,
      loading,
      common,
      alphanumeric
    };
  },
};
</script>
