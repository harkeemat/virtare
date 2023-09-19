<template>
    <a-modal max-width="1140px" width="50%" :title="'Assign Template'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
        <a-form :model="formData" autocomplete="off" layout="vertical" @finish="submitForm">
            <a-row :gutter="24">
                <!-- <a-col :sm="12" :xs="24">
                    <div class="form-group">
                        <a-form-item :label="$t('tasks.tasksModal.to')" name="to">
                        <div class="btn toggleButton" :class="toggleTo ? '' : 'active'" @click="buttonToggle(); checkChangeInput()">
                                <span class="btn-content">{{ $t('global.careCoodinator') }}</span>
                            </div>
                            <div class="btn toggleButton" :class="toggleTo ? 'active' : ''" @click="buttonToggle(); checkChangeInput()">
                                <span class="btn-content">{{ $t('tasks.tasksModal.patient') }}</span>
                            </div>
                            <a-input type="hidden" id="entityType" :value="toggleTo ? formData.entityType= 'patient' : formData.entityType = 'staff'" />
                        </a-form-item>
                    </div>
                </a-col> -->
    
                <!-- <a-col :sm="12" :xs="24" v-show="!toggleTo">
                    <div class="form-group">
                        <a-form-item :label="$t('global.careCoodinator')" name="assignedTo" :rules="[{ required: true, message: $t('global.careCoodinator')+' '+$t('global.validation')  }]">
                            <StaffDropDown :editDataStaff="editTaskState" mode="multiple" v-model:value="formData.assignedTo" @handleStaffChange="handleStaffChange($event); checkChangeInput()" :close="closeValue" />
                        </a-form-item>
                    </div>
                </a-col> -->
                <a-col :sm="24" :xs="24">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="1" tab="Patient">
                            <a-col :sm="24" :xs="24">
                                <div class="form-group" v-if="formData.assignedToProgram?.length==0 && formData.assignedToGroup?.length==0">
                                    <a-form-item :label="$t('tasks.tasksModal.patient')" name="assignedToPatient" :rules="[{ required: true, message: $t('tasks.tasksModal.patient')+' '+$t('global.validation')  }]">
                                        <PatientDropDown :editDataPatient="editTaskState" mode="multiple" v-model:value="formData.assignedToPatient" @handlePatientChange="handlePatientChange($event); checkChangeInput()" :close="closeValue" />
                                        <ErrorMessage v-if="errorMsg" :name="errorMsg.values ? errorMsg.values[0] : ''" />
                                    </a-form-item>
                                </div>
                                <div class="form-group" v-else>
                                    <a-form-item :label="$t('tasks.tasksModal.patient')" name="assignedToPatient" :rules="[{ required: false, message: $t('tasks.tasksModal.patient')+' '+$t('global.validation')  }]">
                                        <a-select disabled v-model:value="value" show-search placeholder="Please select" style="width: 100%" :options="options"></a-select>
                                    </a-form-item>
                                </div>
                            </a-col>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Program">
                            <a-col :sm="24" :xs="24">
                                <div class="form-group" v-if="formData.assignedToPatient?.length==0 && formData.assignedToGroup?.length==0">
                                    <a-form-item :label="'Program'" name="assignedToProgram" :rules="[{ required: true, message: 'Program'+' '+$t('global.validation')  }]">
                                        <!-- <ArrayDataSearch mode="multiple" v-model:value="formData.assignedToProgram" :globalCode="patients.programList" @change="changedValue" /> -->
                                        <!-- In the program list change id to udid then use ArrayDataSearch component -->
                                        <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" size="large" v-model:value="formData.assignedToProgram" mode="multiple">
                                            <a-select-option v-for="program in patients.programList" :key="program.id" :value="program.udid">{{ program.name }}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </div>
                                <div class="form-group" v-else>
                                    <a-form-item :label="'Program'" name="assignedToProgram" :rules="[{ required: false, message: 'Program'+' '+$t('global.validation')  }]">
                                        <a-select disabled v-model:value="value" show-search placeholder="Please select" style="width: 100%" :options="options"></a-select>
                                    </a-form-item>
                                </div>
                            </a-col>
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="Group">
                            <a-col :sm="24" :xs="24">
                                <div class="form-group" v-if="formData.assignedToPatient?.length==0 && formData.assignedToProgram?.length==0">
                                    <a-form-item :label="'Group'" name="assignedToGroup" :rules="[{ required: true, message: 'Group'+' '+$t('global.validation')  }]">
                                        <ArrayDataSearch mode="multiple" v-model:value="formData.assignedToGroup" :globalCode="groupsList" @change="changedValue" />
                                    </a-form-item>
                                </div>
                                <div class="form-group" v-else>
                                    <a-form-item :label="'Group'" name="assignedToGroup" :rules="[{ required: false, message: 'Group'+' '+$t('global.validation')  }]">
                                        <a-select disabled v-model:value="value" show-search placeholder="Please select" style="width: 100%" :options="options"></a-select>
                                    </a-form-item>
                                </div>
                            </a-col>
                        </a-tab-pane>
                    </a-tabs>
                </a-col>
                <a-col :span="24" class="mt-28">
                    <FormButtons @onCancel="closeModal" :submitButton="update ? $t('global.update') : $t('global.save')" />
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
    </template>
<script>
import {
    computed,
    reactive,
    ref
} from "vue";
//   import { useRoute } from "vue-router";
import {
    useStore
} from "vuex";
import PatientDropDown from "@/components/modals/search/PatientDropdownSearch.vue";
// import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue";
import FormButtons from "@/components/common/button/FormButtons";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch";
export default {
    props: {
        formId: String
    },
    components: {
        PatientDropDown,
        // StaffDropDown,
        FormButtons,
        ErrorMessage,
        ArrayDataSearch
    },
    setup(props, {
        emit
    }) {
        const store = useStore();
        // const route = useRoute();
        const formState = reactive({});
        const toggleTo = ref(false);
        const formData = reactive({
            assignedToPatient: [],
            assignedToProgram: [],
            assignedToGroup: []
        });
        const form = reactive({
            ...formData,
        });

        const customFormData = computed(() => {
            return store.state.customForm
        })


        const submitForm = () => {
            let data = {
                form_id: props ?.formId,
                values: '',
                type: ''
            }
            if(formData.assignedToPatient?.length>0){
                data.values = formData.assignedToPatient
                data.type = 'patients'
            }else if(formData.assignedToProgram?.length>0){
                data.values = formData.assignedToProgram
                data.type = 'program'
            }else{
                data.values = formData.assignedToGroup
                data.type = 'group'
            }

            store.dispatch('assignFormData', data).then((resp) => {
                if (resp == true) {
                    emit("saveModal", false);
                    Object.assign(formState, form)
                }
            })
        }

        const errorMsg = computed(() => {
            return store.state.customForm.errorMsg
        });

        const handleStaffChange = (val) => {
            formData.assignedToPatient = val;
        };

        const handlePatientChange = (val) => {
            formData.assignedToPatient = val;
        };

        function buttonToggle() {
            toggleTo.value = !toggleTo.value;
            formData.assignedToPatient = [];
        }

        function closeModal() {
            Object.assign(formState, form)
        }

        function checkChangeInput() {
            store.commit("checkChangeInput", true);
        }

        const patients = computed(() => {
            return store.state.patients;
        });

        const groupsList = computed(() => {
            return store.state.staffGroups.groupsList
        })

        return {
            groupsList,
            patients,
            checkChangeInput,
            errorMsg,
            toggleTo,
            buttonToggle,
            formData,
            handleStaffChange,
            handlePatientChange,
            form,
            formState,
            customFormData,
            submitForm,
            closeModal,
            activeKey: ref('1'),
            
        };
    },
};
</script>

<style>
.ant-modal-footer {
  display: none;
}

.toggleButton {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 6px 16px;
  display: inline-block;
  cursor: pointer;
  width: fit-content;
}

.toggleButton.active {
  background-color: #777;
  color: #fff;
}

.ant-tabs {
  overflow: visible !important;
}
</style>
