<template>
<a-modal width="800px" :title="programId ? 'Edit Program' :'Add New Program'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-form ref="formRef" :model="program" name="basic" autocomplete="off" layout="vertical" @finish="programs" @finishFailed="programFailed">
        <a-row :gutter="24">
            <a-col :sm="24" :xs="24">
                
                <div class="form-group">

                    <a-form-item :label="$t('programs.createProgram')" name="name" :rules="[{ required: true, message: $t('programs.createProgram')+' '+$t('global.validation') }]">
                        <a-input v-model:value="program.name" size="large" @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.program?errorMsg.program[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :md="12" :sm="12" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('global.type')" name="typeId" :rules="[{required: true,message: $t('global.type') + ' ' + $t('global.validation'),},]">
                       
                        <GlobalCodeDropDown v-model:value="program.typeId" :dataId="26" @handleGlobalChange="handleGlobalChange($event)" @change="handleDevice(); checkChangeInput()" />
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.deviceType ? errorMsg.deviceType[0] : ''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="24" :xs="24">
                <div class="form-group">
                    <a-form-item :label="$t('programs.description')" name="description" :rules="[{ required: true, message: $t('programs.description')+' '+$t('global.validation') }]">
                        <a-input v-model:value="program.description" size="large" @change="checkChangeInput()"/>
                        <ErrorMessage v-if="errorMsg" :name="errorMsg.program?errorMsg.program[0]:''" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24">
                <div class="form-group">
                    <label>Active/Inactive</label>

                    <a-switch v-model:checked="program.isActive" @change="UpdateProgramStatus($event); checkChangeInput();" />
                </div>
            </a-col>
            <a-col :span="24">
                <div class="steps-action">
                    <ModalButtons @is_click="reset" :Id="programId" />
                </div>
            </a-col>
        </a-row>
    </a-form>
    <Loader v-if="programId" />
</a-modal>
</template>

<script>
import { ref, reactive, watchEffect, computed } from "vue";
import { useStore } from "vuex";
import Loader from "./../loader/Loader";
import { warningSwal } from "./../../commonMethods/commonMethod";
import { messages } from "./../../config/messages";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import ModalButtons from "@/components/common/button/ModalButtons";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
export default {
  components: {
    ModalButtons,
    Loader,
    ErrorMessage,
    GlobalCodeDropDown,
  },
  props: {
    idProgram: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const formRef = ref();
    const programId = reactive(props.idProgram);
    const program = reactive({
      name: "",
      description: "",
      typeId: "",
      isActive: true,
    });

   
    const programEdit = store.getters.programsRecord;
    watchEffect(() => {
      if (programId != null) {
        store.commit("loadingStatus", true);
        if (programEdit.value.editProgram) {
          Object.assign(program, programEdit.value.editProgram[0]);
          program.isActive = programEdit.value.editProgram[0].isActive? true : false
          setTimeout(() => {
            store.commit("loadingStatus", false);
          }, 2000);
        }
      }
    });

    function UpdateProgramStatus(event) {
      program.isActive = event;
    }
    const programs = () => {
      if (programId != null) {
        store.dispatch("updateManageProgram", {
          data: {
            name: program.name,
            description: program.description,
            typeId: program.typeId,
            isActive: program.isActive,
          },
          id: programId,
        }).then(()=>{
          reset();
          store.dispatch("manageProgramList")
          emit("is-visible", false);
        })
      } else {
        store.dispatch("addManageProgram", {
          data: {
            name: program.name,
            description: program.description,
            typeId: program.typeId,
            isActive: program.isActive,
          },
        }).then(()=>{
          reset();
          store.dispatch("manageProgramList")
          emit("is-visible", false);
        })
        
      }
      store.commit('checkChangeInput', false)
     

    };

    const form = reactive({
      ...program,
    });

    function reset() {
      formRef.value.resetFields();
      Object.assign(program, form);
    }
    const globalCode = computed(() => {
      return store.state.common;
    });
    const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        })
    function checkChangeInput() {
            store.commit('checkChangeInput', true)
        }
    function closeModal() {
      emit("is-visible", true);
      if (checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        
                        
                        reset();
            emit("is-visible", false);
            store.commit('checkChangeInput', false)
                    } else {
                        emit("is-visible", true);
                    }
                });
            }else{
                formRef.value.resetFields();
                emit("is-visible", false);
            }
    }
    const handleGlobalChange = (data) =>{
      program.typeId = data
    }
    return {
      handleGlobalChange,
      form,
      program,
      programs,
      closeModal,
      formRef,
      programId,
      globalCode,
      programEdit,
      UpdateProgramStatus,
      reset,
      checkChangeInput,
    };
  },
};
</script>
