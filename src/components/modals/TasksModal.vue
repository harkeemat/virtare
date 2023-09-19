<template>
<a-modal width="1000px" :title="taskId?'Edit Task':$t('tasks.tasksModal.addTask')" :footer="false" :maskClosable="false" @cancel="closeModal()" centered>
    <a-form :model="taskForm" ref="formRef" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,23,'id','name'),'name','udid')" autocomplete="off" layout="vertical" @finish="submitForm" @finishFailed="taskFormFailed">
        <a-row :gutter="24">
            <a-col :span="24">
                <div class="form-group">
                    <a-form-item  :label="$t('tasks.tasksModal.title')" name="title" :rules="[{ required: true, message: $t('tasks.tasksModal.title')+' '+$t('global.validation')  }]">
                        
                        <a-input v-model:value="taskForm.title" size="large" @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="24">
                <div class="form-group">
                    <a-form-item  :label="$t('tasks.tasksModal.longDescription')" name="description" :rules="[{ required: true, message: $t('tasks.tasksModal.longDescription')+' '+$t('global.validation')  }]">
                        <a-textarea v-model:value="taskForm.description" placeholder="Description" :auto-size="{ minRows: 3 }" @change="checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.status')" name="taskStatus" :rules="[{ required: true, message: $t('tasks.tasksModal.status')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown v-model:value="taskForm.taskStatus" :dataId="5" @handleGlobalChange="handleGlobalChange($event,'taskForm.taskStatus'); checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.priority')" name="priority" :rules="[{ required: true, message: $t('tasks.tasksModal.priority')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown v-model:value="taskForm.priority" :dataId="7" @handleGlobalChange="handleGlobalChange($event,'taskForm.priority'); checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>

            <a-col :sm="12" :xs="24" v-if="!isPatient">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.to')" name="to">
                    <div class="btn toggleButton" :class="toggleTo ? '' : 'active'" @click="buttonToggle(); checkChangeInput()">
                            <span class="btn-content">{{ $t('global.careCoodinator') }}</span>
                        </div>
                        <div class="btn toggleButton" :class="toggleTo ? 'active' : ''" @click="buttonToggle(); checkChangeInput()">
                            <span class="btn-content">{{ $t('tasks.tasksModal.patient') }}</span>
                        </div>
                        <a-input type="hidden" id="entityType" :value="toggleTo ? taskForm.entityType= 'patient' : taskForm.entityType = 'staff'" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" v-show="toggleTo" v-if="!isPatient">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.patient')" name="assignedTo" :rules="[{ required: true, message: $t('tasks.tasksModal.patient')+' '+$t('global.validation')  }]">
                        <PatientDropDown :editDataPatient="editTaskState" mode="multiple" v-model:value="taskForm.assignedTo" @handlePatientChange="handlePatientChange($event); checkChangeInput()" :close="closeValue" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :sm="12" :xs="24" v-show="!toggleTo" v-if="!isPatient">
                <div class="form-group">
                    <a-form-item :label="$t('global.careCoodinator')" name="assignedTo" :rules="[{ required: true, message: $t('global.careCoodinator')+' '+$t('global.validation')  }]">
                        <StaffDropDown :editDataStaff="editTaskState" mode="multiple" v-model:value="taskForm.assignedTo" @handleStaffChange="handleStaffChange($event); checkChangeInput()" :close="closeValue" />
                    </a-form-item>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.category')" name="taskCategory" :rules="[{ required: true, message: $t('tasks.tasksModal.category')+' '+$t('global.validation')  }]">
                        <GlobalCodeDropDown :disabled="taskId?true:false" mode="multiple" v-model:value="taskForm.taskCategory" :dataId="6" @handleGlobalChange="handleGlobalChange($event,'taskForm.taskCategory'); checkChangeInput()" />
                    </a-form-item>
                </div>
            </a-col>
            <!-- <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.startDate')" name="startDate" :rules="[{ required: true, message: $t('tasks.tasksModal.startDate')+' '+$t('global.validation')  }]">
                            <DateField :disabled="taskId?true:false" :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" v-model:value="taskForm.startDate" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :size="size" @change="checkChangeInput(); changeDate()" />
                        </a-form-item>
                </div>
            </a-col> -->
            <a-col :span="12">
                <div class="form-group">
                    <a-form-item :label="$t('tasks.tasksModal.dueDate')" name="dueDate" :rules="[{ required: true, message: $t('tasks.tasksModal.dueDate')+' '+$t('global.validation')  }]">
                            <DateField  :disabled="taskId?true:false" :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" v-model:value="taskForm.dueDate" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :size="size" @change="checkChangeInput()" />
                        </a-form-item>
                </div>
            </a-col>
            <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,23,'id','name'),'name','udid')"> </FormBaseComponents>
            <a-col :span="24">
                <FormButtons @onCancel="closeModal"  :submitButton="update ? $t('global.update') : $t('global.save')" />
            </a-col>
        </a-row>
    </a-form>
    <Loader />
</a-modal>
</template>

<script>
import { defineComponent, ref, reactive, watchEffect, computed, onMounted } from "vue";
import { useStore } from "vuex";
import FormButtons from "@/components/common/button/FormButtons";
import { timeStamp, warningSwal, endTimeAdd, globalDateFormat,arrayToObjectData,formTitleNames} from "@/commonMethods/commonMethod";
import { messages } from "../../config/messages";
import Loader from "@/components/loader/Loader";
import { useRoute } from "vue-router";
import moment from "moment";
import dayjs from 'dayjs';
import PatientDropDown from "@/components/modals/search/PatientDropdownSearch.vue";
import StaffDropDown from "@/components/modals/search/StaffDropdownSearch.vue";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import DateField from "@/components/modals/search/DateField.vue";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default defineComponent({
    components: {
        FormButtons,
        Loader,
        PatientDropDown,
        StaffDropDown,
        GlobalCodeDropDown,
        DateField,
        FormBaseComponents
    },
    props: {
        taskId: Boolean,
        onlyView: Boolean,
        patientId: {
            type: Number,
        },
    },
    setup(props, {
        emit
    }) {
        const store = useStore();
        const route = useRoute();
        const toggleTo = ref(false);
        const formRef = ref();
        const visible = ref(true);
        const value = ref("");
        const staffData = ref([]);
        const patientData = ref([]);
        const isPatientTask = props.patientId ? true : false;
        const closeValue = ref(false);
        const isPatient = route.name == "PatientSummary" ? ref(true) : ref(false)
        const taskForm = reactive({
            title: "",
            description: "",
            taskStatus: "",
            priority: "",
            assignedTo: [],
            taskCategory: [],
            dueDate: "",
            entityType: "",
        });
        const form = reactive({
            ...taskForm,
        });
        const tasks = computed(() => {
            return store.state.tasks;
        });

        const editTaskState = computed(() => {
            return store.state.tasks.editTaskState
        })
       
        onMounted(() => {
            
        })
        watchEffect(() => {
            if (tasks.value.editTask && props.taskId) {
                Object.assign(taskForm, {
                    title: tasks.value.editTask.title,
                    description: tasks.value.editTask.description,
                    taskStatus: tasks.value.editTask.taskStatus,
                    priority: tasks.value.editTask.priority,
                    assignedTo: tasks.value.editTask.assignedTo,
                    assignedName: tasks.value.editTask.assignedName,
                    taskCategory: tasks.value.editTask.taskCategory,
                    dueDate: tasks.value.editTask.dueDate,
                    entityType: tasks.value.editTask.entityType,
                });
                toggleTo.value = tasks.value.editTask.entityType == "staff" ? false : true;
                taskForm.entityType = tasks.value.editTask.entityType
            }
        });

        const submitForm = () => {
            if(route.name == "PatientSummary") {
                taskForm.entityType = 'patient'
                if(!taskForm.assignedTo.includes(route.params.udid)) {
                    taskForm.assignedTo.push(route.params.udid)
                }
            }
            if (props.taskId) {
                store
                    .dispatch("updateTask", {
                        data: {
                            title: taskForm.title,
                            description: taskForm.description,
                            taskStatus: taskForm.taskStatus,
                            priority: taskForm.priority,
                            assignedTo: taskForm.assignedTo,
                            taskCategory: taskForm.taskCategory,
                            startDate: timeStamp(moment()),
                            dueDate: timeStamp(endTimeAdd(moment(taskForm.dueDate))),
                            entityType: taskForm.entityType,
                        },
                        id: props.taskId,
                    })
                    .then(() => {
                        closeValue.value = true;
                        setTimeout(()=>{
                            closeValue.value = false;
                        },100)
                        if (route.name == "PatientSummary") {
                            let dateFilter = ''
                            let filter = ''
                            let orderParam = "&orderField=&orderBy=";
                            let islimit = "&islimit="
                            store.dispatch("showTaskModalData", {
                                id: route.params.udid,
                                filters: "?page=" + dateFilter + filter + orderParam + islimit
                            });
                            store.dispatch("latestTask", route.params.udid);
                        }
                        if (props.onlyView) {
                            emit("clinicalDashboard")
                        } else { 
                            emit("closeModal", {
                                modal: "addTask",
                                value: false,
                            });
                            handleCancel()
                            store.commit("checkChangeInput", false);
                            emit("saveTaskModal", false);
                            Object.assign(taskForm, form);
                            apiCall()
                        }
                    });

            } else {
                store
                    .dispatch("addTask", {
                        title: taskForm.title,
                        description: taskForm.description,
                        taskStatus: taskForm.taskStatus,
                        priority: taskForm.priority,
                        assignedTo: taskForm.assignedTo,
                        taskCategory: taskForm.taskCategory,
                        startDate: timeStamp(moment()),
                        dueDate: timeStamp(endTimeAdd(moment(taskForm.dueDate))),
                        entityType: taskForm.entityType,
                    })
                    .then(() => {
                        closeValue.value = true;
                        setTimeout(()=>{
                            closeValue.value = false;
                        },100)
                        store.commit("checkChangeInput", false);
                        if (route.name == "PatientSummary") {
                            store.dispatch("latestTask", route.params.udid);
                            store.dispatch('patientTimeline', {
                                id: route.params.udid,
                                type: ''
                            });
                        }
                        handleCancel()
                        store.dispatch("notificationList");
                        Object.assign(taskForm, form);
                        emit("closeModal", {
                            modal: "addTask",
                            value: false,
                        });
                        emit("saveTaskModal", false);
                        apiCall()

                    });

            }
            //store.state.tasks.tasksList = null;

            emit("closeModal");
        };

        function apiCall() {
            if (tasks.value.addTask != null || tasks.value.updateTask != null) {
                if (route.params.udid == null) {
                    let filter = route.query.filter ? route.query.filter : ''
                    let date = store.getters.otherFilters.value ? store.getters.otherFilters.value : route.query.fromDate && route.query.toDate ? "&fromDate=" + route.query.fromDate + "&toDate=" + route.query.toDate : "&fromDate=&toDate="
                    store.dispatch("tasksList",'?active=1' + store.getters.otherFilters.value + '&filter=' + filter +date);
                    store.dispatch("allTaskStatus");
                    store.dispatch("taskStatus");
                    store.dispatch("taskPriority");
                    store.dispatch("taskTeamMember");
                    store.dispatch("taskCategory");
                    store.dispatch("completeTaskRate");
                }
                if (route.name != "PatientSummary") {
                    store.dispatch("taskStatus");
                    store.dispatch("taskPriority");
                    store.dispatch("taskTeamMember");
                    store.dispatch("taskCategory");
                }
                Object.assign(taskForm, form);
                emit("saveTaskModal", false);
            }
        }
        const handleCancel = () => {
            store.state.tasks.editTask = ''
            formRef.value.resetFields();
            Object.assign(taskForm, form);
        };

        const common = computed(() => {
            return store.state.common;
        });

        function buttonToggle() {
            toggleTo.value = !toggleTo.value;
            taskForm.assignedTo = [];
        }

        function checkChangeInput() {
            store.commit("checkChangeInput", true);
        }

        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        });

        function closeModal() {
            emit("closeModal", true)
            emit("saveTaskModal", true)
            if (checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        store.state.tasks.editTask = ''
                        closeValue.value = true;
                        setTimeout(() => {
                            closeValue.value = false;
                        }, 100);
                        emit("closeModal", {
                            modal: "addTask",
                            value: false,
                        });
                        formRef.value.resetFields();
                        emit("saveTaskModal", false);
                        Object.assign(taskForm, form);
                        store.commit("checkChangeInput", false);
                    } else {
                        emit("saveTaskModal", true);
                        emit("closeModal", {
                            modal: "addTask",
                            value: true,
                        });
                    }
                });
            } else {
                emit("saveTaskModal", false)
                emit("closeModal", false)
                handleCancel()

            }
        }

        const taskFormFailed = () => {
           
        };

        const handleStaffChange = (val) => {
            taskForm.assignedTo = val;
        };

        const handlePatientChange = (val) => {
            taskForm.assignedTo = val;
        };

        function changeDate() {
            if (moment() > moment(taskForm.dueDate)) {
                taskForm.dueDate = ''
            }

        }
         const handleGlobalChange = (data,type) =>{
      if (type == "taskForm.taskStatus") {
        taskForm.taskStatus = data;
      }
      if (type == "taskForm.priority") {
        taskForm.priority = data;
      }
      if (type == "taskForm.taskCategory") {
        taskForm.taskCategory = data;
      }
    }
        return {
            dayjs,
            handleGlobalChange,
            globalDateFormat,
            changeDate,
            taskFormFailed,
            loadingStatus: store.getters.loadingStatus,
            handlePatientChange,
            handleStaffChange,
            staffData,
            patientData,
            checkChangeInput,
            checkFieldsData,
            tasks,
            common,
            closeModal,
            form,
            formRef,
            timeStamp,
            buttonToggle,
            toggleTo,
            size: ref("large"),
            value,
            taskForm,
            submitForm,
            visible,
            handleCancel,
            isPatientTask,
            closeValue,
            moment,
            editTaskState,
            isPatient,
            formData:store.getters.formTitle,
            arrayToObjectData,
            formTitleNames
        };
    },
});
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
</style>
