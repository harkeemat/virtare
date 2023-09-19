<template>
<a-col :sm="24">
    <a-table rowKey="id" :columns="tasksListColumns" :data-source="tasksList"  :scroll="height ? {  y:height } :{ x: 900,y:'calc(100vh - 340px)'  }" :pagination="false" @change="handleTableChange">

        <template #taskName="{text,record}">
            <a v-if="arrayToObjact(screensPermissions,115)" @click="taskDetails(record.id)"><span>{{ text }}</span></a>
            <span v-else> {{ text }}</span>
        </template>
        <!-- <template #assignedBy="text">
            <router-link to="coordinator-summary">{{ text.text }}</router-link>
        </template> -->
        <template #category="{ record }">
            <span v-for="category,i in record?.category" :key="i" to="coordinator-summary">
                <br v-if="i > 0"/> {{ category?.taskCategory ? category?.taskCategory : category }}
            </span>
        </template>
        <template #assignedTo="{ record }">
            <span v-for="assignee,i in record.assignedTo" :key="assignee.id" >
                <br v-if="i > 0"/>
                <router-link v-if="assignee.entityType == 'staff' && assignee.id" :to="{ name: 'CoordinatorSummary', params: { udid:assignee.id}}">
                    {{ assignee.name.length>9?assignee.name.substring(0,9)+'...':assignee.name }}(Staff)
                </router-link>
                <router-link v-else-if="assignee.id" :to="{ name: 'PatientSummary', params: { udid:assignee.id}}">
                    {{ assignee.name.length>9?assignee.name.substring(0,9)+'...':assignee.name }}(Patient)
                </router-link>
                 <a v-if="assignee.entityType == 'staff' && assignee.id"  @click="showStaffModal( assignee.id)"  class="nameInfoIcon"> <InfoCircleOutlined/></a>
                 <a v-else-if="assignee.id" @click="showPatientModal( assignee.id)"  class="nameInfoIcon"> <InfoCircleOutlined/></a>
            </span>
        </template>
        <template #assignedBy="{ record }">
            <router-link :to="{ name: 'CoordinatorSummary', params: { udid: record.assignedById}}">
                {{ record.assignedBy.length>15?record.assignedBy.substring(0,15)+'...':record.assignedBy }}
            </router-link>
            <a @click="showStaffModal( record.assignedById)"  class="nameInfoIcon"> <InfoCircleOutlined/></a>
        </template>
        <template #action="{ record }" >
            <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions,115)">
                <template #title>
                    <span>{{ $t('global.edit') }}</span>
                </template>
                <a class="icons">
                    <EditOutlined @click="editTask(record.id)" /></a>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="arrayToObjact(screensPermissions,116)">
                <template #title>
                    <span>{{$t('global.delete')}}</span>
                </template>
                <a class="icons">
                    <DeleteOutlined @click="deleteTask(record.id)" /></a>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="!dataList">
                <template #title>
                    <span>{{$t('tasks.createAppointment')}}</span>
                </template>
                <router-link to="appointment-calendar" class="icons" v-if="arrayToObjact(screensPermissions,112)">
                    <CalendarOutlined @click="createAppointment(record.id)" />
                </router-link>
            </a-tooltip>
        </template>
    </a-table>
</a-col>
<Loader/>
<TasksModal v-model:visible="taskVisibleView" @saveTaskModal="handleOk($event)" :taskId="taskID" :onlyView="onlyView" @clinicalDashboard="callApiFromModal" />
<!-- <TaskDetails v-model:visible="taskVisibleView"  :taskId="taskID" :onlyView="onlyView"/> -->
</template>

<script>
import { onMounted, computed,defineAsyncComponent , ref} from "vue"
import { useStore } from "vuex"
import {  DeleteOutlined, EditOutlined, CalendarOutlined,InfoCircleOutlined} from "@ant-design/icons-vue"
import { messages } from "@/config/messages"
import { warningSwal,  arrayToObjact,showPatientModal,showStaffModal,tableYScroller} from "@/commonMethods/commonMethod"
import { useRoute } from 'vue-router'
import Loader from "@/components/loader/TableLoader"
export default {
    name: "TaskTable",
    components: {
        InfoCircleOutlined,
        Loader,
        DeleteOutlined,
        EditOutlined,
        CalendarOutlined,
        TasksModal: defineAsyncComponent(() => import("@/components/modals/TasksModal.vue"))
    },
    props: {
        height: Number,
        tasksListColumns: Array,
        fromAll: Boolean,
        islimit:Number,
        dataList:Array
    },
    setup(props, {
        emit
    }) {
       // const searchAll = props.fromAll ? ref(props.fromAll) : ref(false)
        const store = useStore();
        const route = useRoute()
        const taskID = ref(false);
        let data = [];
        const meta = store.getters.taskRecords.value;
        
        const taskVisibleView = ref(false)
        const onlyView = ref(false)
    
        let dateFilter = ''
        let filter = ''

        const tasksList = computed(()=>{
            return store.state.tasks.tasksList 
        })

        function checkDate() {
            dateFilter = store.getters.otherFilters.value ? route.query.fromDate && route.query.toDate ? "&fromDate=" + route.query.fromDate + "&toDate=" + route.query.toDate : "&fromDate=&toDate=" : store.getters.dateFilter.value ? "&fromDate="+store.getters.dateFilter.value.fromDate+"&toDate="+store.getters.dateFilter.value.toDate : "&fromDate=&toDate="
            filter = route.query.filter ? "&filter=" + route.query.filter : "&filter="
        }
       
            let scroller = "";
        onMounted(() => {
             checkDate()
            var tableContent = document.querySelector(".ant-table-body");
            tableContent?.addEventListener("scroll", (event) => {
                
                let maxScroll = event.target.scrollHeight - event.target.clientHeight;
                let currentScroll = event.target.scrollTop + 2;
                if (currentScroll >= maxScroll) {
                    let current_page = meta.taskMeta.current_page + 1;
                    if (current_page <= meta.taskMeta.total_pages) {
                       
                            scroller = maxScroll;
                        data = meta.tasksList;
                        store.state.tasks.taskMeta = ''
                            store
                                .dispatch(
                                    "tasksList",
                                    "?page=" +
                                    current_page +
                                    dateFilter + filter +
                                    store.getters.searchTable.value +
                                    store.getters.orderTable.value.data
                                )
                                .then(() => {
                                    loadMoredata();
                                });
                    }
                }
            });
        });

        function loadMoredata() {
            const newData = meta.tasksList;

            newData.forEach((element) => {
                data.push(element);
            });

            meta.tasksList = data;
            var tableContent = document.querySelector(".ant-table-body");

            setTimeout(() => {
                tableContent.scrollTo(0, scroller);
            }, 50);
            
        }
        const editTask = (id) => {
            // emit("is-Edit", {
            //     check: true,
            //     id: id,
            // });
              store.dispatch('editTask', {
                id: id
            })
            onlyView.value = true
            taskID.value = id
            taskVisibleView.value = true
        };
        const taskDetails = (id) => {
            store.dispatch('editTask', {
                id: id
            })
            onlyView.value = true
            taskID.value = id
            taskVisibleView.value = true
        };

        function deleteTask(id) {
            warningSwal(messages.deleteWarning).then((response) => {
                if (response == true) {
                    store.dispatch("tasksDelete", id).then(() => {
                        store.dispatch("latestTask", route.params.udid)
                        store.dispatch("tasksList");
                        if (route.name == "PatientSummary") {
                            store.dispatch("showTaskModalData", {
                                id: route.params.udid,
                                filters: ""
                            });
                        }
                    })
                    // setTimeout(() => {
                        // store.state.tasks.tasksList = null;
                        // store.dispatch("tasksList");
                    // }, 2000);
                }
            });
        }
        const tasks = computed(() => {
            return store.state.tasks;
        });

        function handleOk(event) {
            onlyView.value = event
            taskVisibleView.value = event
        }
        const handleTableChange = (pag, filters, sorter) => {
            checkDate()
            let islimit = props.islimit? "&islimit="+props.islimit:"&islimit="
            if (sorter.order) {
                
                let order = sorter.order == "ascend" ? "ASC" : "DESC";
                let orderParam = "&orderField=" + sorter.field + "&orderBy=" + order;
                store.dispatch("orderTable", {
                    data: orderParam,
                    orderBy: order,
                    page: pag,
                    filters: filters,
                });
                if(route.name == 'PatientSummary') {
                    store.dispatch("showTaskModalData", {
                        id: route.params.udid,
                        filters: "?page=" + dateFilter + filter + orderParam+islimit +store.getters.otherFilters.value   
                    });
                }
                else {
                    store.dispatch(
                        "tasksList",
                        "?page=" +
                        dateFilter + filter +
                        orderParam+islimit+store.getters.otherFilters.value
                    );
                }
            } else {
                store.dispatch("orderTable", {
                    data: "&orderField=&orderBy=",
                });
                if(route.name == 'PatientSummary') {
                    let dateFilter = ''
                    let filter = ''
                    let orderParam = "&orderField=&orderBy=";
                    store.dispatch("showTaskModalData", {
                        id: route.params.udid,
                        filters: "?page=" + dateFilter + filter + orderParam+islimit   +store.getters.otherFilters.value 
                    });
                }
                else {
                    store.dispatch(
                        "tasksList",
                        "?page=" +
                        store.getters.searchTable.value +
                        dateFilter + filter +
                        store.getters.orderTable.value.data+islimit+store.getters.otherFilters.value
                    );
                }
                
            }
        };

        function callApiFromModal() {
            taskVisibleView.value = false
            if (props.height) {
                emit("dashboard")

            } else {
                store.dispatch("tasksList");
            }

        }
        return {
            showStaffModal,
            showPatientModal,
            callApiFromModal,
            screensPermissions: store.getters.screensPermissions,
            tasks,
            arrayToObjact,
            editTask,
            deleteTask,
            meta,
            handleTableChange,
            taskID,
            taskDetails,
            taskVisibleView,
            onlyView,
            handleOk,
            tableYScroller,
            tasksList
        };
    },
};
</script>
