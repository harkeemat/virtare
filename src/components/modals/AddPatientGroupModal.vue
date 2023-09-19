<template>
  <a-modal class="patientGroupModal" width="60%" :title="'Add Patient Group'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form :model="patientGroupForm" name="basic" scrollToFirstError=true autocomplete="off" layout="vertical" @finish="submitPatientGroupForm">
      <a-row :gutter="24">
        <a-col :span="24">
          <div class="form-group">
            <a-form-item :label="$t('global.group')" name="group" :rules="[{ required: false, message: $t('global.group')+' '+$t('global.validation') }]">
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" size="large" v-model:value="patientGroupForm.groups" mode="multiple">
                <a-select-option v-for="group in groupsList" :key="group.id" :value="group.udid">{{ group.group }}</a-select-option>
              </a-select>
              <ErrorMessage v-if="errorMsg" :name="errorMsg.groupId ? errorMsg.groupId[0] : ''" />
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="24">
          <FormButtons :disabled="false" @onCancel="closeModal" :submitButton="$t('global.save')" />
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { computed, reactive } from 'vue-demi'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import FormButtons from "@/components/common/button/FormButtons";
import ErrorMessage from "@/components/common/messages/ErrorMessage";

export default {
  components: {
    FormButtons,
    ErrorMessage,
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    
    const patientGroupForm = reactive({
      groups: [],
    });

    const groupsList = computed(() => {
      return store.state.staffGroups.groupsList
    })

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg
    })

    const submitPatientGroupForm = () => {
      store.dispatch('addPatientGroup', {
        patientId: route.params.udid,
        data: patientGroupForm,
      }).then((status) => {
        // alert(JSON.stringify(status))
        if(status) {
          store.dispatch('getPatientGroup', route.params.udid)
          closeModal()
        }
      })
    }

    const closeModal = () => {
      store.commit('errorMsg', null)
      emit("closeModal", {
        modal: 'addGroup',
        value: false,
      });
    }

    return {
      patientGroupForm,
      submitPatientGroupForm,
      closeModal,
      groupsList,
      errorMsg,
    }
  }
}
</script>