<template>
    <a-layout-content>
        <div class="common-bg">
            <a-row>
                <a-col :span="24">
                    <h2 class="pageTittle clinicalDashboard">
                        Business Dashboard
                        <!-- <DateFilter :Buttons="timeLineButton?.businessFiletr" @clickButtons="showButton($event)" :hideArray="hideFilterBusinessDashboard" :custom="false" commit="businessFiletr" v-if="widgetsPermissions?.length > 0" /> -->
                    </h2>
                    <EmptyTable  :text="'We will update soon!'" />
                </a-col>
            </a-row>
            <!-- <a-row :gutter="20" style="margin-top:20px">
                <a-col :span="12" v-if="widgetRecords?.leftWidget?.length > 0">
                    <draggable class="" :list="widgetRecords?.leftWidget" group="people" @change="log" :move="moveLeft">
                        <div v-for="(element, index) in widgetRecords?.leftWidget" :key="index">
                            <DashboardWidgets :element="element" :escalationColumn="escalationColumn" :columnData="columnData" :tasksColumns="tasksColumns" :showColumnsRecord="showColumnsRecord" @showEscalationData="showEscalationData($event)" @actionClick="remove1($event, index,'left')" @escalationColumnRecord="escalationColumnRecord($event)" @taskColumnRecord="taskColumnRecord($event)" @taskApiCall="taskApiCall" :tasksListColumns="tasksListColumns" />
                        </div>
                    </draggable>
                </a-col>
                <a-col :span="12" v-if="widgetRecords?.rightWidget?.length > 0">
                    <draggable :list="widgetRecords?.rightWidget" group="people" @change="log" :move="checkMoveRight">
                        <div v-for="(element, index) in widgetRecords?.rightWidget" :key="index">
                            <DashboardWidgets :element="element" :escalationColumn="escalationColumn" :columnData="columnData" :tasksColumns="tasksColumns" :showColumnsRecord="showColumnsRecord" @showEscalationData="showEscalationData($event)" @actionClick="remove1($event, index,'right')" @escalationColumnRecord="escalationColumnRecord($event)" @taskColumnRecord="taskColumnRecord($event)" @taskApiCall="taskApiCall" :tasksListColumns="tasksListColumns" />
                        </div>
                    </draggable>
    
                </a-col>
                <a-col :span="24">
                    <div class="addMoreWidget">
                        <a-popover>
                            <template #content>
                                <p>Add More Widgets</p>
                            </template>
                            <PlusCircleOutlined @click="addWidgetLeft({ show: true })" />
                        </a-popover>
                    </div>
                </a-col>
    
            </a-row>
            <DashboardLoader class="fullLoader" /> -->
        </div>
    </a-layout-content>
    <!-- <EscaltionViewModal v-model:visible="escaltionViewModal" v-if="escaltionViewModal"/>
    <EscaltionModal v-model:visible="escaltionModal" @saveModal="saveModal($event)" :isEdit="isEdit" v-if="escaltionModal"/>
    <AddWidgetModal v-model:visible="widgetShow" v-if="widgetShow" @saveModal="getWidget($event)" :list1="widgetRecords?.leftWidget" :list2="widgetRecords?.rightWidget" :align="align" :tasksColumns="tasksColumns" :escalationColumn="escalationColumn" />
    <TasksModal v-model:visible="visible" @saveTaskModal="handleOk($event)" :taskId="taskID" /> -->
</template>
<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
// import { PlusCircleOutlined } from "@ant-design/icons-vue";
// import { ref, onMounted, computed, onUnmounted, reactive, watchEffect } from "vue";
// import { warningSwal, startimeAdd, endTimeAdd, timeStamp, arrayToObjact, objectRemoveFormArray,hideFilterBusinessDashboard } from "@/commonMethods/commonMethod";
// import { useStore } from "vuex";
// import DashboardLoader from "@/components/loader/DashboardLoader";
// import moment from "moment";
// import { messages } from "@/config/messages";
// import EscaltionViewModal from "@/components/escalations/EscalationViewModal";

// import TasksModal from "@/components/modals/TasksModal";

// import EscaltionModal from "@/components/escalations/EscalationModal";
// import AddWidgetModal from "@/components/clinic/dashboard/modal/AddWidgetModal";
// import DashboardWidgets from "@/components/clinic/dashboard/DashboardWidgets";
// // import { VueDraggableNext } from "vue-draggable-next";
// import DateFilter from "@/components/common/DateFilter.vue";
// const columnData = [
//     {
//         id: 1,
//         title: "Name",
//         position: 1,
//         dataIndex: "patientName",
//         sorter: true,
//         slots: {
//             customRender: "patientName",
//         },
//     },
//     {
//         id: 2,
//         title: "Type",
//         position: 2,
//         dataIndex: "escalationType",
//         sorter: true,
//         slots: {
//             customRender: "escalationType",
//         },
//     },

//     {
//         id: 3,
//         position: 3,
//         title: "Assigned By",
//         dataIndex: "assignedBy",
//         sorter: true,
//         slots: {
//             customRender: "assignedBy",
//         },
//     },

//     {
//         id: 4,
//         position: 4,
//         title: "Action",
//         dataIndex: "action",
//         slots: {
//             customRender: "action",
//         },
//     },
// ]
// const tasksListColumns = [
//     {
//         id: 1,
//         position: 1,
//         title: "Task Name",
//         dataIndex: "title",
//         sorter: true,
//         slots: {
//             customRender: "taskName",
//         },
//     },

//     {
//         id: 2,
//         position: 2,
//         title: "Priority ",
//         dataIndex: "priority",
//     },
//     {
//         id: 3,
//         position: 3,
//         title: "Category",
//         dataIndex: "category",
//         sorter: true,
//         slots: {
//             customRender: "category",
//         },
//     },
//     {
//         id: 4,
//         position: 4,
//         title: "Start Date ",
//         dataIndex: "startDate",
//         sorter: true,
//     },

//     {
//         id: 5,
//         position: 5,
//         title: "Due Date ",
//         dataIndex: "dueDate",
//         sorter: true,
//     },
// ];
// export default {
//     components: {
//         DashboardLoader,
//         EscaltionViewModal,
//         TasksModal,
//         EscaltionModal,
//         AddWidgetModal,
//         PlusCircleOutlined,
//         // draggable: VueDraggableNext,
//         DashboardWidgets,
//         DateFilter
//     },

//     setup() {
//         const fromDate = ref();
//         const toDate = ref();
//         const store = useStore()
//         const widgetShow = ref(false);
//         const align = ref();
//         const list2 = ref([]);
//         const list3 = ref([]);
//         const escaltionViewModal = ref(false);
//         const escaltionModal = ref(false);
//         const isEdit = ref();
//         const escalationColumn = ref([])
//         const tasksColumns = ref([])
//         const showColumnsRecord = reactive({
//             escalation: [],
//             task: []
//         })
//         const timeLineButton = store.getters.businessDashboard
//         const countApi = ref(4)
//         function apiCall(data) {
//             countApi.value = 4
//             let from = moment()
//             let to = moment()
//             if (data?.globalCodeId == 122) {

//                 from = moment()
//                 to = moment().subtract(data?.number, data?.intervalType);
//             } else if (data?.globalCodeId == 123) {
//                 from = moment();

//                 to = moment().subtract(data?.number, data?.intervalType);
//             } else if (data?.globalCodeId == 124) {
//                 from = moment();
//                 to = moment().subtract(data?.number, data?.intervalType);
//             } else {
//                 from = moment();
//                 to = moment().subtract(data?.number, data?.intervalType);
//             }
//             let dateFormate = {
//                 fromDate: '',
//                 toDate: ''
//             }
//             let cptDateFormate = {
//                 fromDate: '',
//                 toDate: ''
//             }

//             if (data?.globalCodeId == 122) {
//                 dateFormate = {
//                     fromDate: from ? timeStamp(startimeAdd(from)) : '',
//                     toDate: to ? timeStamp(endTimeAdd(to)) : ''
//                 }
//                 cptDateFormate = {
//                     fromDate: from.format("YYYY-MM-DD"),
//                     toDate: to.format("YYYY-MM-DD")
//                 }
//             } else {
//                 dateFormate = {
//                     fromDate: timeStamp(startimeAdd(to)),
//                     toDate: timeStamp(endTimeAdd(from))
//                 }
//                 cptDateFormate = {
//                     fromDate: to.format("YYYY-MM-DD"),
//                     toDate: from.format("YYYY-MM-DD")
//                 }
//             }
//             fromDate.value = dateFormate.fromDate;
//             toDate.value = dateFormate.toDate;

//             store.commit("dateFilter", dateFormate);
//             store.dispatch("permissions")
//             store.dispatch("callStatus", dateFormate).then(() => { countApi.value-- })
//             store.dispatch("cptCode", cptDateFormate).then(() => { countApi.value-- })
//             store.dispatch("referalCount", dateFormate).then(() => { countApi.value-- })
//             store.dispatch("financial", dateFormate).then(() => { setTimeout(()=>{

//                 countApi.value--;
//             },2000) })
            
            
            
            
           


//         }
//         watchEffect(() => {
            
//             if (countApi.value <= 0) {
//                 store.commit("dashboardLoadingStatus", false)
//             } else {
//                 store.commit("dashboardLoadingStatus", true)
//             }
//             if (store.state.common.filterDateDataGet.length > 0) {
//                 if (timeLineButton.value?.businessFiletr == null) {
//                 store
//                     .dispatch("timeLine", {
//                     id: 122,
//                     commit: "businessFiletr",
//                     })
//                     .then(() => {
//                     countApi.value = 4;
//                     apiCall(timeLineButton.value?.businessFiletr);
//                     });
//                 }
//             }
//         })
//         const escalationList = computed(() => {
//             return store.state.escalations.escalation;
//         });
//         const widgetRecords = ref()
//         const allwidgetdashboard = store.getters.widgetRecords
//         const setting = ref({
//             config: "business Dashboard",
//             setting: "",
//         });
//         const widgetName = store.getters.widgetName
//         onMounted(() => {
//             store.dispatch("widgetName").then(() => {

//                 store.dispatch("getUserSetting", { config: 'business Dashboard' }).then(() => {
//                     allwidgetdashboard.value?.map((item) => {
//                         if (item.config == "business Dashboard") {
//                             widgetRecords.value = JSON.parse(item.setting)

//                         }
//                     });
//                     let widget = {
//                         widget: widgetName.value[1]?.widget,
//                         tableColumn: {
//                             escalation: columnData,
//                             task: tasksListColumns
//                         }
//                     };
//                     setting.value = {
//                         config: "business Dashboard",
//                         setting: JSON.stringify(widget),
//                     };
//                     if (!widgetRecords.value) {
//                         store.dispatch("userSetting", setting.value).then(() => {
//                             escalationColumn.value = columnData
//                             tasksColumns.value = tasksListColumns
//                             checkMoveLeft({ event: true, widget: widget.widget });
//                         });
//                     } else {
//                         escalationColumn.value = widgetRecords.value?.tableColumn?.escalation ? widgetRecords.value?.tableColumn?.escalation : columnData
//                         tasksColumns.value = widgetRecords.value?.tableColumn?.task ? widgetRecords.value?.tableColumn?.task : tasksListColumns
//                         checkMoveLeft({ event: true, widget: widgetRecords.value.widget });
//                     }
//                     if (widgetRecords.value?.tableColumn) {
//                         widgetRecords.value?.tableColumn?.escalation ?
//                             widgetRecords.value?.tableColumn?.escalation.map((item) => {
//                                 showColumnsRecord.escalation.push(item.id)
//                             }) : ''
//                         widgetRecords.value?.tableColumn?.task ?
//                             widgetRecords.value?.tableColumn?.task.map((item) => {
//                                 showColumnsRecord.task.push(item.id)
//                             }) : ''
//                     } else {
//                         widget?.tableColumn?.escalation.map((item) => {
//                             showColumnsRecord.escalation.push(item.id)
//                         })
//                         widget?.tableColumn?.task.map((item) => {
//                             showColumnsRecord.task.push(item.id)
//                         })
//                     }

//                 })

//             })
//             if (timeLineButton.value?.businessFiletr) {
//                 apiCall(timeLineButton.value?.businessFiletr)
//             }



//         })
//         const showEscalationModal = () => {
//             store.commit("resetEscalationCounter");
//             store.state.patients.addBasicEscalation = null;
//             escaltionModal.value = true;
//             isEdit.value = null;
//         };
//         const showEscalationData = (data) => {
//             if (data.type == "view") {
//                 escaltionViewModal.value = data.value;
//             } else {
//                 escaltionModal.value = data.value;
//                 isEdit.value = data.id;
//             }
//         };

//         const saveModal = (value) => {
//             escaltionModal.value = value;
//             store
//                 .dispatch("timeLine", {
//                     id: 122,
//                     commit: "businessFiletr",
//                 })
//                 .then(() => {
//                     apiCall(timeLineButton.value?.businessFiletr);
//                 });
//         };
//         function showButton() {
//             apiCall(timeLineButton.value?.businessFiletr);
//         }
//         ///task list
//         const visible = ref(false);

//         const taskID = ref();
//         const editTask = (id) => {
//             (visible.value = id.check), (taskID.value = id.id);
//             store.dispatch("editTask", {
//                 id: id.id,
//             });
//         };
//         const screensPermissions = store.getters.screensPermissions;
//         const taskUrl = arrayToObjact(screensPermissions.value, 113) ? "Tasks" : "";
//         const PatientUrl = arrayToObjact(screensPermissions.value, 65)
//             ? "PatientsWithFilter"
//             : "";
//         const AppointmentsUrl = arrayToObjact(screensPermissions.value, 112)
//             ? "AppointmnetCalendar"
//             : "";
//         const escalationUrl = arrayToObjact(screensPermissions.value, 404)
//             ? "Escalation"
//             : "";
//         function taskApiCall() {
//             store.dispatch(
//                 "tasksList",
//                 "?fromDate=" +
//                 fromDate.value +
//                 "&toDate=" +
//                 toDate.value +
//                 "&status=notIn"
//             );
//         }
//         onUnmounted(() => {
//             store.state.clinicalDashboard.widgetRecords = null
//             store.state.escalations.escalation = "";
//             store.state.tasks.task = "";
//             store.dispatch("searchTable", "&search=");
//             store.dispatch("orderTable", {
//                 data: "&orderField=&orderBy=",
//             });
//         });
//         const remove1 = (event, value, direction) => {
//             if (event.event == "remove") {
//                 let temp = [];
//                 warningSwal(messages.widgetWarning).then((response) => {
//                     if (response == true) {

//                         store.commit("dashboardLoadingStatus", true)

//                         if (direction == "left") {
//                             temp = widgetRecords.value?.leftWidget;
//                             widgetRecords.value.leftWidget = temp.filter(
//                                 (item, index) => index !== value
//                             )
//                         } else {
//                             temp = widgetRecords.value?.rightWidget;
//                             widgetRecords.value.rightWidget = temp.filter(
//                                 (item, index) => index !== value
//                             );
//                         }
//                         checkMoveLeft({ event: true, widget: "" });
//                         setTimeout(() => {
//                             store.commit("dashboardLoadingStatus", false)
//                         }, 1000)
//                     }
//                 })
//             } else if (event.event == "charttype") {
//                 if (direction == "left") {
//                     let obj = widgetRecords.value?.leftWidget.find((item, index) => index == value)
//                     obj.type = event.value

//                 } else {
//                     let obj = widgetRecords.value?.rightWidget.find((item, index) => index == value)
//                     obj.type = event.value
//                 }

//                 checkMoveLeft({ event: true, widget: "" });
//             } 
//         };

//         const moveLeft = () => {
//             checkMoveLeft({ event: true, widget: "" });
//         };
//         const checkMoveLeft = (event) => {
//             let AllWidgets = [];
//             setTimeout(() => {
//                 if (!event.widget) {
//                     let count =
//                         widgetRecords.value?.leftWidget?.length >
//                             widgetRecords.value?.rightWidget?.length
//                             ? widgetRecords.value?.leftWidget?.length
//                             : widgetRecords.value?.rightWidget?.length;
//                     for (let i = 0; i < count; i++) {
//                         if (widgetRecords.value.leftWidget[i])
//                             AllWidgets.push(widgetRecords.value?.leftWidget[i]);
//                         if (widgetRecords.value.rightWidget[i])
//                             AllWidgets.push(widgetRecords.value?.rightWidget[i]);
//                     }
//                 } else {
//                     AllWidgets = event.widget;
//                 }
//                 setTimeout(() => {
//                     widgetRecords.value ? widgetRecords.value.leftWidget = [] : widgetRecords.value = { leftWidget: [], rightWidget: [] }
//                     widgetRecords.value ? widgetRecords.value.rightWidget = [] : widgetRecords.value = { leftWidget: [], rightWidget: [] }
//                     AllWidgets.map((item, index) => {
//                         if ((index + 1) % 2 == 0) {
//                             widgetRecords.value?.rightWidget.push(item);
//                         } else {
//                             widgetRecords.value?.leftWidget.push(item);
//                         }
//                     });

//                     setting.value = {
//                         config: "business Dashboard",
//                         setting: JSON.stringify({
//                             widget: AllWidgets,
//                             tableColumn: {
//                                 escalation: escalationColumn.value,
//                                 task: tasksColumns.value
//                             }
//                         }),
//                     };
//                     event.event ? store.dispatch("userSetting", setting.value) : "";
//                 }, 1000);
//             }, 1000);

//         };
//         const checkMoveRight = () => {
//             checkMoveLeft({ event: true, widget: "" });
//         };
//         const addWidgetRight = (event) => {
//             align.value = "right";
//             widgetShow.value = event.show;
//         };
//         const addWidgetLeft = (event) => {
//             align.value = "left";
//             widgetShow.value = event.show;
//         };
//         const getWidget = (event) => {
//             widgetShow.value = event.show;
//             if (event.clinic || event.business) {
//                 store.commit("dashboardLoadingStatus", false)
//                 checkMoveLeft({ event: false, widget: event.business });
//                 setTimeout(() => {
//                     store.commit("dashboardLoadingStatus", false)
//                 }, 1000)
//             }
//         };
//         const escalationColumnRecord = (event) => {
//             if (event.target.checked) {
//                 let obj = arrayToObjact(columnData, event.target.value)
//                 obj ? escalationColumn.value.splice(obj?.position - 1, 0, obj) : ''
//             } else {
//                 escalationColumn.value = objectRemoveFormArray(escalationColumn.value, event.target.value)
//             }
//             checkMoveLeft({ event: true, widget: "" });
//         }
//         const taskColumnRecord = (event) => {
//             if (event.target.checked) {
//                 let obj = arrayToObjact(tasksListColumns, event.target.value)
//                 obj ? tasksColumns.value.splice(obj?.position - 1, 0, obj) : ''
//             } else {
//                 tasksColumns.value = objectRemoveFormArray(tasksColumns.value, event.target.value)
//             }
//             checkMoveLeft({ event: true, widget: "" });
//         }
//         return {
//             grid: store.getters.grid,
//             cptCodeValue: store.getters.cptCodeValue,
//             financialValue: store.getters.financialValue,
//             referalCount: store.getters.referalCount,
//             timeLineButton,
//             showButton,
//             widgetsPermissions: store.getters.widgetsPermissions,
//             referalCountRecord: store.getters.referalCountRecord,
//             callStatus: store.getters.callStatus,
//             arrayToObjact,
//             saveModal,
//             isEdit,
//             editTask,
//             visible,
//             taskID,
//             clicalTask: store.getters.clicalTask,
//             escalationCount: store.getters.escalationCount,
//             patientsFlag: store.getters.patientsFlag,
//             appointmentCount: store.getters.appointmentCount,
//             escalationRecord: store.getters.escalationRecord,
//             columnData,
//             escalationList,
//             showEscalationModal,
//             escaltionViewModal,
//             escaltionModal,
//             showEscalationData,
//             tasksList: store.getters.tasksList,
//             tasksListColumns,
//             taskApiCall,
//             screensPermissions,
//             taskUrl,
//             PatientUrl,
//             AppointmentsUrl,
//             escalationUrl,
//             list2,
//             list3,
//             remove1,
//             checkMoveLeft,
//             checkMoveRight,
//             widgetShow,
//             addWidgetRight,
//             getWidget,
//             addWidgetLeft,
//             align,
//             widgetRecords,
//             moveLeft,
//             escalationColumnRecord,
//             showColumnsRecord,
//             escalationColumn,
//             tasksColumns,
//             taskColumnRecord,
//             hideFilterBusinessDashboard
//         };
//     },
// };
</script>
<style lang="scss" scoped>
.dragDrop {
    width: 100%;
    height: 400px;
}

.addMoreWidget {
    height: 440px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .anticon {
        font-size: 150px;
        cursor: pointer;
    }
}
</style>
