<template>
  <a-form ref="formRef" class="common-form" :model="peopleForm" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-col :span="24">
        <a-typography-title :level="2" class="common-heading" v-if="!isEdit">Add New Member</a-typography-title>
        <a-typography-title :level="2" class="common-heading" v-else>{{ formHeading }}</a-typography-title>

        <!-- <div class="form-heading"> -->
        <!-- <h3 v-if="!isEdit">Add New Member</h3> -->
        <!-- <h3 v-else>{{ formHeading }}</h3> -->
        <!-- <p v-if="!isEdit">Information of new member</p>
            <p v-else>Information of member</p> -->
        <!-- </div> -->
      </a-col>
      <!-- <h2 class="common-heading">{{ formHeading }}</h2> -->
      <a-row :gutter="[48, 16]" v-if="!isEdit">
        <a-col :span="24" v-if="fromScreen == 'careTeams'">
          <a-form-item :label="$t('clients.teamMember')" class="required" name="teamHeadId"
            :rules="[{ required: true, message: $t('global.required') }]">
            <SelectBox v-model:value="peopleForm.teamHeadId" entity="careTeamMeamMember"
              :placeholderData="$t('clients.teamMember')" @focus="focus" @change="handleChange('teamHead', $event)"
              :globalCode="siteHead"><template #suffixIcon>
                <CaretDownOutlined />^
              </template></SelectBox>
            <ErrorMessage v-if="people?.errorClients"
              :name="people?.errorClients?.teamHeadId ? people?.errorClients?.teamHeadId[0] : ''" />
          </a-form-item>
        </a-col>
        <a-col :span="12"></a-col>
      </a-row>
      <a-row :gutter="[48, 16]" v-if="isEdit || peopleForm.teamHeadId === 1">
        <PeoplForm :formObject="peopleForm" :isEdit="isEdit" @toggleCheckbox="toggleCheckbox($event)" :showExternal="showExternal" screen="siteHead" />
      </a-row>
    </div>
    <div class="drawerFooter" :class="isEdit ? `justifyBet` : ``">
      <a-popconfirm title="Are you sure, you want to remove this member?" ok-text="Yes" cancel-text="No"
        @confirm="destroyCareTeamMember" v-if="isEdit && !isHead">
        <a-button class="delete-btn"> Remove </a-button>
      </a-popconfirm>
      <a-popconfirm ok-text="Yes" cancel-text="No" v-if="isEdit && isHead == 1" disabled>
        <a-tooltip placement="topLeft">
          <template #title>
            <span>{{ `You can't remove ` + siteAndCareMessage }}</span>
          </template>
          <a-button class="delete-btn" disabled> Remove </a-button>
        </a-tooltip>

      </a-popconfirm>
      <a-space>
        <a-button @click="onClose" class="secondary-btn"> Cancel </a-button>
        <a-button class="primary-btn" html-type="submit" :loading="commonRecord?.loading"> {{ 'Save' }} </a-button>
      </a-space>
    </div>
  </a-form>
  <AddClientLoader />
</template>

<script>
//import { CaretDownOutlined } from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import SelectBox from "@/components/form-fields/SelectBox.vue"
import AddClientLoader from "@/components/administration/clients/AddClientLoader.vue";
import PeoplForm from "@/components/administration/clients/Tabs/addClient/PeopleForm"
export default {
  emits: ["onSubmitForm", "onClose"],
  props: {
    fromScreen: String,
    formHeading: String,
    careTeamId: String,
    isEdit: Boolean,
    memberUdid: String,
    recordId: String,
    isHead: Number,
    siteAndCareMessage: String
  },
  components: {
    SelectBox,
    AddClientLoader,
    PeoplForm
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const formRef = ref()
    const showExternal = ref(false)
    const focus = () => {
    };



    const peopleListDropdown = computed(() => {
      return store.state.clients.peopleListDropdown
    })

    const siteHead = computed(() => {
      return store.state.clients.siteHead
    })

    const clientId = ref(route?.params?.udid)
    const peopleForm = reactive({
      teamHeadId: undefined,
      careTeamId: props.careTeamId,
      clientId: clientId.value,
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
        npi: "",
        clientId: clientId.value,
        faxNumber:"",
        type: false,  // true - External, false - Internal
      }
    });
    const commonRecord = store.getters.commonRecords
    const people = store.getters.clients
    // const roleAssign = () =>{
    //   if (!props.isEdit){
    //     commonRecord.value?.rolesDropDown.map((item)=>{
    //             if(item.name=='Non System User'){
                    // showExternal.value = false
    //               peopleForm.roleId = item.udid
    //             }
    //       })
    //   }
    // }
    const contactPerson = reactive({ ...peopleForm.contactPerson })
    const handleChange = (text, value) => {
      people.value.errorClients = ''
      if (text == 'teamHead') {
        if (value == 0) {
          store.dispatch("rolesDropDown", 1).then(() => {
            //roleAssign()
          })
        }
        Object.assign(peopleForm.contactPerson, contactPerson)
      }
    };
    onMounted(() => {
      store.commit('loading', false)
      if (!props.isEdit) {
        store.dispatch("siteHead", {
          id: route?.params?.udid,
          status: 2
        })

      }
      if (props.isEdit) {

        store.dispatch("rolesDropDown", 1).then(() => {
          //roleAssign()
        })
      }

    });

    watchEffect(() => {

      if (people.value?.peopleDetails && props.isEdit) {
        Object.assign(peopleForm.contactPerson, people.value?.peopleDetails)
      }

    })
    const changeSelf = () => {
    };

    const submitForm = () => {
      store.commit('loading', true)
      let requestData = peopleForm
      requestData.contactPerson.phoneNumber = requestData.contactPerson?.phoneNumber.replace(/-/g, '')
      if (props.isEdit) {
        store.dispatch("updatePeople", { data: requestData?.contactPerson, id: props.recordId }).then((resp) => {
          store.commit('loading', false)
          if (resp) {
            clear()
            store.dispatch("peopleList", { clientId: clientId.value })
            store.dispatch('careTeamListByClient', { clientId: route?.params?.udid })
            emit('onClose')
          }
        })
      }
      else {

        store.dispatch("addCareTeamMember", requestData).then((resp) => {
          store.commit('loading', false)
          if (resp) {
            clear()
            store.dispatch("peopleList", { clientId: clientId.value })
            store.dispatch('careTeamListByClient', { clientId: route?.params?.udid })
            store.dispatch('sitesList', { clientId: clientId.value })
            onClose()

          }
        })
      }
    }
    const form = reactive({ ...peopleForm })
    const clear = () => {
      store.commit('loading', false)
      store.state.clients.peopleDetails = null
      formRef.value ? formRef.value.resetFields() : ''
      Object.assign(peopleForm, form)

      emit('onClose', false)

    }
    const onClose = () => {
      store.commit('loading', false)
      clear()
      emit('onClose')
      store.commit('peopleDetails', null)
    };

    const destroyCareTeamMember = () => {
      store.dispatch('destroyCareTeamMember', props.memberUdid).then(() => {
        store.dispatch("careTeamListByClient", { clientId: clientId.value })
        store.dispatch("peopleList", { clientId: clientId.value })
        store.dispatch('sitesList', { clientId: clientId.value })
        emit('onClose', false)
      })
    }

    const toggleCheckbox = (value) => {
      if(value == 'Non System User') {
        showExternal.value = false
        //peopleForm.type = true
      }
      else {
        showExternal.value = true
        //peopleForm.type = false
      }
    }

    return {
      destroyCareTeamMember,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      focus,
      toggleCheckbox,
      showExternal,
      handleChange,
      gender: ref("Ma"),
      value1: ref("AL"),
      peopleForm,
      submitForm,
      changeSelf,
      onClose,
      commonRecord,
      formRef,
      peopleListDropdown,
      siteHead,
      people

    };
  },
};
</script>

