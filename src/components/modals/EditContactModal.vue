<template>
  <a-modal width="50%" title="Edit Emergency Contact" :footer="false" centered @cancel="closeModal()">
    <a-form :model="editContactForm" ref="formRest" autocomplete="off" layout="vertical" @finish="submitForm">
      <a-row :gutter="24">
        <a-col :md="12" :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: true, message: $t('global.firstName')+' '+$t('global.validation')  }]">
              <a-input @change="changeValue()" v-model:value="editContactForm.firstName" size="large" name="firstName"/>
              <ErrorMessage v-if="errorMsg" :name="errorMsg.firstName ? errorMsg.firstName[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :md="12" :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
              <a-input @change="changeValue()" v-model:value="editContactForm.lastName" size="large"/>
              <ErrorMessage v-if="errorMsg" :name="errorMsg.lastName ? errorMsg.lastName[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :md="12" :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(), type: 'email' }]">
              <a-input @change="changeValue()" v-model:value="editContactForm.email" placeholder="test@test.com" size="large" @blur="emailChange()"/>
              <ErrorMessage v-if="errorMsg" :name="errorMsg.email ? errorMsg.email[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :md="12" :sm="12" :xs="24">
          <div class="form-group">
            <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
              <a-input @change="changeValue()" v-maska="'###-###-####'" max="12" v-model:value="editContactForm.phoneNumber" placeholder="Please enter 10 digit number" size="large"  style="width: 100%"/>
              <ErrorMessage v-if="errorMsg" :name="errorMsg.phoneNumber ? errorMsg.phoneNumber[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
      <a-col :span="24">
        <a-button type="primary" html-type="submit" style="float:right">{{$t('global.update')}}</a-button>
      </a-col>
    </a-row>
    </a-form>
    <Loader />
  </a-modal>
</template>

<script>
import { computed, watchEffect, reactive, ref } from 'vue-demi'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Loader from "@/components/loader/Loader";
import {
    regex
} from "@/RegularExpressions/regex";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";

export default {
  props: {
    isContactEdit: {
      type: Number
    }
  },
  components: {
    Loader,
    ErrorMessage,
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const paramId = route.params.udid
    const formRest = ref()
    var isEdit = reactive(props.isContactEdit)

    const contactDetails = computed(() => {
      return store.state.careCoordinator.contactDetails
    })
    
    const errorMsg = computed(() => {
      return store.state.careCoordinator.errorMsg
    })

     const staffs = computed(() => {
      return store.state.careCoordinator.addStaff;
    });

    const editContactForm = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    })

    const changeValue = () => {
      store.commit('errorMsg', null)
      store.commit('checkChangeInput', true)
    }
    
    watchEffect(() => {
      if(isEdit) {
        Object.assign(editContactForm, contactDetails.value)
      }
    })

    const form = reactive({ ...editContactForm })
    const submitForm = () => {
      isEdit = false
      let phone = editContactForm.phoneNumber
      store.dispatch('updateContact', {
        id: staffs.value?staffs.value.id:route.params.udid,
        contactId: contactDetails.value.id,
        data: {
          firstName: editContactForm.firstName,
          lastName: editContactForm.lastName,
          email: editContactForm.email,
          phoneNumber: phone.replace(/-/g,''),
        },
      }).then(() => {
        if(errorMsg.value == null) {
          emit('closeModal')
          formRest.value.resetFields();
          Object.assign(editContactForm, form)
          store.dispatch("staffContactList", staffs.value?staffs.value.id:route.params.udid);
        }
      })
    }

    const checkChangedInput = computed(() => {
      return store.state.common.checkChangeInput
    })

    const closeModal = () => {
      emit("closeModal", checkChangedInput.value)
    }

    return {
      regex,
      staffs,
      formRest,
      editContactForm,
      paramId,
      submitForm,
      errorMsg,
      changeValue,
      closeModal,
    }
  }
}
</script>