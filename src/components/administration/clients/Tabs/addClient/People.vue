<template>
  <a-form ref="formRef" class="common-form" :model="peopleForm" :label-col="labelCol" :wrapper-col="wrapperCol"
    @finish="submitForm">
    <div class="drawerBody">
      <a-typography-title :level="2" class="common-heading">{{ people?.peopleDetails ? people?.peopleDetails?.fullName :
        formHeading }}</a-typography-title>
      <a-row :gutter="[48, 16]">
        <PeoplForm :form="peopleForm" :isEdit="isEdit" :isStaff="isStaff" @toggleCheckbox="toggleCheckbox($event)"
          :showExternal="showExternal" screen="person" />
      </a-row>
    </div>
    <div class="drawerFooter">
      <!-- <a-popconfirm title="Are you sure delete this people?" ok-text="Yes" cancel-text="No">
        <a-button class="delete-btn"> Delete </a-button>
      </a-popconfirm> -->

      <Button classData="secondary-btn" @click="onClose" class="" name="Cancel"></Button>
      <Button classData="primary-btn" html-type="submit" :name="'Save'" :loading="common.loading" />
    </div>
  </a-form>
  <AddClientLoader />
</template>
<script>
//import { CaretDownOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive, ref, watchEffect, defineAsyncComponent } from "vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import AddClientLoader from "@/components/administration/clients/AddClientLoader.vue";
import Button from "@/components/button/Button.vue";

export default {
  emits: ["onSubmitForm", "onClose"],
  props: {
    formHeading: String,
    isEdit: Boolean,
    //only use for profile change
    isStaff: Boolean
  },
  components: {
    AddClientLoader,
    Button,
    PeoplForm: defineAsyncComponent(() =>
      import("@/components/administration/clients/Tabs/addClient/PeopleForm")
    ),
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const formRef = ref()
    const showExternal = ref(false)
    const focus = () => {
    };
    const handleChange = () => {
    };
    const clientId = ref(route?.params?.udid)
    const peopleForm = reactive({
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleId: undefined,
      timeZoneId: undefined,
      clientId: clientId.value,
      specializationId: '',
      npi: "",
      faxNumber: "",
      type: false,  // true - External, false - Internal
    });
    const form = reactive({ ...peopleForm })
    const common = store.getters.commonRecords
    const people = store.getters.clients
    const roleAssign = () => {
      //if (!props.isEdit){
      common.value?.rolesDropDown.map((item) => {
        if (item.name == 'Non System User') {
          showExternal.value = false
          peopleForm.roleId = item.udid
        }
      })
      // }
    }
    onMounted(() => {
      store.commit('loading', false)
      if (!props.isEdit && !props.isStaff) {
        store.dispatch("rolesDropDown").then(() => {
          roleAssign()
        })
      } else {
        store.dispatch("rolesDropDown")
      }

    });
    watchEffect(() => {
      if ((props.isEdit || props.isStaff) && people.value?.peopleDetails) {
        Object.assign(peopleForm, people.value?.peopleDetails)
        // if(people.value?.peopleDetails?.role=='Non System User'){
        //   store.dispatch("rolesDropDown")
        // }else{
        //   store.dispatch("rolesDropDown",1)
        // }
      }
    })
    const changeSelf = () => {
    };

    const submitForm = () => {
      store.commit('loading', true)
      peopleForm.phoneNumber = peopleForm.phoneNumber.replace(/-/g, '')
      if (people.value?.peopleDetails) {
        store.dispatch("updatePeople", {
          data: peopleForm,
          id: people.value?.peopleDetails?.id
        }).then((resp) => {
          store.commit('loading', false)
          if (resp) {
            if (props.isStaff) {
              let authUser = JSON.parse(localStorage.getItem("auth"));

              authUser.user.firstName = peopleForm.firstName
              authUser.user.lastName = peopleForm.lastName
              localStorage.setItem('auth', JSON.stringify(authUser));
            } else {
              store.dispatch("peopleList", { clientId: clientId.value })
            }
            clear()
            emit('onClose', false)
          }
        })
      } else {

        store.dispatch("addPeople", {
          data: peopleForm,
        }).then((resp) => {
          store.commit('loading', false)
          if (resp) {
            clear()
            store.dispatch("peopleList", { clientId: clientId.value })
          }
        })
      }
    }

    const clear = () => {
      store.commit('loading', false)
      store.state.common.rolesDropDown = []
      formRef.value?.resetFields();
      Object.assign(peopleForm, form)
      store.state.clients.peopleDetails = null
      emit('onClose', false)

    }
    const onClose = () => {
      clear()
    };
    const fieldChange = (event) => {
      if (event == "peopleForm.email") {
        store.state.clients.errorClients = ''
      }
    }

    const toggleCheckbox = (value) => {
      if (value == 'Non System User') {
        showExternal.value = false
       // peopleForm.type = true
      }
      else {
        showExternal.value = true
        //peopleForm.type = false
      }
    }

    return {
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
      common,
      formRef,
      people,
      fieldChange,

    };
  },
};
</script>

