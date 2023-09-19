<template>
  <a-modal width="50%" :title="title" @cancel="onCloseModal()">
    <div class="wide">
      <a-form ref="formRef" layout="vertical" :model="addCareTeamForm" @finish="submitForm">
        <a-row :gutter="24">
          <a-col :sm="24" :xs="24">
            <a-form-item :label="$t('global.careCoodinator')" name="staff" :rules="[{ required: true, message: $t('global.careCoodinator')+' '+$t('global.validation') }]">
              <a-input v-if="isEditCareCoordinator" :disabled="disabled" :value="patientCareCoordinatorName" size="large" />
              <StaffDropDown v-else :disabled="disabled" v-model:value="addCareTeamForm.staff" @handleStaffChange="handleStaffChange($event); checkChangeInput()" :close="closeValue" />
            </a-form-item>
          </a-col>
          <a-col :sm="24" :xs="24">
            <a-form-item :label="$t('global.isPrimary')" name="isPrimary" :rules="[{ required: true, message: $t('global.isPrimary')+' '+$t('global.validation') }]">
              <a-switch @change="checkChangeInput()" v-model:checked="addCareTeamForm.isPrimary" size="large" />
            </a-form-item>
          </a-col>
          <a-col  :sm="4" :md="8" :xs="24"> 
            <a-button class="add-button" size="large" html-type="submit">{{ buttontext }}</a-button>
          </a-col>
        </a-row>
      </a-form>
      <Loader />
    </div>
  </a-modal>
</template>

<script>

import { computed, defineComponent, reactive, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {warningSwal,actionTrack} from "@/commonMethods/commonMethod";
import { messages } from '@/config/messages';
import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue"
import Loader from "@/components/loader/Loader";

export default defineComponent({
  props: {
    title: {
      title: String
    },
    staffType: {
      type: Number
    },
    isEditCareCoordinator: {
      type: Boolean
    },
  },
  components: {
    StaffDropDown,
    Loader,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const patientUdid = route.params.udid;
    const isValueChanged = ref(false);
    const patientCareCoordinatorName = ref(null);
    const disabled = props.isEditCareCoordinator == true ? true : false
    var isEdit = props.isEditCareCoordinator == true ? true : false
    var buttontext = props.isEditCareCoordinator == true ? 'Update' : 'Add'

    const patientCareCoordinatorDetails = computed(() => {
      return store.state.careTeam.patientCareCoordinatorDetails
    })

    const addCareTeamForm = reactive({
      staff: "",
      isPrimary: false,
      type: props.staffType
    })
    const form = reactive({ ...addCareTeamForm })

    watchEffect(() => {
      if(isEdit == true) {
        Object.assign(addCareTeamForm, patientCareCoordinatorDetails.value)
        patientCareCoordinatorName.value = patientCareCoordinatorDetails.value != null ? patientCareCoordinatorDetails.value.staff : ''
      }
      store.dispatch('staffArray', {
        patientUdid: patientUdid,
        type: props.staffType
      })
    })

    const staffList = computed(() => {
      return store.state.common.allStaffList
    })

    const handleStaffChange = (val) => {
      addCareTeamForm.staff = val;
    };

    function checkChangeInput() {
      store.commit('checkChangeInput', true)
    }
    
    const checkFieldsData = computed(()=>{
      return store.state.common.checkChangeInput;
    })

    const changedValue = () => {
      isValueChanged.value = true;
    }

    function onCloseModal() {
      emit("closeModal", {
        modal: 'addCareTeam',
        value: true
      });
      if(checkFieldsData.value) {
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            emit("closeModal", {
              modal: 'addCareTeam',
              value: false
            });
            Object.assign(addCareTeamForm, form);
            store.commit('checkChangeInput', false)
          }
          else {
            emit("closeModal", {
              modal: 'addCareTeam',
              value: true
            });
          }
        })
      }
      else {
        emit("closeModal", {
          modal: 'addCareTeam',
          value: false
        });
      }
    }
    
    const formRef = ref();
    const submitForm = () => {
      if(props.isEditCareCoordinator) {
        store.dispatch('updatePatientCareCoordinator', {
          patientUdid: patientUdid,
          patientStaffUdid: patientCareCoordinatorDetails.value.id,
          data: {
            isPrimary: addCareTeamForm.isPrimary == true ? 1 : 0,
            type: props.staffType,
          }
        }).then(() => {
          store.dispatch('patientCareCoordinatorsList', {
            patientUdid: patientUdid,
            type: props.staffType
          })
          formRef.value.resetFields();
          Object.assign(addCareTeamForm, form);
          emit("closeModal", {
            modal: 'addCareTeam',
            value: false
          });
          isEdit = false
        })
      }
      else {
        store.dispatch('addPatientCareCoordinator', {
          patientUdid: patientUdid,
          data: addCareTeamForm
        }).then(() => {
          store.dispatch('patientCareCoordinatorsList', {
            patientUdid: patientUdid,
            type: props.staffType
          })
          formRef.value.resetFields();
          Object.assign(addCareTeamForm, form);
          emit("closeModal", {
            modal: 'addCareTeam',
            value: false
          });
          isEdit = false
        })
      }
    }

    const deleteStaff = (patientStaffUdid) => {
      warningSwal(messages.deleteWarning).then((response) => {
        if (response == true) {
            store.dispatch('deleteStaff', { patientUdid: patientUdid, patientStaffUdid: patientStaffUdid }).then(() => {
            store.dispatch('patientCareCoordinatorsList', {
              patientUdid: patientUdid,
              type: props.staffType
            })
          })
        }
      })
    }

    return {
      actionTrack,
      paramsId:route.params.udid,
      deleteStaff,
      addCareTeamForm,
      submitForm,
      formRef,
      staffList,
      isValueChanged,
      changedValue,
      onCloseModal,
      handleStaffChange,
      checkChangeInput,
      disabled,
      patientCareCoordinatorName,
      buttontext,
    };
  },
});
</script>


<style>
  .add-button {
    color: #fff;
    background: #1890ff;
    border-color: #1890ff;
    width: 70%;
  }
</style>